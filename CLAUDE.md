# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Workout plan PWA built with Vite + React + TypeScript. Originally a single-file Claude Desktop component, refactored into a modular app.

## Tech Stack

- **Build tool**: Vite
- **Framework**: React + TypeScript
- **Package manager**: Yarn
- **Test runner**: Vitest + @testing-library/react + jsdom
- **Styling**: CSS Modules (dark theme)
- **PWA**: vite-plugin-pwa (Workbox)
- **Deployment**: Vercel (static SPA)

## Commands

- `yarn dev` — Start dev server
- `yarn build` — Production build
- `yarn preview` — Preview production build locally
- `yarn test` — Run tests with Vitest (watch mode)
- `yarn test:run` — Run tests once (no watch)
- `npx tsc --noEmit` — Type-check without emitting

## Architecture

- **Data layer**: Exercise data (`days`, `tips`, `schedule`) in `src/data/exercises.ts`. The `Exercise` type has an optional `movements?: Movement[]` field — when present, the exercise is a superset and each movement tracks weight/reps independently.
- **Storage**: `localStorage` wrapper in `src/lib/storage.ts`. Log entries keyed as `"dayId-exerciseIndex-setIndex"` for regular exercises, and `"dayId-exerciseIndex-setIndex-movementIndex"` for individual superset movements. The hook exposes both `setKey` and `movKey` helpers.
- **State**: `useWorkoutLog` custom hook in `src/hooks/` encapsulates log, drafts, and completion state. For supersets, use the `getMovDraft`/`updateMovDraft`/`lastMovEntry` variants; regular exercises use `getDraft`/`updateDraft`/`lastEntry`.
- **Components**: Modular components under `src/components/` organized by tab (plan/, prehab/, tips/). Supersets render via `SupersetSetLogger` (one confirm button per set logs all movements); regular exercises use `SetLogger`.
- **Tabs**: Three tabs — "Workout Plan" (exercise tracker), "Knee & Foot Care" (prehab), "Tips & Strategy"

## Testing

- Unit/integration tests only — no E2E tests in this repo
- Tests live alongside source in `__tests__/` directories

## Key Patterns

- Set completion (`completedSets`) is intentionally ephemeral (resets each visit) while weight/rep logs persist across sessions via localStorage
- All components are client-side only — no SSR
- Exercise video links point to YouTube search results, not specific videos
- Superset `lastMovEntry` falls back to the old flat `setKey` entry for backwards compatibility with data logged before per-movement tracking was added
