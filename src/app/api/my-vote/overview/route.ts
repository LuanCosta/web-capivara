import { NextRequest,NextResponse } from "next/server";
import { API } from "@/lib/data";

type Body={candidateIds?:unknown;newsLimit?:unknown;newsCursor?:unknown};

export async function POST(request:NextRequest){
  let body:Body;try{body=await request.json() as Body}catch{return NextResponse.json({message:"Consulta inválida."},{status:400})}
  const candidateIds=Array.isArray(body.candidateIds)?[...new Set(body.candidateIds.map(Number))]:[];const newsLimit=Number(body.newsLimit??10);const newsCursor=body.newsCursor==null?null:String(body.newsCursor);
  if(candidateIds.length<1||candidateIds.length>6||candidateIds.some(id=>!Number.isInteger(id)||id<=0)||!Number.isInteger(newsLimit)||newsLimit<1||newsLimit>30||(newsCursor!=null&&newsCursor.length>200))return NextResponse.json({message:"Consulta inválida."},{status:400,headers:{"cache-control":"no-store"}});
  try{
    const response=await fetch(`${API}/my-vote/overview`,{method:"POST",cache:"no-store",headers:{accept:"application/json","content-type":"application/json"},body:JSON.stringify({candidateIds,newsLimit,newsCursor})});const responseBody=await response.text();
    return new NextResponse(responseBody,{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}});
  }catch{return NextResponse.json({message:"O acompanhamento está temporariamente indisponível."},{status:503,headers:{"cache-control":"no-store"}})}
}
