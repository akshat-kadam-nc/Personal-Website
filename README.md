# Akshat Kadam — Personal Archive

The production source for [akshatkadam.com](https://akshatkadam.com): a manga-inspired personal portfolio built with Next.js, React, TypeScript, Three.js, and server-side API routes.

## Run locally

Use Node.js 22 and pnpm:

```bash
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` to `.env.local` and provide the server-side assistant variables. Secrets are consumed only by the API routes and are never exposed to the browser.

## Deployment

The `main` branch deploys to Vercel. The framework preset is Next.js and no custom output directory is required.
