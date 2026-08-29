import { NextResponse } from "next/server";
import { bffAsk,getProposalQuestions,type ProposalAnswer } from "@/lib/proposals";
import { allowRequest,cached,clientIp,proposalStore,saveCache } from "@/lib/proposal-security";

export async function POST(request:Request){
  if(!allowRequest(`ask:${clientIp(request)}`,20,60*60_000))return NextResponse.json({error:"Limite de consultas atingido. Tente novamente mais tarde."},{status:429});
  try{
    const body=await request.json() as Record<string,unknown>;const candidateId=Number(body.candidateId);const questionId=Number(body.questionId);const question=typeof body.question==="string"?body.question:"";
    if(!Number.isInteger(candidateId)||candidateId<=0||!Number.isInteger(questionId)||question.length>500)return NextResponse.json({error:"Consulta inválida."},{status:400});
    const official=(await getProposalQuestions()).find(item=>item.id===questionId);
    if(!official||official.question!==question)return NextResponse.json({error:"Escolha uma das perguntas sugeridas."},{status:400});
    const key=`${candidateId}:${questionId}`;const hit=cached<ProposalAnswer>(proposalStore.askCache,key);if(hit)return NextResponse.json(hit);
    return NextResponse.json(saveCache(proposalStore.askCache,key,await bffAsk(candidateId,questionId,question),24*60*60_000));
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível gerar a resposta."},{status:502})}
}
