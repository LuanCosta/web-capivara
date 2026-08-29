import { NextResponse } from "next/server";
import { getProposalQuestions } from "@/lib/proposals";
import { allowRequest,clientIp } from "@/lib/proposal-security";

export async function GET(request:Request){if(!allowRequest(`questions:${clientIp(request)}`,60,60_000))return NextResponse.json({error:"Muitas solicitações. Tente novamente em instantes."},{status:429});try{return NextResponse.json({questions:await getProposalQuestions()})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível carregar as perguntas."},{status:502})}}
