"use client";

import { useEffect, useState } from "react";
import { KeyRound, X, ExternalLink } from "lucide-react";
import { getLocalToken, setLocalToken } from "@/lib/token";
import { cn } from "@/lib/utils";

export function TokenNotice() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasServerToken, setHasServerToken] = useState(true); // optimistic
  const [tokenValue, setTokenValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const localToken = getLocalToken();
    if (localToken) return; // already have a token

    fetch("/api/token-status")
      .then((r) => r.json())
      .then((d: { hasServerToken: boolean }) => {
        setHasServerToken(d.hasServerToken);
        if (!d.hasServerToken) {
          setVisible(true);
        }
      })
      .catch(() => {
        // If we can't check, don't annoy the user
      });
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  const handleSave = () => {
    const trimmed = tokenValue.trim();
    if (!trimmed) {
      setError("Please enter a token.");
      return;
    }
    if (!trimmed.startsWith("ghp_") && !trimmed.startsWith("github_pat_")) {
      setError("Token should start with ghp_ or github_pat_");
      return;
    }
    setSaving(true);
    setError("");
    setTimeout(() => {
      setLocalToken(trimmed);
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setDialogOpen(false);
        setVisible(false);
        // Reload to re-fetch with new token
        window.location.reload();
      }, 1000);
    }, 300);
  };

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Floating notice */}
      <div
        className={cn(
          "fixed bottom-5 left-5 z-50 max-w-xs w-full",
          "animate-in slide-in-from-bottom-4 fade-in duration-300",
        )}
      >
        <div
          className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xl
            shadow-black/10 dark:shadow-black/40"
        >
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
            <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug mb-1">
              Add a GitHub token
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
              Avoid API rate limits by adding your personal access token.
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-foreground text-background
                hover:opacity-90 transition-opacity"
            >
              Add token
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground
              hover:bg-accent transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialogOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl
              animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setDialogOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground
                hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold mb-1">Add a GitHub Token</h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Generate a token and add it below to avoid hitting the rate limit.
              The token is stored only in your browser.
            </p>

            {/* Steps */}
            <ol className="text-sm text-muted-foreground space-y-2 mb-5 list-decimal list-inside">
              <li>
                Go to{" "}
                <a
                  href="https://github.com/settings/tokens/new?scopes=public_repo&description=GitRanked"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-2 inline-flex items-center gap-1
                    hover:opacity-75 transition-opacity"
                >
                  Settings → Personal Access Tokens
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Click{" "}
                <strong className="text-foreground">Generate Token</strong>
              </li>
              <li>Copy the token and paste it below</li>
            </ol>

            {/* Input */}
            <div className="space-y-2 mb-4">
              <input
                type="password"
                value={tokenValue}
                onChange={(e) => {
                  setTokenValue(e.target.value);
                  setError("");
                }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full h-10 px-3 rounded-lg border border-border bg-secondary text-sm
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
                  focus:border-transparent transition-all font-mono"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="flex-1 h-10 rounded-lg bg-foreground text-background text-sm font-medium
                  hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Token"}
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                className="h-10 px-4 rounded-lg border border-border text-sm text-muted-foreground
                  hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Skip
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Only <code className="text-foreground">public_repo</code> scope is
              needed. Stored in localStorage only.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
