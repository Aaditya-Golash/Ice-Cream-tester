# Find Ya Flava

Find Ya Flava is an independent, source-aware audition project by Aaditya Golash. Visitors build an ideal ice-cream spoonful and receive the closest eligible match from a documented Dr. Bombay product catalogue. It is not affiliated with Dr. Bombay.

## What is implemented

- Four-step responsive preference quiz with a live illustrated spoonful.
- Deterministic matching with ingredient-exclusion filtering and transparent tradeoffs.
- Source-linked product results and an honest unsupported-combination state.
- Cutting-Chai Kulfi original flavour concept, clearly separated from catalogue products.
- Private-safe fragment sharing and downloadable 1080 × 1350 “My Flava” cards.
- Versioned, validated and bounded browser-only storage for requests, interest and feedback.
- Local analytics dashboard separated from clearly labelled fictional sample data.
- Presentation-only presets for repeatable screen recording.
- CSP, framing, referrer and browser-permission security headers.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For presentation controls, use [http://localhost:3000/?demo=1](http://localhost:3000/?demo=1).

## Verify

```bash
npm run verify
```

GitHub Actions runs the same locked-install, type-check and production-build sequence on pushes and pull requests.

## Record the demo

Follow the committed [screen-recording workflow](docs/SCREEN_RECORDING.md) for the recommended shot order, narration beats, one-click demo states and export checklist.

## Data and claims

Quiz activity stays in the current browser’s local storage. Shared links omit city, free-text requests and tasting feedback. Product descriptions and external links are maintained in `lib/catalog.ts`; availability and undocumented physical properties are never implied.
