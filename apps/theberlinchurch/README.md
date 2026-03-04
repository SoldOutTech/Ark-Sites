# The Berlin Church App

Next.js + React Bricks app for the Berlin International Christian Church site.

- App path: `apps/theberlinchurch`
- Live site: [theberlin.church](https://www.theberlin.church)
- Shared UI package: `packages/ark-ui`

## Monorepo context

This app is part of the `ark-sites` monorepo and consumes `@bazel-digital/ark-ui` from the local workspace (`file:../../packages/ark-ui`).

## Local development

From monorepo root:

```bash
npm install
npm run dev:berlin
```

Alternative (from this folder):

```bash
npm run dev
```

## Environment variables

Create `apps/theberlinchurch/.env.local` with your React Bricks credentials:

You can obtain these credentials from the React Bricks dashboard for the relevant project.

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=...
REACT_BRICKS_API_KEY=...
```

## Build

From repo root:

```bash
npm run build:berlin
```

Or from this folder:

```bash
npm run build
```

## Vercel

Create a dedicated Vercel project for this app:

- Repo: `Ark Sites` monorepo
- Root Directory: `apps/theberlinchurch`
- Framework Preset: Next.js
- Env vars: set Berlin-specific `NEXT_PUBLIC_REACT_BRICKS_APP_ID` and `REACT_BRICKS_API_KEY`
