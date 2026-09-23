export type AnonymousSessionResponse={token:string;expiresAt:string};

export const ANONYMOUS_TOKEN_KEY="capivara_anonymous_token";
export const ANONYMOUS_EXPIRES_KEY="capivara_anonymous_token_expires_at";
const BFF_URL=(process.env.NEXT_PUBLIC_BFF_URL||"https://bff-capivara.fly.dev").replace(/\/$/,"");
let sessionPromise:Promise<AnonymousSessionResponse>|null=null;

export class AnonymousSessionError extends Error{status:number;constructor(status:number,message="Não foi possível criar a sessão anônima."){super(message);this.status=status}}
const browserStorage=()=>typeof window!=="undefined"?window.localStorage:null;

export function clearAnonymousSession(){const storage=browserStorage();if(!storage)return;storage.removeItem(ANONYMOUS_TOKEN_KEY);storage.removeItem(ANONYMOUS_EXPIRES_KEY)}
export function getStoredAnonymousSession(now=Date.now()):AnonymousSessionResponse|null{const storage=browserStorage();if(!storage)return null;const token=storage.getItem(ANONYMOUS_TOKEN_KEY);const expiresAt=storage.getItem(ANONYMOUS_EXPIRES_KEY);if(!token||!expiresAt||!Number.isFinite(Date.parse(expiresAt))||Date.parse(expiresAt)<=now){clearAnonymousSession();return null}return{token,expiresAt}}
function validSession(value:unknown):value is AnonymousSessionResponse{if(!value||typeof value!=="object")return false;const session=value as Record<string,unknown>;return typeof session.token==="string"&&session.token.length>10&&typeof session.expiresAt==="string"&&Number.isFinite(Date.parse(session.expiresAt))&&Date.parse(session.expiresAt)>Date.now()}

async function createAnonymousSession():Promise<AnonymousSessionResponse>{
  let response:Response;try{response=await fetch(`${BFF_URL}/api/anonymous/session`,{method:"POST",headers:{accept:"application/json"}})}catch{throw new AnonymousSessionError(0,"Verifique sua conexão e tente novamente.")}
  if(!response.ok)throw new AnonymousSessionError(response.status,response.status===429?"Não foi possível iniciar sua participação agora. Tente novamente mais tarde.":"Não foi possível iniciar sua participação agora.");
  const value:unknown=await response.json();if(!validSession(value))throw new AnonymousSessionError(502,"A sessão recebida é inválida.");const storage=browserStorage();if(!storage)throw new AnonymousSessionError(0);storage.setItem(ANONYMOUS_TOKEN_KEY,value.token);storage.setItem(ANONYMOUS_EXPIRES_KEY,value.expiresAt);return value;
}

export function getAnonymousSession(){const stored=getStoredAnonymousSession();if(stored)return Promise.resolve(stored);if(!sessionPromise)sessionPromise=createAnonymousSession().finally(()=>{sessionPromise=null});return sessionPromise}
export function resetAnonymousSessionPromiseForTests(){sessionPromise=null}
