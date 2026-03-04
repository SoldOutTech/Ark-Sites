# The Paris Church App

Next.js + React Bricks app for the Paris church site (Eglise de Paris).

- App path: `apps/theparischurch`
- Live site: [eglisede.paris](http://eglisede.paris)
- Shared UI package: `packages/ark-ui`

## Monorepo context

This app is part of the `ark-sites` monorepo and consumes `@bazel-digital/ark-ui` from the local workspace (`file:../../packages/ark-ui`).

## Local development

From monorepo root:

```bash
npm install
npm run dev:paris
```

Alternative (from this folder):

```bash
npm run dev
```

## Environment variables

Create `apps/theparischurch/.env.local` with your React Bricks credentials:

You can obtain these credentials from the React Bricks dashboard for the relevant project.

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=...
REACT_BRICKS_API_KEY=...
```

## Build

From repo root:

```bash
npm run build:paris
```

Or from this folder:

```bash
npm run build
```

## Vercel

Create a dedicated Vercel project for this app:

- Repo: `Ark Sites` monorepo
- Root Directory: `apps/theparischurch`
- Framework Preset: Next.js
- Env vars: set Paris-specific `NEXT_PUBLIC_REACT_BRICKS_APP_ID` and `REACT_BRICKS_API_KEY`
