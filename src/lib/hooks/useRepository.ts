"use client";

import { useQuery } from "@tanstack/react-query";
import type { RepositoryDetails } from "@/lib/types";
import { buildAuthHeaders } from "@/lib/token";

async function fetchRepository(
  owner: string,
  name: string,
): Promise<RepositoryDetails> {
  const res = await fetch(`/api/repo/${owner}/${name}`, {
    headers: buildAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch repository");
  return res.json();
}

export function useRepository(owner: string, name: string) {
  return useQuery({
    queryKey: ["repository", owner, name],
    queryFn: () => fetchRepository(owner, name),
    staleTime: 1000 * 60 * 10,
  });
}
