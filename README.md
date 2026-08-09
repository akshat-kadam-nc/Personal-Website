# Akshat Kadam

The first public surface for akshatkadam.com: an editorial landing page for Akshat's work across technology, education, AI, and India–Japan.

## Run locally

Use a recent Node.js runtime, install dependencies, then run the development command:

```bash
pnpm install
pnpm dev
```

## Connect the AI assistant

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_AGENT_URL` to the public URL of the separately developed AI assistant. The landing page will then show an **Open the AI assistant** button.

## Next phase

The implementation roadmap and proposed MDX content architecture are in [PLAN.md](./PLAN.md). The current landing page intentionally establishes the visual system and public entry point before the archive, search, and publishing system are added.
