import { NextRequest,NextResponse } from "next/server";
import { getNewsPage } from "@/lib/data";
export async function GET(request:NextRequest){const cursor=request.nextUrl.searchParams.get("cursor");const page=await getNewsPage(cursor,10);return NextResponse.json(page)}
