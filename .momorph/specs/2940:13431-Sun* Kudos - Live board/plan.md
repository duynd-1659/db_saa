# Implementation Plan: Sun* Kudos - Live board

**Frame**: `2940:13431-Sun* Kudos - Live board`
**Date**: 2026-03-12
**Spec**: `specs/2940:13431-Sun* Kudos - Live board/spec.md`
**Version**: v9.0
**Last synced**: 2026-03-20

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v9.0 | 2026-03-20 | Structural | Requirement change: Highlight Kudos section. Updated: Phase 4 T013 (clear button + button text), T015 (line-clamp-3), T016 (min-height on loading), Critical E2E #4. |
| v8.1 | 2026-03-19 | Cosmetic | Requirement change: Carousel clone-based seamless infinite loop. Updated: State Management. |
| v8.0 | 2026-03-19 | Structural | Requirement change: Carousel circular loop. Updated: State Management (carousel wrap), Phase 4 T016 (no disabled state), E2E scenario 3. |
| v7.4 | 2026-03-19 | Structural | Requirement change: SpotlightWordCloud user popover fully specified. Added SpotlightUserPopover.tsx to file structure. Updated Phase 5 note (no longer deferred). |
| v7.3 | 2026-03-19 | Cosmetic | Requirement change: (1) Canvas height 548→688px; (2) SpotlightRecentFeed fixed 330×136px + overflow-hidden, no fade, only name bold. Updated: Phase 5 T018, T021-SP bottom-left. |
| v7.2 | 2026-03-19 | Cosmetic | Requirement change: B.7 canvas width fluid (100%) not fixed 1157px. Updated: Phase 5 T018. |
| v7.1 | 2026-03-19 | Cosmetic | Requirement change: Row 3 clarifications — department name (not ID), dot text-sm, badge 109×19px. Updated: Phase 6 T021. |
| v7.0 | 2026-03-19 | Structural | Requirement change: KudoCard sender/recipient column — 3-row layout + hero badge image + anonymous sender exception. Updated: Phase 6 T021. |
| v6.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added to Integration Points (injected via (main)/layout.tsx). |
| v5.0 | 2026-03-18 | Structural | Figma sync: kudo card (C.3) redesign. Updated: T001 (Kudo type adds title), T021 (KudoCard full layout spec). |
| v4.0 | 2026-03-18 | Structural | Requirement change: (1) WriteKudosBar must be `<button>` for cursor:pointer (T011 updated); (2) post-submit router.refresh() strategy added to State Management. Updated: State Management, Phase 3 T011. |
| v3.1 | 2026-03-18 | Cosmetic | Version bump only (animation float 2D — CSS-only change). |
| v3.0 | 2026-03-18 | Structural | Phase 5 Spotlight Board: cập nhật architecture — stars fixed layer ngoài zoom+pan div, background image (spotlight-bg.png, blend-mode screen) trong zoom+pan layer, drag-to-pan (panOffset state + mouse handlers), zoom min=1.0/step=0.5, border-radius 47px, search bar pill style + result count, tên 9px/400/#ff6b35. |
| v2.0 | 2026-03-18 | Structural | Phase 5 Spotlight Board: mở rộng T018–T020 và thêm T021-SP, T022-SP, T023-SP. Thêm animated star bg, name oscillation, search/count in-canvas layout, bottom-left 7-kudos feed, bottom-right zoom controls, zoom map behavior, defer hover popup. Cập nhật Notes. |
| v1.0 | 2026-03-12 | Initial | Initial implementation plan |

---

## Summary

Build the Sun* Kudos live board page at route `/[locale]/sun-kudos`. This is the main kudo feed page featuring: a keyvisual hero with write-kudo input bar, a "Highlight Kudos" carousel (top 5 by hearts) with hashtag/department filtering, a Spotlight word-cloud board, an "All Kudos" paginated feed with kudo cards (sender→recipient, heart, copy-link), and a right sidebar with personal stats and "Mo qua" (Open Secret Box) button. The page uses Server Components for initial SSR feed render and Client Components for interactive elements (heart toggle, carousel, spotlight canvas, filters). Requires new Supabase queries against `kudos`, `kudo_hashtags`, `kudo_images`, `kudo_hearts`, `hashtags`, `departments`, `profiles`, and `secret_boxes` tables.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 App Router
**Primary Dependencies**: React 19, Tailwind CSS 4.x, `@supabase/ssr` 2.x, `next-intl`, `zod`
**Database**: Supabase PostgreSQL — reads multiple tables (kudos, profiles, hashtags, departments, secret_boxes)
**Testing**: Playwright (E2E), Vitest (unit)
**State Management**: URL query params for filters (`?hashtag=id&dept=id`), React state for carousel/heart/spotlight
**API Style**: Next.js Route Handlers (REST) + Server Actions

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

- [x] Follows project coding conventions (kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Supabase SSR, next-intl, Tailwind CSS 4)
- [x] Adheres to folder structure guidelines (`src/components/kudos/`, `src/services/`, `src/types/`)
- [x] Meets security requirements (RLS, server-side auth, no raw HTML rendering)
- [x] Follows testing standards (E2E for critical paths, unit for hooks/services)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| D3.js for word cloud (TR-006) | Spotlight board needs canvas-based word cloud with pan/zoom | Pure CSS word cloud lacks interactivity; consider `d3-cloud` or `react-wordcloud` — evaluate in Phase 5 |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/kudos/`
- **Styling Strategy**: Tailwind utilities + CSS variables from `globals.css` (reuse existing tokens `--color-gold`, `--color-page-bg`, `--color-border`, etc.)
- **Data Fetching**:
  - Server Component page fetches initial feed + highlights + sidebar stats via services
  - Client Components for: heart toggle (optimistic UI), carousel navigation, spotlight interaction, filter dropdowns
- **State Management**:
  - Filter state in URL query params (`?hashtag=id&dept=id`) for shareability (TR-004)
  - Carousel index in local React state — clone-based seamless infinite loop: prepend clone of last slide + append clone of first slide; after CSS transition ends, silently jump to the real slide (no animation)
  - Heart state with optimistic updates + rollback on error
  - Post-submit refresh: `WriteKudoProvider` exposes an `onSuccess` callback; after kudo submit, call `router.refresh()` (Next.js) to re-run the Server Component and update AllKudosFeed, SpotlightBoard, and sidebar stats in one pass (FR-013)

### Backend Approach

- **API Design**: Next.js Route Handlers at `src/app/api/kudos/`
  - `GET /api/kudos` — paginated feed (query params: `page`, `limit`, `hashtag`, `dept`)
  - `GET /api/kudos/highlights` — top 5 by hearts (query params: `hashtag`, `dept`)
  - `POST /api/kudos/:id/heart` — toggle heart (body: none, uses auth session)
  - `GET /api/kudos/spotlight` — recipient names + kudos counts for word cloud
  - `GET /api/users/me/stats` — authenticated user's kudo stats
- **Data Access**: Service functions in `src/services/kudos-service.ts` using Supabase server client
- **Validation**: Zod schemas for API request params

### Integration Points

- **Reusable Components**: `<Header />` and `<Footer />` from `src/components/homepage/` — reuse directly with "Sun* Kudos" as active link
- **Shared UI**: `<Button />` from `src/components/ui/`; `<WidgetButton />` from `src/components/ui/WidgetButton.tsx` — injected automatically via `src/app/[locale]/(protected)/(main)/layout.tsx`; no per-page import needed
- **Overlays**: Viet Kudo form, Dropdown Hashtag filter, Dropdown Phong ban — separate specs already exist; this plan integrates their trigger points only
- **i18n**: All user-facing text via `next-intl` translations (`vi.json`, `en.json`)
- **Auth**: Protected route via existing middleware + `(protected)` layout group

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2940:13431-Sun* Kudos - Live board/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── [locale]/(protected)/
│   │   └── sun-kudos/
│   │       └── page.tsx                   # NEW — Sun* Kudos page (Server Component)
│   ├── api/
│   │   └── kudos/
│   │       ├── route.ts                   # NEW — GET /api/kudos (paginated feed)
│   │       ├── highlights/
│   │       │   └── route.ts               # NEW — GET /api/kudos/highlights
│   │       ├── [id]/
│   │       │   └── heart/
│   │       │       └── route.ts           # NEW — POST /api/kudos/:id/heart
│   │       └── spotlight/
│   │           └── route.ts               # NEW — GET /api/kudos/spotlight
│   └── api/
│       └── users/
│           └── me/
│               └── stats/
│                   └── route.ts           # NEW — GET /api/users/me/stats
├── components/
│   ├── kudos/                             # NEW — Feature components
│   │   ├── KudosKeyvisual.tsx             # Hero banner + gradient
│   │   ├── WriteKudosBar.tsx              # Pill input bar (click → Viet Kudo)
│   │   ├── HighlightKudos.tsx             # Section container (header + carousel + filters)
│   │   ├── KudosCarousel.tsx              # Carousel with prev/next navigation
│   │   ├── HighlightKudoCard.tsx          # Individual kudo card (highlight variant)
│   │   ├── KudoCard.tsx                   # Feed kudo card (sender → recipient)
│   │   ├── KudoCardActions.tsx            # Heart button + Copy Link (Client Component)
│   │   ├── SpotlightBoard.tsx             # Word cloud canvas (Client Component)
│   │   ├── SpotlightUserPopover.tsx       # NEW — Hover popover: name, dept+badge, stats, Send KUDO
│   │   ├── AllKudosFeed.tsx               # Feed container + pagination
│   │   ├── KudosSidebar.tsx               # Stats + Mo qua button
│   │   ├── KudosSidebarStats.tsx          # 5 stat rows
│   │   ├── OpenSecretBoxButton.tsx        # Gold CTA → modal trigger
│   │   ├── RecentBoxOpeners.tsx           # "10 SUNNER NHAN QUA MOI NHAT" list
│   │   ├── FilterChips.tsx               # Hashtag + Phong ban filter buttons
│   │   └── KudoHashtagChip.tsx            # Individual hashtag badge
│   └── homepage/
│       ├── Header.tsx                     # REUSE — active link = "Sun* Kudos"
│       └── Footer.tsx                     # REUSE — no changes needed
├── services/
│   └── kudos-service.ts                   # NEW — All kudo-related Supabase queries
├── hooks/
│   ├── use-heart.ts                       # NEW — Optimistic heart toggle hook
│   └── use-kudos-filters.ts              # NEW — URL-based filter state hook
├── types/
│   └── kudos.ts                           # NEW — Kudo, KudoCard, KudoStats, etc.
└── i18n/
    └── messages/
        ├── vi.json                        # MODIFY — add kudos namespace
        └── en.json                        # MODIFY — add kudos namespace
```

### Modified Files

| File | Changes |
|------|---------|
| `src/i18n/messages/vi.json` | Add `kudos` namespace with all Vietnamese strings |
| `src/i18n/messages/en.json` | Add `kudos` namespace with all English strings |
| `src/app/globals.css` | Add kudos-specific CSS variables (if any not already defined) |

### New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `d3-cloud` | latest | Word cloud layout for Spotlight board (evaluate in Phase 5) |
| `@types/d3-cloud` | latest | TypeScript definitions |

> **Note**: The d3-cloud dependency is tentative. If the Spotlight board can be achieved with a simpler approach (CSS grid with random sizing), prefer that. Evaluate during Phase 5 implementation.

---

## Implementation Approach

### Phase 0: Asset Preparation
- Download required UI assets from Figma (keyvisual BG, icons, any section-specific graphics) using `get_media_files` / `get_figma_image`
- Organize under `public/assets/kudos/{images,icons,logos}/`
- Required assets: keyvisual background, pencil icon (write bar), chevron-left/right (carousel nav), heart icon, copy-link icon, pan/zoom icons (spotlight)
- Verify reusable assets already in `public/assets/icons/` (avatar.svg, bell.svg, etc.)

### Phase 1: Foundation — Types, Services, Route
- **T001**: Define TypeScript types in `src/types/kudos.ts`: `Kudo` (includes `title: string`), `KudoWithDetails`, `HighlightKudo`, `KudoStats`, `SpotlightEntry`, `KudoFilters`
- **T002**: Create `src/services/kudos-service.ts` with server-side Supabase query functions:
  - `fetchKudosFeed(page, limit, filters)` — paginated feed with sender/recipient joins
  - `fetchHighlightKudos(filters)` — top 5 by hearts_count
  - `fetchSpotlightData()` — aggregated recipient names + counts
  - `fetchUserKudoStats(userId)` — personal stats
  - `toggleKudoHeart(kudoId, userId)` — insert/delete from kudo_hearts
  - `fetchRecentBoxOpeners()` — 10 most recent secret box openers
- **T003**: Create page route `src/app/[locale]/(protected)/sun-kudos/page.tsx` (Server Component shell)
- **T004**: Add i18n messages for `kudos` namespace in `vi.json` and `en.json`

### Phase 2: API Route Handlers
- **T005**: `GET /api/kudos` — paginated feed endpoint with filter params
- **T006**: `GET /api/kudos/highlights` — top 5 highlight kudos endpoint
- **T007**: `POST /api/kudos/:id/heart` — toggle heart endpoint (auth required)
- **T008**: `GET /api/kudos/spotlight` — spotlight data endpoint
- **T009**: `GET /api/users/me/stats` — user stats endpoint

### Phase 3: Core UI — Keyvisual + Write Bar (US5)
- **T010**: Create `KudosKeyvisual` — hero section with background image + gradient overlay
- **T011**: Create `WriteKudosBar` — pill-shaped input bar (click triggers Viet Kudo form open). MUST render as `<button>` to ensure `cursor: pointer` on hover (FR-012)
- **T012**: Wire page: Header (reuse, active="Sun* Kudos") + KudosKeyvisual + WriteKudosBar

### Phase 4: Highlight Kudos Section (US3, US4)
- **T013**: Create `FilterChips` — hashtag + department filter trigger buttons (Client Component). Active button label changes to selected option's display name (FR-016). "Xoá bộ lọc" clear button renders after the two filter buttons when ≥1 filter is active; hidden otherwise (FR-017)
- **T014**: Create `use-kudos-filters` hook — manages filter state via URL search params
- **T015**: Create `HighlightKudoCard` — kudo card for carousel (sender→recipient layout, content, hashtags, heart, copy-link). Content area MUST use `line-clamp-3`: max 3 lines visible; if content > 3 lines, show 2 full lines + `...` on 3rd line (FR-003)
- **T016**: Create `KudosCarousel` — horizontal carousel with prev/next navigation (infinite circular loop, no disabled state) + page indicator "2/5". Carousel container MUST declare a fixed `min-height` matching the loaded state so the section does not collapse during filter-triggered loading (FR-018)
- **T017**: Create `HighlightKudos` — section container (header + filters + carousel)

### Phase 5: Spotlight Board (US8)
- **T018**: Create `SpotlightBoard` (Client Component) — canvas/div `width: 100% (fluid), height: 688px` với `border 1px solid #998C5F`, `overflow-hidden`, `position relative`. Render word cloud của recipient names (size tỉ lệ kudos count). Evaluate d3-cloud vs simpler approach; implement chosen solution.
- **T019**: Implement animated star/constellation background — dark background với animated dots + connecting lines (CSS animation hoặc canvas `requestAnimationFrame`). Decorative orange graphic góc trái.
- **T020**: Implement sunner name oscillation — mỗi tên dao động lắc lư trái-phải quanh vị trí cố định bằng CSS `@keyframes` với random delay và amplitude nhỏ (~3–6px).
- **T021-SP**: Implement SpotlightBoard internal layout:
  - Top-left (inside canvas): Search input (`B.7.3`) — placeholder "Tìm kiếm", kính lúp icon, lọc/highlight tên khớp
  - Top-center (inside canvas): "388 KUDOS" count — Montserrat Alternates 28px 700 white, query từ DB
  - Bottom-left (inside canvas): Live feed 7 kudos mới nhất — `HH:MMam/pm [Tên] đã nhận được một Kudos mới`, chỉ tên recipient in đậm (không fade). Fixed size 330×136px, overflow hidden (tránh đè lên SpotlightWordCloud khi zoom). Cần API `GET /api/kudos/spotlight/recent?limit=7`
  - Bottom-right (inside canvas): Zoom-in icon, zoom-out icon, zoom ratio label (e.g. `100%`), fullscreen button (↗)
- **T022-SP**: Implement zoom behavior — zoom toàn bộ map cloud: scale background + giãn inter-name spacing theo tỉ lệ. Dùng CSS `transform: scale()` hoặc D3 zoom trên container.
- **T023-SP**: Add `fetchRecentSpotlightKudos(limit=7)` to `kudos-service.ts` + API route `GET /api/kudos/spotlight/recent`
- **Note**: Hover popover over sunner name — **fully specified in FR-015 and US8 scenarios 7–10**. Implement as `SpotlightUserPopover.tsx` (Client Component): 6-row layout (name+profile link, dept+hero badge, divider, kudos received, kudos sent, Send KUDO button). Requires `GET /api/users/:id/spotlight-stats` or equivalent to fetch per-user kudos received/sent counts on hover. Send KUDO button pre-fills the Viết Kudo form recipient field.

### Phase 6: All Kudos Feed (US1, US2, US7)
- **T021**: Create `KudoCard` — feed variant (C.3, node `3127:21871`). Cream card (`rgba(255,248,225,1)`, `border-radius: 24px`, `padding: 40px 40px 16px 40px`). Layout: (1) sender COLUMN (row 1: avatar 64px; row 2: name 16px/700 dark; row 3: department name text 12px/400/gray + `·` dot (text-sm) + hero badge `<Image>` 109×19px — if anonymous: no row 3, show "Nguoi dung an danh / Anonymous User" text-sm gray) ↔ arrow ↔ recipient COLUMN (same 3-row, always shown); (2) 1px divider; (3) Content: timestamp (`HH:MM - MM/DD/YYYY` format), title badge (D.4 with pencil icon), content box (gold border+bg, 20px/700, max 5 lines), image gallery (up to 5 × 88px), hashtag chips (single row, flex-nowrap, overflow-hidden, trailing "..." if overflow); (4) gold 1px divider; (5) action bar (hearts LEFT, Copy Link text+icon RIGHT). Requires `kudo.title` in `KudoWithDetails`.
- **T022**: Create `KudoCardActions` (Client Component) — heart toggle (optimistic) + copy link button
- **T023**: Create `use-heart` hook — optimistic heart toggle with rollback on error
- **T024**: Create `AllKudosFeed` — paginated feed container (infinite scroll or "Load more")
- **T025**: Create `KudoHashtagChip` — individual hashtag badge component

### Phase 7: Sidebar (US6, stats)
- **T026**: Create `KudosSidebarStats` — 5 stat rows (kudos received, sent, hearts, boxes opened, boxes remaining)
- **T027**: Create `OpenSecretBoxButton` — gold CTA button (triggers modal if unopened_count > 0)
- **T028**: Create `RecentBoxOpeners` — "10 SUNNER NHAN QUA MOI NHAT" list with avatars
- **T029**: Create `KudosSidebar` — sidebar container (stats + button + recent openers)

### Phase 8: Page Assembly + Layout
- **T030**: Assemble full page layout in `sun-kudos/page.tsx`:
  - Header (reuse) → Keyvisual → HighlightKudos → Spotlight → [Feed | Sidebar] → Footer (reuse)
- **T031**: Implement responsive layout:
  - Desktop (>=1280px): feed + sidebar side-by-side
  - Tablet (768-1279px): sidebar moves below feed
  - Mobile (<768px): single column, carousel horizontal scroll

### Phase 9: Polish + Error Handling
- **T032**: Add loading states (skeleton) for feed, highlights, sidebar stats
- **T033**: Add error handling: heart API failure toast, stats fallback ("--"), empty feed state
- **T034**: Add empty state for zero kudos ("Write the first kudo!")
- **T035**: Accessibility: aria-labels, focus management, keyboard carousel navigation, min touch target 44x44px

---

## Testing Strategy

| Type | Focus | Coverage |
|------|-------|----------|
| Unit | `kudos-service.ts` functions, `use-heart` hook, `use-kudos-filters` hook | 80% |
| Integration | API route handlers (feed, highlights, heart toggle) | 70% |
| E2E | Feed load, heart toggle, carousel navigation, filter, copy link | Key flows (US1-US5) |

### Critical E2E Test Scenarios

1. Feed loads with kudo cards showing sender, recipient, content, hashtags, heart count
2. Heart toggle: click → red + increment; click again → gray + decrement
3. Carousel: navigate between 5 highlight cards with circular wrap-around (no disabled state)
4. Filter by hashtag → highlights update; filter button shows selected name; filter by department → highlights update; filter button shows selected dept name; "Xoá bộ lọc" appears and resets all filters when clicked; carousel height stable during loading
5. Click write bar → Viet Kudo form opens
6. Copy link → clipboard + toast
7. Sidebar stats display correctly for authenticated user
8. Responsive: sidebar moves below feed on tablet, single column on mobile

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Spotlight word cloud complexity | Medium | High | Start with simple CSS grid approach; only adopt d3-cloud if required |
| Real-time feed updates | Low | Medium | Initial implementation uses polling/refresh; WebSocket/Realtime can be added later |
| Large feed performance | Medium | Medium | Server-side pagination, limit 20 per page, lazy-load images |
| Heart race conditions | Low | Medium | Optimistic UI with server reconciliation; unique constraint on kudo_hearts |
| Missing DB tables/RLS | Medium | High | Verify all required tables exist before Phase 1; create migrations if needed |

---

## Estimated Complexity

- **Frontend**: High (many interactive components, carousel, word cloud, optimistic UI)
- **Backend**: Medium (CRUD queries, pagination, auth-guarded endpoints)
- **Testing**: Medium (mostly E2E for interactive flows)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] `design-style.md` available
- [ ] Verify DB tables exist: `kudos`, `kudo_hashtags`, `kudo_images`, `kudo_hearts`, `secret_boxes`, `profiles`, `hashtags`, `departments`
- [ ] Verify RLS policies on above tables

### External Dependencies (separate specs, integrated as trigger points only)

- Viet Kudo form: `520:11602-Viet Kudo/spec.md` — write bar opens this
- Dropdown Hashtag filter: `721:5580-Dropdown Hashtag filter/spec.md` — filter chip triggers this
- Dropdown Phong ban: `721:5684-Dropdown Phong ban/spec.md` — filter chip triggers this
- Open Secret Box modal: `1466:7676-Open secret box- chua mo/spec.md` — sidebar button triggers this

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The page is 1440px wide and 5862px tall — requires significant vertical scrolling with multiple major sections.
- Header and Footer are reused from homepage components (`src/components/homepage/`). Header needs "Sun* Kudos" as the active nav link — verify the Header component supports this via props.
- Anonymous kudos: display `anonymous_name` instead of sender name/avatar — handle in `KudoCard` rendering.
- The Spotlight board is the most complex sub-feature. Internal layout: search top-left, "388 KUDOS" top-center, word cloud fills canvas, bottom-left 7-kudos live feed, bottom-right zoom controls. Consider a phased approach: ship word cloud + static controls first, then add animations.
- Spotlight hover popup is deferred — do NOT implement until a follow-up sync defines it.
- Filter state in URL params enables sharing filtered views (e.g., `/sun-kudos?hashtag=3`).
- "10 SUNNER NHAN QUA MOI NHAT" list requires a join between `secret_boxes` and `profiles` — verify schema supports this.
- All navigation URLs sourced from SCREENFLOW.md: `/[locale]/sun-kudos` is the page route.
