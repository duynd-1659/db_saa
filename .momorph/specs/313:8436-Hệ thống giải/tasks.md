# Tasks: Hệ thống giải (Awards Information)

**Frame**: `313:8436-Hệ thống giải`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Version**: v2.2
**Last synced**: 2026-03-25

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v2.2 | 2026-03-25 | Cosmetic | Fix T012: nav active state border-bottom + icon gold + text-shadow glow. |
| v2.1 | 2026-03-25 | Cosmetic | Fix T012: AwardsNavMenu width 220px → 178px. |
| v2.0 | 2026-03-18 | Structural | Requirement change: Added Phase 9 with T030 (WidgetButton verification via (main)/layout.tsx). |
| v1.2 | 2026-03-11 | Structural | Add Phase 8 sync tasks (T025-T029) for icons and stat label fixes |
| v1.1 | 2026-03-11 | Cosmetic | Update T009 description (composite asset, no CSS border) |
| v1.0 | 2026-03-11 | Initial | Initial task list |

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download Figma assets and verify existing infrastructure

- [x] T001 Download awards keyvisual background image from Figma node `313:8437` and ROOT FURTHER logo from node `2789:12915` to `public/assets/awards/images/`
- [x] T002 Download 6 award card images from Figma (one per award category) to `public/assets/awards/images/award-{slug}.png`
- [x] T003 Verify award data in `src/config/award-categories.ts` matches spec values (Top Talent: 10/7M, Top Project: 2/15M, Top Project Leader: 3/7M, Best Manager: 1/10M, Signature 2025: 1/5M+8M, MVP: 1/15M). Update if different | src/config/award-categories.ts

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Page route, design tokens, and i18n setup required by ALL user stories

- [x] T004 Review `src/app/globals.css` and add any missing awards-specific CSS tokens: `--spacing-content-gap: 80px`, `--spacing-award-card-gap: 40px` (verify existing tokens cover colors and spacing from design-style.md) | src/app/globals.css
- [x] T005 [P] Add i18n translation keys under `awards-information` namespace to `vi.json` and `en.json`: section caption, section heading, stat labels ("So luong giai thuong", "Gia tri giai thuong", "cho moi giai thuong", unit types), page metadata | src/i18n/messages/vi.json, src/i18n/messages/en.json
- [x] T006 [P] Create page route as Server Component skeleton: import `AWARD_CATEGORIES` from config, render placeholder sections with `<Header />`, `<Footer />`, set page background `bg-[var(--color-page-bg)]` | src/app/[locale]/(protected)/awards-information/page.tsx

**Checkpoint**: Page route accessible at `/awards-information`, shows Header + Footer with dark background

---

## Phase 3: User Story 1 - Browse award categories (Priority: P1) MVP

**Goal**: User can view all 6 award categories with correct name, description, prize count, and prize value

**Independent Test**: Navigate to `/awards-information`, verify all 6 award cards render with correct data, keyvisual displays, title section shows

### Frontend (US1)

- [x] T007 [P] [US1] Create `AwardsKeyvisual` Server Component: 547px height, background via CSS `background` shorthand `linear-gradient(...), url(/assets/homepage/images/keyvisual-bg.png)` (reuse homepage asset, same pattern as HeroSection — no separate `<Image>` or overlay div), "ROOT FURTHER" logo image positioned top-left | src/components/awards/AwardsKeyvisual.tsx
- [x] T008 [P] [US1] Create `AwardsSectionTitle` Server Component: caption "Sun* Annual Awards 2025" (Montserrat 14px 700 white), horizontal divider line, heading "He thong giai thuong SAA 2025" (Montserrat Alternates 700 40px gold). Use i18n keys. Layout `flex flex-col gap-4`, width `1152px` centered | src/components/awards/AwardsSectionTitle.tsx
- [x] T009 [P] [US1] Create `AwardCard` Server Component: props `award: AwardCategory`. Layout `flex row` with image left (336x336px, `<Image>`, composite asset, no CSS border) + content right (name 700 24-28px white, description 400 16px white). Stats section: "So luong giai thuong" label + value (gold) + unit type, "Gia tri giai thuong" label + value (gold) + "cho moi giai thuong". Handle Signature 2025 dual-value via `special_note`. Each card MUST have `id={award.slug}` for hash anchoring | src/components/awards/AwardCard.tsx
- [x] T010 [US1] Create `AwardsLayout` Server Component: two-column layout `flex gap-[80px]`, left column placeholder for nav (220px), right column maps `AWARD_CATEGORIES` to `<AwardCard />` with `gap-[40px]`. Content width `1152px` centered with `px-[var(--spacing-page-x)]` | src/components/awards/AwardsLayout.tsx
- [x] T011 [US1] Integrate all US1 components into page: render `<AwardsKeyvisual />`, `<AwardsSectionTitle />`, `<AwardsLayout />` between Header and Footer. Add `<KudosPromo />` (reuse from homepage) below awards section | src/app/[locale]/(protected)/awards-information/page.tsx

**Checkpoint**: All 6 award cards visible with correct data, keyvisual + title section rendered, page fully static

---

## Phase 4: User Story 2 - Navigate via left menu (Priority: P1)

**Goal**: User can click sticky left nav to smooth-scroll to any award, and scroll-spy highlights active section

**Independent Test**: Click "Best Manager" in left nav -> page smooth-scrolls to Best Manager card and nav item turns gold. Scroll manually past Top Project -> "Top Project" becomes active in nav.

**Depends on**: US1 (award cards must exist with `id={slug}` attributes)

### Frontend (US2)

- [x] T012 [US2] Create `AwardsNavMenu` Client Component (`'use client'`): 6 nav items from `AWARD_CATEGORIES` slugs. Implement `IntersectionObserver` on each `#award-slug` section (threshold ~0.3, rootMargin offset for header height). Active state: `border-bottom: 1px solid #FFEA9E` + text `color: var(--color-gold)` + text-shadow glow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` + icon gold (inherit). Click handler: `element.scrollIntoView({ behavior: 'smooth' })` + update `window.location.hash` without page jump. Sticky: `sticky top-20` (below 80px header). Width 178px | src/components/awards/AwardsNavMenu.tsx
- [x] T013 [US2] Integrate `AwardsNavMenu` into `AwardsLayout` left column, replacing the placeholder from T010 | src/components/awards/AwardsLayout.tsx

**Checkpoint**: Left nav scroll-spy works, clicking nav items smooth-scrolls, active state updates on scroll

---

## Phase 5: User Story 3 - Navigate from homepage card links (Priority: P1)

**Goal**: Users arriving via Homepage award card "Chi tiet" links land at the correct award section via URL hash

**Independent Test**: Navigate to `/awards-information#mvp` -> page scrolls to MVP section on load

**Depends on**: US2 (AwardsNavMenu must exist for hash-based scroll + active state)

### Frontend (US3)

- [x] T014 [US3] Add deep-link hash handling to `AwardsNavMenu`: `useEffect` on mount checks `window.location.hash`, if hash matches a valid award slug, scroll to that section with a small delay (allow DOM to render). Set corresponding nav item as active. Invalid hash -> no scroll (stay at top) | src/components/awards/AwardsNavMenu.tsx

**Checkpoint**: URL `/awards-information#top-talent` scrolls to Top Talent on load; invalid hash stays at top

---

## Phase 6: User Story 4 - View Sun* Kudos promo (Priority: P2)

**Goal**: User can navigate from the Kudos promo block to the Sun* Kudos live board page

**Independent Test**: Click "Chi tiet" in the Kudos promo block -> navigated to `/sun-kudos`

### Frontend (US4)

- [x] T015 [US4] Verify `KudosPromo` component (reused from `src/components/homepage/KudosPromo.tsx`) renders correctly on this page and "Chi tiet" link navigates to `/sun-kudos`. If the component needs adjustments for this page context (different width, different section gap), create a thin wrapper or pass props | src/app/[locale]/(protected)/awards-information/page.tsx

**Checkpoint**: Kudos promo visible, "Chi tiet" navigates to Sun* Kudos page

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, accessibility, edge cases, and Header active state

- [x] T016 [P] Implement responsive layout for `AwardsLayout`: Desktop (>=1280px) side-by-side nav + cards, Tablet (768-1279px) nav collapses to horizontal tabs above cards, Mobile (<768px) nav hidden or dropdown + single column stacked cards | src/components/awards/AwardsLayout.tsx, src/components/awards/AwardsNavMenu.tsx
- [x] T017 [P] Implement responsive layout for `AwardCard`: Desktop image left + content right, Mobile single column image on top + content below. Ensure image + card fill available width gracefully | src/components/awards/AwardCard.tsx
- [x] T018 [P] Implement responsive layout for `AwardsKeyvisual`: Full-width at all breakpoints, adjust height for smaller screens | src/components/awards/AwardsKeyvisual.tsx
- [x] T019 [P] Add image fallback handling: if award card image fails to load, show gold-bordered placeholder. Use `<Image>` `onError` or CSS fallback bg | src/components/awards/AwardCard.tsx
- [x] T020 [P] Verify Header active state: "Awards Information" nav link must be gold + underlined when on `/awards-information` route. Check that existing Header component's `usePathname()` logic handles this correctly. Fix if needed | src/components/ui/Header.tsx
- [x] T021 [P] Add accessibility: proper heading hierarchy (h1 for page title, h2 for each award name), `aria-current="true"` on active nav item, `role="navigation"` + `aria-label` on left nav, skip link | src/components/awards/AwardsSectionTitle.tsx, src/components/awards/AwardsNavMenu.tsx, src/components/awards/AwardCard.tsx
- [x] T022 Test all pages at 375px, 768px, 1024px, and 1440px widths per constitution Section V. Verify no horizontal scroll, touch targets >= 44x44px, images responsive
- [x] T023 Verify page renders without errors in both `vi` and `en` locales. Ensure all visible text uses i18n keys (no hardcoded Vietnamese/English strings in components)
- [x] T024 Run `yarn format` to ensure all new files pass Prettier formatting

---

## Phase 8: Figma Sync — 2026-03-11

**Purpose**: Fix discrepancies between Figma design and implementation for Menu list (C) and Award card Content (D.1.2)

- [x] T025 [P] Add target icon (`/assets/icons/target.png`) before each nav item text in `AwardsNavMenu`. Each item layout: [icon 20x20] + text label, horizontal flex with gap | src/components/awards/AwardsNavMenu.tsx
- [x] T026 [P] Add target icon before award title in `AwardCard`. Title row: [icon 20x20] + h2 name, horizontal flex with gap | src/components/awards/AwardCard.tsx
- [x] T027 [P] Add diamond icon (`/assets/icons/diamond.png`) before "Số lượng giải thưởng:" label in `AwardCard`. Change count layout to single horizontal row: [diamond icon] + label (bold gold) + value (bold gold) + unit type | src/components/awards/AwardCard.tsx
- [x] T028 [P] Fix stat label styles in `AwardCard`: "Số lượng giải thưởng:" and "Giá trị giải thưởng:" should be `font-bold text-[var(--color-gold)]` instead of `font-medium text-[var(--color-text-muted)]` | src/components/awards/AwardCard.tsx
- [x] T029 Run build and verify all changes render correctly

---

## Phase 9: Requirement Change — 2026-03-18

**Purpose**: Add WidgetButton shared component to this page

- [ ] T030 [P] Verify `<WidgetButton />` renders correctly on `/awards-information` — injected by `(main)/layout.tsx`, visible at all scroll positions fixed bottom-right | `src/app/[locale]/(protected)/(main)/awards-information/page.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Assets) ─────────> Phase 2 (Foundation) ─────> Phase 3 (US1) ───> Phase 4 (US2) ───> Phase 5 (US3)
                                       │                                                            │
                                       │                                        Phase 6 (US4) ──────┤
                                       │                                                            │
                                       └────────────────────────────────────> Phase 7 (Polish) <────┘
```

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 (assets must be available for image references)
- **Phase 3 (US1)**: Depends on Phase 2 (page route + tokens + i18n must exist)
- **Phase 4 (US2)**: Depends on US1 (award cards with `id` attributes must exist for scroll-spy)
- **Phase 5 (US3)**: Depends on US2 (AwardsNavMenu must exist for hash handling)
- **Phase 6 (US4)**: Depends on Phase 2 only (KudosPromo already exists, just integrate)
- **Phase 7 (Polish)**: Depends on all user stories being complete

### Within Each User Story

- Components marked [P] within a phase can be built in parallel
- `AwardsLayout` (T010) depends on `AwardCard` (T009) being defined
- Page integration (T011) depends on all US1 components
- `AwardsNavMenu` integration (T013) depends on T012

### Parallel Opportunities

- **Phase 2**: T004 (tokens), T005 (i18n), T006 (page skeleton) — T005 and T006 run in parallel
- **Phase 3 (US1)**: T007 (Keyvisual), T008 (SectionTitle), T009 (AwardCard) — all 3 run in parallel
- **Phase 6 (US4)**: Can run in parallel with Phase 4/5 (independent of scroll-spy)
- **Phase 7**: T016-T021 — all 6 polish tasks can run in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (assets + foundation)
2. Complete Phase 3 (US1: static award cards) -> **STOP and VALIDATE**
3. Deploy static page — users can browse all awards

### Incremental Delivery

1. Setup + Foundation (Phase 1-2)
2. US1 (Browse awards) -> Test -> Deploy
3. US2 (Scroll-spy nav) -> Test -> Deploy
4. US3 (Deep-link hash) -> Test -> Deploy
5. US4 (Kudos promo) -> Test -> Deploy
6. Polish -> Test -> Deploy

---

## Notes

- **Reuse existing components**: Header, Footer are imported from `src/components/ui/`. KudosPromo from `src/components/homepage/`. Do NOT recreate them.
- **Award data discrepancy**: Spec shows different values than existing config. T003 addresses this — verify with stakeholders before implementation.
- **Signature 2025 special case**: This card has dual prize values (5M individual / 8M team). `AwardCard` must check `special_note` field and render both value rows with "Hoac" (Or) separator.
- **Sticky nav bounds**: Nav must unstick before reaching KudosPromo/Footer. Consider using IntersectionObserver on the awards section container boundary.
- **Fonts**: Ensure both "Montserrat" and "Montserrat Alternates" are loaded (check `layout.tsx` or `globals.css`).
- **No API needed**: All data comes from static config. No database queries, no route handlers.
- Commit after each task or logical group
- Run `yarn format` before each commit
- Mark tasks complete as you go: `[x]`
