# The Template Church

This Next.js and React Bricks app is the editable reference for new Ark Sites church websites. It is a separate React Bricks app using the shared `@bazel-digital/ark-ui` bricks. Its content can be changed in the React Bricks editor before taking a fresh seed snapshot for a new church.

The Template Church does not own `thetemplate.church` or any other custom domain. Deploy it as a Vercel project with root directory `apps/thetemplatechurch` and use its Vercel-assigned URL. The app sends `noindex, nofollow` headers and disallows crawlers in `robots.txt`.

## Local setup

Create `.env.local` from `.env.example` and set the **Template Church's own** `NEXT_PUBLIC_APP_ID` and `API_KEY`. Do not use Dublin's keys. Both values come from the Template Church React Bricks app.

From the repository root:

```sh
npm install
npm run dev:template
npm run build:template
```

The editor lives at `/admin`.

## Content

The bricks themselves are defined in `packages/ark-ui`. Editable page content lives in React Bricks. The initial Dublin copy is saved as `seeds/dublin-initial-2026-10-05.json` at the repository root. It contains all 12 published Dublin pages and 85 arranged bricks, ready to import into the Template Church React Bricks app and curate into a reusable skeleton. Publishing a change here does not automatically alter any existing church app.

The snapshot can be refreshed from a source React Bricks app using `scripts/react-bricks/snapshot-published.cjs` and its read-only API key. The snapshot has no credentials. Its image objects currently point to Dublin's React Bricks assets; copy those assets into the Template Church media library before using this app as a source for new churches.

Before using this app as a starter source, review city names, leader profiles, service times, addresses, contact details, donation links, embedded videos, social links, SEO metadata, and images.
