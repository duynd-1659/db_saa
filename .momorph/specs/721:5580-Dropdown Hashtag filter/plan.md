# Implementation Plan: Dropdown Hashtag filter

**Frame**: `721:5580-Dropdown Hashtag filter`
**Date**: 2026-03-12
**Spec**: `specs/721:5580-Dropdown Hashtag filter/spec.md`

---

## Summary

A single-select hashtag filter dropdown for the Kudos feed. The dropdown lists all 13 hashtags from `public.hashtags`, highlights the active selection with a gold glow, and updates the feed via URL query param `?hashtag={key}` (human-readable slug). Most infrastructure already exists (`useKudosFilters` hook, `fetchKudosFeed` with hashtag filtering, database tables). The main work is adding a `key` column to `public.hashtags`, creating the dropdown UI component, a hashtag-fetching service function, and wiring it into the existing `FilterChips` component.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React, Tailwind CSS 4, Supabase SSR, next-intl
**Database**: PostgreSQL (Supabase) — `public.hashtags`, `public.kudo_hashtags`
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: URL search params via `useKudosFilters()` hook (already exists)
**API Style**: Supabase client direct queries (no REST route handler needed)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (Prettier, kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Supabase SSR, Tailwind, next-intl)
- [x] Adheres to folder structure guidelines (`components/kudos/`, `services/`, `hooks/`, `types/`)
- [x] Meets security requirements (RLS on hashtags table, no raw HTML, parameterized queries)
- [x] Follows testing standards

**Violations (if any)**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-scoped under `src/components/kudos/`
  - `HashtagFilterDropdown.tsx` — Client Component, manages open/close state, renders hashtag list
  - `HashtagFilterItem.tsx` — Presentational atom for each hashtag row (default/selected/hover states)
- **Styling Strategy**: Tailwind utilities + CSS variables for design tokens (defined in `globals.css`)
- **Data Fetching**: Hashtags fetched server-side and passed as props to avoid client waterfall. Alternatively, fetched client-side on first dropdown open via Supabase browser client — **Decision: server-side prefetch** passed down as props for instant dropdown open (13 static items, rarely change).
- **State Management**:
  - Dropdown open/close: local `useState<boolean>`
  - Selected hashtag: URL param via existing `useKudosFilters().setHashtag(key)` — stores hashtag `key` (slug) in `?hashtag=` param, resolves to `hashtag_id` for DB queries
  - Click-outside/Escape: `useRef` + `useEffect` (same pattern as `LocaleDropdown`)

### Backend Approach

- **No new API route handler needed.** Hashtags are fetched directly via Supabase client (server-side in page component, or client-side in hook).
- **New migration**: Add `key` column (text, unique, not null) to `public.hashtags` table — slug format (e.g., `high-performance`).
- **New service function**: `fetchHashtags()` in `src/services/hashtag-service.ts` — queries `public.hashtags` table, selects `id, name, key`, returns `KudoHashtag[]`.
- **Validation**: Not needed for read-only dropdown (no user input beyond selection).

### Integration Points

- **Existing Hook**: `src/hooks/use-kudos-filters.ts` — provides `filters.hashtag_id`, `setHashtag(key)`, already manages URL params. **Needs update**: rename `hashtag_id` to `hashtag_key` in filters, `setHashtag` passes key instead of id
- **Existing Component**: `src/components/kudos/FilterChips.tsx` — has `// TODO: Open Dropdown Hashtag filter` ready for integration
- **Existing Service**: `src/services/kudos-service.ts` — `fetchKudosFeed(filters)` already supports `hashtag_id` filtering. **Needs update**: resolve `hashtag_key` → `hashtag_id` via join or subquery
- **Existing Types**: `src/types/kudos.ts` — `KudoHashtag`, `KudoFilters` interfaces. **Needs update**: add `key` field to `KudoHashtag`, add `hashtag_key` to `KudoFilters`

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721:5580-Dropdown Hashtag filter/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design tokens ✅
├── plan.md              # This file ✅
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
src/
├── components/kudos/
│   ├── HashtagFilterDropdown.tsx   # NEW — Dropdown container + item list
│   ├── HashtagFilterItem.tsx       # NEW — Single hashtag row (atom)
│   └── FilterChips.tsx             # MODIFY — Wire up dropdown trigger
├── services/
│   └── hashtag-service.ts          # NEW — fetchHashtags() from Supabase
├── hooks/
│   └── use-kudos-filters.ts        # MODIFY — hashtag_key instead of hashtag_id
├── types/
│   └── kudos.ts                    # MODIFY — add key to KudoHashtag, hashtag_key to KudoFilters
└── app/globals.css                 # MODIFY — Add hashtag dropdown design tokens
```

### New Files

| File | Purpose |
|------|---------|
| `src/components/kudos/HashtagFilterDropdown.tsx` | Client Component: dropdown container with open/close, click-outside, Escape, hashtag list rendering |
| `src/components/kudos/HashtagFilterItem.tsx` | Presentational component: single hashtag item with default/selected/hover states |
| `src/services/hashtag-service.ts` | Service function: `fetchHashtags()` querying `public.hashtags` |
| `supabase/migrations/{timestamp}_add_hashtags_key.sql` | Add `key` column to `public.hashtags` |

### Modified Files

| File | Changes |
|------|---------|
| `src/components/kudos/FilterChips.tsx` | Remove TODO, add dropdown trigger, pass hashtags + selected state |
| `src/app/globals.css` | Add CSS variables for hashtag dropdown tokens (`--color-dropdown-bg`, etc.) |
| `src/types/kudos.ts` | Add `key` to `KudoHashtag`, add `hashtag_key` to `KudoFilters` |
| `src/hooks/use-kudos-filters.ts` | Use `hashtag_key` instead of `hashtag_id` for URL param |
| `src/services/kudos-service.ts` | Resolve `hashtag_key` → `hashtag_id` via join/subquery in feed query |
| `supabase/seeds/common/01_master_data.sql` | Add `key` values to hashtag INSERT |

### Dependencies

No new packages required — all dependencies already in the project.

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset Preparation
- No icon/image assets needed — this is a text-only dropdown.
- **Only action**: Add design tokens to `globals.css`.

#### Phase 0.5: Database Migration
- Create migration to add `key` column (text, unique, not null) to `public.hashtags`
- Update seed data in `01_master_data.sql` to include `key` values for all 13 hashtags
- Add index on `key` for fast lookup

#### Phase 1: Foundation — Types & Service
- Update `KudoHashtag` type: add `key: string` field
- Update `KudoFilters` type: add `hashtag_key?: string` (replaces `hashtag_id` for URL-based filtering)
- Create `src/services/hashtag-service.ts` with `fetchHashtags()`:
  - Server-side: uses `createClient()` from `@/libs/supabase/server`
  - Queries `public.hashtags`, selects `id, name, key`, orders by name
  - Returns `KudoHashtag[]`
- Update `use-kudos-filters.ts`: `setHashtag(key)` stores key in `?hashtag=` param
- Update `kudos-service.ts`: resolve `hashtag_key` to `hashtag_id` via `hashtags.key` lookup in feed queries

#### Phase 2: Core UI — Dropdown Components (US1, US2)
- Create `HashtagFilterItem.tsx`:
  - Props: `name: string`, `isSelected: boolean`, `onClick: () => void`
  - Renders `#` prefix + hashtag name
  - Applies selected/default/hover styles per design-style.md
  - Montserrat 700, 16px, letter-spacing 0.5px, white text
  - Selected: gold bg `rgba(255,234,158,0.10)` + text-shadow glow
  - Hover: gold bg `rgba(255,234,158,0.10)`
- Create `HashtagFilterDropdown.tsx`:
  - Client Component (`'use client'`)
  - Props: `hashtags: KudoHashtag[]`, `selectedHashtagKey?: string`, `onSelect: (key: string | undefined) => void`, `onClose: () => void`
  - Uses `useRef` + `useEffect` for click-outside and Escape
  - Renders list of `HashtagFilterItem` components
  - Toggle logic: if clicking selected → `onSelect(undefined)`, else → `onSelect(id)`
  - Animation: opacity + translateY, 150ms ease-out
  - Container: absolute, z-10, dark bg, gold border, 8px radius, 6px padding

#### Phase 3: Integration — Wire into FilterChips (US1, US2, US3)
- Modify `FilterChips.tsx`:
  - Accept `hashtags: KudoHashtag[]` prop (passed from parent page)
  - Add `useState<boolean>` for dropdown open state
  - Render `HashtagFilterDropdown` when open
  - On hashtag select: call `setHashtag(key)` from `useKudosFilters()` + close dropdown
  - Position dropdown relative to the hashtag filter button

#### Phase 4: Polish & Edge Cases
- Empty state: if no hashtags, hide filter button or show "No hashtags"
- Keyboard accessibility: arrow key navigation within dropdown (stretch)
- Animation transitions (opacity + translateY)
- Verify feed updates within 500ms of selection (SC-003)

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dropdown positioning off-screen on mobile | Low | Medium | Use relative positioning + max-height with overflow scroll |
| Hashtag list stale after DB update | Low | Low | Re-fetch on dropdown open (or accept server-side prefetch staleness) |
| Click-outside conflicts with other dropdowns | Low | Medium | Follow existing pattern from LocaleDropdown (proven) |

### Estimated Complexity

- **Frontend**: Low — follows established dropdown patterns
- **Backend**: Low — single read query, no mutations
- **Testing**: Low — limited states to test

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: HashtagFilterDropdown ↔ FilterChips ↔ useKudosFilters
- [x] **Data layer**: Supabase `public.hashtags` query
- [x] **User workflows**: Select hashtag → feed filters → clear filter → feed resets

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Dropdown open/close, item selection, URL param update |
| App ↔ Data Layer | Yes | Fetch hashtags, verify all 13 returned |
| Cross-platform | Yes | Mobile/desktop dropdown positioning |

### Test Environment

- **Environment type**: Local (Supabase local dev)
- **Test data strategy**: Seeded database (`supabase/seeds/common/01_master_data.sql` — 13 hashtags)
- **Isolation approach**: Fresh state per test

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Open dropdown → all 13 hashtags visible
   - [ ] Click hashtag → dropdown closes, URL updates, feed filters
   - [ ] Click same hashtag again → filter cleared, full feed shown
   - [ ] Click different hashtag → filter switches

2. **Dismissal**
   - [ ] Click outside → dropdown closes, no filter change
   - [ ] Press Escape → dropdown closes, no filter change

3. **Edge Cases**
   - [ ] Empty hashtags list → filter button hidden or "No hashtags" message
   - [ ] Selected hashtag visually highlighted on re-open

### Tooling & Framework

- **Test framework**: Vitest (unit/component), Playwright (E2E)
- **CI integration**: Run on PR checks

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core selection flow | 90%+ | High |
| Dismiss behaviors | 85%+ | Medium |
| Edge cases | 75%+ | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] Codebase research completed (existing patterns identified)
- [x] Database tables exist (`public.hashtags`, `public.kudo_hashtags`)
- [ ] `public.hashtags.key` column exists (migration required)
- [x] `useKudosFilters()` hook exists and works
- [x] `fetchKudosFeed()` supports hashtag filtering

### External Dependencies

- None — all infrastructure already in place.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- This feature has minimal new code (~3 new files, ~1 modified file) because most infrastructure already exists.
- The `FilterChips.tsx` component already has a TODO placeholder for this dropdown integration.
- 13 hashtags are static master data seeded in `01_master_data.sql` — no CRUD needed.
- Letter-spacing 0.5px is specific to this dropdown (differs from profile dropdown's 0.15px).
