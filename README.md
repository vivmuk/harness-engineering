# Harness Engineering

Design agent harnesses for any domain.

A beautiful, interactive website + recipe generator for building domain-specific AI harnesses. Powered by Venice AI.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Generator

The generator is fully client-side. Visit `/generator/`, paste your Venice API key, and describe the workflow you want to harness. The site will produce:

- A complete harness recipe
- A starter file bundle (`CLAUDE.md`, playbooks, agents, skills, state schema, anti-patterns, QHX loop)
- A generated illustration of the harness architecture

## Environment

No server-side API key is required for the static site. Copy `.env.example` to `.env.local` only if you add backend routes later:

```
VENICE_API_KEY=your_key_here
```

## Build

```bash
npm run build
```

Static export is output to `dist/`.

## Deploy to Railway

1. Push this repo to GitHub (`vivmuk/harness-engineering`).
2. In Railway, click **New Project** → **Deploy from GitHub repo** and select `vivmuk/harness-engineering`.
3. Railway will use `railway.json` to build and serve the static `dist/` folder.
4. No environment variables are required for the generator to work.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Venice REST API (`/chat/completions`, `/image/generate`)
- `jszip` for bundle downloads
- `lucide-react` for icons
