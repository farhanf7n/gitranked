<div align="center">

<br />

# GitHunt

**Discover the most starred GitHub repositories from any date.**

A modern GitHub trending explorer built with Next.js 15, Tailwind CSS, and the GitHub GraphQL API — featuring a Vercel-inspired UI, powerful filtering, dark mode, and a blazing-fast developer experience.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square)](https://ui.shadcn.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br />

[Live Demo](#) · [Report Bug](https://github.com/yourusername/githunt/issues) · [Request Feature](https://github.com/yourusername/githunt/issues)

</div>

---

## Features

- **GitHub Trending Explorer** — Browse the most starred repositories surfaced from the GitHub GraphQL API
- **Date-based Discovery** — Filter by today, this week, this month, or pick any custom date
- **Language Filtering** — Narrow results to TypeScript, Python, Go, Rust, and 10+ languages
- **Sort Options** — Order by stars, forks, or recently updated
- **Grid & List Layouts** — Switch between a card grid and a compact list view
- **Repository Detail Pages** — Full stats, language breakdown, README preview, topics, and metadata
- **User Profile Pages** — Avatar, bio, contribution stats, pinned repositories, and social links
- **Dark & Light Mode** — System-aware theme with instant toggle, persisted across sessions
- **Command Palette** — Press `⌘K` to navigate, filter by language, change time range, or switch theme
- **Infinite Scrolling** — Seamless pagination with automatic loading as you scroll
- **Personal Token Support** — Save your GitHub token locally to avoid API rate limits
- **Responsive Design** — Optimised for desktop, tablet, and mobile with a collapsible filter drawer
- **Keyboard Navigation** — Full keyboard support with proper focus management
- **Framer Motion Animations** — Subtle, smooth transitions that never get in the way
- **Vercel-inspired UI** — Monochrome-first palette, clean typography, elegant hover states

---

## Tech Stack

| Technology                                                       | Purpose                                   |
| ---------------------------------------------------------------- | ----------------------------------------- |
| [Next.js 15](https://nextjs.org)                                 | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org)                     | Full type safety                          |
| [Tailwind CSS v4](https://tailwindcss.com)                       | Utility-first styling                     |
| [shadcn/ui](https://ui.shadcn.com)                               | Accessible, composable UI primitives      |
| [Framer Motion](https://www.framer.com/motion)                   | Animations and transitions                |
| [TanStack Query](https://tanstack.com/query)                     | Server state, caching, infinite scroll    |
| [GitHub GraphQL API](https://docs.github.com/en/graphql)         | Repository and user data                  |
| [next-themes](https://github.com/pacocoursey/next-themes)        | Dark/light mode with system preference    |
| [graphql-request](https://github.com/jasonkuhrt/graphql-request) | Lightweight GraphQL client                |
| [date-fns](https://date-fns.org)                                 | Date formatting and manipulation          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- A GitHub account (for a personal access token)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/githunt.git
cd githunt

# Install dependencies
npm install

# Copy the environment file
cp .env.local.example .env.local
```

### Environment Setup

Open `.env.local` and add your GitHub token:

```env
GITHUB_TOKEN=ghp_your_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** `GITHUB_TOKEN` is optional for development but strongly recommended to avoid hitting GitHub's 60 req/hour unauthenticated rate limit. With a token you get 5,000 requests/hour.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable              | Required | Description                                                     |
| --------------------- | -------- | --------------------------------------------------------------- |
| `GITHUB_TOKEN`        | Optional | GitHub Personal Access Token. Needs only `public_repo` scope.   |
| `NEXT_PUBLIC_APP_URL` | Optional | Your deployed app URL, used for sitemap and OpenGraph metadata. |

Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens/new?scopes=public_repo&description=GitHunt).

---

## Personal Token System

GitHunt includes a built-in token onboarding flow for users who visit without a server-configured token.

- A subtle floating notice appears in the bottom-left corner when no token is detected
- Users can enter their own GitHub Personal Access Token directly in the browser
- The token is saved **only in the browser's `localStorage`** — it is never stored on or sent to any server beyond GitHub's API
- On every API request, the client forwards the token via an `X-GitHub-Token` header to the Next.js API routes
- The server uses the client-provided token as a fallback when no `GITHUB_TOKEN` env var is set

This design lets GitHunt be deployed publicly without a shared token, while still giving every visitor a smooth, rate-limit-free experience.

---

## Folder Structure

```
githunt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── repositories/        # GET /api/repositories
│   │   │   ├── repo/[owner]/[repo]/ # GET /api/repo/:owner/:repo
│   │   │   ├── user/[username]/     # GET /api/user/:username
│   │   │   └── token-status/        # GET /api/token-status
│   │   ├── repo/[owner]/[repo]/     # Repository detail page
│   │   ├── user/[username]/         # User profile page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── command/                 # Command palette (⌘K)
│   │   ├── filters/                 # FilterBar, DateRangePicker
│   │   ├── layout/navbar/           # Sticky navbar
│   │   ├── repository/              # RepoCard, RepoGrid, skeletons
│   │   ├── search/                  # SearchInput
│   │   ├── theme/                   # ThemeToggle
│   │   ├── token/                   # TokenNotice + dialog
│   │   └── ui/                      # shadcn/ui primitives
│   ├── lib/
│   │   ├── github.ts                # GitHub GraphQL API client
│   │   ├── token.ts                 # localStorage token utilities
│   │   ├── types.ts                 # Shared TypeScript types
│   │   ├── utils.ts                 # cn() and helpers
│   │   └── hooks/
│   │       ├── useRepositories.ts
│   │       ├── useRepository.ts
│   │       └── useUser.ts
│   └── providers/
│       ├── QueryProvider.tsx        # TanStack Query
│       └── ThemeProvider.tsx        # next-themes
├── public/
├── .env.local.example
├── next.config.ts
└── tsconfig.json
```

---

## Design Philosophy

GitHunt's visual design is inspired by [Vercel](https://vercel.com), [Linear](https://linear.app), and [Raycast](https://raycast.com).

**Principles:**

- **Monochrome-first** — Pure blacks and soft whites. No bright gradients, no neon accents.
- **Typography-led** — Content hierarchy through weight, size, and spacing — not color.
- **Minimal chrome** — UI elements recede; your content is always the focus.
- **Purposeful motion** — Framer Motion animations are subtle and fast. Nothing blocks interaction.
- **Dense but readable** — Cards pack a lot of information without feeling cluttered.
- **Exceptional dark mode** — `#000000` background, `#0a0a0a` cards, `#1f1f1f` borders — true black, not dark gray.

---

## Performance

- **React Server Components** — all data-fetching pages render on the server with zero client JS overhead
- **Infinite scroll** — `IntersectionObserver` loads the next page automatically as you scroll
- **TanStack Query caching** — repeated filter changes use cached results, not redundant network requests
- **Next.js Image optimization** — automatic WebP conversion and lazy loading for all avatars
- **Suspense boundaries** — skeleton UIs appear instantly while data loads in the background

---

## Accessibility

- Full keyboard navigation throughout the app
- Command palette navigable with arrow keys and `Enter`
- Proper `aria-label` attributes on all icon-only buttons
- Semantic HTML landmarks (`<header>`, `<main>`, `<nav>`)
- Focus-visible outlines on all interactive elements
- Colour contrast meets WCAG AA in both light and dark modes

---

## Roadmap

- [x] Command palette (`⌘K`)
- [x] Local GitHub token onboarding
- [x] Repository detail pages
- [x] User profile pages
- [x] Infinite scrolling
- [x] Grid and list layouts
- [x] Dark / light / system theme
- [ ] AI-generated repository summaries
- [ ] Bookmark repositories
- [ ] GitHub OAuth authentication
- [ ] Trending developers leaderboard
- [ ] Star history sparkline charts
- [ ] Compare two repositories side-by-side
- [ ] Keyboard shortcuts reference panel
- [ ] Save filter presets
- [ ] PWA / offline support

---

## Contributing

Contributions are welcome!

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/yourusername/githunt.git

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: describe your change"

# 4. Push to your fork
git push origin feat/your-feature-name

# 5. Open a Pull Request
```

Please open an issue first for significant changes so we can align on the approach before you invest time building it.

---

## License

Distributed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

</div>
