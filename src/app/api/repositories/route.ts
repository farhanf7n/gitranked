import { NextRequest, NextResponse } from "next/server";
import { searchRepositories, getDateRange } from "@/lib/github";
import type { SortOption, TimeRange } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const language = searchParams.get("language") ?? "all";
    const timeRange = (searchParams.get("timeRange") ?? "today") as TimeRange;
    const sort = (searchParams.get("sort") ?? "stars") as SortOption;
    const query = searchParams.get("query") ?? "";
    const after = searchParams.get("after") ?? null;
    const customDate = searchParams.get("date") ?? undefined;
    const clientToken = request.headers.get("X-GitHub-Token") ?? undefined;

    const date = getDateRange(timeRange, customDate);

    const result = await searchRepositories({
      date,
      language,
      sort,
      query: query || undefined,
      first: 24,
      after,
      token: clientToken,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Repository API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
