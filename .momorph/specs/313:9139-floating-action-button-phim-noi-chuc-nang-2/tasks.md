# Tasks: Floating Action Button – Expanded State

**Frame**: `313:9139-floating-action-button-phim-noi-chuc-nang-2`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅
**Version**: v1.1
**Last updated**: 2026-03-18

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup

**Purpose**: Download required icon assets from Figma and prepare directory structure.

- [x] T001 Verify `public/assets/fab/icons/` directory path is ready (create if missing) | public/assets/fab/icons/
- [x] T002 Download MM_MEDIA_LOGO icon (node `214:3752`) → fab-logo.svg using get_media_files tool | public/assets/fab/icons/fab-logo.svg
- [x] T003 [P] Download MM_MEDIA_Pen icon (node `214:3812`) → fab-pen.svg using get_media_files tool | public/assets/fab/icons/fab-pen.svg
- [x] T004 [P] Download MM_MEDIA_Close icon (node `214:3851`) → fab-close.svg using get_media_files tool | public/assets/fab/icons/fab-close.svg

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: CSS tokens and component scaffold that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Add FAB design tokens to globals.css (`--color-fab-action-bg`, `--color-fab-cancel-bg`, `--color-fab-label`, `--color-fab-icon-cancel`, `--radius-fab-action`, `--radius-fab-cancel`, `--shadow-fab-hover`) | src/app/globals.css
- [x] T006 Create FabWidget.tsx scaffold: `'use client'` directive, `isExpanded` state, collapsed trigger button matching existing WidgetButton design (fixed bottom-right, gold bg, pen+saa-widget icons, onClick expands FAB) | src/components/ui/FabWidget.tsx

**Checkpoint**: FAB trigger button renders and clicking it sets `isExpanded = true` (no sub-buttons yet)

---

## Phase 3: User Story 1 – Dismiss FAB menu (Priority: P1) 🎯 MVP

**Goal**: User can open and close the FAB group without navigating anywhere — the cancel/close mechanism is the safety valve for the whole interaction.

**Independent Test**: Render `FabWidget`, click trigger → FAB expands (container visible); click Huỷ button → FAB collapses (container hidden), URL unchanged; press Escape → FAB collapses.

- [ ] T007 [US1] Add expanded state container to FabWidget: `flex flex-col items-end gap-5`, correct fixed position (`bottom-8 right-8` desktop), staggered entrance animation (opacity + translateY, 200ms, 50ms delay per button) | src/components/ui/FabWidget.tsx (RESYNC: updated per requirement change — desktop position changed to bottom-8 right-8)
- [x] T008 [US1] Implement Button C (Huỷ): `w-14 h-14` circular, `bg-[var(--color-fab-cancel-bg)]` red, `rounded-full`, fab-close.svg icon (24×24 white), `onClick` → `setIsExpanded(false)`, `aria-label="Đóng menu hành động nhanh"`, hover state `hover:bg-[#B91C1C]`, 150ms transition | src/components/ui/FabWidget.tsx
- [x] T009 [US1] Add Escape key `useEffect` handler: listen for `keydown` when `isExpanded=true`, call `setIsExpanded(false)` on `Escape`, cleanup listener on unmount/collapse | src/components/ui/FabWidget.tsx

**Checkpoint**: US1 fully testable — expand + collapse via button click and Escape key both work; no navigation triggered

---

## Phase 4: User Story 2 – Write KUDOS quick action (Priority: P1)

**Goal**: Logged-in user clicks "Viết KUDOS" in the expanded FAB → `WriteKudoModal` opens immediately.

**Independent Test**: Render `FabWidget` inside `WriteKudoProvider`, expand FAB, click "Viết KUDOS" → `WriteKudoModal` is present in DOM; FAB sub-buttons disappear (collapsed).

- [x] T010 [US2] Implement Button B (Viết KUDOS): `min-w-[214px] h-16`, `bg-[var(--color-fab-action-bg)]` yellow, `rounded-[var(--radius-fab-action)]`, fab-pen.svg icon (24×24), label "Viết KUDOS" (Montserrat 700 24px `var(--color-fab-label)`), `useWriteKudoContext().openWriteKudo()` + `setIsExpanded(false)` on click, hover shadow + brightness, `aria-label="Viết KUDOS tặng đồng đội"` | src/components/ui/FabWidget.tsx

**Checkpoint**: US2 fully testable — clicking Viết KUDOS opens WriteKudoModal; FAB collapses; modal dismissible independently

---

## Phase 5: User Story 3 – View award rules (Priority: P2)

**Goal**: User clicks "Thể lệ" in the expanded FAB → navigates to `/awards-information`.

**Independent Test**: Render `FabWidget`, expand FAB, click "Thể lệ" → URL changes to `/awards-information`; FAB collapses.

- [x] T011 [US3] Implement Button A (Thể lệ): `w-[149px] h-16`, `bg-[var(--color-fab-action-bg)]` yellow, `rounded-[var(--radius-fab-action)]`, fab-logo.svg icon (24×24), label "Thể lệ" (Montserrat 700 24px `var(--color-fab-label)`), rendered as Next.js `<Link href="/awards-information">` wrapper, `onClick` → `setIsExpanded(false)`, hover shadow, `aria-label="Xem thể lệ giải thưởng"` | src/components/ui/FabWidget.tsx

**Checkpoint**: All 3 user stories complete — US1 + US2 + US3 independently verified

---

## Phase 6: Layout Wiring

**Purpose**: Swap `WidgetButton` out of the `(main)` layout and replace with `FabWidget`.

- [x] T012 Update `(main)/layout.tsx`: replace `import { WidgetButton }` with `import { FabWidget }`, replace `<WidgetButton />` with `<FabWidget />` | src/app/[locale]/(protected)/(main)/layout.tsx
- [x] T013 Delete `src/components/ui/WidgetButton.tsx` after confirming no other file imports it (grep `WidgetButton` before deletion) | src/components/ui/WidgetButton.tsx

**Checkpoint**: FAB renders on every `(protected)/(main)` page; old WidgetButton gone; no broken imports

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, i18n, UX edge cases, accessibility.

- [ ] T014 [P] Add responsive breakpoint overrides to FabWidget: mobile (`right-4 bottom-4`, button font `text-lg`), tablet `md:` (`right-6 bottom-6`), desktop `lg:` (`right-8 bottom-8`) | src/components/ui/FabWidget.tsx (RESYNC: updated per requirement change — desktop position changed to right-8 bottom-8)
- [x] T015 [P] Add Vietnamese i18n translation keys under `common.fab` namespace: `ariaLabel`, `rulesLabel`, `vietKudosLabel`, `huyLabel`, `expandedRegionLabel` | src/i18n/vi.json
- [x] T016 [P] Add English i18n translation keys under `common.fab` namespace (mirror of T015) | src/i18n/en.json
- [x] T017 Replace hardcoded Vietnamese strings in FabWidget with `useTranslations('common.fab')` calls after T015/T016 | src/components/ui/FabWidget.tsx
- [x] T018 [P] Add 300ms click-once debounce to Buttons A and B to prevent duplicate navigation/modal opens on rapid clicks | src/components/ui/FabWidget.tsx
- [x] T019 [P] Wrap expanded panel in `role="region"` + `aria-label` from i18n; move focus to Button C on expand via `useRef` + `.focus()` | src/components/ui/FabWidget.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup/Assets)
    └── Phase 2 (Foundation: CSS tokens + scaffold)
            └── Phase 3 (US1: expanded container + Huỷ + Escape)   ← BLOCKS Phase 4 & 5
                    ├── Phase 4 (US2: Viết KUDOS button)            ← can start after Phase 3
                    └── Phase 5 (US3: Thể lệ button)               ← can start after Phase 3, parallel with Phase 4
                            └── Phase 6 (Layout Wiring)
                                    └── Phase 7 (Polish)
```

### Within Phase 3 (US1)

```
T007 (expanded container) → T008 (Huỷ button) → T009 (Escape handler)
```
T008 and T009 both depend on T007 but can be written simultaneously by different developers (different sections of the same file).

### Parallel Opportunities

| Parallel Group | Tasks |
|---|---|
| Icon downloads | T002, T003, T004 (different files) |
| Phase 4 + Phase 5 | T010 (US2) ‖ T011 (US3) — different buttons, same file but no dependency |
| i18n files | T015 (vi.json) ‖ T016 (en.json) |
| Polish tasks | T014, T015, T016, T018, T019 — independent concerns |

---

## Implementation Strategy

### MVP (Recommended First Delivery)

1. Complete Phase 1 + 2 (assets + scaffold)
2. Complete Phase 3 (US1 — expand/collapse mechanics)
3. Complete Phase 4 (US2 — Viết KUDOS)
4. Complete Phase 6 (wire into layout, remove WidgetButton)
5. **STOP and VALIDATE**: test on localhost at all 3 breakpoints
6. Deploy Phase 5 (US3 — Thể lệ) + Phase 7 (Polish) as follow-up

### Incremental Delivery

1. Phase 1 → 2 → 3 → 4: Core FAB working (Huỷ + Viết KUDOS)
2. Phase 5: Add Thể lệ navigation
3. Phase 6: Integrate into layout
4. Phase 7: Polish for production

---

## Notes

- **T013 caution**: Before deleting `WidgetButton.tsx`, always run `grep -r "WidgetButton" src/` to confirm zero remaining imports.
- **Icons**: Verify SVG colors after download. `fab-logo.svg` and `fab-pen.svg` should use `#00101A`; `fab-close.svg` should use `#FFFFFF`. Override via `[&_path]:fill-[color]` Tailwind if embedded colors are wrong.
- **WriteKudoProvider scope**: The provider is at `src/app/[locale]/layout.tsx`, wrapping all locale routes. `FabWidget` inside `(protected)/(main)` is always within provider scope — no provider migration needed.
- **T006 trigger button**: Preserve the exact visual design of the current `WidgetButton` (pen + saa-widget icons, gold bg, pill shape) so there's no visual regression on the collapsed state.
- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each phase checkpoint

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: desktop position updated to `bottom-8 right-8`. Modified: T007, T014 (reset to [ ] with RESYNC marker). |
| v1.0 | 2026-03-18 | — | Initial task list |
