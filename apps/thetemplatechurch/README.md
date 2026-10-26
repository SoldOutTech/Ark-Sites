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

The content CLI exports editable snapshots, previews and applies page changes, and seeds empty React Bricks apps. It uses the authenticated account from `create-reactbricks-app` when you choose “keep me logged in”. Alternatively, provide a short-lived `REACT_BRICKS_DASHBOARD_TOKEN` or an app-specific `REACT_BRICKS_ADMIN_TOKEN` in the environment. The token must have admin access to the app specified by `--app-id`; the app's public read API key cannot write content.

```sh
# Export an editable snapshot from the template or another source app.
npm run content -- snapshot ./church-snapshot.json --app-id SOURCE_APP_ID

# Edit each entry's `page` in the JSON file; leave `id`, `language`,
# `base`, and `original` unchanged. Inspect changes before applying them.
npm run content -- diff ./church-snapshot.json --app-id SOURCE_APP_ID
npm run content -- publish ./church-snapshot.json --app-id SOURCE_APP_ID --apply

# Copy the snapshot into a separate empty app. Omit --apply for a preview.
npm run content -- seed ./church-snapshot.json --app-id TARGET_APP_ID
npm run content -- seed ./church-snapshot.json --app-id TARGET_APP_ID --apply

npm run test:content
```

Snapshots contain content and original page states, but no credentials; protect them as you would the underlying content. The tool refuses to overwrite a snapshot file or seed an app containing pages. Publishing checks each changed page against the original and stops on conflicts. Updates happen page by page, so a network error can leave a partially applied operation; export a fresh snapshot before retrying. On apps with working copies, publishing is currently refused; exporting also refuses pages with a different working copy to avoid losing drafts.

Seeding copies React Bricks-hosted images into the new app and remaps their master and cropped image IDs. Other external links and media continue to point to their original locations. A failed seed may leave uploaded images or some created pages; inspect the target before trying again. The React Bricks CLI's admin endpoints are not a documented stable API, and these operations still need verification against a live test app. The old `import-seed.cjs` is disabled because its image ID mapping was incorrect; the older published-only snapshot has a different format and must be recaptured with the new CLI.

To use this app as a living starter, edit and publish the Template Church pages, then capture a fresh snapshot. That snapshot becomes the starting content for future church apps.

Before using this app as a starter source, review city names, leader profiles, service times, addresses, contact details, donation links, embedded videos, social links, SEO metadata, and images.
