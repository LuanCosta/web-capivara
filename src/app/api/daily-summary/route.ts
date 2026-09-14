import { NextResponse } from "next/server";
import { getDailySummaryForHome } from "@/lib/daily-summary";

export const dynamic="force-dynamic";
export async function GET(){const summary=await getDailySummaryForHome();return summary?NextResponse.json(summary,{headers:{"cache-control":"private, no-store"}}):new NextResponse(null,{status:204,headers:{"cache-control":"private, no-store"}})}
