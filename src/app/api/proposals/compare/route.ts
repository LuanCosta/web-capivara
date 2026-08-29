import { NextResponse } from "next/server";
import { bffCompare,orientComparison,type ProposalComparison } from "@/lib/proposals";
import { allowRequest,cached,clientIp,proposalStore,saveCache } from "@/lib/proposal-security";

export async function POST(request:Request){
  if(!allowRequest(`compare:${clientIp(request)}`,15,15*60_000))return NextResponse.json({error:"Limite de comparações atingido. Tente novamente mais tarde."},{status:429});
  try{
    const body=await request.json() as Record<string,unknown>;const requestedA=Number(body.candidateAId);const requestedB=Number(body.candidateBId);
    if(!Number.isInteger(requestedA)||requestedA<=0||!Number.isInteger(requestedB)||requestedB<=0||requestedA===requestedB)return NextResponse.json({error:"Escolha dois candidatos diferentes."},{status:400});
    const [candidateAId,candidateBId]=[requestedA,requestedB].sort((a,b)=>a-b);const key=`${candidateAId}:${candidateBId}`;
    let comparison=cached<ProposalComparison>(proposalStore.compareCache,key);if(!comparison)comparison=saveCache(proposalStore.compareCache,key,await bffCompare(candidateAId,candidateBId),6*60*60_000);
    return NextResponse.json(orientComparison(comparison,requestedA));
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível comparar as propostas."},{status:502})}
}
