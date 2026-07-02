# Harness Engineering

Design agent harnesses for any domain.

A beautiful, interactive website + recipe generator for building domain-specific AI harnesses. Powered by Venice AI.

## Development

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and add your Venice API key:

```
VENICE_API_KEY=your_key_here
```

The generator calls Venice AI directly from the browser using your own key.

## Build

```bash
npm run build
```

Static export is output to `dist/`.

## Deploy

Configure Railway to deploy from this repo. Set `VENICE_API_KEY` as an environment variable only if you add server-side routes later. The current generator is client-side.
