import { NextRequest,NextResponse } from "next/server";
import { API } from "@/lib/data";

const offices=new Set(["PRESIDENT","GOVERNOR","FEDERAL_DEPUTY","STATE_DEPUTY","DISTRICT_DEPUTY","SENATOR"]);
const modes=new Set(["FUTURE_COMPOSITION","CURRENT"]);

export async function GET(request:NextRequest){
  const source=request.nextUrl.searchParams;const territory=(source.get("territory")||"").toUpperCase();const office=source.get("office")||"";const mode=source.get("mode")||"FUTURE_COMPOSITION";const query=(source.get("query")||"").slice(0,100);const limit=Math.min(50,Math.max(1,Number(source.get("limit"))||20));const offset=Math.max(0,Number(source.get("offset"))||0);
  if(!/^(BR|[A-Z]{2})$/.test(territory)||!offices.has(office)||!modes.has(mode))return NextResponse.json({message:"Consulta de representantes inválida."},{status:400});
  const params=new URLSearchParams({territory,office,mode,limit:String(limit),offset:String(offset)});if(query)params.set("query",query);
  try{
    const response=await fetch(`${API}/representatives?${params}`,{cache:"no-store",headers:{accept:"application/json"}});const body=await response.text();
    return new NextResponse(body,{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}});
  }catch{return NextResponse.json({message:"Não foi possível consultar as pessoas agora."},{status:503,headers:{"cache-control":"no-store"}})}
}
