import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getUser } from "@/lib/github";
import { UserProfileClient } from "./UserProfileClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username).catch(() => null);
  if (!user) return { title: "User not found" };
  return {
    title: user.name ?? user.login,
    description: user.bio ?? `${user.login}'s GitHub profile`,
  };
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const user = await getUser(username).catch(() => null);
  if (!user) notFound();

  return (
    <Suspense fallback={null}>
      <UserProfileClient user={user} />
    </Suspense>
  );
}
