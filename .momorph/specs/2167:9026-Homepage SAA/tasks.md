# Tasks: Homepage SAA

**Frame**: `2167:9026-Homepage SAA`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅
**Version**: v3.2
**Last synced**: 2026-03-26

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v3.2 | 2026-03-26 | Structural | Figma sync: Modified T017 (CTAButtons: gap-10, RedirectIcon, B3.2 bg), T018 (HeroSection: Frame 487 gap-10, Frame 523 wrapper gap-4). |
| v3.1 | 2026-03-26 | Cosmetic | Requirement change: Hide entire countdown block on expiry. Modified: T022, T042 (CountdownTimer hides digits block; QR button shown in place). |
| v3.0 | 2026-03-20 | Structural | Requirement change: Modified T022 (CountdownTimer shows QR button when expired). Added: T038, T039, T040, T041, T042 (qrcode.react install, QRCodeDisplay, /ticket page, i18n keys, CountdownTimer QR button). |
| v2.0 | 2026-03-18 | Structural | Requirement change: T028 updated (WidgetButton moved to ui/), T029 updated ((main)/layout.tsx created). |
| v1.0 | 2026-03-10 | Initial | Initial task list |

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: User story this belongs to (US1–US5)
- **|**: Primary file affected

---

## Phase 1: Setup — Asset Preparation

**Purpose**: Download all Figma media assets before any UI work begins. Unblock image-dependent components.

- [x] T001 Verify/install `zod` dependency (`yarn add zod` if missing) | `package.json`
- [x] T002 [P] Download keyvisual background image from Figma node `2167:9028` using `get_media_files` | `public/assets/homepage/images/keyvisual-bg.png`
- [x] T003 [P] Download award images from Figma: shared BG (`award-bg.png`, node `I2167:9075;214:1019;81:2442`) + 6 name logo overlays (`award-name-{slug}.png`, no border baked in, intrinsic dimensions per card: Top Talent 221×35, Top Project 232×35, Top Project Leader 232×64, Best Manager 232×30, Signature 232×54, MVP 116×52) | `public/assets/homepage/images/`
- [x] T004 [P] Download SAA logo from Figma node `I2167:9091;178:1033` | `public/assets/homepage/logos/saa-logo.png`
- [x] T005 [P] Download icon assets from Figma: bell (`I2167:9091;186:2101`), pencil + SAA widget (`5022:15169`), arrow-right (`I2167:9075;214:1023`) | `public/assets/icons/`

---

## Phase 2: Foundation — Blocking Prerequisites

**Purpose**: Types, tokens, static config, service, and route handler. ALL user story phases depend on this being complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Add Homepage design tokens to CSS variables and `@theme` block: `--color-gold: #FFEA9E`, `--color-border: #998C5F`, `--color-header-bg: rgba(16,20,23,0.8)`, `--spacing-page-x: 144px`, `--spacing-section-gap: 120px`, `--color-text-muted: rgba(255,255,255,0.6)` | `src/app/globals.css`
- [x] T007 [P] Create TypeScript interfaces `EventConfig` and `AwardCategory` with all fields documented in plan.md | `src/types/homepage.ts`
- [x] T008 [P] Create static award categories config array with all 6 awards (slug, name, description, image_url, award_count, unit_type, award_value_vnd, special_note) | `src/config/award-categories.ts`
- [x] T009 Create `fetchEventConfig()` — reads `event_start_datetime` from `public.app_config` using Supabase server client; fallback to `process.env.NEXT_PUBLIC_EVENT_START_DATETIME` if missing; throws descriptive error on malformed value | `src/services/homepage-service.ts`
- [x] T010 Create `GET /api/config/event` route handler — thin controller calling `fetchEventConfig()`, validates response with zod schema `{ event_start_datetime: z.string().datetime() }`, returns 200 JSON or 500 generic error (no stack trace) | `src/app/api/config/event/route.ts`
- [x] T011 [P] Add `homepage` i18n namespace with all required keys (hero title, subtitle, event info, section headings, CTA labels, footer copyright, award names/descriptions) to both locale files | `src/i18n/messages/vi.json`, `src/i18n/messages/en.json`

**Checkpoint**: Foundation complete — all user story phases can begin.

---

## Phase 3: US1 + US5 — Homepage Structure & Header Navigation (Priority: P1) 🎯 MVP

**Goal**: Full page skeleton renders correctly. All nav links work. Header is sticky with active state. Footer present.

**Independent Test**: Visit `/` as authenticated user → page loads with header, hero area, awards section placeholder, kudos promo placeholder, and footer. Click "Awards Information" → navigates to `/awards-information`. Click "Sun* Kudos" → navigates to `/sun-kudos`. Scroll down → header stays fixed at top. Active nav link shows gold + underline.

### UI Atoms (US1, US5)

- [x] T012 [P] [US1] Create `NavLink` atom: renders `<Link>` from next-intl; accepts `href`, `label`, `isActive`; active state applies `text-[var(--color-gold)] underline`; hover applies light bg highlight | `src/components/homepage/NavLink.tsx`
- [x] T013 [P] [US5] Create `DropdownProfile` overlay component: renders 3 items (Profile, Dashboard if admin, Logout); positioned absolute below avatar button; closes on outside click or Escape; Logout calls `supabase.auth.signOut()` then redirects to `/login` | `src/components/homepage/DropdownProfile.tsx`
- [x] T014 [P] [US5] Use shared `LocaleDropdown` (self-contained button + dropdown, manages own state) | `src/components/ui/LocaleDropdown.tsx`

### Header (US5)

- [x] T015 [US5] Create `Header` Client Component (`'use client'`): sticky `top-0 z-50 backdrop-blur`; `bg-[var(--color-header-bg)]`; `padding: 12px 144px`; logo (64×60 `<Image>`) links to `/(locale)/`; 3 `<NavLink>`s with active state via `usePathname()`; bell button (40×40 no border); `<LocaleDropdown />`; avatar button → `<DropdownProfile>`; dropdowns rendered inline with z-[60] | `src/components/homepage/Header.tsx`

### Static Sections (US1)

- [x] T016 [P] [US1] Create `EventInfo` component: displays "Thời gian: 18h30" and "Địa điểm: Nhà hát nghệ thuật quân đội" as static text; uses `useTranslations('homepage')` | `src/components/homepage/EventInfo.tsx`
- [x] T017 [P] [US1] Create `CTAButtons` component: `flex row gap-10` container; "ABOUT AWARDS" (gold fill `bg-[var(--color-gold)] text-[#00101A]`, `gap-2` + `<RedirectIcon>`) → `/awards-information`; "ABOUT KUDOS" (`border border-[#998C5F]` + `bg-[rgba(255,234,158,0.10)]` text-white, `gap-2` + `<RedirectIcon>`) → `/sun-kudos`; uses `<Link>` from next-intl/navigation | `src/components/homepage/CTAButtons.tsx`
- [x] T018 [P] [US1] Create `HeroSection` Server Component: full-width `<Image>` BG with `fill object-cover priority`; gradient overlay via CSS variable; "ROOT FURTHER" `<Image>` asset; outer Frame 487 container `flex-col gap-10`; inner Frame 523 wrapper `flex-col gap-4` containing `<CountdownTimer>` + `<EventInfo>`; `<CTAButtons>` | `src/components/homepage/HeroSection.tsx`
- [x] T019 [P] [US1] Create `Footer` Server Component: `flex justify-between px-[90px] py-10`; SAA logo; 4 nav `<Link>`s (About SAA 2025, Awards Information, Sun* Kudos, Tiêu chuẩn chung); copyright text `Montserrat Alternates 700 16px`; uses `useTranslations('homepage')` | `src/components/homepage/Footer.tsx`

### Page Assembly (US1)

- [x] T020 [US1] Create Homepage page Server Component: `async` function; calls `fetchEventConfig()` from `homepage-service.ts`; derives `isEventStarted` boolean; renders `<Header />`, `<HeroSection targetDate={...} />`, awards section placeholder `<div>`, kudos promo placeholder `<div>`, `<Footer />`; wraps in `<main className="bg-[var(--color-page-bg)] min-h-screen">` | `src/app/[locale]/(protected)/page.tsx`

**Checkpoint**: US1 + US5 complete. Authenticated user can load homepage, see hero, navigate header links.

---

## Phase 4: US3 — Countdown Timer (Priority: P1)

**Goal**: Hero section shows real-time countdown to event. Updates per minute. Shows "00" and hides "Coming soon" when event starts.

**Independent Test**: On homepage hero, verify 3 digit groups (DAYS, HOURS, MINUTES) show 2-digit zero-padded values. Wait 60 seconds → values decrement correctly. Set `targetDate` to a past time → countdown block is hidden and only "Lấy mã QR" button is shown.

### Components (US3)

- [x] T021 [P] [US3] Create `CountdownDigit` atom: props `value: string` (2-digit padded), `unit: 'DAYS' | 'HOURS' | 'MINUTES'`; renders digit card with backdrop-blur bg, gold border, `12px border-radius`; Montserrat Alternates bold for digit, Montserrat 700 for unit label | `src/components/homepage/CountdownDigit.tsx`
- [x] T022 [US3] Create `CountdownTimer` Client Component (`'use client'`): props `targetDate: string`; initial render outputs `{ days: '00', hours: '00', minutes: '00' }` (SSR-safe, avoids hydration mismatch); `useEffect` sets up `setInterval(60_000)` computing remaining time; when expired → **hide entire countdown block** (digits + any subtitle), render only `<Link href="/ticket">` "Lấy mã QR" button (gold fill `bg-[var(--color-gold)] text-[#00101A]`, same style as ABOUT AWARDS) in its place; renders 3 `<CountdownDigit>` when not expired | `src/components/homepage/CountdownTimer.tsx`
- [x] T023 [US3] Integrate `<CountdownTimer targetDate={targetDate}>` into `HeroSection`; "Coming soon" shown/hidden by CountdownTimer based on expiry state | `src/components/homepage/HeroSection.tsx`

**Checkpoint**: US3 complete. Countdown ticks live; zero-state hides entire countdown block and shows QR button.

---

## Phase 5: US2 — Award Category Cards (Priority: P1)

**Goal**: 6 award cards render in a 3-column grid. Each card links to `/awards-information#{slug}`. Hover shows lift + gold glow.

**Independent Test**: On homepage, verify 6 award cards visible: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP. Click "Chi tiết" on Top Talent → navigates to `/awards-information#top-talent`. Hover a card → sees lift + glow transition.

### Components (US2)

- [x] T024 [P] [US2] Create `AwardCard` component: props `award: AwardCategory`; `<Link>` wraps entire `<article>`; image = shared BG (`fill object-cover`) + name logo overlay (centered, intrinsic `width/height` from `award.name_image_width/height`); `border border-[#FFEA9E] rounded-[24px]` + base shadow `0 4px 4px 0 rgba(0,0,0,0.25),0 0 6px 0 #FAE287`; hover glow `0 0 16px rgba(255,234,158,0.3)` + `-translate-y-1`; title Montserrat 400 24px `#FFEA9E`; `card_description` white 16px `line-clamp-2` tracking-[0.5px]; "Chi tiết" `<div>` inline-flex with `<RedirectIcon>` (white, 24×24); image onError → placeholder with first letter | `src/components/homepage/AwardCard.tsx`
- [x] T025 [P] [US2] Create `AwardsSection` Server Component: C1 header = caption "Sun* annual awards 2025" (Montserrat 24px 700 white) + `1px solid #2E3940` divider + title "Hệ thống giải thưởng" (Montserrat 57px 700 `#FFEA9E` tracking-[-0.25px] leading-[64px]); no description paragraph; award grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`; maps `AWARD_CATEGORIES` config → `<AwardCard>` | `src/components/homepage/AwardsSection.tsx`
- [x] T026 [P] [US2] Create `KudosPromo` Server Component: "Phong trào ghi nhận" label (muted 14px); "Sun* Kudos" title (Montserrat Alternates 700 #FFEA9E large); description paragraph; illustration `<Image>` (right side); "Chi tiết" `<Link>` button → `/sun-kudos` using next-intl navigation | `src/components/homepage/KudosPromo.tsx`
- [x] T027 [US2] Replace award section placeholder and kudos promo placeholder in page.tsx with `<AwardsSection />` and `<KudosPromo />`; correct vertical spacing in flex-column layout | `src/app/[locale]/(protected)/page.tsx`

**Checkpoint**: US2 complete. All 6 award cards render with correct data, navigation, and hover effects.

---

## Phase 6: US4 — Floating Widget Button (Priority: P2)

**Goal**: Gold pill FAB fixed at bottom-right, visible at all scroll positions. Click navigates to write-kudo flow.

**Independent Test**: Load homepage, scroll to bottom → FAB still visible at bottom-right corner. Click FAB → navigates to `/write-kudo` (or quick-action menu opens).

### Components (US4)

- [x] T028 [US4] Create shared `WidgetButton` Client Component (`'use client'`): `fixed bottom-8 right-8 z-40`; gold pill `w-[105px] h-[64px] rounded-full bg-[var(--color-gold)]`; flex row with pencil icon + "/" separator + SAA icon; click → quick-action dropdown (spec TBD); accessible with `aria-label` | `src/components/ui/WidgetButton.tsx`
- [x] T029 [US4] Inject `<WidgetButton />` for all non-admin protected pages via `(main)` route group layout — NOT in individual page.tsx files | `src/app/[locale]/(protected)/(main)/layout.tsx`

**Checkpoint**: US4 complete. FAB visible and functional.

---

## Phase 6.5: US6 — QR Code Ticket Page (Priority: P1)

**Goal**: After countdown expires, "Lấy mã QR" button appears in hero. Clicking navigates to `/ticket` which shows employee's personal QR code centered on black background.

**Independent Test**: Set `targetDate` to past → see "Lấy mã QR" gold button in countdown block. Click → `/ticket` loads with black bg and white QR code (240×240) centered. QR encodes the logged-in user's UUID.

- [x] T038 Install `qrcode.react` dependency (`yarn add qrcode.react`) | `package.json`
- [x] T039 [P] [US6] Create `QRCodeDisplay` Client Component (`'use client'`): props `userId: string`; renders `<QRCodeSVG value={userId} size={240} fgColor="#FFFFFF" bgColor="transparent" />` from `qrcode.react`; wrapped in `flex flex-col items-center justify-center min-h-screen bg-black` | `src/components/homepage/QRCodeDisplay.tsx`
- [x] T040 [US6] Create `/ticket` Server Component page: reads authenticated user via Supabase server session; if no session → redirect to `/login`; passes `user.id` to `<QRCodeDisplay userId={user.id} />`; no header/footer | `src/app/[locale]/(protected)/(main)/ticket/page.tsx`
- [x] T041 [P] [US6] Add i18n keys: `homepage.qrButton` ("Lấy mã QR" / "Get QR Code") to both locale files | `src/i18n/messages/vi.json`, `src/i18n/messages/en.json`
- [x] T042 [US6] Update `CountdownTimer` to: when `isExpired === true`, hide countdown digits block and render only `<Link href="/ticket">` with label `t('homepage.qrButton')` styled as gold fill button; use `<Link>` from `@/i18n/navigation` | `src/components/homepage/CountdownTimer.tsx`

**Checkpoint**: US6 complete. QR button appears on countdown expiry, ticket page renders unique QR per employee.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, loading states, responsive validation, accessibility, code quality gates.

- [ ] T030 [P] Add `<Suspense>` boundary with animated skeleton fallback (`animate-pulse`) around `<AwardsSection />` to handle slow data; each skeleton card matches AwardCard dimensions | `src/app/[locale]/(protected)/page.tsx`
- [ ] T031 [P] Add error boundary / try-catch in `page.tsx` around `fetchEventConfig()`: on failure, log error server-side and fall back to `process.env.NEXT_PUBLIC_EVENT_START_DATETIME`; never expose error details to client | `src/app/[locale]/(protected)/page.tsx`
- [ ] T032 [P] Add `onError` handler on `<Image>` in `AwardCard` to swap to gold-border placeholder `<div>` when image 404s; no layout shift | `src/components/homepage/AwardCard.tsx`
- [ ] T033 Verify responsive layout at all 4 required breakpoints (375px, 768px, 1024px, 1440px): award grid 1→2→3 cols, header nav readable, hero title scales, no horizontal scroll | `src/components/homepage/`
- [ ] T034 [P] Audit: confirm ALL static text in homepage components uses `useTranslations('homepage')` — no hardcoded Vietnamese/English strings | `src/components/homepage/`
- [ ] T035 [P] Audit: confirm ALL color values in homepage components reference CSS variables (`var(--color-*)`) or Tailwind tokens — no raw `#hex` strings in component files | `src/components/homepage/`
- [ ] T036 [P] Audit: confirm ALL internal navigation uses `<Link>` from `next-intl/navigation` — no raw `<a href>`, no `window.location`, no hardcoded locale prefixes | `src/components/homepage/`
- [ ] T037 [P] Accessibility pass: add `alt` text to all `<Image>` components; verify all interactive elements have minimum 44×44px touch targets (constitution §V); add `aria-label` to icon-only buttons (bell, avatar) | `src/components/homepage/`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup/Assets)
    └── Phase 2 (Foundation)                    ← BLOCKS all phases below
            ├── Phase 3 (US1+US5) 🎯 MVP
            ├── Phase 4 (US3)                    ← can start after Phase 3 HeroSection exists
            ├── Phase 5 (US2)                    ← can start after Phase 3 page.tsx exists
            ├── Phase 6 (US4)                    ← independent of Phase 4 & 5
            └── Phase 6.5 (US6)                  ← T038→T039→T040; T042 after Phase 4 (CountdownTimer)
                    └── Phase 7 (Polish)         ← after all stories complete
```

### Within Phase 3 (US1 + US5)

```
T012 NavLink ──────────────────────┐
T013 DropdownProfile ──────────────┤
T014 LocaleDropdown (shared) ──────┼──→ T015 Header ──→ T020 Page
T016 EventInfo ────────────────────┤
T017 CTAButtons ───────────────────┤
T018 HeroSection ──────────────────┘
T019 Footer ──────────────────────────────────────────→ T020 Page
```

### Within Phase 4 (US3)

```
T021 CountdownDigit ──→ T022 CountdownTimer ──→ T023 (inject into HeroSection)
```

### Within Phase 5 (US2)

```
T024 AwardCard ─────────────────┐
T025 AwardsSection ─────────────┼──→ T027 (inject into page.tsx)
T026 KudosPromo ────────────────┘
```

### Parallel Opportunities

| Group | Tasks | Condition |
|-------|-------|-----------|
| Asset downloads | T002, T003, T004, T005 | All independent — run simultaneously |
| Foundation | T007, T008, T011 | After T006 tokens done |
| US1 atoms | T012, T013, T014, T016, T017, T018, T019 | All independent files — run simultaneously |
| US3 | T021 → T022 → T023 | Sequential |
| US2 | T024, T025, T026 | All independent — run simultaneously |
| US6 — QR | T039, T041 | Independent — run simultaneously after T038 |
| Polish | T030, T031, T032, T034, T035, T036, T037 | All independent — run simultaneously |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete **Phase 1** (assets) + **Phase 2** (foundation)
2. Complete **Phase 3** (US1 + US5) → page loads with header, hero, footer
3. Complete **Phase 4** (US3) → countdown ticks live
4. **STOP and VALIDATE**: Authenticated user can visit `/`, sees hero with live countdown, nav works
5. Then continue Phase 5 → 6 → 7

### Incremental Delivery

```
Phase 1+2 → Phase 3 (skeleton renders) → Phase 4 (countdown) → Phase 5 (award cards)
         → Phase 6 (FAB) → Phase 7 (polish) → ✅ Done
```

---

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 42 |
| Phase 1 (Setup) | 5 |
| Phase 2 (Foundation) | 6 |
| Phase 3 — US1+US5 (P1) | 8 |
| Phase 4 — US3 (P1) | 3 |
| Phase 5 — US2 (P1) | 4 |
| Phase 6 — US4 (P2) | 2 |
| Phase 6.5 — US6 (P1) | 5 |
| Phase 7 (Polish) | 8 |
| Tasks marked [P] (parallelizable) | 26 |

### MVP Scope (Phase 1–3)

Complete 19 tasks → homepage renders with sticky header, hero, working nav, footer, countdown.

---

## Notes

- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each phase checkpoint
- If `zod` is missing (T001), install before T010 or T010 will fail
- `CountdownTimer` must render `"00"` server-side (T022) — do NOT use `Date.now()` during SSR render
- All `<Link>` components must import from `@/i18n/navigation` (next-intl wrapper) not from `next/link` directly — this ensures locale prefix is automatically prepended
- Avatar button in Header must read user role from Supabase session to show `DropdownProfile` (user) vs `DropdownProfileAdmin` (admin) — read role from `public.profiles.role`
