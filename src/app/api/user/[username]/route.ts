import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const clientToken = request.headers.get("X-GitHub-Token") ?? undefined;
    const data = await getUser(username, clientToken);
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("User API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
