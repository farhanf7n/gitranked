import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const { owner, repo } = await params;
    const clientToken = request.headers.get("X-GitHub-Token") ?? undefined;
    const data = await getRepository(owner, repo, clientToken);
    if (!data) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Repo API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
