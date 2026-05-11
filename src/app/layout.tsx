import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { TokenNotice } from "@/components/token/TokenNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GitRanked — Discover Trending GitHub Repositories",
    template: "%s | GitRanked",
  },
  description:
    "Discover the most starred GitHub repositories from any date. Filter by language, time range, and more.",
  keywords: ["github", "trending", "repositories", "open source", "developers"],
  authors: [{ name: "GitRanked" }],
  openGraph: {
    title: "GitRanked — Discover Trending GitHub Repositories",
    description: "Discover the most starred GitHub repositories from any date.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitRanked — Discover Trending GitHub Repositories",
    description: "Discover the most starred GitHub repositories from any date.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <TokenNotice />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
