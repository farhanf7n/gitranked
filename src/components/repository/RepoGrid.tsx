"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RepoCard } from "./RepoCard";
import { RepoCardSkeleton } from "./RepoCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { Repository, LayoutMode } from "@/lib/types";

interface RepoGridProps {
  repositories: Repository[];
  layout: LayoutMode;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  tokenRequired?: boolean;
}

export function RepoGrid({
  repositories,
  layout,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  tokenRequired,
}: RepoGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !onLoadMore) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            onLoadMore();
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, onLoadMore],
  );

  if (isLoading) {
    return (
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-2"
        }
      >
        {Array.from({ length: layout === "grid" ? 9 : 8 }).map((_, i) => (
          <RepoCardSkeleton key={i} layout={layout} />
        ))}
      </div>
    );
  }

  if (!repositories.length) {
    return <EmptyState tokenRequired={tokenRequired} />;
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={layout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-2"
          }
        >
          {repositories.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} layout={layout} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Load more sentinel */}
      <div ref={loadMoreRef} className="mt-4" />

      {isFetchingNextPage && (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
              : "flex flex-col gap-2 mt-2"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <RepoCardSkeleton key={i} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
}
