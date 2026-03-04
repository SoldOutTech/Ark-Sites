# The Edinburgh Church App

Next.js + React Bricks app for the Edinburgh church site.

- App path: `apps/theedinburghchurch`
- Live site: [theedinburgh.church](https://theedinburgh.church)
- Shared UI package: `packages/ark-ui`

## Monorepo context

This app is part of the `ark-sites` monorepo and consumes `@bazel-digital/ark-ui` from the local workspace (`file:../../packages/ark-ui`).

## Local development

From monorepo root:

```bash
npm install
npm run dev:edinburgh
```

Alternative (from this folder):

```bash
npm run dev
```

## Environment variables

Create `apps/theedinburghchurch/.env.local` with your React Bricks credentials:

You can obtain these credentials from the React Bricks dashboard for the relevant project.

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=...
REACT_BRICKS_API_KEY=...
```

## Build

From repo root:

```bash
npm run build:edinburgh
```

Or from this folder:

```bash
npm run build
```

## Vercel

Create a dedicated Vercel project for this app:

- Repo: `Ark Sites` monorepo
- Root Directory: `apps/theedinburghchurch`
- Framework Preset: Next.js
- Env vars: set Edinburgh-specific `NEXT_PUBLIC_REACT_BRICKS_APP_ID` and `REACT_BRICKS_API_KEY`
