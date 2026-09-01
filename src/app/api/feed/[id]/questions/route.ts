import { NextResponse } from "next/server";
import { API } from "@/lib/data";
import type { FeedQuestionType } from "@/lib/feed-questions";
import { allowRequest,clientIp } from "@/lib/proposal-security";

const questionTypes=new Set<FeedQuestionType>(["EXPLAIN_NEWS","PEOPLE_MENTIONED"]);
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!allowRequest(`feed-question:${clientIp(request)}`,20,60*60_000))return NextResponse.json({error:"Muitas solicitações."},{status:429});
  const {id}=await params;const feedId=Number(id);if(!Number.isInteger(feedId)||feedId<=0)return NextResponse.json({error:"Notícia inválida."},{status:400});
  let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Solicitação inválida."},{status:400})}
  const questionType=body&&typeof body==="object"&&"questionType" in body?(body as {questionType?:unknown}).questionType:undefined;
  if(typeof questionType!=="string"||!questionTypes.has(questionType as FeedQuestionType))return NextResponse.json({error:"Tipo de pergunta inválido."},{status:400});
  try{const response=await fetch(`${API}/feed/${feedId}/questions`,{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({questionType}),cache:"no-store"});const text=await response.text();return new NextResponse(text||null,{status:response.status,headers:{"content-type":response.headers.get("content-type")??"application/json"}})}catch{return NextResponse.json({error:"Serviço indisponível."},{status:502})}
}
