import { GraphQLClient } from "graphql-request";
import { format, subDays } from "date-fns";
import type {
  Repository,
  RepositoryDetails,
  GitHubUser,
  SearchResult,
  TimeRange,
  SortOption,
} from "./types";

const GITHUB_API_URL = "https://api.github.com/graphql";

function getClient(tokenOverride?: string) {
  const token = tokenOverride || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "No GitHub token configured. Add a token to avoid rate limits.",
    );
  }
  return new GraphQLClient(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getDateRange(
  timeRange: TimeRange,
  customDate?: string,
): string {
  const today = new Date();
  switch (timeRange) {
    case "today":
      return format(subDays(today, 1), "yyyy-MM-dd"); // last 24 h
    case "yesterday":
      return format(subDays(today, 2), "yyyy-MM-dd");
    case "week":
      return format(subDays(today, 7), "yyyy-MM-dd");
    case "month":
      return format(subDays(today, 30), "yyyy-MM-dd");
    case "custom":
      return customDate ?? format(today, "yyyy-MM-dd");
    default:
      return format(subDays(today, 7), "yyyy-MM-dd");
  }
}

function buildSearchQuery(
  date: string,
  language: string,
  sort: SortOption,
  query?: string,
): string {
  const parts: string[] = [];
  if (query) {
    // Free-text search: find repos matching the query with any stars
    parts.push(query);
    parts.push("stars:>5");
  } else {
    // Trending: repos actively pushed to in the time window with decent stars
    parts.push("stars:>100");
    parts.push(`pushed:>=${date}`);
  }
  if (language && language !== "all") {
    parts.push(`language:${language}`);
  }
  if (sort === "forks") parts.push("sort:forks-desc");
  else if (sort === "updated") parts.push("sort:updated-desc");
  else parts.push("sort:stars-desc");
  return parts.join(" ");
}

const REPO_FRAGMENT = `
  id
  name
  nameWithOwner
  description
  url
  stargazerCount
  forkCount
  openIssues: issues(states: OPEN) { totalCount }
  primaryLanguage { name color }
  repositoryTopics(first: 5) {
    nodes { topic { name } }
  }
  owner { login avatarUrl }
  createdAt
  updatedAt
  licenseInfo { name }
`;

function mapRepo(node: Record<string, unknown>): Repository {
  return {
    id: node.id as string,
    name: node.name as string,
    nameWithOwner: node.nameWithOwner as string,
    description: node.description as string | null,
    url: node.url as string,
    stargazerCount: node.stargazerCount as number,
    forkCount: node.forkCount as number,
    openIssuesCount:
      (node.openIssues as { totalCount: number })?.totalCount ?? 0,
    primaryLanguage: node.primaryLanguage as {
      name: string;
      color: string | null;
    } | null,
    repositoryTopics:
      (
        node.repositoryTopics as { nodes: Array<{ topic: { name: string } }> }
      )?.nodes?.map((n) => n.topic.name) ?? [],
    owner: node.owner as { login: string; avatarUrl: string },
    createdAt: node.createdAt as string,
    updatedAt: node.updatedAt as string,
    licenseInfo: node.licenseInfo as { name: string } | null,
  };
}

export async function searchRepositories(params: {
  date: string;
  language: string;
  sort: SortOption;
  query?: string;
  first?: number;
  after?: string | null;
  token?: string;
}): Promise<SearchResult> {
  const client = getClient(params.token);
  const { date, language, sort, query, first = 24, after } = params;

  const searchQuery = buildSearchQuery(date, language, sort, query);

  const gql = `
    query SearchRepositories($query: String!, $first: Int!, $after: String) {
      search(query: $query, type: REPOSITORY, first: $first, after: $after) {
        repositoryCount
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on Repository {
            ${REPO_FRAGMENT}
          }
        }
      }
    }
  `;

  const data = await client.request<{
    search: {
      repositoryCount: number;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: Record<string, unknown>[];
    };
  }>(gql, { query: searchQuery, first, after: after ?? null });

  return {
    repositories: data.search.nodes.filter((n) => n && n.id).map(mapRepo),
    totalCount: data.search.repositoryCount,
    hasNextPage: data.search.pageInfo.hasNextPage,
    endCursor: data.search.pageInfo.endCursor,
  };
}

export async function getRepository(
  owner: string,
  name: string,
  token?: string,
): Promise<RepositoryDetails | null> {
  const client = getClient(token);

  const gql = `
    query GetRepository($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        name
        nameWithOwner
        description
        url
        homepageUrl
        stargazerCount
        forkCount
        watchers { totalCount }
        openIssues: issues(states: OPEN) { totalCount }
        primaryLanguage { name color }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
          totalSize
        }
        repositoryTopics(first: 10) {
          nodes { topic { name } }
        }
        owner { login avatarUrl }
        createdAt
        updatedAt
        pushedAt
        licenseInfo { name }
        defaultBranchRef { name }
        object(expression: "HEAD:README.md") {
          ... on Blob { text }
        }
        releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes { name tagName publishedAt }
        }
      }
    }
  `;

  const data = await client.request<{
    repository: Record<string, unknown> | null;
  }>(gql, { owner, name });

  if (!data.repository) return null;
  const r = data.repository;

  const langs = r.languages as {
    edges: Array<{
      size: number;
      node: { name: string; color: string | null };
    }>;
    totalSize: number;
  };

  const releases = r.releases as {
    nodes: Array<{ name: string; tagName: string; publishedAt: string }>;
  };

  return {
    ...mapRepo(r),
    homepageUrl: r.homepageUrl as string | null,
    pushedAt: r.pushedAt as string,
    defaultBranchRef: r.defaultBranchRef as { name: string } | null,
    watchers: (r.watchers as { totalCount: number })?.totalCount ?? 0,
    languages: langs?.edges?.map((e) => ({ ...e.node, size: e.size })) ?? [],
    totalLanguageSize: langs?.totalSize ?? 0,
    readme: (r.object as { text?: string } | null)?.text ?? null,
    latestRelease: releases?.nodes?.[0] ?? null,
  };
}

export async function getUser(
  login: string,
  token?: string,
): Promise<GitHubUser | null> {
  const client = getClient(token);

  const gql = `
    query GetUser($login: String!) {
      user(login: $login) {
        id login name bio email avatarUrl
        websiteUrl location company twitterUsername
        followers { totalCount }
        following { totalCount }
        repositories(first: 6, orderBy: { field: STARGAZERS, direction: DESC }, privacy: PUBLIC) {
          nodes {
            id name nameWithOwner description url
            stargazerCount forkCount
            openIssues: issues(states: OPEN) { totalCount }
            primaryLanguage { name color }
            repositoryTopics(first: 3) { nodes { topic { name } } }
            owner { login avatarUrl }
            createdAt updatedAt
          }
        }
        pinnedItems(first: 6) {
          nodes {
            ... on Repository {
              id name nameWithOwner description url
              stargazerCount forkCount
              openIssues: issues(states: OPEN) { totalCount }
              primaryLanguage { name color }
              repositoryTopics(first: 3) { nodes { topic { name } } }
              owner { login avatarUrl }
              createdAt updatedAt
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
        createdAt
      }
    }
  `;

  const data = await client.request<{ user: Record<string, unknown> | null }>(
    gql,
    { login },
  );
  if (!data.user) return null;

  const u = data.user;
  const contrib = u.contributionsCollection as {
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalIssueContributions: number;
  };

  return {
    id: u.id as string,
    login: u.login as string,
    name: u.name as string | null,
    bio: u.bio as string | null,
    email: u.email as string | null,
    avatarUrl: u.avatarUrl as string,
    websiteUrl: u.websiteUrl as string | null,
    location: u.location as string | null,
    company: u.company as string | null,
    twitterUsername: u.twitterUsername as string | null,
    followers: (u.followers as { totalCount: number })?.totalCount ?? 0,
    following: (u.following as { totalCount: number })?.totalCount ?? 0,
    repositories:
      (u.repositories as { nodes: Record<string, unknown>[] })?.nodes
        ?.filter(Boolean)
        .map(mapRepo) ?? [],
    pinnedRepositories:
      (u.pinnedItems as { nodes: Record<string, unknown>[] })?.nodes
        ?.filter((n) => n?.id)
        .map(mapRepo) ?? [],
    totalCommits: contrib?.totalCommitContributions ?? 0,
    totalPRs: contrib?.totalPullRequestContributions ?? 0,
    totalIssues: contrib?.totalIssueContributions ?? 0,
    createdAt: u.createdAt as string,
  };
}
