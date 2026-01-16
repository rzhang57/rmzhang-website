# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (ryanz.dev) built with Next.js 14+ App Router, TypeScript, and Tailwind CSS. Deployed on Vercel.

## Commands

```bash
npm run dev       # Start development server on localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (mix of server and client components)
- `src/components/landing/` - Landing page section components (Hero, About, Projects, Contact)
- `src/components/ui/` - Shadcn/ui components
- `src/data/content.json` - Static content for about, work, hobbies sections
- `src/lib/utils.ts` - Utility functions including `cn()` for classname merging

### Key Patterns

- **Server/Client Hybrid**: Components use "use client" directive where needed
- **Path Aliases**: Use `@/*` for imports from `src/`
- **Styling**: Tailwind CSS with Shadcn/ui components and custom glass morphism effects
- **Animations**: Framer Motion for component animations, custom CSS keyframes in globals.css

### Spotify Integration

API routes in `src/app/api/spotify/`:
- `currently-playing/route.ts` - Fetches currently playing track
- `top-tracks/route.ts` - Fetches top tracks
- `util.ts` - OAuth token refresh handling

Requires `.env.local` with:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
