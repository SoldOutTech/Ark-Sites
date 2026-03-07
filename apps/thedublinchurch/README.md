# The Dublin Church App

Next.js + React Bricks app for the Dublin church site.

- App path: `apps/thedublinchurch`
- Live site: [thedublin.church](https://thedublin.church)
- Shared UI package: `packages/ark-ui`

## Monorepo context

This app is part of the `ark-sites` monorepo and consumes `@bazel-digital/ark-ui` from the local workspace (`file:../../packages/ark-ui`).

## Local development

From monorepo root:

```bash
npm install
npm run dev:dublin
```

Alternative (from this folder):

```bash
npm run dev
```

## Environment variables

Create `apps/thedublinchurch/.env.local` with your React Bricks credentials:

You can obtain these credentials from the React Bricks dashboard for the relevant project.

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=...
REACT_BRICKS_API_KEY=...
```

## Build

From repo root:

```bash
npm run build:dublin
```

Or from this folder:

```bash
npm run build
```

## Vercel

Create a dedicated Vercel project for this app:

- Repo: `Ark Sites` monorepo
- Root Directory: `apps/thedublinchurch`
- Framework Preset: Next.js
- Env vars: set Dublin-specific `NEXT_PUBLIC_REACT_BRICKS_APP_ID` and `REACT_BRICKS_API_KEY`
