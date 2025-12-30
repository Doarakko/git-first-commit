# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

**Git First Commit** is a Next.js web application that displays the first commit of GitHub repositories. Users can search for repositories or browse featured ones to see their initial commits.

- **Live URL**: https://git-first-commit.2wua4nlyi4102.workers.dev (Workers deployment)
- **Legacy URL**: https://git-first-commit.pages.dev (no longer active)

## Tech Stack

- **Framework**: Next.js 15.5.9 with React 19
- **Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`
- **Database**: Cloudflare D1 (SQLite-based)
- **Styling**: Tailwind CSS 4
- **Linting/Formatting**: Biome
- **GitHub API**: Octokit

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Build
npm run build            # Next.js build
npm run pages:build      # OpenNext build for Cloudflare

# Deploy
npm run deploy           # Build and deploy to Cloudflare Workers

# Preview
npm run preview          # Local preview with OpenNext

# Code Quality
npm run lint             # Run Biome linter
npm run format           # Format code with Biome

# Database
npm run d1:execute       # Execute migrations locally
npm run d1:execute-prd   # Execute migrations in production
npm run cf-typegen       # Generate Cloudflare types
```

## Architecture

### Directory Structure

```
src/app/
├── api/
│   ├── repositories/route.ts       # GET /api/repositories - list/search repos
│   └── usernames/[username]/repositories/[repositoryName]/commits/route.ts
│                                    # GET commits for specific repo
├── [username]/[repositoryName]/page.tsx  # Repository detail page
├── page.tsx                         # Home page (client component)
├── not-found.tsx                    # 404 page
├── db.ts                            # GitHubRepository class for D1 operations
├── github.ts                        # GitHub class wrapping Octokit
├── constants.ts                     # Metadata and regex patterns
└── types/index.ts                   # TypeScript interfaces
```

### Key Components

- **GitHubRepository** (`src/app/db.ts`): D1 database operations for repositories and commits
- **GitHub** (`src/app/github.ts`): Octokit wrapper for GitHub API calls, fetches first commits
- **API Routes**: Use `getCloudflareContext()` from `@opennextjs/cloudflare` to access D1 bindings

### Database Schema

Two tables in D1:
- `repositories`: id, platform_name, username, name, description, owner_image_url, star_count, platform_created_at
- `commits`: repository_id, url, message, author_id, author_name, author_url, author_image_url, commit_date, author_date

### Cloudflare Configuration

- **wrangler.jsonc**: Workers configuration with D1 binding (DB)
- **open-next.config.ts**: OpenNext configuration for Cloudflare
- Environment variable `PUBLIC_URL` is used for internal API calls in SSR

## Development Notes

### Accessing Cloudflare Bindings

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

const { env } = await getCloudflareContext();
const db = env.DB;  // D1 database
```

### Environment Variables

- `GITHUB_TOKEN`: GitHub API token for fetching repository data
- `PUBLIC_URL`: Base URL for internal API calls (set in wrangler.jsonc)
- `CLOUDFLARE_API_TOKEN`: For deployment (GitHub Actions secret)
- `CLOUDFLARE_ACCOUNT_ID`: For deployment (GitHub Actions secret)

### Important Constraints

- Do NOT use `export const runtime = "edge"` - OpenNext Cloudflare handles runtime automatically
- API routes should not have edge runtime declarations
- The app uses Workers deployment, not Pages
