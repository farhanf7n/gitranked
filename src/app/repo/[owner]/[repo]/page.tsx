import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRepository } from "@/lib/github";
import { RepoDetailsClient } from "./RepoDetailsClient";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const data = await getRepository(owner, repo).catch(() => null);
  if (!data) return { title: "Repository not found" };
  return {
    title: `${data.nameWithOwner} — ${data.stargazerCount.toLocaleString()} stars`,
    description: data.description ?? `Explore ${data.nameWithOwner} on GitHub`,
    openGraph: {
      title: data.nameWithOwner,
      description: data.description ?? "",
    },
  };
}

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params;
  const data = await getRepository(owner, repo).catch(() => null);
  if (!data) notFound();

  return (
    <Suspense fallback={null}>
      <RepoDetailsClient repo={data} />
    </Suspense>
  );
}
