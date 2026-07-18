import { NextRequest,NextResponse } from "next/server";
import { getCandidateNewsPage } from "@/lib/data";
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){const {id}=await params;const cursor=request.nextUrl.searchParams.get("cursor");return NextResponse.json(await getCandidateNewsPage(id,cursor,10))}
