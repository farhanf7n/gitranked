"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Link2,
  AtSign,
  Building2,
  Users,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { RepoCard } from "@/components/repository/RepoCard";
import type { GitHubUser } from "@/lib/types";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface Props {
  user: GitHubUser;
}

export function UserProfileClient({ user }: Props) {
  const pinnedOrTop =
    user.pinnedRepositories.length > 0
      ? user.pinnedRepositories
      : user.repositories;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Avatar + name */}
            <div className="border border-border rounded-2xl bg-card p-6 text-center">
              <Image
                src={user.avatarUrl}
                alt={user.login}
                width={96}
                height={96}
                className="rounded-2xl mx-auto mb-4"
              />
              <h1 className="font-bold text-xl">{user.name ?? user.login}</h1>
              <p className="text-muted-foreground text-sm mb-3">{user.login}</p>
              {user.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {user.bio}
                </p>
              )}
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 rounded-lg bg-foreground text-background text-sm font-medium
                  hover:opacity-90 transition-opacity"
              >
                View on GitHub
              </a>
            </div>

            {/* Meta */}
            <div className="border border-border rounded-2xl bg-card p-4 space-y-2.5">
              {user.company && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 shrink-0" />
                  {user.company}
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {user.location}
                </div>
              )}
              {user.websiteUrl && (
                <a
                  href={user.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Link2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {user.websiteUrl.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {user.twitterUsername && (
                <a
                  href={`https://twitter.com/${user.twitterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <AtSign className="w-4 h-4 shrink-0" />@{user.twitterUsername}
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                Joined {format(new Date(user.createdAt), "MMMM yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 shrink-0" />
                <span>
                  <strong className="text-foreground">
                    {formatCount(user.followers)}
                  </strong>{" "}
                  followers ·{" "}
                  <strong className="text-foreground">
                    {formatCount(user.following)}
                  </strong>{" "}
                  following
                </span>
              </div>
            </div>

            {/* Contribution stats */}
            <div className="border border-border rounded-2xl bg-card p-4">
              <h3 className="font-semibold text-sm mb-3">This year</h3>
              <div className="space-y-2.5">
                {[
                  {
                    icon: GitCommit,
                    label: "Commits",
                    value: user.totalCommits,
                  },
                  {
                    icon: GitPullRequest,
                    label: "Pull Requests",
                    value: user.totalPRs,
                  },
                  {
                    icon: AlertCircle,
                    label: "Issues",
                    value: user.totalIssues,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </span>
                    <span className="text-sm font-semibold">
                      {value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="font-semibold mb-4">
              {user.pinnedRepositories.length > 0
                ? "Pinned repositories"
                : "Popular repositories"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pinnedOrTop.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
