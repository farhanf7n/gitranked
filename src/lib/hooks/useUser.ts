"use client";

import { useQuery } from "@tanstack/react-query";
import type { GitHubUser } from "@/lib/types";
import { buildAuthHeaders } from "@/lib/token";

async function fetchUser(login: string): Promise<GitHubUser> {
  const res = await fetch(`/api/user/${login}`, {
    headers: buildAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function useUser(login: string) {
  return useQuery({
    queryKey: ["user", login],
    queryFn: () => fetchUser(login),
    staleTime: 1000 * 60 * 10,
  });
}
