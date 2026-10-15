import { NextResponse } from "next/server";
import { getTrending } from "@/lib/data";

export async function GET(){
  return NextResponse.json(await getTrending(),{headers:{"cache-control":"public, max-age=60, stale-while-revalidate=240"}});
}
