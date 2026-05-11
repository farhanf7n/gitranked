"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  AlertCircle,
  Eye,
  ExternalLink,
  Globe,
  Scale,
  GitBranch,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { RepositoryDetails } from "@/lib/types";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface Props {
  repo: RepositoryDetails;
}

export function RepoDetailsClient({ repo }: Props) {
  const totalSize = repo.totalLanguageSize || 1;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to trending
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-border rounded-2xl bg-card p-6 sm:p-8 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <Link href={`/user/${repo.owner.login}`}>
              <Image
                src={repo.owner.avatarUrl}
                alt={repo.owner.login}
                width={52}
                height={52}
                className="rounded-xl hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                <div>
                  <Link
                    href={`/user/${repo.owner.login}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {repo.owner.login}
                  </Link>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {repo.name}
                  </h1>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-foreground text-background
                    text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on GitHub
                </a>
              </div>
              {repo.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {repo.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary rounded-xl mb-6">
            {[
              {
                icon: Star,
                label: "Stars",
                value: formatCount(repo.stargazerCount),
              },
              {
                icon: GitFork,
                label: "Forks",
                value: formatCount(repo.forkCount),
              },
              {
                icon: Eye,
                label: "Watchers",
                value: formatCount(repo.watchers),
              },
              {
                icon: AlertCircle,
                label: "Issues",
                value: formatCount(repo.openIssuesCount),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs">{label}</span>
                </div>
                <div className="text-xl font-bold">{value}</div>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {repo.primaryLanguage && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: repo.primaryLanguage.color ?? "#6e7681",
                  }}
                />
                {repo.primaryLanguage.name}
              </span>
            )}
            {repo.licenseInfo && (
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                {repo.licenseInfo.name}
              </span>
            )}
            {repo.defaultBranchRef && (
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                {repo.defaultBranchRef.name}
              </span>
            )}
            {repo.latestRelease && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {repo.latestRelease.tagName}
              </span>
            )}
            {repo.homepageUrl && (
              <a
                href={repo.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </a>
            )}
            <span>
              Updated{" "}
              {formatDistanceToNow(new Date(repo.updatedAt), {
                addSuffix: true,
              })}
            </span>
            <span>
              Created {format(new Date(repo.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Topics */}
          {repo.repositoryTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {repo.repositoryTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/?query=${topic}`}
                  className="text-xs px-2.5 py-1 rounded-lg bg-secondary border border-border
                    text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Languages */}
        {repo.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="border border-border rounded-2xl bg-card p-6 mb-6"
          >
            <h2 className="font-semibold mb-4">Languages</h2>
            {/* Bar */}
            <div className="flex rounded-full overflow-hidden h-2 mb-4">
              {repo.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${(lang.size / totalSize) * 100}%`,
                    background: lang.color ?? "#6e7681",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {repo.languages.map((lang) => (
                <span
                  key={lang.name}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: lang.color ?? "#6e7681" }}
                  />
                  {lang.name}
                  <span className="text-xs text-muted-foreground/60">
                    {((lang.size / totalSize) * 100).toFixed(1)}%
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* README */}
        {repo.readme && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border border-border rounded-2xl bg-card p-6 sm:p-8"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              README
              <span className="text-xs text-muted-foreground font-normal">
                {repo.defaultBranchRef?.name ?? "main"}
              </span>
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-relaxed overflow-auto max-h-96 bg-secondary rounded-lg p-4">
                {repo.readme.slice(0, 3000)}
                {repo.readme.length > 3000 &&
                  "\n\n… [truncated, view full README on GitHub]"}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
