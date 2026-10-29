import { NextRequest,NextResponse } from "next/server";

const upstream=process.env.MY_VOTE_PUSH_SUBSCRIPTION_ENDPOINT;
const publicKey=process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
const unavailable=()=>NextResponse.json({available:false,message:"Os alertas web ainda dependem da configuração do servidor de notificações."},{status:503,headers:{"cache-control":"no-store"}});

export async function GET(){return upstream&&publicKey?NextResponse.json({available:true,publicKey},{headers:{"cache-control":"no-store"}}):unavailable()}

async function forward(request:NextRequest,method:"POST"|"DELETE"){
  if(!upstream||!publicKey)return unavailable();const authorization=request.headers.get("authorization");if(!authorization?.startsWith("Bearer "))return NextResponse.json({message:"Sessão anônima necessária."},{status:401,headers:{"cache-control":"no-store"}});
  let raw:string;try{raw=await request.text();const body=JSON.parse(raw) as{candidateIds?:unknown};const ids=Array.isArray(body.candidateIds)?[...new Set(body.candidateIds.map(Number))]:[];if(ids.length>6||ids.some(id=>!Number.isInteger(id)||id<=0))throw new Error()}catch{return NextResponse.json({message:"Inscrição inválida."},{status:400,headers:{"cache-control":"no-store"}})}
  try{const response=await fetch(upstream,{method,cache:"no-store",headers:{authorization,"content-type":"application/json",accept:"application/json"},body:raw});return new NextResponse(await response.text(),{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}})}catch{return NextResponse.json({message:"Não foi possível sincronizar os alertas."},{status:503,headers:{"cache-control":"no-store"}})}
}
export const POST=(request:NextRequest)=>forward(request,"POST");
export const DELETE=(request:NextRequest)=>forward(request,"DELETE");
