# ⛪️ theberlin.church

This is the official website of the **Berlin International Christian Church**, built to be beautiful, performant, and scalable for other churches to replicate.

> 🧭 Live: [theberlin.church](https://theberlin.church)

---

## 🏗️ Tech Stack Overview

| Layer         | Tool / Platform                                                                          |
| ------------- | ---------------------------------------------------------------------------------------- |
| Hosting       | [Vercel](https://vercel.com)                                                             |
| CMS           | [React Bricks](https://reactbricks.com)                                                  |
| UI Components | [`@bazel-digital/ark-ui`](https://github.com/bazel-digital/ark-ui) (private NPM package) |
| Styling       | [Tailwind CSS](https://tailwindcss.com)                                                  |
| Framework     | [Next.js](https://nextjs.org)                                                            |

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vizcosity/theberlinchurch.git
cd theberlinchurch
npm install
```

You must have access to the private @bazel-digital/ark-ui NPM package. See 🔐 Private Package Setup.

### 2. Configure Environment

Create a .env.local file:

```bash
NEXT_PUBLIC_REACT_BRICKS_APP_ID=your-app-id
REACT_BRICKS_API_KEY=your-api-key
NPM_TOKEN=your-npm-token
```

You can get your React Bricks credentials by creating a free project at reactbricks.com.

### 3. Start Development Server

```bash
npm run dev
```

## 🧱 Bricks & Design System

This project uses a shared component library called @bazel-digital/ark-ui, which includes reusable, branded bricks for:
• Hero sections (image, video, text)
• Timelines
• Collapsibles
• Profile cards
• Layout components (navbar, footer)
• Event-specific UI blocks

Bricks are grouped into categories inside ark-ui and registered like this:

```js
import arkUI from '@bazel-digital/ark-ui'

const bricks = [arkUI]
```

All content is edited visually via the React Bricks CMS at /admin.

## 🎨 Tailwind Configuration

Ensure Tailwind scans all relevant folders, including external packages:

```js
// tailwind.config.js

module.exports = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './react-bricks/**/*.{ts,tsx}',
    './node_modules/@bazel-digital/ark-ui/**/*.{ts,tsx}', // Required
  ],
  // ...
}
```

This is required for Tailwind styles inside ark-ui to be applied correctly.

## 🔐 Private Package Setup

To use the @bazel-digital/ark-ui package, you need access to GitHub Packages.

### 1. Create a .npmrc file in the project root:

```bash
@bazel-digital:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 2. Set NPM_TOKEN in your .env.local and in Vercel:

```bash
NPM_TOKEN=your-github-personal-access-token
```

The token should have `read:packages` scope. You can obtain your token by creating a GitHub Private Access Key in your account settings. Firstly, you need access to the [`@bazel-digital/ark-ui`](https://github.com/bazel-digital/ark-ui) (ark-ui) github repo. If you do not, request acccess by contacting Aaron.

## ⚠️ Common Gotchas

### ✅ Tailwind not applying styles?

Make sure you’ve updated tailwind.config.js to include @bazel-digital/ark-ui as shown above.

### ✅ Vercel build fails to fetch ark-ui?

Ensure that:
• .npmrc exists in the project root
• NPM_TOKEN is set as an environment variable in the Vercel project

## 🧱 Scaling to Other Churches

This project was built with scalability in mind. To replicate for another church:

1. Create a new React Bricks site (get a new APP_ID and API_KEY)
2. Clone this repo and update .env.local
3. Repoint content (logo, name, colors, etc.)
4. Deploy to Vercel
5. Begin editing content via /admin

No need to fork the bricks or reimplement design—just reuse @bazel-digital/ark-ui.

## 🧠 Learnings

    •	Centralized Bricks enable consistent branding and faster rollout across locations
    •	React Bricks CMS empowers non-developers to edit content visually
    •	Tailwind CSS + Next.js provides rapid dev with modern performance

## 🙌 Maintainers

    •	Built by @aaronbaw
    •	UI Library: @bazel-digital/ark-ui

For support, open an issue or message the maintainers directly.

To God be the glory ✨
