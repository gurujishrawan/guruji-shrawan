import { NextResponse } from "next/server";
import { getArticles } from "../../articles/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json({ articles });
}
