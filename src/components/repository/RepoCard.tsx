"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Repository } from "@/lib/types";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface RepoCardProps {
  repo: Repository;
  layout?: "grid" | "list";
  index?: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  PHP: "#4F5D95",
  "C#": "#178600",
  C: "#555555",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  default: "#6e7681",
};

function getLangColor(
  lang: string | null | undefined,
  colorFromApi: string | null | undefined,
): string {
  if (colorFromApi) return colorFromApi;
  if (lang && LANG_COLORS[lang]) return LANG_COLORS[lang];
  return LANG_COLORS.default;
}

export function RepoCard({ repo, layout = "grid", index = 0 }: RepoCardProps) {
  const langColor = getLangColor(
    repo.primaryLanguage?.name,
    repo.primaryLanguage?.color,
  );

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
      >
        <Link
          href={`/repo/${repo.owner.login}/${repo.name}`}
          className="group flex items-start gap-4 px-4 py-3 rounded-xl border border-border bg-card
            hover:border-border/80 hover:bg-accent/40 transition-all duration-200"
        >
          <Image
            src={repo.owner.avatarUrl}
            alt={repo.owner.login}
            width={36}
            height={36}
            className="rounded-lg shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-muted-foreground text-sm truncate">
                {repo.owner.login}
              </span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-semibold text-sm truncate group-hover:text-foreground transition-colors">
                {repo.name}
              </span>
            </div>
            {repo.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {repo.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0 text-muted-foreground text-xs">
            {repo.primaryLanguage && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: langColor }}
                />
                {repo.primaryLanguage.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {formatCount(repo.stargazerCount)}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {formatCount(repo.forkCount)}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/repo/${repo.owner.login}/${repo.name}`}
        className={cn(
          "group flex flex-col h-full rounded-xl border border-border bg-card p-5",
          "hover:border-foreground/20 transition-all duration-200",
          "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              width={28}
              height={28}
              className="rounded-md shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {repo.owner.login}
              </p>
              <p className="font-semibold text-sm truncate leading-tight group-hover:text-foreground">
                {repo.name}
              </p>
            </div>
          </div>
          <ExternalLink
            className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-1
            opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1 mb-4 leading-relaxed">
          {repo.description ?? "No description provided."}
        </p>

        {/* Topics */}
        {repo.repositoryTopics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.repositoryTopics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground
                  border border-border font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span className="font-medium text-foreground">
                {formatCount(repo.stargazerCount)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {formatCount(repo.forkCount)}
            </span>
            {repo.openIssuesCount > 0 && (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formatCount(repo.openIssuesCount)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "2-digit",
              })}
            </span>
          </div>

          {repo.primaryLanguage && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: langColor }}
              />
              {repo.primaryLanguage.name}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
