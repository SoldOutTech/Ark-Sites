# The London Church App

Next.js + React Bricks app for the London church site.

- App path: `apps/thelondonchurch`
- Live site: [thelondon.church](https://thelondon.church)
- Shared UI package: `packages/ark-ui`

## Monorepo context

This app is part of the `ark-sites` monorepo and consumes `@bazel-digital/ark-ui` from the local workspace (`file:../../packages/ark-ui`).

## Local development

From monorepo root:

```bash
npm install
npm run dev:london
```

Alternative (from this folder):

```bash
npm run dev
```

## Environment variables

Create `apps/thelondonchurch/.env.local` with your React Bricks credentials:

You can obtain these credentials from the React Bricks dashboard for the relevant project.

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=...
REACT_BRICKS_API_KEY=...
```

### PhotoGallery Dropbox relay

PhotoGallery Dropbox folder links use a server-side relay endpoint in this app.

Editor usage:

1. Set `Dropbox URL` and `Max Images` in the PhotoGallery Data panel.
2. Click `Load Images` to persist resolved image and thumbnail URLs into brick props.

Required Dropbox env vars for the relay:

```bash
DROPBOX_ACCESS_TOKEN=...
DROPBOX_REFRESH_TOKEN=...
DROPBOX_APP_KEY=...
DROPBOX_APP_SECRET=...
```

Full setup guide:

- [Dropbox PhotoGallery Relay docs](/Users/aaronbaw/Code/Ark Sites/docs/dropbox-photogallery-relay.md)

## Build

From repo root:

```bash
npm run build:london
```

Or from this folder:

```bash
npm run build
```

## Vercel

Create a dedicated Vercel project for this app:

- Repo: `Ark Sites` monorepo
- Root Directory: `apps/thelondonchurch`
- Framework Preset: Next.js
- Env vars: set London-specific `NEXT_PUBLIC_REACT_BRICKS_APP_ID` and `REACT_BRICKS_API_KEY`
