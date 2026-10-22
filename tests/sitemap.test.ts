import test from "node:test";
import assert from "node:assert/strict";
import { getAllNewsForSitemap } from "../src/lib/data.ts";

test("percorre o feed paginado e remove notícias duplicadas do sitemap",async()=>{
  const originalFetch=globalThis.fetch;
  const calls:string[]=[];
  globalThis.fetch=async input=>{
    const url=String(input);calls.push(url);const cursor=new URL(url).searchParams.get("cursor");
    const body=cursor==="pagina-2"
      ?{items:[{id:2,titulo:"Dois repetida",criado_em:"2026-10-21T12:00:00Z"},{id:1,titulo:"Um",criado_em:"2026-10-20T12:00:00Z"}],hasMore:false,nextCursor:null}
      :{items:[{id:3,titulo:"Três",criado_em:"2026-10-22T12:00:00Z"},{id:2,titulo:"Dois",criado_em:"2026-10-21T12:00:00Z"}],hasMore:true,nextCursor:"pagina-2"};
    return new Response(JSON.stringify(body),{status:200,headers:{"content-type":"application/json"}});
  };
  try{
    const news=await getAllNewsForSitemap();
    assert.deepEqual(news.map(item=>item.id),["3","2","1"]);
    assert.equal(calls.length,2);
  }finally{globalThis.fetch=originalFetch}
});
