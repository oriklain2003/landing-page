# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static "Coming Soon" marketing landing page for the **ONYX** brand. Its only functional job is to send visitors to the main product's login URL via the "Terminal Access" button. Everything else (waitlist form, in-app login form) is decorative/simulated — there is no backend.

## Commands

Package manager is **pnpm** (despite what the upstream-template README says). A `pnpm-lock.yaml` is checked in.

- `pnpm install` — install deps
- `pnpm dev` — Vite dev server on `0.0.0.0:3000`
- `pnpm build` — production build
- `pnpm preview` — preview the build

No tests, no linter, no formatter are configured.

## Environment

- `VITE_LOGIN_URL` — URL of the main system. When set, the "Terminal Access" button does `window.location.href = VITE_LOGIN_URL`. When unset, it falls back to showing the in-app `LoginForm` (which is a non-functional UI mock — submit does nothing). Set this in `.env.local`.
- `GEMINI_API_KEY` — referenced in `vite.config.ts` and `README.md` as legacy from the AI Studio template. **Not used anywhere in the app.** Safe to ignore / eventually delete.

## Architecture

Single-page React 19 app, three-state machine driven by `AppState` (`types.ts`):

```
LOADING ──(4.5s timer in App.tsx)──▶ CONTENT ──(Terminal Access click)──▶ external login URL
                                          │
                                          └──(if VITE_LOGIN_URL unset)──▶ LOGIN (in-app mock)
```

`App.tsx` is the only orchestrator — it owns the state, the timer, and the `AnimatePresence` transitions between screens. Each screen is one component under `components/`:

- `LoadingScreen` — 4.5s splash with logo trace + fake progress bar
- `ComingSoonContent` — header (logo + Terminal Access), hero with typewriter effect cycling through `WORDS`, `WaitlistForm`, footer
- `WaitlistForm` — email input with simulated 2s submit; no network call, always "succeeds"
- `LoginForm` — visual mock; `onSubmit` is `preventDefault()` only. Only reachable when `VITE_LOGIN_URL` is unset
- `BackgroundEffect` — animated radial gradient + blobs + grain + grid, used on every screen

## Styling

- **Tailwind via CDN** (`<script src="https://cdn.tailwindcss.com">` in `index.html`). There is no `tailwind.config.js`, no PostCSS pipeline, and no `tailwindcss` dep in `package.json`. All utility classes resolve at runtime in the browser. Custom values go inline via arbitrary values (e.g. `bg-[#050505]`, `tracking-[0.3em]`).
- Fonts: Inter (body), Space Grotesk (headings via `.font-heading`), loaded from Google Fonts in `index.html`.
- Visual language: near-black `#050505` background, cyan-500 accent, heavy use of `backdrop-blur`, glass borders, and `framer-motion` for nearly every visible element. Preserve this aesthetic when adding UI.

## Conventions worth knowing

- React imports use ESM CDN shims via the `<script type="importmap">` in `index.html` — but the Vite build also bundles them normally from `node_modules`. Don't remove either.
- The `@/*` path alias maps to the project root (`tsconfig.json` + `vite.config.ts`).
- `index.html` references `/index.css` but no such file exists in the repo. The link 404s silently in dev. Leave it or remove it — it has no effect.
- The footer in `ComingSoonContent.tsx` says "© 2026 ONYX DEFENSIVE TECHNOLOGIES TLDR" — the "TLDR" is almost certainly a typo for "LTD". Worth flagging but don't silently "fix" copy.
