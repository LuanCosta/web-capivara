import test,{beforeEach} from "node:test";
import assert from "node:assert/strict";
import {
  ANONYMOUS_EXPIRES_KEY,
  ANONYMOUS_TOKEN_KEY,
  AnonymousSessionError,
  getAnonymousSession,
  getStoredAnonymousSession,
  resetAnonymousSessionPromiseForTests,
} from "../src/lib/anonymous-session.ts";
import {
  getFeedReactions,
  reactionOperation,
  setFeedReaction,
} from "../src/lib/feed-reactions-api.ts";

class MemoryStorage implements Storage{
  private values=new Map<string,string>();
  get length(){return this.values.size}
  clear(){this.values.clear()}
  getItem(key:string){return this.values.get(key)??null}
  key(index:number){return [...this.values.keys()][index]??null}
  removeItem(key:string){this.values.delete(key)}
  setItem(key:string,value:string){this.values.set(key,String(value))}
}

const storage=new MemoryStorage();
const future=()=>new Date(Date.now()+60_000).toISOString();
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json"}});
const setBrowser=(enabled=true)=>Object.defineProperty(globalThis,"window",{value:enabled?{localStorage:storage}:undefined,configurable:true,writable:true});

beforeEach(()=>{
  storage.clear();
  setBrowser();
  resetAnonymousSessionPromiseForTests();
});

test("consulta totais sem criar sessão e sem enviar autorização",async()=>{
  const calls:Array<{url:string;init:RequestInit}> = [];
  globalThis.fetch=async(input,init={})=>{calls.push({url:String(input),init});return json({feedId:336,likes:4,dislikes:1,myReaction:null})};
  const result=await getFeedReactions(336);
  assert.equal(result.likes,4);
  assert.equal(calls.length,1);
  assert.equal(calls[0].init.method,"GET");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"),null);
  assert.equal(calls[0].url.endsWith("/api/feed/336/reactions"),true);
});

test("reaproveita uma sessão válida para identificar a reação atual",async()=>{
  storage.setItem(ANONYMOUS_TOKEN_KEY,"existing-token-123");
  storage.setItem(ANONYMOUS_EXPIRES_KEY,future());
  let authorization:string|null=null;
  globalThis.fetch=async(_input,init={})=>{authorization=new Headers(init.headers).get("authorization");return json({feedId:336,likes:1,dislikes:0,myReaction:"LIKE"})};
  const result=await getFeedReactions(336);
  assert.equal(result.myReaction,"LIKE");
  assert.equal(authorization,"Bearer existing-token-123");
});

test("não reutiliza token expirado",async()=>{
  storage.setItem(ANONYMOUS_TOKEN_KEY,"expired-token-123");
  storage.setItem(ANONYMOUS_EXPIRES_KEY,new Date(Date.now()-1_000).toISOString());
  let authorization:string|null="not-checked";
  globalThis.fetch=async(_input,init={})=>{authorization=new Headers(init.headers).get("authorization");return json({feedId:336,likes:0,dislikes:0,myReaction:null})};
  await getFeedReactions(336);
  assert.equal(authorization,null);
  assert.equal(storage.getItem(ANONYMOUS_TOKEN_KEY),null);
});

test("primeiro like cria a sessão apenas no momento da interação",async()=>{
  const methods:string[]=[];
  globalThis.fetch=async(input,init={})=>{
    methods.push(String(init.method));
    if(String(input).endsWith("/api/anonymous/session"))return json({token:"new-session-token-123",expiresAt:future()});
    assert.equal(new Headers(init.headers).get("authorization"),"Bearer new-session-token-123");
    assert.deepEqual(JSON.parse(String(init.body)),{reaction:"LIKE"});
    return json({feedId:336,likes:1,dislikes:0,myReaction:"LIKE"});
  };
  const result=await setFeedReaction(336,"LIKE");
  assert.deepEqual(methods,["POST","PUT"]);
  assert.equal(result.myReaction,"LIKE");
});

test("interações concorrentes compartilham a mesma criação de sessão",async()=>{
  let creations=0;
  globalThis.fetch=async()=>{creations++;await new Promise(resolve=>setTimeout(resolve,5));return json({token:"shared-session-token",expiresAt:future()})};
  const [first,second]=await Promise.all([getAnonymousSession(),getAnonymousSession()]);
  assert.equal(creations,1);
  assert.equal(first.token,second.token);
});

test("mesma reação remove e reação oposta substitui",()=>{
  assert.equal(reactionOperation("LIKE","LIKE"),"REMOVE");
  assert.equal(reactionOperation("DISLIKE","DISLIKE"),"REMOVE");
  assert.equal(reactionOperation("LIKE","DISLIKE"),"SET");
  assert.equal(reactionOperation(null,"LIKE"),"SET");
});

test("renova após 401 e repete a operação exatamente uma vez",async()=>{
  storage.setItem(ANONYMOUS_TOKEN_KEY,"stale-session-token");
  storage.setItem(ANONYMOUS_EXPIRES_KEY,future());
  let puts=0,creations=0;
  globalThis.fetch=async(input,init={})=>{
    if(String(input).endsWith("/api/anonymous/session")){creations++;return json({token:"renewed-session-token",expiresAt:future()})}
    puts++;
    if(puts===1)return json({message:"expired"},401);
    assert.equal(new Headers(init.headers).get("authorization"),"Bearer renewed-session-token");
    return json({feedId:336,likes:1,dislikes:0,myReaction:"LIKE"});
  };
  await setFeedReaction(336,"LIKE");
  assert.equal(puts,2);
  assert.equal(creations,1);
});

test("429 ao criar sessão não dispara repetição automática",async()=>{
  let calls=0;
  globalThis.fetch=async()=>{calls++;return json({message:"rate limit"},429)};
  await assert.rejects(()=>setFeedReaction(336,"LIKE"),(error:unknown)=>{
    assert.equal(error instanceof AnonymousSessionError,true);
    assert.equal((error as AnonymousSessionError).status,429);
    assert.equal((error as Error).message.includes("token"),false);
    return true;
  });
  assert.equal(calls,1);
});

test("acesso durante renderização no servidor não tenta usar localStorage",()=>{
  setBrowser(false);
  assert.equal(getStoredAnonymousSession(),null);
});
