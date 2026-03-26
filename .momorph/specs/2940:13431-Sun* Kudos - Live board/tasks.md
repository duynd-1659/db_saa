# Tasks: Sun* Kudos - Live board

**Frame**: `2940:13431-Sun* Kudos - Live board`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Version**: v9.0
**Last synced**: 2026-03-20

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v9.0 | 2026-03-20 | Structural | Requirement change: Highlight Kudos section. Modified: T030 (selected label state), T031 (clear button + label replacement), T032 (line-clamp-3), T034 (min-height on loading). |
| v8.1 | 2026-03-19 | Cosmetic | Requirement change: Carousel clone-based seamless infinite loop. Modified: T033 (re-invalidated RESYNC — clone approach). |
| v8.0 | 2026-03-19 | Structural | Requirement change: Carousel circular loop. Modified: T033 (invalidated RESYNC — no disabled nav, wrap-around). |
| v7.4 | 2026-03-19 | Structural | Requirement change: SpotlightWordCloud user popover fully specified (FR-015). Added T056 (SpotlightUserPopover). Updated Phase 9 note (no longer deferred). |
| v7.3 | 2026-03-19 | Cosmetic | Requirement change: (1) Canvas height 548→688px; (2) SpotlightRecentFeed fixed 330×136px + overflow-hidden, no fade, only name bold. Modified: T043 (height), T044d (reopened RESYNC). |
| v7.2 | 2026-03-19 | Cosmetic | Requirement change: B.7 canvas width fluid (100%), height stays 548px. Modified: T043 (reopened RESYNC — width + star canvas ResizeObserver). |
| v7.1 | 2026-03-19 | Cosmetic | Requirement change: Row 3 — dept name, dot text-sm, badge 109×19px, service join departments. Modified: T024 (reopened RESYNC). |
| v7.0 | 2026-03-19 | Structural | Requirement change: sender/recipient 3-row layout + hero badge + anonymous exception. Modified: T024. |
| v6.0 | 2026-03-18 | Structural | Requirement change: Added Phase 10 with T055 (WidgetButton verification via (main)/layout.tsx). |
| v5.0 | 2026-03-18 | Structural | Figma sync: All Kudos kudo card redesign. Reopened: T024 (RESYNC full redesign), T028 (RESYNC dark text + Copy Link label). Added: T053 (kudo title type + service), T054 (KudoImageGallery). |
| v4.0 | 2026-03-18 | Structural | Requirement change: cursor pointer + post-submit refresh. Modified: T021 (reopened RESYNC). Added: T052. |
| v3.2 | 2026-03-18 | Cosmetic | Requirement change: zoom max 500% (5.0). Modified: T044a. |
| v3.1 | 2026-03-18 | Cosmetic | Modified T043b: animation float 2D (translate XY + rotate) thay cho oscillate translateX. |
| v3.0 | 2026-03-18 | Structural | Phase 10 Figma Sync: T043a/T043b/T044/T044a reopened (RESYNC). Thêm T051 (background image zoom+pan layer). Fixes: star fixed layer + white color, name 9px/400/#ff6b35, border-radius 47px, search pill + result count, zoom min=1.0/step=0.5, drag-to-pan. |
| v2.0 | 2026-03-18 | Structural | Phase 9 SpotlightBoard: T043 reopened + updated (RESYNC internal layout). Thêm T043a (animated star bg), T043b (name oscillation), T044 updated (controls in-canvas), T044a (zoom map behavior), T044b (fetchRecentSpotlightKudos service), T044c (API route spotlight/recent), T044d (bottom-left 7-kudos feed). Hover popup deferred. |
| v1.0 | 2026-03-12 | Initial | Initial task list |

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, etc.)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asset preparation and project scaffolding

- [x] T001 Download keyvisual background image from Figma node `2940:13432` using `get_figma_image` | public/assets/kudos/images/keyvisual-bg.png
- [x] T002 Download and verify required icons from Figma using `get_media_files`: pencil (write bar), chevron-left/right (carousel nav), heart (kudo card), copy-link, pan/zoom icons (spotlight). Check reusable icons already in `public/assets/icons/` before downloading duplicates | public/assets/kudos/icons/
- [x] T003 Download SAA Kudos logo from Figma keyvisual section | public/assets/kudos/logos/
- [x] T004 [P] Define TypeScript types: `Kudo`, `KudoWithDetails` (includes sender/recipient profile joins), `HighlightKudo`, `KudoStats` (5 stat fields), `SpotlightEntry` (name + count), `KudoFilters` (hashtag_id, department_id, page, limit), `KudoHeart`, `SecretBoxOpener` | src/types/kudos.ts
- [x] T005 [P] Add i18n messages for `kudos` namespace in Vietnamese — all section headings ("HIGHLIGHT KUDOS", "SPOTLIGHT BOARD", "ALL KUDOS"), write bar placeholder, stat labels, button labels ("Mo qua", "Copy Link"), filter labels, empty states, error messages | src/i18n/messages/vi.json
- [x] T006 [P] Add i18n messages for `kudos` namespace in English — mirror all keys from vi.json | src/i18n/messages/en.json
- [x] T007 Add kudos-specific CSS variables to globals.css if not already defined: `--color-heart-inactive` (`rgba(255,255,255,0.4)`), `--color-heart-active` (`#FF4D4D`), `--color-cover-gradient`, `--color-header-bg`. Verify existing tokens (`--color-gold`, `--color-page-bg`, `--color-border`) cover the design-style.md spec | src/app/globals.css

**Checkpoint**: Assets downloaded, types defined, i18n ready, design tokens complete

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Service layer + API routes required by ALL user stories

**CRITICAL**: No UI component work can begin until service functions and API routes are available

- [x] T000 Create `kudos-service.ts` with `fetchKudosFeed(page, limit, filters)` — paginated query on `kudos` table with sender/recipient profile joins (avatar_url, name, department), kudo_hashtags join, kudo_images join, ordered by `created_at DESC`, returns `KudoWithDetails[]` + total count. Use Supabase server client. Select only required columns (no `select('*')`). Handle anonymous kudos (use `anonymous_name` when `is_anonymous = true`) | src/services/kudos-service.ts
- [x] T000 Add `fetchHighlightKudos(filters)` to kudos-service — top 5 kudos by `hearts_count` with same joins as feed query, supports optional hashtag_id and department_id filters | src/services/kudos-service.ts
- [x] T010 Add `toggleKudoHeart(kudoId, userId)` to kudos-service — check if row exists in `kudo_hearts` for (kudo_id, user_id): if yes, delete (unlike); if no, insert (like). Then update `kudos.hearts_count` accordingly. Return new heart state and count | src/services/kudos-service.ts
- [x] T011 [P] Add `fetchSpotlightData()` to kudos-service — aggregate recipient names with kudos count, return `SpotlightEntry[]` sorted by count DESC | src/services/kudos-service.ts
- [x] T012 [P] Add `fetchUserKudoStats(userId)` to kudos-service — query counts: kudos received, kudos sent, hearts received, secret boxes opened, secret boxes remaining. Return `KudoStats` | src/services/kudos-service.ts
- [x] T013 [P] Add `fetchRecentBoxOpeners(limit=10)` to kudos-service — query `secret_boxes` joined with `profiles` for 10 most recent openers, return `SecretBoxOpener[]` with avatar, name, prize description | src/services/kudos-service.ts
- [x] T014 [P] Create API route handler `GET /api/kudos` — validate query params (page, limit, hashtag, dept) with Zod, call `fetchKudosFeed`, return JSON response with pagination metadata | src/app/api/kudos/route.ts
- [x] T015 [P] Create API route handler `GET /api/kudos/highlights` — validate optional filter params with Zod, call `fetchHighlightKudos`, return JSON | src/app/api/kudos/highlights/route.ts
- [x] T016 [P] Create API route handler `POST /api/kudos/:id/heart` — auth guard (get user from session), call `toggleKudoHeart`, return new state `{ hearted: boolean, count: number }` | src/app/api/kudos/[id]/heart/route.ts
- [x] T017 [P] Create API route handler `GET /api/kudos/spotlight` — call `fetchSpotlightData`, return JSON | src/app/api/kudos/spotlight/route.ts
- [x] T018 [P] Create API route handler `GET /api/users/me/stats` — auth guard, call `fetchUserKudoStats(userId)`, return JSON | src/app/api/users/me/stats/route.ts
- [x] T019 Create page route shell `src/app/[locale]/(protected)/sun-kudos/page.tsx` — Server Component that fetches initial data (highlights, feed page 1, sidebar stats) via service functions and passes as props to child components. Reuse `<Header />` (with active="Sun* Kudos") and `<Footer />` from `src/components/homepage/`. Verify Header supports active link prop — if not, extend it | src/app/[locale]/(protected)/sun-kudos/page.tsx

**Checkpoint**: Foundation ready — all service functions and API routes available for UI implementation

---

## Phase 3: User Story 5 - Write a kudo from live board (Priority: P1)

**Goal**: User sees the keyvisual hero section and can click the write bar to start writing a kudo

**Independent Test**: Navigate to `/sun-kudos` → keyvisual renders with background image + gradient + SAA Kudos logo. Click the write bar → Viet Kudo form opens (or placeholder if Viet Kudo spec not yet implemented)

- [x] T020 [P] [US5] Create `KudosKeyvisual` Server Component — full-width hero section (512px height) with background image (`public/assets/kudos/images/keyvisual-bg.png`) using Next.js `<Image>` fill mode, gradient overlay (`--color-cover-gradient`), "He thong ghi nhan loi cam on" text + SAA Kudos logo. Layout per design-style.md section A | src/components/kudos/KudosKeyvisual.tsx
- [ ] T021 [P] [US5] Create `WriteKudosBar` Client Component — pill-shaped input bar (border-radius ~28px, full content width ~1152px), pencil icon left, placeholder text from i18n `kudos.writeBarPlaceholder`. MUST render as `<button>` element to ensure `cursor: pointer` on hover (FR-012). `onClick` handler opens Viet Kudo form. (RESYNC: thêm cursor-pointer requirement per FR-012) | src/components/kudos/WriteKudosBar.tsx
- [x] T022 [US5] Wire keyvisual section into page: page.tsx renders Header → KudosKeyvisual (containing WriteKudosBar at bottom) → rest of page placeholder | src/app/[locale]/(protected)/sun-kudos/page.tsx
- [ ] T052 [US5] Update `WriteKudoProvider` to call `router.refresh()` (from `next/navigation`) on successful kudo submit — this re-runs the Server Component to refresh AllKudosFeed, SpotlightBoard counts, and sidebar stats (FR-013). Wire via `onSuccess` callback passed into `WriteKudoModal` / `useWriteKudo` | src/components/kudos/write-kudo/WriteKudoProvider.tsx

**Checkpoint**: User Story 5 complete — page loads with keyvisual and write bar; post-submit refreshes related sections

---

## Phase 4: User Story 1 - View kudo feed (Priority: P1) MVP

**Goal**: Authenticated user views paginated kudo feed with cards showing sender, recipient, content, hashtags, heart count

**Independent Test**: Navigate to `/sun-kudos` → scroll to "ALL KUDOS" section → feed shows kudo cards (cream bg, rounded-24px). Each card: sender COLUMN (64px avatar + name + dept/badge) ↔ arrow ↔ recipient COLUMN; timestamp `HH:MM - MM/DD/YYYY`; title badge; content in gold-bordered box (max 5 lines); image gallery; hashtag chips; heart count + Copy Link. Pagination works.

- [x] T023 [P] [US1] Create `KudoHashtagChip` — small badge component rendering hashtag text in `#FFEA9E` color, Montserrat 13px 500 weight | src/components/kudos/KudoHashtagChip.tsx
- [ ] T053 [P] [US1] Add `title: string` to `Kudo` interface in `src/types/kudos.ts` and update `fetchKudosFeed` + `fetchHighlightKudos` in kudos-service to select `kudos.title` column | src/types/kudos.ts, src/services/kudos-service.ts
- [ ] T054 [P] [US1] Create `KudoImageGallery` component — `flex row gap-4`, renders up to 5 `KudoImage` items each `88×88px rounded-[18px] border border-[#998C5F]`, click → open full image | src/components/kudos/KudoImageGallery.tsx
- [x] T024 [P] [US1] Create `KudoCard` — cream card (`rgba(255,248,225,1)`, `rounded-[24px]`, `p-[40px_40px_16px_40px]`). (1) Info row: sender COLUMN (row 1: avatar 64px `border-[1.869px_solid_#FFF]`; row 2: name 16px/700 dark; row 3: department name 12px/400/gray + `·` dot (text-sm) + hero badge `<Image>` `109×19px` from `profile.hero_badge` — if `is_anonymous`: omit row 3, show "Nguoi dung an danh / Anonymous User" `text-sm text-gray-400`) ↔ sent-arrow icon ↔ recipient COLUMN (same 3-row, always shown); (2) 1px divider; (3) Content: timestamp 16px/700/gray `HH:MM - MM/DD/YYYY`, title badge (D.4) with pencil icon, content box (`border border-[#FFEA9E] bg-[rgba(255,234,158,0.40)] rounded-[12px] p-[16px_24px]`, text 20px/700 dark max-5-lines), image gallery (`KudoImageGallery`, up to 5 × 88px), hashtag chips (single row, flex-nowrap, overflow-hidden, trailing "..." if overflow); (4) gold 1px divider; (5) action bar: hearts LEFT, Copy Link text+icon RIGHT. (RESYNC: dept name not ID; dot text-sm; badge 109×19px; service join departments) | src/components/kudos/KudoCard.tsx
- [x] T025 [US1] Create `AllKudosFeed` Client Component — feed container rendering list of `KudoCard` components. Accepts initial data from Server Component page via props. Implements pagination: "Load more" button (or infinite scroll) that calls `GET /api/kudos?page=N` to fetch next page. Shows loading spinner while fetching. Section header rendered in page.tsx (C.1): subtitle "Sun* Annual Awards 2025" Montserrat 24px/700 white → 1px divider → "ALL KUDOS" Montserrat 57px/700/#FFEA9E lh:64px ls:-0.25px | src/components/kudos/AllKudosFeed.tsx
- [x] T026 [US1] Wire feed into page layout: page.tsx passes initial feed data to `AllKudosFeed`. Layout section: `C.1: All Kudos header` + `C.2: Feed` (flex row with sidebar placeholder for Phase 7) | src/app/[locale]/(protected)/sun-kudos/page.tsx

**Checkpoint**: User Story 1 complete — feed loads with kudo cards, pagination works

---

## Phase 5: User Story 2 - Heart (like) a kudo (Priority: P1)

**Goal**: User can toggle heart on any kudo card — heart turns red + count increments on like, gray + decrements on unlike

**Independent Test**: On any kudo card, click the heart icon → heart turns red, count increments by 1. Click again → heart turns gray, count decrements by 1. If API fails → error toast, heart reverts

- [x] T027 [P] [US2] Create `use-heart` hook — manages heart state for a single kudo. Accepts initial `{ hearted: boolean, count: number }`. Provides `toggle()` function with optimistic update: immediately flip state + update count, then call `POST /api/kudos/:id/heart`. On failure: rollback state, show error toast. Returns `{ hearted, count, toggle, isLoading }` | src/hooks/use-heart.ts
- [ ] T028 [US2] Create `KudoCardActions` Client Component — action bar `justify-between`. Hearts LEFT: count `24px/700/rgba(0,16,26,1)` dark + heart icon (gray inactive / red active). Copy Link RIGHT: text "Copy Link" `16px/700` dark + link icon `24×24px`. Uses `use-heart` hook. Min touch target 44x44px. (RESYNC: dark text colors on cream card, Copy Link shows text label + icon, hearts LEFT / Copy Link RIGHT layout) | src/components/kudos/KudoCardActions.tsx
- [x] T029 [US2] Integrate `KudoCardActions` into `KudoCard` — add action bar at bottom of each kudo card, passing initial heart state from server data | src/components/kudos/KudoCard.tsx

**Checkpoint**: User Story 2 complete — heart toggle works with optimistic UI

---

## Phase 6: User Story 3 + 4 - Highlight Kudos carousel + Filters (Priority: P1)

**Goal**: User views top 5 most-hearted kudos in a carousel and can filter by hashtag or department

**Independent Test**: "HIGHLIGHT KUDOS" section shows carousel with 5 kudo cards. Click next (>) → advances to next card. At first card, back (<) is disabled. At last card (5), next (>) is disabled. Page indicator shows "2/5". Click "Hashtag" filter → dropdown opens (placeholder), select hashtag → carousel updates. Click "Phong ban" filter → dropdown opens, select department → carousel updates

- [x] T030 [P] [US4] Create `use-kudos-filters` hook — manages filter state via URL search params (`?hashtag=id&dept=id`) using `useSearchParams` + `useRouter`. Provides `{ filters, setHashtag, setDepartment, clearFilters, hashtagLabel, deptLabel }` — `hashtagLabel` and `deptLabel` store the selected option's display name (used to update button text per FR-016); cleared back to `null` when filter is removed. Updates URL without full page reload (shallow navigation) | src/hooks/use-kudos-filters.ts
- [x] T031 [P] [US4] Create `FilterChips` Client Component — renders two filter trigger buttons: "Hashtag" and "Phong ban" with dropdown chevron icon. Button style matches Homepage filter chips (gold border, gold text on active). On click: triggers respective dropdown overlay (placeholder `console.log` until dropdown specs integrated). When a filter is active: (a) button label changes to the selected option's display name (from `hashtagLabel`/`deptLabel` via `use-kudos-filters`, FR-016); (b) a "Xoá bộ lọc" text button appears immediately after the two filter buttons, calls `clearFilters()` on click, resets both labels to defaults — hidden when no filters active (FR-017) | src/components/kudos/FilterChips.tsx
- [x] T032 [P] [US3] Create `HighlightKudoCard` — kudo card variant for carousel. Same sender→arrow→recipient layout as `KudoCard` but sized for carousel display per design-style.md node `2940:13465`. Includes content area (`line-clamp-3`: max 3 lines visible; if content > 3 lines → 2 full lines + `...` on 3rd, FR-003), hashtag chips (single row, flex-nowrap, overflow-hidden, trailing "..." if overflow), heart + copy-link actions. Reuses `KudoCardActions` and `KudoHashtagChip` | src/components/kudos/HighlightKudoCard.tsx
- [x] T033 [US3] Create `KudosCarousel` Client Component — seamless infinite loop carousel: prepend clone of last slide + append clone of first slide (total = n+2 slides in DOM); track index starting at 1 (real first slide); on `transitionend` if index=0 jump silently to n, if index=n+1 jump silently to 1. Nav buttons never disabled. Dimmed side cards (opacity 0.4). Page indicator shows real position. (RESYNC: updated per requirement change — clone-based seamless infinite loop, slide 5 pre-positioned left of slide 1) | src/components/kudos/KudosCarousel.tsx
- [x] T034 [US3] Create `HighlightKudos` — section container (1440x786px). Renders: B.1 header (subtitle "Sun* Annual Awards 2025" Montserrat 24px/700 white → 1px divider rgba(46,57,64) → title row flex justify-between: "HIGHLIGHT KUDOS" Montserrat 57px/700/#FFEA9E lh:64px ls:-0.25px LEFT + `FilterChips` RIGHT), `KudosCarousel`. Fetches highlight data — accepts initial server data, re-fetches via `GET /api/kudos/highlights` when filters change (using `use-kudos-filters`). Carousel wrapper MUST apply a fixed `min-height` (measured from loaded state) so the section height does not collapse while `isLoading=true` during filter refetch (FR-018) | src/components/kudos/HighlightKudos.tsx
- [x] T035 [US3] Wire HighlightKudos into page layout below keyvisual. Page passes initial highlight data from server fetch | src/app/[locale]/(protected)/sun-kudos/page.tsx

**Checkpoint**: User Stories 3 & 4 complete — carousel navigates, filters trigger data refresh

---

## Phase 7: User Story 7 - Copy kudo link (Priority: P2)

**Goal**: User clicks "Copy Link" on any kudo card and the URL is copied to clipboard

**Independent Test**: On any kudo card, click "Copy Link" button → kudo URL copied to clipboard, toast appears "Link copied — ready to share!"

- [x] T036 [US7] Add copy-link functionality to `KudoCardActions` — implement `handleCopyLink()` that constructs canonical kudo URL, calls `navigator.clipboard.writeText()`, and shows success toast (i18n `kudos.linkCopied`). Add copy-link icon button next to heart | src/components/kudos/KudoCardActions.tsx

**Checkpoint**: User Story 7 complete — copy link works on all kudo cards

---

## Phase 8: User Story 6 - Open Secret Box + Sidebar (Priority: P2)

**Goal**: Sidebar shows personal stats and "Mo qua" button. User can open secret box if they have unopened boxes

**Independent Test**: On `/sun-kudos`, sidebar shows 5 stats (Kudos nhan, Kudos gui, Tim nhan, Secret Box da mo, Secret Box chua mo) with gold values. "Mo qua" button is gold and clickable when `unopened_count > 0`, disabled when 0. "10 SUNNER NHAN QUA MOI NHAT" list shows 10 recent openers with avatars. Click avatar/name → profile page

- [x] T037 [P] [US6] Create `KudosSidebarStats` Server Component — renders 5 stat rows: label (Montserrat 14px 400 muted) + value (Montserrat 24px 700 `#FFEA9E`). Stat fields: kudos received, kudos sent, hearts received, boxes opened, boxes remaining. Accepts `KudoStats` as props | src/components/kudos/KudosSidebarStats.tsx
- [x] T038 [P] [US6] Create `OpenSecretBoxButton` Client Component — gold fill button (`bg-[var(--color-gold)]` text dark). Shows unopened count (padded "00"). Disabled state when count = 0. On click: triggers Open Secret Box modal (placeholder `console.log` until modal spec integrated). Label from i18n `kudos.openSecretBox` | src/components/kudos/OpenSecretBoxButton.tsx
- [x] T039 [P] [US6] Create `RecentBoxOpeners` Server Component — header "10 SUNNER NHAN QUA MOI NHAT" (Montserrat Alternates 700 gold). List of 10 items: avatar (circle, Next.js `<Image>`) + name + prize description. Click name/avatar → navigates to user profile page (use `<Link>` from next-intl) | src/components/kudos/RecentBoxOpeners.tsx
- [x] T040 [US6] Create `KudosSidebar` — sidebar container (width ~280px) composing: `KudosSidebarStats` + `OpenSecretBoxButton` + `RecentBoxOpeners`. Vertical flex layout with gap | src/components/kudos/KudosSidebar.tsx
- [x] T041 [US6] Wire sidebar into page layout: All Kudos section becomes flex row — `AllKudosFeed` (flex-1) + `KudosSidebar` (w-[280px]) on desktop. Pass stats data and recent openers from server fetch | src/app/[locale]/(protected)/sun-kudos/page.tsx

**Checkpoint**: User Story 6 complete — sidebar stats display, "Mo qua" triggers modal, recent openers listed

---

## Phase 9: User Story 8 - Spotlight board (Priority: P2)

**Goal**: Interactive word cloud canvas với animated background, zoom map, live feed, và search

**Independent Test**: Spotlight canvas (full-width × 688px, `#998C5F` border) render: animated star bg, "388 KUDOS" top-center INSIDE canvas, search bar top-left INSIDE canvas, names scattered + oscillating, bottom-left 7-kudos feed (330×136px fixed, only name bold), bottom-right zoom-in/out/ratio/fullscreen controls

- [x] T042 [US8] Evaluate word cloud approach: test d3-cloud integration vs CSS grid with random sizing. If d3-cloud chosen, install `d3-cloud` + `@types/d3-cloud` via yarn. Document decision in plan.md notes | src/components/kudos/SpotlightBoard.tsx
- [ ] T043 [US8] Create `SpotlightBoard` Client Component — canvas/div (width: 100% fluid, height: 688px, border `1px solid #998C5F`, `overflow-hidden`, `position relative`) rendering word cloud of recipient names from `GET /api/kudos/spotlight`. Name size proportional to kudos count. All sub-elements positioned INSIDE this container. (RESYNC: width fluid 100%; height 548→688px; star background canvas uses ResizeObserver) | src/components/kudos/SpotlightBoard.tsx, src/components/kudos/SpotlightStarBackground.tsx
- [x] T043a [US8] Implement animated star/constellation background inside SpotlightBoard — **fixed layer** (OUTSIDE zoom+pan div, NOT affected by zoom/pan). Star color: **white** `rgba(255,255,255,opacity)`. Connection lines: increased opacity (~0.5). Canvas `requestAnimationFrame`. (RESYNC: star layer must be fixed; color gold→white; line opacity increased) | src/components/kudos/SpotlightStarBackground.tsx, src/components/kudos/SpotlightBoard.tsx
- [x] T043b [US8] Implement sunner name style — font **9px fixed**, weight **400** (`font-normal`), search-active color **`#ff6b35`**. CSS `@keyframes spotlight-oscillate` float 2D: translate XY + rotate nhẹ, 10 bước, `ease-in-out infinite`. (RESYNC: font size/weight/active color; animation float 2D thay cho translateX) | src/components/kudos/SpotlightWordCloud.tsx, src/app/globals.css
- [x] T044 [US8] Implement SpotlightBoard internal layout — border-radius **47px**, search bar **pill** (`rounded-full`, `border: 0.682px solid #998C5F`, `bg: rgba(255,234,158,0.10)`), search **result count** right side (`"N kết quả"`, text-xs font-semibold text-white, hidden when query empty). (RESYNC: border-radius, search pill style, result count) | src/components/kudos/SpotlightBoard.tsx
- [x] T044a [US8] Implement zoom + drag-to-pan behavior — zoom: **min=1.0 (100%)**, **max=5.0 (500%)**, step=**0.5 (50%)**. Drag-to-pan: only when zoom>1.0; cursor `grab`/`grabbing`; drag moves zoom+pan layer (names + bg image). Stars (fixed layer) NOT panned. (RESYNC: zoom constraints, add drag-to-pan) | src/components/kudos/SpotlightBoard.tsx
- [x] T044b [US8] Add `fetchRecentSpotlightKudos(limit=7)` to kudos-service — query 7 kudos mới nhất (created_at DESC) với recipient name. Return `RecentSpotlightKudo[]` | src/services/kudos-service.ts
- [x] T044c [US8] Create API route `GET /api/kudos/spotlight/recent` — call `fetchRecentSpotlightKudos(7)`, return JSON | src/app/api/kudos/spotlight/recent/route.ts
- [ ] T044d [US8] Implement bottom-left recent kudos feed inside SpotlightBoard — 7 kudos mới nhất, format `HH:MMam/pm [Tên] đã nhận được một Kudos mới`. Only recipient **name** is bold (no fade). Fixed container: `w-[330px] h-[136px] overflow-hidden`. (RESYNC: fixed size 330×136px + overflow-hidden prevents overlap with SpotlightWordCloud on zoom; remove opacity fade; only name bold) | src/components/kudos/SpotlightRecentFeed.tsx
- [x] T051 [US8] Add background image (spotlight-bg.png, node `2940:14181`) inside zoom+pan layer — `<img>` absolute cover with `mix-blend-mode: screen`. Image already downloaded to `public/assets/kudos/images/spotlight-bg.png` | src/components/kudos/SpotlightBoard.tsx
- [x] T045 [US8] Wire Spotlight into page layout: B.6 header (subtitle "Sun* Annual Awards 2025" Montserrat 24px/700 white → 1px divider → "SPOTLIGHT BOARD" Montserrat 57px/700/#FFEA9E lh:64px ls:-0.25px) + `SpotlightBoard` between HighlightKudos and AllKudosFeed sections | src/app/[locale]/(protected)/sun-kudos/page.tsx

- [ ] T056 [US8] Create `SpotlightUserPopover` Client Component — shown on hover over any sunner name in the word cloud (FR-015). Layout: (1) full name in large white text + "View profile" link (navigates to profile page); (2) department name + hero badge `<Image>` 109×19px (reuse same asset as KudoCard row 3); (3) `1px` horizontal divider; (4) "Kudos đã nhận:" label + received count; (5) "Kudos đã gửi:" label + sent count; (6) "Send KUDO" gold button — onClick opens Viết Kudo form with recipient pre-filled. Popover closes on mouse-leave. Requires fetching per-user stats (received + sent counts) on hover — add `fetchUserSpotlightStats(userId)` to `kudos-service.ts` and API route `GET /api/users/:id/spotlight-stats`. Wire into `SpotlightWordCloud`: wrap each name with `onMouseEnter`/`onMouseLeave` handlers that show/hide this popover | src/components/kudos/SpotlightUserPopover.tsx, src/services/kudos-service.ts, src/app/api/users/[id]/spotlight-stats/route.ts

**Note**: Hover popover over sunner name — **fully specified in FR-015 and US8 scenarios 7–10**. Implement via T056.

**Checkpoint**: User Story 8 complete — spotlight word cloud renders với animated bg, in-canvas controls, bottom-left feed, zoom map, hover popover

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, loading states, error handling, accessibility

- [x] T046 [P] Implement responsive layout for full page: Desktop (>=1280px) feed + sidebar side-by-side; Tablet (768-1279px) sidebar moves below feed; Mobile (<768px) single column, carousel scrolls horizontally. Test at 375px, 768px, 1024px, 1440px | src/app/[locale]/(protected)/sun-kudos/page.tsx
- [x] T047 [P] Add loading skeletons for: feed cards (3 placeholder cards), highlight carousel (1 placeholder card), sidebar stats (5 shimmer rows), spotlight board (shimmer rectangle) | src/components/kudos/
- [x] T048 [P] Add error handling: heart API failure → error toast + revert; stats API failure → show "--" for values; feed API failure → retry button; empty feed → "Write the first kudo!" prompt with link to write bar | src/components/kudos/
- [x] T049 [P] Accessibility pass: aria-labels on all interactive elements, focus management for carousel (keyboard left/right arrow navigation), `role="region"` on major sections, `aria-live="polite"` on heart count updates, all buttons meet 44x44px min touch target | src/components/kudos/
- [x] T050 Run build to verify no compilation errors and visually verify page at all 4 breakpoints
- [ ] T055 [P] Verify `<WidgetButton />` renders correctly on `/sun-kudos` — injected by `(main)/layout.tsx`, visible at all scroll positions fixed bottom-right | `src/app/[locale]/(protected)/(main)/sun-kudos/page.tsx`

**Checkpoint**: All user stories complete with polish

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────────────┐
    ↓                                                                 │
Phase 2 (Foundation) ── BLOCKS ALL UI ──────────────────────────────│
    ↓                                                                 │
Phase 3 (US5 - Write bar) ── gets page visible ─────────────────────│
    ↓                                                                 │
Phase 4 (US1 - Feed) ──┬── Phase 5 (US2 - Heart) ─── Phase 7 (US7 - Copy) │
    ↓                   │                                             │
Phase 6 (US3+4 - Highlight + Filters) ─── depends on KudoCard pattern│
    ↓                                                                 │
Phase 8 (US6 - Sidebar) ── independent, can parallel with Phase 6 ──│
    ↓                                                                 │
Phase 9 (US8 - Spotlight) ── independent, can parallel with Phase 6-8│
    ↓                                                                 │
Phase 10 (Polish) ── after all stories complete ─────────────────────┘
```

### Within Each User Story

- Types/services before UI components
- Server Components before Client Components
- Base components before composite containers
- Wire into page as final task per story

### Parallel Opportunities

**Phase 1**: T004, T005, T006 can all run in parallel (types, vi.json, en.json)
**Phase 2**: T011, T012, T013 (independent service functions) + T014-T018 (API routes) after T008-T010
**Phase 4+5**: After Phase 4 creates `KudoCard`, US2 (heart) can start immediately
**Phase 6+8+9**: US3/4 (highlights), US6 (sidebar), US8 (spotlight) can all run in parallel once Phase 4 is done
**Phase 7**: US7 (copy link) is a small addition to `KudoCardActions` — can run anytime after Phase 5

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US5 - Write bar) → page is visible
3. Complete Phase 4 (US1 - Feed) → core value delivered
4. **STOP and VALIDATE**: Test feed rendering, pagination, anonymous kudos handling
5. Deploy MVP if ready

### Incremental Delivery

1. Setup + Foundation → page shell
2. US5 (Write bar) → visual anchor
3. US1 (Feed) + US2 (Heart) + US7 (Copy link) → core kudo interactions
4. US3+US4 (Highlights + Filters) → discovery feature
5. US6 (Sidebar) → personal stats
6. US8 (Spotlight) → word cloud (can defer if complex)
7. Polish → responsive, loading, errors, a11y

---

## Notes

- Header component reuse: verify `Header.tsx` accepts an `activeLink` prop to highlight "Sun* Kudos". If not, extend it in Phase 2/T019
- Anonymous kudos handling is critical in `KudoCard` (T024) — must check `is_anonymous` and display `anonymous_name` instead of sender profile
- Viet Kudo form, Dropdown Hashtag filter, Dropdown Phong ban, and Open Secret Box modal are separate specs — only wire trigger points (onClick handlers) in this task list
- The Spotlight board (Phase 9) is the highest-risk item. If d3-cloud proves too complex, fall back to a styled CSS grid with font-size variation
- All navigation URLs from SCREENFLOW.md: page route is `/[locale]/sun-kudos`
- Commit after each phase or logical group of tasks
- Run build before marking each phase complete
- Mark tasks complete as you go: `[x]`
