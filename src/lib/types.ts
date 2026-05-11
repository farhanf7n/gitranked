export interface Repository {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl?: string | null;
  stargazerCount: number;
  forkCount: number;
  openIssuesCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  repositoryTopics: string[];
  owner: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
  licenseInfo?: { name: string } | null;
  defaultBranchRef?: { name: string } | null;
}

export interface RepositoryDetails extends Repository {
  watchers: number;
  languages: Array<{ name: string; color: string | null; size: number }>;
  totalLanguageSize: number;
  readme: string | null;
  latestRelease?: { name: string; tagName: string; publishedAt: string } | null;
}

export interface GitHubUser {
  id: string;
  login: string;
  name: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string;
  websiteUrl: string | null;
  location: string | null;
  company: string | null;
  twitterUsername: string | null;
  followers: number;
  following: number;
  repositories: Repository[];
  pinnedRepositories: Repository[];
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  createdAt: string;
}

export type TimeRange = "today" | "yesterday" | "week" | "month" | "custom";
export type SortOption = "stars" | "forks" | "updated";
export type LayoutMode = "grid" | "list";

export interface FilterState {
  language: string;
  timeRange: TimeRange;
  sort: SortOption;
  layout: LayoutMode;
  query: string;
  date?: string;
}

export interface SearchResult {
  repositories: Repository[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
  tokenRequired?: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string;
}
