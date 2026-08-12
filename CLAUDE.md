# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build (`vite build`) into `dist/`
- `npm run lint` — Oxlint
- `npm run preview` — serve the built `dist/` locally

There is no test suite in this repo yet.

Requires `.env.local` (gitignored, not committed) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — see `.env.example`. `src/lib/supabaseClient.ts` throws at import time if either is missing.

## Architecture

**Single-table persistence.** Everything lives in one Supabase table, `checklist_items` (id, section, category, name, estimated_value, is_checked, created_at) — defined and seeded in `supabase/schema.sql`. That file is the source of truth for schema/seed data but is **not** run automatically; it must be pasted into the Supabase SQL editor by hand whenever it changes. Incremental changes to an already-seeded database live as standalone scripts in `supabase/migrations/` (also run by hand, in order — they are not tracked/applied automatically). `section` is one of `'viagem' | 'gastos_fixos' | 'casa' | 'documentacao'` (`SectionKey` in `src/types.ts`). `category` is freeform text per item, not a separate table — there is no fixed category list; the UI derives the categories to render/group by from whatever distinct values are present in the fetched items for that section.

RLS is enabled on the table, but the policies grant the anon key full CRUD (`using (true)`) because the app has no authentication. If auth is ever added, the policies in `supabase/schema.sql` need to change from "public" to per-user rules.

**One hook owns all data.** `src/hooks/useChecklistItems.ts` fetches the *entire* table once on mount into a single in-memory `items` array — there's no per-section fetching and no realtime subscription. `toggleChecked`, `updateValue`, `addItem`, `deleteItem` all optimistically mutate local state first, then write through to Supabase. `itemsBySection(section)` just filters that same in-memory array. Switching tabs in `App.tsx` doesn't refetch anything — it only changes which slice of the shared list is rendered.

**Component flow:** `App.tsx` holds the `active` section key and the grand total (summed across *all* items regardless of section). `TopNav.tsx` is a single centered horizontal nav (with icons) used at every breakpoint — there's no separate desktop/mobile nav, it just wraps onto more rows on narrow screens. `SectionView.tsx` is stateless — it derives the section total, checked-count progress %, and category grouping straight from the `items` prop it's given, and computes `showValue = sectionKey !== 'documentacao'` to decide whether to render money-related UI at all (the "Documentação" section is a plain task checklist with no price). `showValue` is threaded down into `ChecklistItemRow` and `AddItemForm` to hide the value pill/input in that section. `ChecklistItemRow.tsx` owns its own local state for inline value-editing (click the value to get a number input) and its own delete-confirmation dialog (`ConfirmDialog.tsx`) — both are per-row and independent.

**Per-section accent color.** Each section has its own accent color (viagem = purple, gastos_fixos = amber/orange, casa = blue, documentacao = neutral slate) driving the section title gradient, progress bar, checkbox, value pill, category divider, and primary button. This works by CSS custom-property scoping: `:root` defines fixed `--accent-<section>` tokens plus a generic `--accent`/`--accent-strong`/`--accent-glow` alias; `SectionView` adds a class `accent-${sectionKey}` to its root element, and `.section-view.accent-viagem` (etc., in `index.css`) reassigns the generic `--accent*` variables to that section's fixed tokens. Everything inside a section only ever references the generic `--accent*` variables, so it automatically picks up the right color without per-component branching. `TopNav` uses the fixed `--accent-<section>` tokens directly (via `.top-nav-item--<section>.active`) since all tabs render simultaneously and can't rely on the scoped alias.

**Styling.** Everything is global CSS in `src/index.css` using CSS custom properties (`--purple`, `--glow`, `--card`, the per-section accent tokens above, etc.) — no CSS modules, no styled-components. The Sora variable font is self-hosted via `@fontsource-variable/sora`, imported once in `src/main.tsx`. Checkbox spring, strike-through (`scaleX` on `.strike`), and section/list transitions use `framer-motion` (`AnimatePresence` for enter/exit); plain hover/focus states use ordinary CSS transitions.

**Currency formatting** always goes through `src/utils/format.ts` (`formatCurrency`, pt-BR/BRL) — don't reformat numbers ad hoc elsewhere.

## Deployment

Deployed on Vercel from the `prlcheater/mudan-a` GitHub repo; Vercel auto-detects the Vite build (`vite build` → `dist/`). `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set in the Vercel project's Environment Variables (mirroring `.env.local`). The anon key is meant to be public client-side. The Supabase `secret`/`service_role` keys must never be added to Vercel env vars or referenced anywhere in this codebase — they bypass RLS entirely.
