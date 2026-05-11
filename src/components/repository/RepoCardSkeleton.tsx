import { cn } from "@/lib/utils";

interface RepoCardSkeletonProps {
  layout?: "grid" | "list";
}

export function RepoCardSkeleton({ layout = "grid" }: RepoCardSkeletonProps) {
  if (layout === "list") {
    return (
      <div className="flex items-start gap-4 px-4 py-3 rounded-xl border border-border bg-card animate-pulse">
        <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="h-3 bg-muted rounded w-12" />
          <div className="h-3 bg-muted rounded w-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-md bg-muted shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3.5 bg-muted rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-2 flex-1 mb-4">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
      <div className="flex gap-1 mb-3">
        <div className="h-5 bg-muted rounded-md w-14" />
        <div className="h-5 bg-muted rounded-md w-16" />
      </div>
      <div className="pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="h-3 bg-muted rounded w-10" />
          <div className="h-3 bg-muted rounded w-8" />
        </div>
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  );
}
