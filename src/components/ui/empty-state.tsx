import { GitFork, SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function EmptyState({
  title = "No repositories found",
  description = "Try adjusting your filters or search query.",
  onRetry,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        <SearchX className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background
            hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      )}
    </div>
  );
}
