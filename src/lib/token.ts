const TOKEN_KEY = "gitranked_github_token";

export function getLocalToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setLocalToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function clearLocalToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function buildAuthHeaders(): HeadersInit {
  const token = getLocalToken();
  if (!token) return {};
  return { "X-GitHub-Token": token };
}
