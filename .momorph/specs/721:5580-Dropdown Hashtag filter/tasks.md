# Tasks: Dropdown Hashtag filter

**Frame**: `721:5580-Dropdown Hashtag filter`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 0: Database Migration (Blocking)

**Purpose**: Add `key` column to `public.hashtags` — blocks all downstream work

- [x] T014 [DB] Create migration to add `key` column (text, unique, not null) to `public.hashtags` table with index. Populate existing rows using slugified `name` values | supabase/migrations/20260312000000_add_hashtags_key.sql
- [x] T015 [DB] Update seed data to include `key` values for all 13 hashtags in INSERT statement (e.g., `'high-performance'` for `'Hiệu suất cao'`) | supabase/seeds/common/01_master_data.sql

**Checkpoint**: `public.hashtags.key` column exists, seed data includes keys

---

## Phase 1: Setup (Design Tokens + Types)

**Purpose**: Add design tokens and update types for key-based filtering

- [x] T001 Add hashtag dropdown design tokens (--color-dropdown-bg, --color-dropdown-border, --color-item-selected-bg, --color-glow, --text-shadow-glow) to CSS variables | src/app/globals.css
- [x] T002 Add `key: string` field to `KudoHashtag` type. Add `hashtag_key?: string` to `KudoFilters` type (RESYNC: updated per requirement change — URL uses key instead of id) | src/types/kudos.ts

**Checkpoint**: Design tokens available, types updated with `key` field

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Service layer for fetching hashtags — required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `fetchHashtags()` service function to select `id, name, key` from `public.hashtags`. Return `KudoHashtag[]` with key field (RESYNC: updated per requirement change — include key for URL param) | src/services/hashtag-service.ts
- [x] T016 [P] Update `use-kudos-filters.ts`: rename filter field to `hashtag_key`, `setHashtag(key)` stores key in `?hashtag=` URL param | src/hooks/use-kudos-filters.ts
- [x] T017 [P] Update `kudos-service.ts`: resolve `hashtag_key` → `hashtag_id` via `hashtags.key` join/subquery in `fetchKudosFeed()` and `fetchHighlightKudos()` | src/services/kudos-service.ts

**Checkpoint**: Foundation ready — `fetchHashtags()` returns all 13 hashtags from database

---

## Phase 3: User Story 1 — Filter kudo feed by hashtag (Priority: P1) 🎯 MVP

**Goal**: User opens the hashtag dropdown, clicks a hashtag, feed filters to show only matching kudos. Selected hashtag is visually highlighted with gold bg + glow text.

**Independent Test**: Open hashtag dropdown on Homepage, click "#Dedicated", verify dropdown closes and feed shows only kudos tagged with "#Dedicated". Re-open dropdown, verify "#Dedicated" has gold background and glow text.

### Frontend (US1)

- [x] T004 [P] [US1] Create `HashtagFilterItem` presentational component. Props: `name`, `isSelected`, `onClick`. Render `#` prefix + name. Apply Montserrat 700 16px, letter-spacing 0.5px, white text. Selected state: `rgba(255,234,158,0.10)` bg + text-shadow glow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`. Hover state: `rgba(255,234,158,0.10)` bg. Height 56px, padding 16px, border-radius 4px. Background-color transition 100ms ease-in-out | src/components/kudos/HashtagFilterItem.tsx
- [x] T005 [P] [US1] Create `HashtagFilterDropdown` Client Component. Props: `hashtags: KudoHashtag[]`, `selectedHashtagKey?: string`, `onSelect: (key: string | undefined) => void`, `onClose: () => void`. Container: absolute, z-10, flex column, 6px padding, `#00070C` bg, `1px solid #998C5F` border, 8px radius. Render list of `HashtagFilterItem`. Toggle logic: clicking selected item calls `onSelect(undefined)`, clicking unselected calls `onSelect(key)`. Open/close animation: opacity + translateY 150ms ease-out. Max-height with overflow-y auto for scroll | src/components/kudos/HashtagFilterDropdown.tsx
- [x] T006 [US1] Modify `FilterChips` to accept `hashtags: KudoHashtag[]` prop. Add `useState<boolean>` for dropdown open state. Wire hashtag filter button to toggle dropdown. On hashtag select: call `setHashtag(key)` from `useKudosFilters()` and close dropdown. Position dropdown relative to filter button (RESYNC: updated per requirement change — pass key instead of id) | src/components/kudos/FilterChips.tsx
- [x] T007 [US1] Update parent page/component that renders `FilterChips` to fetch hashtags server-side via `fetchHashtags()` and pass as prop | src/app/[locale]/(protected)/page.tsx (or relevant parent)

**Checkpoint**: User Story 1 complete — selecting a hashtag filters the feed via URL param, selected item highlighted

---

## Phase 4: User Story 2 — Clear hashtag filter (Priority: P1)

**Goal**: User can clear an active filter by clicking the active hashtag again, or switch filters by clicking a different hashtag.

**Independent Test**: With a hashtag filter active, open dropdown and click the active hashtag — filter clears, full feed shown. With a filter active, click a different hashtag — filter switches.

### Frontend (US2)

- [x] T008 [US2] Verify toggle-off behavior in `HashtagFilterDropdown`: clicking the selected hashtag calls `onSelect(undefined)` which triggers `setHashtag(undefined)` in `FilterChips`, removing `?hashtag` from URL. Verify `FilterChips` passes correct `selectedHashtagKey` from `useKudosFilters().filters.hashtag_key` so re-opening dropdown shows correct highlight. Fix any issues (RESYNC: updated per requirement change — key instead of id) | src/components/kudos/HashtagFilterDropdown.tsx, src/components/kudos/FilterChips.tsx

**Checkpoint**: User Stories 1 & 2 complete — filter selection, clearing, and switching all work

---

## Phase 5: User Story 3 — Dismiss dropdown without filtering (Priority: P2)

**Goal**: User can close the dropdown without changing the active filter by clicking outside or pressing Escape.

**Independent Test**: Open dropdown, click outside — dropdown closes, filter unchanged. Open dropdown, press Escape — dropdown closes, filter unchanged.

### Frontend (US3)

- [x] T009 [US3] Add click-outside detection to `HashtagFilterDropdown` using `useRef` + `useEffect` with `mousedown` event listener. When click target is outside ref, call `onClose()`. Follow existing pattern from `LocaleDropdown.tsx` | src/components/kudos/HashtagFilterDropdown.tsx
- [x] T010 [US3] Add Escape key handler to `HashtagFilterDropdown` using `useEffect` with `keydown` event listener. When `event.key === 'Escape'`, call `onClose()` | src/components/kudos/HashtagFilterDropdown.tsx

**Checkpoint**: All user stories complete — full dropdown interaction cycle works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and refinements

- [x] T011 [P] Handle empty hashtags edge case: if `hashtags` array is empty, hide the filter button in `FilterChips` or show "No hashtags available" message in dropdown | src/components/kudos/FilterChips.tsx
- [x] T012 [P] Add ARIA attributes for accessibility: `role="listbox"` on dropdown container, `role="option"` + `aria-selected` on each item, `aria-haspopup="listbox"` + `aria-expanded` on trigger button | src/components/kudos/HashtagFilterDropdown.tsx, src/components/kudos/FilterChips.tsx
- [x] T013 Format all new and modified files with Prettier | src/components/kudos/, src/services/hashtag-service.ts

**Checkpoint**: Feature complete, polished, and accessible

---

## Dependencies & Execution Order

### Phase Dependencies

- **DB Migration (Phase 0)**: No dependencies — MUST start first, BLOCKS everything
- **Setup (Phase 1)**: T001 can start immediately. T002 depends on Phase 0 (needs key column to exist)
- **Foundation (Phase 2)**: Depends on T002 (types confirmed) + Phase 0. T003, T016, T017 can run in parallel. BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion. T004 and T005 are parallel. T006 depends on T004 + T005. T007 depends on T003 + T006
- **US2 (Phase 4)**: Depends on US1 completion (T008 verifies/fixes existing toggle logic)
- **US3 (Phase 5)**: Depends on T005 (dropdown component exists). T009 and T010 can run in parallel
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities

Within Phase 0: T014 and T015 are sequential (migration before seed)
Within Phase 1: T001 can run in parallel with Phase 0
Within Phase 2: T003, T016, T017 can run in parallel (different files)
Within Phase 3: T004 and T005 can run in parallel (different files)
Within Phase 5: T009 and T010 can run in parallel (additive to same file, no conflict)
Within Phase 6: T011 and T012 can run in parallel (different concerns)

### Execution Flow

```
T014 ──→ T015 ──→ T002 ──┐
T001 ────────────────────┤
                         ├─→ T003 ─┐
                         │   T016 ─┤
                         │   T017 ─┤
                         │         ├─→ T004 ─┐
                         │              T005 ─┤
                         │                    ├─→ T006 ──→ T007 ──→ T008 ──→ T009 ─┐
                         │                    │                              T010 ─┤
                         │                    │                                    ├─→ T011 ─┐
                         │                    │                                    │   T012 ─┤
                         │                    │                                    │         ├─→ T013
```

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 (DB migration) + Phase 1 + 2 (tokens + types + service)
2. Complete Phase 3 (US1: select hashtag → filter feed)
3. **STOP and VALIDATE**: Test hashtag selection and feed filtering independently
4. Proceed to Phase 4 + 5 (clear filter + dismiss)

### Incremental Delivery

1. DB Migration + Setup + Foundation → verify `fetchHashtags()` returns 13 hashtags with keys
2. US1 → Test hashtag selection and feed update → Commit
3. US2 → Test filter clear/switch → Commit
4. US3 → Test click-outside and Escape → Commit
5. Polish → Test edge cases and accessibility → Commit

---

## Notes

- Most infrastructure already exists: `useKudosFilters()` hook, `fetchKudosFeed()` with hashtag support, database tables, seed data
- `FilterChips.tsx` has a `// TODO: Open Dropdown Hashtag filter when spec is integrated` placeholder ready for T006
- US1 and US2 are both P1 but US2 is a verification/fix task since toggle logic is built into US1's dropdown
- T009 and T010 (click-outside + Escape) could be implemented during T005 for efficiency, but are separated for clarity and independent testing
- Total: 17 tasks across 7 phases (Phase 0–6)
