import { NextRequest, NextResponse } from "next/server";
import { getNewsPage } from "@/lib/data";

const validCursor = (cursor: string | null) =>
  cursor === null || (cursor.length <= 512 && /^[A-Za-z0-9_-]+={0,2}$/.test(cursor));

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");
  if (!validCursor(cursor)) {
    return NextResponse.json({ error: "Cursor inválido." }, { status: 400 });
  }

  return NextResponse.json(await getNewsPage(cursor, 10));
}
