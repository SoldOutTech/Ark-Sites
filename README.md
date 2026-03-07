# Ark Sites

A shared platform for church websites built with a single design system, a unified engineering workflow, and local editorial control through React Bricks.

## Vision

Then the Lord said to Moses, “See, I have chosen Bezalel son of Uri, the son of Hur, of the tribe of Judah, and I have filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills—to make artistic designs for work in gold, silver and bronze, to cut and set stones, to work in wood, and to engage in all kinds of crafts. Moreover, I have appointed Oholiab son of Ahisamak, of the tribe of Dan, to help him. Also I have given ability to all the skilled workers to make everything I have commanded you
Exodus 31:1-6

Moses was given a pattern that was used to build the tabernacle. In the same way, we want to define the "pattern" that is used to build the digital tabernacle, on the internet. A custom designed design system sits at the heart of the Sold Out Movement's web design, with a unified, shared design language that affords a certain level of excellence, polish and uniformity, while giving flexibility to each local Church to tune and tweak each site to their specific preferences, flavours and style.

## Tech Stack

- Framework: Next.js
- CMS: React Bricks
- UI System: `@bazel-digital/ark-ui` (local workspace package in this repo)
- Styling: Tailwind CSS
- Hosting: Vercel

## Repository Structure

```text
apps/
  thelondonchurch/
  theparischurch/
  theberlinchurch/
  thedublinchurch/
  theedinburghchurch/
packages/
  ark-ui/
```

- `apps/*`: Individual church sites with their own content model, env vars, and deployment target.
- `packages/ark-ui`: Shared React Bricks-compatible component library used by all apps.

## Why This Architecture

- One codebase reduces duplication and maintenance overhead.
- A shared UI package keeps interaction and brand language consistent.
- Local app boundaries preserve flexibility for city-specific content and experience.
- Changes to shared UI can be tested across multiple apps immediately.

## React Bricks Workflow

Each app integrates React Bricks for visual content editing and page management.

- Developers define and evolve reusable bricks in `packages/ark-ui`.
- Editors manage page content from each app's React Bricks dashboard.
- Apps register shared bricks and compose pages without duplicating core components.

This keeps implementation centralized while content ownership remains local.

## Local Development

Requirements:

- Node.js 22+
- npm 10+

Install dependencies once from the monorepo root:

```bash
npm install
```

Run any app:

```bash
npm run dev:london
npm run dev:paris
npm run dev:berlin
npm run dev:dublin
npm run dev:edinburgh
```

Build any app:

```bash
npm run build:london
npm run build:paris
npm run build:berlin
npm run build:dublin
npm run build:edinburgh
```

## Shared UI Development

All apps consume the local `ark-ui` package directly:

- `"@bazel-digital/ark-ui": "file:../../packages/ark-ui"`

When you update `packages/ark-ui`, those changes are immediately available to every app in this monorepo workflow.

## Deployment (Vercel)

Use one Vercel project per app, all connected to this same repository.

Set each Vercel project's **Root Directory**:

- London: `apps/thelondonchurch`
- Paris: `apps/theparischurch`
- Berlin: `apps/theberlinchurch`
- Dublin: `apps/thedublinchurch`
- Edinburgh: `apps/theedinburghchurch`

Set app-specific environment variables (React Bricks credentials, etc.) in each Vercel project.

Made with 🙏, ☕️ and ❤️ by disciples.
