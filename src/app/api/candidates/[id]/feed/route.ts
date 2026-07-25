import { NextRequest, NextResponse } from "next/server";
import { getCandidateNewsPage } from "@/lib/data";

const validCursor = (cursor: string | null) =>
  cursor === null || (cursor.length <= 512 && /^[A-Za-z0-9_-]+={0,2}$/.test(cursor));

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cursor = request.nextUrl.searchParams.get("cursor");

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Candidato inválido." }, { status: 400 });
  }
  if (!validCursor(cursor)) {
    return NextResponse.json({ error: "Cursor inválido." }, { status: 400 });
  }

  return NextResponse.json(await getCandidateNewsPage(id, cursor, 10));
}
