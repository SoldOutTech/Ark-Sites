# Ark Sites Monorepo

This repository contains all church apps plus the shared UI package.

## Structure

- `apps/thelondonchurch`
- `apps/theparischurch`
- `apps/theberlinchurch`
- `apps/theedinburghchurch`
- `packages/ark-ui`

## Local development

Requirements:

- Node.js 22+
- npm 10+

Install once at repo root:

```bash
npm install
```

Run an app:

```bash
npm run dev:london
npm run dev:paris
npm run dev:berlin
npm run dev:edinburgh
```

Build an app:

```bash
npm run build:london
npm run build:paris
npm run build:berlin
npm run build:edinburgh
```

## Shared package development

Apps consume the local package via:

- `"@bazel-digital/ark-ui": "file:../../packages/ark-ui"`

Edit code in `packages/ark-ui` and rerun app builds/dev as needed.

## Vercel deployment

Create one Vercel project per app from this same repo.

Set **Root Directory** per Vercel project:

- London: `apps/thelondonchurch`
- Paris: `apps/theparischurch`
- Berlin: `apps/theberlinchurch`
- Edinburgh: `apps/theedinburghchurch`

Set environment variables per project (React Bricks keys, etc.).

Vercel should install dependencies from the monorepo root and include sibling package files.
