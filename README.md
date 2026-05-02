<p align="center">
  <img src="docs/assets/ark-sites-logo.png" alt="Ark Sites logo" width="180" />
</p>

<h1 align="center">Ark Sites</h1>

<p align="center">
  A shared platform for SoldOutMovement church websites, built around one design system,
  one engineering workflow, and local editorial control through React Bricks.
</p>

<p align="center">
  <a href="#local-development">Local Development</a> ·
  <a href="#applications">Applications</a> ·
  <a href="#shared-ui">Shared UI</a> ·
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%3E%3D22-339933?logo=nodedotjs&logoColor=white" />
</p>

## Overview

Ark Sites is a monorepo for building and maintaining SoldOutMovement websites across
multiple cities. Each church has its own Next.js application, React Bricks
content model, environment variables, and deployment target, while shared
presentation components live in a single local UI package.

The goal is simple: preserve local flexibility while raising the quality,
consistency, and maintainability of every site built on the platform.

## Vision

Then the Lord said to Moses:

> See, I have chosen Bezalel son of Uri, the son of Hur, of the tribe of
> Judah, and I have filled him with the Spirit of God, with wisdom, with
> understanding, with knowledge and with all kinds of skills.
>
> Exodus 31:1-6

Moses was given a blueprint for building the tabernacle. In the same spirit,
Ark Sites defines a blueprint for building digital tabernacles on the internet:
a shared design language that brings excellence, polish, and consistency to
the SoldOutMovement's web presence while giving each local church room to
shape its site around its city, culture, and ministry needs.

## Applications

| City | Workspace | Development | Build |
| --- | --- | --- | --- |
| London | `apps/thelondonchurch` | `npm run dev:london` | `npm run build:london` |
| Paris | `apps/theparischurch` | `npm run dev:paris` | `npm run build:paris` |
| Berlin | `apps/theberlinchurch` | `npm run dev:berlin` | `npm run build:berlin` |
| Dublin | `apps/thedublinchurch` | `npm run dev:dublin` | `npm run build:dublin` |
| Edinburgh | `apps/theedinburghchurch` | `npm run dev:edinburgh` | `npm run build:edinburgh` |

## Platform

| Layer | Technology |
| --- | --- |
| Framework | Next.js |
| UI | React 19 |
| CMS | React Bricks |
| Shared components | `@bazel-digital/ark-ui` |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Package manager | npm workspaces |
| Runtime | Node.js 22+ |

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
docs/
  assets/
```

| Path | Purpose |
| --- | --- |
| `apps/*` | Individual church sites with their own content model, environment variables, and deployment target. |
| `packages/ark-ui` | Shared React Bricks-compatible component library used by every app. |
| `docs` | Supporting implementation notes, setup guides, and README assets. |

## Architecture

- One codebase reduces duplicated implementation and maintenance work.
- A shared UI package keeps interaction patterns and brand language consistent.
- Local app boundaries preserve flexibility for city-specific content and site behavior.
- Shared UI changes can be tested across all city apps from the same workspace.

## React Bricks Workflow

Each app integrates React Bricks for visual content editing and page
management.

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

Run an app:

```bash
npm run dev:london
```

Build an app:

```bash
npm run build:london
```

Build every app:

```bash
npm run build:all
```

## Shared UI

All apps consume the local `ark-ui` package directly:

```json
"@bazel-digital/ark-ui": "file:../../packages/ark-ui"
```

When `packages/ark-ui` changes, those updates are immediately available to
every app in the monorepo workflow.

## Documentation

- [Dropbox PhotoGallery Relay](docs/dropbox-photogallery-relay.md)

The London app uses a server-side Dropbox relay for PhotoGallery folder URLs.
In the editor, set the folder URL and click `Load Images` once to persist
resolved image and thumbnail URLs into block props.

## Deployment

Use one Vercel project per app, all connected to this repository.

Set each Vercel project's root directory:

| Project | Root Directory |
| --- | --- |
| London | `apps/thelondonchurch` |
| Paris | `apps/theparischurch` |
| Berlin | `apps/theberlinchurch` |
| Dublin | `apps/thedublinchurch` |
| Edinburgh | `apps/theedinburghchurch` |

Set app-specific environment variables, including React Bricks credentials, in
each Vercel project.

## Maintainers

Made by disciples for disciples.
