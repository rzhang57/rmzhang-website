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

### Special instructions
- Do NOT put any unnecessary comments in code.

### Content pipeline

`src/data/content.json` is the seed and permanent fallback. `getContent()` in
`src/lib/content/store.ts` reads a Vercel Blob override first and falls back to
the committed json, so local dev and builds work with no store configured.
`ContentProvider` in `src/lib/content/provider.tsx` hands it to the client
sections, which read it with `useContent()`.

- `/admin` - visual editor, guarded by `src/proxy.ts`
- `/api/content` - public read; `/api/admin/content` - authenticated write

The editor has no hardcoded field list. `src/lib/content/shape.ts` derives the
structure from the committed json, so the same admin works against any shape and
a save is rejected if it would drop a key the pages read. Publishing calls
`revalidateTag`, so pages stay statically prerendered and update in seconds
without a redeploy.

### Admin auth

Password gate, no database and no third party. `ADMIN_PASSWORD_HASH` holds an
scrypt hash; `ADMIN_SECRET` signs the session cookie. Generate both with
`npm run admin:password` (`--env` writes them locally, `--vercel` also pushes).

- `src/lib/admin/password.ts` - scrypt hash and constant-time verify, node only
- `src/lib/admin/auth.ts` - session jwt, no node builtins so the proxy can run
  it on the edge
- `src/lib/admin/throttle.ts` - 8 failed attempts per 15 minutes per ip

The write route also rejects requests whose `Origin` is not this site.
