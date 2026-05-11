"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { FilterState, SearchResult } from "@/lib/types";
import { buildAuthHeaders } from "@/lib/token";

async function fetchRepositories(
  filters: Omit<FilterState, "layout">,
  after?: string | null,
): Promise<SearchResult> {
  const params = new URLSearchParams({
    language: filters.language,
    timeRange: filters.timeRange,
    sort: filters.sort,
    query: filters.query,
    ...(filters.date ? { date: filters.date } : {}),
    ...(after ? { after } : {}),
  });
  const res = await fetch(`/api/repositories?${params}`, {
    headers: buildAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch repositories");
  return res.json();
}

export function useRepositories(filters: Omit<FilterState, "layout">) {
  return useQuery({
    queryKey: ["repositories", filters],
    queryFn: () => fetchRepositories(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInfiniteRepositories(filters: Omit<FilterState, "layout">) {
  return useInfiniteQuery({
    queryKey: ["repositories", "infinite", filters],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      fetchRepositories(filters, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: SearchResult) =>
      lastPage.hasNextPage ? lastPage.endCursor : undefined,
    staleTime: 1000 * 60 * 5,
  });
}
