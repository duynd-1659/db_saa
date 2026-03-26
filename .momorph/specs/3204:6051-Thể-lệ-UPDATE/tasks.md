# Tasks: Thể lệ UPDATE

**Frame**: `3204:6051-Thể-lệ-UPDATE`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅
**Version**: v1.2
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

- [x] T001 Verify `public/assets/rules/icons/` directory path is ready (create if missing) | public/assets/rules/icons/
- [x] T002 [P] Download MM_MEDIA_New Hero badge (node `3007:17506`) → hero-new.svg using get_media_files tool | public/assets/rules/icons/hero-new.svg
- [x] T003 [P] Download MM_MEDIA_Rising Hero badge (node `3007:17509`) → hero-rising.svg using get_media_files tool | public/assets/rules/icons/hero-rising.svg
- [x] T004 [P] Download MM_MEDIA_Super Hero badge (node `3007:17512`) → hero-super.svg using get_media_files tool | public/assets/rules/icons/hero-super.svg
- [x] T005 [P] Download MM_MEDIA_Legend Hero badge (node `3007:17516`) → hero-legend.svg using get_media_files tool | public/assets/rules/icons/hero-legend.svg
- [x] T006 [P] Download MM_MEDIA_ Badge REVIVAL (node `737:20446`) → badge-revival.svg using get_media_files tool | public/assets/rules/icons/badge-revival.svg
- [x] T007 [P] Download MM_MEDIA_ Badge TOUCH OF LIGHT (node `737:20450`) → badge-touch-of-light.svg using get_media_files tool | public/assets/rules/icons/badge-touch-of-light.svg
- [x] T008 [P] Download MM_MEDIA_ Badge STAY GOLD (node `737:20449`) → badge-stay-gold.svg using get_media_files tool | public/assets/rules/icons/badge-stay-gold.svg
- [x] T009 [P] Download MM_MEDIA_ Badge FLOW TO HORIZON (node `737:20447`) → badge-flow-to-horizon.svg using get_media_files tool | public/assets/rules/icons/badge-flow-to-horizon.svg
- [x] T010 [P] Download MM_MEDIA_ Badge BEYOND THE BOUNDARY (node `737:20448`) → badge-beyond-the-boundary.svg using get_media_files tool | public/assets/rules/icons/badge-beyond-the-boundary.svg
- [x] T011 [P] Download MM_MEDIA_ Badge ROOT FURTHER (node `737:20451`) → badge-root-further.svg using get_media_files tool | public/assets/rules/icons/badge-root-further.svg

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: CSS tokens, animations, and provider scaffold that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T012 Add Rules design tokens to globals.css under a `/* --- Rules Panel --- */` comment: `--color-rules-panel-bg: #00070c`, `--color-rules-overlay: rgba(0,16,26,0.8)`, `--color-rules-title: #ffea9e`, `--color-rules-body: #ffffff`, `--color-rules-btn-close-bg: rgba(255,234,158,0.1)`, `--color-rules-btn-close-border: #998c5f`, `--color-rules-btn-write-bg: #ffea9e`, `--color-rules-btn-write-text: #00101a`, `--color-rules-badge-icon-border: #ffffff`, `--radius-rules-btn: 4px`, `--radius-rules-hero-badge: 55.579px`, `--radius-rules-collectible-icon: 100px`, `--shadow-rules-panel: 0 0 40px rgba(0,0,0,0.5)` | src/app/globals.css
- [x] T013 Add `@keyframes rules-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }` and `@keyframes rules-slide-out { from { transform: translateX(0) } to { transform: translateX(100%) } }` to globals.css; add `.animate-rules-slide-in` and `.animate-rules-slide-out` utility classes using the keyframes | src/app/globals.css
- [x] T014 Create `RulesPanelProvider.tsx` scaffold: `'use client'` directive; define `RulesPanelContextValue` interface with `openPanel(): void` and `closePanel(): void`; create `RulesPanelContext`; implement `useRulesPanelContext()` hook that throws if used outside provider; implement `RulesPanelProvider` component with `isOpen: boolean` state — portal rendering of `RulesPanelDrawer` deferred until T015 | src/components/rules/RulesPanelProvider.tsx

**Checkpoint**: CSS tokens available in Tailwind, provider hook importable, token names match design-style.md.

---

## Phase 3: User Story 1 – Read award rules (Priority: P1) 🎯 MVP

**Goal**: User opens the Thể lệ panel and reads all three content sections (Người nhận KUDOS hero badges, Người gửi KUDOS collectible badges, Kudos Quốc Dân) with correct text and icons.

**Independent Test**: Render `RulesPanelDrawer` with `isOpen=true`; verify the title "Thể lệ" is visible; all four Hero badge rows (New Hero / Rising Hero / Super Hero / Legend Hero) render with icon + condition + description; 6 collectible badge icons appear in a 3×2 grid with names; Kudos Quốc Dân section is visible with body text.

- [x] T015 [US1] Create `RulesPanelDrawer.tsx`: define `HeroTier` interface `{ id: string; icon: string; label: string; condition: string; description: string }` and `CollectibleBadge` interface `{ id: string; icon: string; name: string }`; define static `HERO_TIERS` array (4 items: new/rising/super/legend with Vietnamese condition and description text inline for now) and `COLLECTIBLE_BADGES` array (6 items: REVIVAL / TOUCH OF LIGHT / STAY GOLD / FLOW TO HORIZON / BEYOND THE BOUNDARY / ROOT FURTHER with correct icon paths from Phase 1); component accepts `{ isOpen: boolean; onClose: () => void }` props with explicit return type `React.ReactElement | null` | src/components/rules/RulesPanelDrawer.tsx
- [ ] T016 [US1] Implement backdrop overlay in `RulesPanelDrawer`: full-viewport `<div>` with Tailwind classes `fixed inset-0 bg-[rgba(0,16,26,0.8)] z-[59]`; onClick calls `onClose`; return `null` when `!isOpen` | src/components/rules/RulesPanelDrawer.tsx (RESYNC: z-index raised from 44 → 59 to sit above sticky header z-50)
- [ ] T017 [US1] Implement panel container in `RulesPanelDrawer`: `<div role="dialog" aria-modal="true" aria-label="Thể lệ">` with classes `fixed top-0 right-0 w-[553px] h-screen bg-[#00070C] z-[60] flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-rules-slide-in`; stop click propagation to prevent backdrop close; add inner content area `flex flex-col gap-6 flex-1 overflow-y-auto px-10 pt-6 pb-0` and footer row `flex flex-row gap-4 pb-10 px-10` | src/components/rules/RulesPanelDrawer.tsx (RESYNC: z-index raised from 45 → 60 to sit above sticky header z-50)
- [ ] T018 [US1] Implement title and "Người nhận KUDOS" section in `RulesPanelDrawer`: title `<h2>` with classes `font-montserrat font-bold text-[45px] leading-[52px] text-[#FFEA9E]`; section heading `<h3>` `font-montserrat font-bold text-[22px] leading-7 text-[#FFEA9E]`; body description `<p>` `font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify`; iterate `HERO_TIERS` rendering each row as `flex flex-col gap-1 w-full`; row 1 inner div `flex flex-row items-center gap-4` containing `<Image>` for hero badge + condition `<span>` (16px/24px bold white ls:0.5px); row 2: description `<span>` (14px/20px bold white ls:0.1px) directly below | src/components/rules/RulesPanelDrawer.tsx (RESYNC: updated per requirement change — BadgePill+Condition on row 1, Description on row 2)
- [x] T019 [US1] Implement "Người gửi KUDOS" section in `RulesPanelDrawer`: section heading + body description (same styles as T018); render `COLLECTIBLE_BADGES` in two flex rows of 3 cells each — outer container `flex flex-col gap-4 px-6`, each row `flex flex-row justify-between w-[377px]`, each cell `flex flex-col items-center gap-2 w-20`; badge icon: `<Image>` inside `<div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">`; badge name `<span>` `font-montserrat font-bold text-[12px] leading-4 text-white text-center tracking-[0.5px]`; summary text below grid (16px/24px bold white) | src/components/rules/RulesPanelDrawer.tsx
- [x] T020 [US1] Implement "Kudos Quốc Dân" section in `RulesPanelDrawer`: sub-heading `<h3>` `font-montserrat font-bold text-2xl leading-8 text-[#FFEA9E]`; body `<p>` `font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify` | src/components/rules/RulesPanelDrawer.tsx
- [x] T021 [US1] Wire `RulesPanelProvider` to render `RulesPanelDrawer` via `createPortal(…, document.body)` — import `RulesPanelDrawer` in `RulesPanelProvider`; wrap portal with `typeof window !== 'undefined'` mount guard via `useEffect` + `isMounted` state to prevent SSR hydration mismatch | src/components/rules/RulesPanelProvider.tsx

**Checkpoint**: US1 fully testable — render `RulesPanelProvider` → call `openPanel()` → verify drawer renders with all 3 sections, correct icons, text, and layout.

---

## Phase 4: User Story 2 – Close the panel (Priority: P1)

**Goal**: User can dismiss the Thể lệ panel by clicking "Đóng", pressing Escape, or clicking the backdrop. Focus returns to the FAB trigger after close.

**Independent Test**: Render the panel open; click "Đóng" → drawer unmounts, no navigation; press Escape → drawer unmounts; click backdrop → drawer unmounts; confirm focus returns to FAB trigger button.

- [x] T022 [US2] Implement Button "Đóng" (B.1) in the footer row of `RulesPanelDrawer`: `<button>` with `onClick={onClose}` and classes `flex items-center gap-2 p-4 border border-[#998C5F] bg-[rgba(255,234,158,0.10)] rounded-[4px] cursor-pointer hover:bg-[rgba(255,234,158,0.15)] active:bg-[rgba(255,234,158,0.20)] focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-2 transition-colors duration-150`; icon: `<Image src="/assets/fab/icons/fab-close.svg" width={24} height={24} alt="" aria-hidden>`; label `<span className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px]">Đóng</span>`; add `ref={closeButtonRef}` (useRef) so focus can move here on open | src/components/rules/RulesPanelDrawer.tsx
- [x] T023 [US2] Add Escape key `useEffect` in `RulesPanelDrawer`: when `isOpen=true`, attach `keydown` listener to `document`; call `onClose()` on `e.key === 'Escape'`; return cleanup function to remove listener; dependency array `[isOpen, onClose]` | src/components/rules/RulesPanelDrawer.tsx
- [x] T024 [US2] Implement focus management in `RulesPanelDrawer`: capture `document.activeElement` into a `triggerRef = useRef<Element | null>(null)` before panel opens (in a `useEffect` that runs when `isOpen` transitions false→true); on open, move focus to `closeButtonRef.current?.focus()`; on close, return focus via `(triggerRef.current as HTMLElement)?.focus()` | src/components/rules/RulesPanelDrawer.tsx
- [x] T025 [US2] Implement close animation in `RulesPanelDrawer`: add `isClosing: boolean` state; expose a `handleClose()` internal function that sets `isClosing=true`, waits 250ms via `setTimeout`, then calls `onClose()`; update Đóng button, Escape handler, and backdrop `onClick` to call `handleClose()` instead of `onClose()` directly; toggle panel class: `isClosing ? 'animate-rules-slide-out' : 'animate-rules-slide-in'` | src/components/rules/RulesPanelDrawer.tsx

**Checkpoint**: US2 fully testable — all three close mechanisms work; panel animates out; focus returns to trigger element; no navigation side-effects.

---

## Phase 5: User Story 3 – Write KUDOS from panel (Priority: P2)

**Goal**: User clicks "Viết KUDOS" inside the panel → WriteKudo modal opens and the Thể lệ panel closes simultaneously.

**Independent Test**: Render the panel inside `WriteKudoProvider`; click "Viết KUDOS" → `WriteKudoModal` appears in DOM, Thể lệ drawer is removed; rapid double-click → modal opens only once (debounce guard).

- [x] T026 [US3] Implement Button "Viết KUDOS" (B.2) in the footer row of `RulesPanelDrawer`: import `useWriteKudoContext`; add `clickOnceRef = useRef<boolean>(false)` debounce guard; button `onClick` calls debounced handler: if `clickOnceRef.current` return; set `clickOnceRef.current = true`; call `openWriteKudo()` then `handleClose()`; reset after 300ms via `setTimeout`; button classes: `flex items-center justify-center gap-2 flex-1 h-14 p-4 bg-[#FFEA9E] rounded-[4px] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:brightness-105 active:brightness-95 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2 transition-all duration-150`; icon: `<Image src="/assets/fab/icons/fab-pen.svg" width={24} height={24} alt="" aria-hidden>`; label `<span className="font-montserrat font-bold text-base leading-6 text-[#00101A] tracking-[0.5px]">Viết KUDOS</span>` | src/components/rules/RulesPanelDrawer.tsx

**Checkpoint**: US3 fully testable — clicking Viết KUDOS opens WriteKudoModal and closes the drawer in < 300ms; double-click produces only one modal open.

---

## Phase 6: Layout Wiring

**Purpose**: Connect `RulesPanelProvider` to the app and wire `FabWidget` Button A to open the panel.

- [x] T027 Update `src/app/[locale]/layout.tsx`: import `RulesPanelProvider` from `@/components/rules/RulesPanelProvider`; wrap `WriteKudoProvider` with `RulesPanelProvider` so the tree reads `<RulesPanelProvider><WriteKudoProvider>{children}</WriteKudoProvider></RulesPanelProvider>` | src/app/[locale]/layout.tsx
- [x] T028 Update `src/components/ui/FabWidget.tsx`: import `useRulesPanelContext` from `@/components/rules/RulesPanelProvider`; destructure `openPanel` from the context; update `handleRules()` to call `openPanel()` before `setIsExpanded(false)` — removing the stub behaviour where clicking "Thể lệ" only collapsed the FAB | src/components/ui/FabWidget.tsx

**Checkpoint**: Full flow works end-to-end — click FAB → expand → click "Thể lệ" → panel slides in from right → Đóng → panel slides out; URL unchanged throughout.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: i18n, responsive layout, accessibility, and final edge cases.

- [x] T029 [P] Add Vietnamese i18n translation keys to `vi.json` under `common.rules` namespace: `ariaLabel`, `title`, `nguoiNhanHeading`, `nguoiNhanBody`, `nguoiGuiHeading`, `nguoiGuiBody`, `nguoiGuiSummary`, `kudosQuocDanHeading`, `kudosQuocDanBody`, `btnClose`, `btnVietKudos`; hero tier keys: `heroNew.condition`, `heroNew.description`, `heroRising.condition`, `heroRising.description`, `heroSuper.condition`, `heroSuper.description`, `heroLegend.condition`, `heroLegend.description`; collectible badge name keys: `badgeRevival`, `badgeTouchOfLight`, `badgeStayGold`, `badgeFlowToHorizon`, `badgeBeyondTheBoundary`, `badgeRootFurther` | src/i18n/messages/vi.json
- [x] T030 [P] Add English i18n translation keys to `en.json` under `common.rules` namespace (mirror of T029, translate to English where applicable — badge names remain uppercase English) | src/i18n/messages/en.json
- [x] T031 Replace all hardcoded Vietnamese strings in `RulesPanelDrawer.tsx` with `useTranslations('common.rules')` calls after T029/T030 are complete; update `HERO_TIERS` array to reference i18n keys (pass `t` into the map or compute the array inside the component body); update all text labels, section headings, button labels, and aria-label | src/components/rules/RulesPanelDrawer.tsx
- [x] T032 [P] Apply responsive breakpoints to `RulesPanelDrawer`: mobile default: `w-full p-[16px_20px_20px] text-[32px]` for title, `text-[18px]` for section headings; tablet `md:w-[480px] md:p-[20px_32px_32px]`; desktop `lg:w-[553px] lg:p-[24px_40px_40px]`; button B.2 "Viết KUDOS" `w-full lg:flex-1`; hero badge rows clamp width on mobile; badge grid padding `px-2 md:px-4 lg:px-6` | src/components/rules/RulesPanelDrawer.tsx
- [x] T033 [P] Add WCAG accessibility attributes to `RulesPanelDrawer`: `role="dialog"` + `aria-modal="true"` + `aria-label={t('ariaLabel')}` on panel container; `aria-label` on both CTA buttons; close button `aria-label={t('btnClose')}`; Viết KUDOS button `aria-label={t('btnVietKudos')}`; confirm focus trap cycles within panel on repeated Tab/Shift+Tab | src/components/rules/RulesPanelDrawer.tsx
- [ ] T034 [P] Add body scroll lock to `RulesPanelDrawer`: `useEffect` with `isOpen` dependency — when `isOpen` is `true` set `document.body.style.overflow = 'hidden'`; return cleanup function that sets `document.body.style.overflow = ''`; this prevents background page scrolling while the panel is open and restores on close (Escape, backdrop click, Đóng button) | src/components/rules/RulesPanelDrawer.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup/Assets — T001-T011)
    └── Phase 2 (Foundation: CSS tokens + animations + provider scaffold — T012-T014)
            └── Phase 3 (US1: Drawer UI — T015-T021)   ← BLOCKS Phase 4 & 5
                    ├── Phase 4 (US2: Close mechanics — T022-T025)
                    └── Phase 5 (US3: Viết KUDOS — T026)
                            └── Phase 6 (Layout Wiring — T027-T028)
                                    └── Phase 7 (Polish — T029-T033)
```

### Within Phase 3 (US1)

```
T015 (data types + component scaffold) → T016 (backdrop) → T017 (panel container)
    → T018 (title + Người nhận section) → T019 (Người gửi section)
    → T020 (Kudos Quốc Dân section) → T021 (wire portal in provider)
```

### Within Phase 4 (US2)

```
T022 (Đóng button) → T023 (Escape key) → T024 (focus management) → T025 (close animation)
```

T022 depends on the panel structure from Phase 3. T023-T025 depend on T022.

### Parallel Opportunities

| Parallel Group | Tasks |
|---|---|
| Icon downloads | T002–T011 (10 downloads, different files) |
| CSS tokens + animations | T012 ‖ T013 (different blocks in same file — write sequentially to avoid conflicts) |
| i18n files | T029 (vi.json) ‖ T030 (en.json) |
| Polish tasks | T031, T032, T033 can be written concurrently (different concern areas within same file) |

---

## Implementation Strategy

### MVP (Recommended First Delivery)

1. Complete Phase 1 (download assets)
2. Complete Phase 2 (tokens + provider scaffold)
3. Complete Phase 3 (US1 — drawer renders all sections)
4. Complete Phase 4 (US2 — all close mechanisms)
5. Complete Phase 6 (wire into layout + FabWidget)
6. **STOP and VALIDATE**: test full flow on localhost at 375px, 768px, 1024px, 1440px
7. Deploy Phase 5 (US3 — Viết KUDOS) + Phase 7 (Polish) as follow-up

### Incremental Delivery

1. Phase 1 → 2 → 3 → 4: Drawer fully readable and closeable
2. Phase 5: Add Viết KUDOS action
3. Phase 6: Wire into app
4. Phase 7: Full polish for production

---

## Notes

- **Reuse existing icons**: `fab-close.svg` and `fab-pen.svg` already exist at `public/assets/fab/icons/` — import from there; do not re-download.
- **Hero badge icons**: These are pill-shaped badge components in Figma. Verify downloaded asset format after T002–T005. If they download as composite images (not pure SVG), use PNG fallback — the `<Image>` component handles both.
- **SSR guard in provider**: The `createPortal` call in `RulesPanelProvider` must be guarded with an `isMounted` state (set via `useEffect`) to avoid hydration mismatch since `document.body` is not available during SSR.
- **Panel bg `#00070C` ≠ page bg `#00101A`**: Always use `--color-rules-panel-bg` token; never substitute `--color-page-bg`.
- **`RulesPanelProvider` position in tree**: Wraps `WriteKudoProvider` in `[locale]/layout.tsx`. Both are Client Components with `'use client'` — nesting order doesn't affect functionality.
- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each phase checkpoint

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.2 | 2026-03-18 | Structural | Requirement change: z-index raised + body scroll lock. Modified: T016 (RESYNC), T017 (RESYNC). Added: T034. |
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: Hero Badge Row layout. Modified: T018 (RESYNC). |
| v1.0 | 2026-03-18 | — | Initial task list |
