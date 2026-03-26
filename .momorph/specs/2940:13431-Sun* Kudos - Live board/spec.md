# Feature Specification: Sun* Kudos - Live board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft
**Version**: v9.0
**Last synced**: 2026-03-20

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v9.0 | 2026-03-20 | Structural | Requirement change: Highlight Kudos section — (1) clear filter button "Xoá bộ lọc" added (FR-017, US4 scenario 4 replaced); (2) filter buttons show selected option name (FR-016, US4 scenarios 2 & 3 updated); (3) Highlight card content line-clamp-3 (FR-003 updated, US3 scenario 6 added); (4) carousel min-height on loading (FR-018, US4 scenario 5 added). |
| v8.1 | 2026-03-19 | Cosmetic | Requirement change: Carousel seamless infinite loop — slide 5 pre-positioned left of slide 1 (clone-based), no visual jump. Clarified US3 scenarios 3 & 4. |
| v8.0 | 2026-03-19 | Structural | Requirement change: Highlight Kudos carousel is now circular/infinite loop — nav buttons never disabled; left from card 1 wraps to card 5, right from card 5 wraps to card 1. Updated: US3 scenarios 3 & 4 & 5, SC-003. |
| v7.4 | 2026-03-19 | Structural | Requirement change: SpotlightWordCloud user popover fully specified (6 rows: full name, dept + hero badge, divider, kudos received, kudos sent, Send KUDO button). Updated: US8 scenario 7, FR-015 added, Screen Components B.7, Visual Requirements. |
| v7.3 | 2026-03-19 | Cosmetic | Requirement change: (1) Canvas height 548→688px; (2) SpotlightRecentFeed fixed 330×136px + overflow-hidden; (3) feed text only recipient name bold, no fade. Updated: US8 AC4, Screen Components table, Visual Requirements, FR-010. |
| v7.2 | 2026-03-19 | Cosmetic | Requirement change: B.7 Spotlight canvas width changed from fixed 1157px to fluid 100%. Height stays 548px. Updated: Screen Components table, Visual Requirements. |
| v7.1 | 2026-03-19 | Cosmetic | Requirement change: Row 3 clarifications — department shows name (not ID); dot text-sm; hero badge 109×19px. Updated: US1 scenario 2, FR-001, Visual Requirements. |
| v7.0 | 2026-03-19 | Structural | Requirement change: sender/recipient column — explicit 3-row layout (avatar / name / dept+dot+hero badge); anonymous sender shows "Người dùng ẩn danh / Anonymous User" gray text, no row 3. Updated: US1 scenario 2, FR-001, Visual Requirements, Notes. |
| v6.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added as shared component injected via (main)/layout.tsx. Updated: Screen Components table, Visual Requirements, FR section, Navigation Flow. |
| v5.0 | 2026-03-18 | Structural | Figma sync: All Kudos kudo card. Updated US1 scenario 2 (full card structure), FR-001 (card fields). Added C.3 to Screen Components. Updated Visual Requirements for kudo card. |
| v4.0 | 2026-03-18 | Structural | Requirement change: (1) write bar cursor pointer (FR-012, US5 scenario 3); (2) post-submit refresh AllKudosFeed + SpotlightBoard + sidebar stats (FR-013, US5 scenario 2 expanded). |
| v3.2 | 2026-03-18 | Cosmetic | Requirement change: zoom max updated from 200% (2.0) to 500% (5.0). Updated FR-011. |
| v3.1 | 2026-03-18 | Cosmetic | Version bump only (animation float 2D — visual change, no spec flow change). |
| v3.0 | 2026-03-18 | Structural | SpotlightBoard (US8): cập nhật acceptance scenarios — background image (blend-mode screen), zoom min=100% step=50%, drag-to-pan khi zoom>100%, stars fixed layer, tên sunner 9px/400/#ff6b35, search result count, frame border-radius 47px, search bar pill style. Cập nhật FR-011, FR-012. |
| v2.0 | 2026-03-18 | Structural | SpotlightBoard (US8, FR-010, FR-011): cập nhật acceptance scenarios (animated bg, search in-canvas, "388 KUDOS" in-canvas top-center, name oscillation, bottom-left 7-kudos feed, bottom-right zoom controls, fullscreen, hover defer). Thêm FR-011. Cập nhật Screen Components table và Visual Requirements. |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |

---

## Overview

The Sun* Kudos live board — the main kudo feed page. Shows a real-time feed of all kudos sent by employees during the SAA 2025 event. Features: a keyvisual with write-kudo input bar, a "Highlight Kudos" carousel (top 5 by hearts), a Spotlight board (word-cloud of recipient names), an "All Kudos" paginated feed, and a right sidebar with personal stats and the "Mở quà" (Open Secret Box) button. Supports filtering by hashtag and department.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View kudo feed (Priority: P1)

An authenticated user views all kudos on the live board.

**Why this priority**: Core feature of the Kudos system — the live board is the main destination for kudo activity.

**Independent Test**: Navigate to Sun* Kudos page, verify the feed loads with kudo cards showing sender, recipient, content, hashtags, and heart count.

**Acceptance Scenarios**:

1. **Given** the user is on the Sun* Kudos page, **When** it loads, **Then** the "All Kudos" feed shows kudo cards ordered by most recent first.
2. **Given** each kudo card, **When** rendered, **Then** it shows: (a) sender info column (row 1: avatar 64px; row 2: name; row 3: department name + gray dot `·` (text-sm) + hero badge image (109×19px) — or "Người dùng ẩn danh / Anonymous User" gray text-sm if anonymous, no row 3) — send icon — recipient info column (same 3-row structure); (b) timestamp `HH:MM - MM/DD/YYYY`; (c) kudo title badge (D.4) with pencil icon; (d) content text in gold-bordered box (max 5 lines + ellipsis); (e) image gallery (up to 5 images, if any); (f) hashtag chips; (g) heart count + Copy Link button.
3. **Given** a kudo card, **When** the user clicks the sender/recipient avatar or name, **Then** they are navigated to that user's profile page.

---

### User Story 2 - Heart (like) a kudo (Priority: P1)

A user can like a kudo to boost it.

**Acceptance Scenarios**:

1. **Given** a kudo card with heart button (inactive/gray), **When** the user clicks the heart, **Then** the heart turns red and the count increments by 1.
2. **Given** a kudo the user already liked (heart red), **When** they click the heart again, **Then** the heart returns to gray and the count decrements by 1 (toggle).
3. **Given** a heart click, **When** the API call fails, **Then** show an error toast and revert the optimistic update.

---

### User Story 3 - Highlight Kudos carousel (Priority: P1)

A user can view the top 5 most-hearted kudos in a carousel.

**Acceptance Scenarios**:

1. **Given** the Highlight Kudos section, **When** it loads, **Then** 5 kudo cards are shown in a carousel ordered by heart count (most hearts first).
2. **Given** the carousel, **When** the user clicks the next (>) button, **Then** the carousel advances to the next card.
3. **Given** the carousel is at the first card, **When** the user clicks the back (<) button, **Then** the carousel slides leftward seamlessly to card 5 — card 5 is pre-positioned directly to the left of card 1 in the DOM so the transition is continuous with no visual jump.
4. **Given** the carousel is at the last card (card 5), **When** the user clicks the next (>) button, **Then** the carousel slides rightward seamlessly to card 1 — card 1 is pre-positioned directly to the right of card 5 in the DOM so the transition is continuous with no visual jump.
5. **Given** the carousel, **When** rendered at any position, **Then** both the back (<) and next (>) buttons are always enabled (never disabled).
6. **Given** a Highlight Kudos card whose content exceeds 3 lines, **When** rendered in the carousel, **Then** only 3 lines are visible: 2 full content lines followed by `...` truncation on the 3rd line (CSS `line-clamp-3`).

---

### User Story 4 - Filter feed by hashtag or department (Priority: P1)

A user can filter the Highlight Kudos section by hashtag or department.

**Acceptance Scenarios**:

1. **Given** the Highlight Kudos header with filter buttons, **When** the user clicks "Hashtag", **Then** the Dropdown Hashtag filter opens.
2. **Given** a hashtag is selected, **When** the dropdown closes, **Then** the Highlight Kudos carousel updates to show only kudos with that hashtag, and the "Hashtag" button label changes to the selected hashtag's display name.
3. **Given** the user clicks "Phòng ban", **When** a department is selected, **Then** the feed updates to show kudos for recipients in that department, and the "Phòng ban" button label changes to the selected department's name.
4. **Given** at least one filter is active, **When** the user clicks the "Xoá bộ lọc" (Clear filters) button, **Then** all active filters are cleared, the Highlight Kudos feed returns to the unfiltered view, and all filter button labels reset to their defaults ("Hashtag", "Phòng ban").
5. **Given** the user selects a filter, **When** the Highlight Kudos section is fetching filtered data, **Then** the carousel container maintains its current height — no layout shift or collapse occurs during loading.

---

### User Story 5 - Write a kudo from live board (Priority: P1)

A user can start writing a kudo from the write-kudos input bar.

**Acceptance Scenarios**:

1. **Given** the keyvisual section with the write-kudos pill input bar, **When** the user clicks it, **Then** the Viết Kudo form opens (full-page modal).
2. **Given** the Viết Kudo form is submitted successfully, **When** the user returns to the live board, **Then**: (a) the new kudo appears at the top of the All Kudos feed; (b) the Spotlight board name/count data is refreshed; (c) the sidebar personal stats (kudos sent) are refreshed.
3. **Given** the write-kudos input bar, **When** the user hovers over it, **Then** the cursor changes to `pointer` (tương đương button).

---

### User Story 6 - Open Secret Box (Priority: P2)

An authenticated user can open their secret box to reveal a badge.

**Acceptance Scenarios**:

1. **Given** the user has unopened secret boxes (`unopened_count > 0`), **When** they click "Mở quà" in the sidebar, **Then** the "Open secret box- chưa mở" modal opens.
2. **Given** the modal is open, **When** the user clicks the box image, **Then** a random badge is revealed based on probability table.
3. **Given** the user has 0 unopened boxes, **When** the sidebar renders, **Then** "Mở quà" is disabled and/or shows count "00".

---

### User Story 7 - Copy kudo link (Priority: P2)

A user can share a kudo's direct URL.

**Acceptance Scenarios**:

1. **Given** a kudo card with "Copy Link" button, **When** the user clicks it, **Then** the kudo URL is copied to clipboard and a toast appears: "Link copied — ready to share!".

---

### User Story 8 - Spotlight board (Priority: P2)

A user can explore the interactive Spotlight board showing recipient names as a word cloud with zoom, search, and live kudos feed.

**Acceptance Scenarios**:

1. **Given** the Spotlight board loads, **When** rendered, **Then** the canvas shows: animated star/constellation background (continuously moving), recipient names scattered as word cloud (size proportional to kudos count, generally small), total kudos count "388 KUDOS" centered at top-inside the canvas.
2. **Given** the Spotlight board, **When** rendered, **Then** each sunner name continuously oscillates left-right (small amplitude) around its fixed position.
3. **Given** the search input (inside canvas, top-left), **When** the user types a sunner name, **Then** the matching name is highlighted in the word cloud.
4. **Given** the bottom-left area of the canvas, **When** rendered, **Then** a live feed shows the 7 most recent kudos in format `HH:MMam/pm [Tên] đã nhận được một Kudos mới`, only the recipient **name** is bold; no fading of older entries. The feed is fixed at ~330×136px with `overflow: hidden` to prevent overlapping `SpotlightWordCloud` when zoomed.
5. **Given** the zoom controls (bottom-right of canvas), **When** the user clicks zoom-in or zoom-out, **Then** the entire map scales: background grows/shrinks, distances between sunner names expand/contract proportionally. Current zoom ratio is displayed (e.g. `100%`).
6. **Given** the fullscreen button (bottom-right), **When** clicked, **Then** the Spotlight board expands to fullscreen.
7. **Given** hovering over a sunner name in the word cloud, **When** hovered, **Then** a popover card is shown anchored near the name with the following structure:
   - **Row 1 — Full name**: The sunner's full name displayed in large, prominent white text with a link/underline style (e.g., "Như Thu Quyên"). A secondary "View profile for [Full Name]" link appears at the top of the popover, navigating to that user's profile page.
   - **Row 2 — Department + hero badge**: The sunner's department name followed by their hero badge image (same `109×19px` hero badge image as used in the kudo card sender/recipient columns — see US1 scenario 2 and FR-001 for hero badge spec).
   - **Row 3 — Divider**: A horizontal `1px` divider line separating identity info from stats.
   - **Row 4 — Kudos received**: Label (e.g., "Kudos đã nhận:") followed by the count number (e.g., `9`).
   - **Row 5 — Kudos sent**: Label (e.g., "Kudos đã gửi:") followed by the count number (e.g., `12`).
   - **Row 6 — Send KUDO button**: A "Send KUDO" CTA button. Clicking it opens the Viết Kudo form (same form as the write bar — see US5) with the **recipient field pre-filled** with this sunner's name/user.
8. **Given** a sunner name popover is open, **When** the user moves the cursor away from the name or the popover, **Then** the popover closes.
9. **Given** a sunner name popover is open, **When** the user clicks "View profile for [Full Name]", **Then** they are navigated to that sunner's profile page.
10. **Given** a sunner name popover is open and the user clicks "Send KUDO", **When** the Viết Kudo form opens, **Then** the recipient input field is pre-filled with the hovered sunner's identity (name + avatar shown as a selected recipient chip).

---

### Edge Cases

- What if there are no kudos? → Show empty state with prompt to write the first kudo.
- What if heart API fails? → Show error toast, revert optimistic update.
- What if the sidebar stats API fails? → Show "–" for stat values.
- What if the carousel has fewer than 5 Highlight Kudos? → Show available cards, disable nav when at edges.
- What if a kudo content exceeds 5 lines (All Kudos feed)? → Truncate with "..." ellipsis (FR-001).
- What if a Highlight Kudos card content exceeds 3 lines? → Truncate at 3 lines with `...` (line-clamp-3, FR-003).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Header | `2940:13433` | Sticky nav, "Sun* Kudos" active | Navigation |
| A: Keyvisual | `2940:13432` | Hero banner (512px) with BG + gradient | Static |
| A.1: Write bar | `2940:13449` | Pill input "Hôm nay, bạn muốn gửi..." | Click → Viết Kudo |
| B: Highlight | `2940:13451` | HIGHLIGHT KUDOS section | Carousel, filters |
| B.1: Header | `2940:13452` | Subtitle + "HIGHLIGHT KUDOS" + filter chips | Opens filter dropdowns |
| B.2: Carousel | `2940:13461` | 5 kudo cards carousel | Prev/Next navigation |
| B.5: Pagination | `2940:13471` | "2/5" + arrows | Click prev/next |
| B.6: Spotlight header | `2940:13476` | "SPOTLIGHT BOARD" heading | Static |
| B.7: Spotlight | `2940:14174` | Word cloud canvas (full-width × 688px) với animated star bg, search top-left (inside), "388 KUDOS" top-center (inside), name oscillation, bottom-left 7-kudos feed (330×136px fixed), bottom-right zoom controls. Hover over any name → user popover (name, dept+badge, divider, kudos received/sent, Send KUDO button) | Search/Zoom/Fullscreen/Hover popover |
| C.1: All Kudos header | `2940:14221` | "ALL KUDOS" heading | Static |
| C.2: Feed | `2940:13482` | Paginated kudo cards list | Infinite scroll / pagination |
| C.3: Kudo Post | `3127:21871` | Individual kudo card: cream bg, sender/recipient columns, title badge, content box, image gallery, hashtags, actions | Heart toggle, Copy Link, click avatar/name → profile |
| D.1: Stats sidebar | `2940:13489` | 5 stat rows + "Mở quà" button | Click "Mở quà" → modal |
| D.3: 10 Sunner | `2940:13510` | "10 SUNNER NHẬN QUÀ MỚI NHẤT" list | Click → profile |
| Footer | `2940:13522` | Logo + links + copyright | Navigation |
| Widget Button | — | Fixed FAB bottom-right: pencil + SAA icon (shared `src/components/ui/WidgetButton.tsx`) | Click → dropdown quick-action menu (spec TBD) |

> See `design-style.md` for visual specifications (colors, typography, dimensions).

### Navigation Flow

- **From**: Homepage SAA ("ABOUT KUDOS" button or "Sun* Kudos" nav link)
- **To (Write)**: Viết Kudo form overlay
- **To (Avatar/Name)**: User profile page
- **To (Hashtag filter)**: Dropdown Hashtag filter overlay
- **To (Phòng ban filter)**: Dropdown Phòng ban overlay
- **To (Mở quà)**: Open secret box- chưa mở modal

### Visual Requirements

- Page bg: `#00101A`.
- Header active link: "Sun* Kudos" gold + underline.
- Write bar: pill shape, pencil icon left, full content width.
- Highlight Kudos: dark section with carousel + prev/next circle buttons.
- Kudo card (C.3): `rgba(255,248,225,1)` cream background, `border-radius: 24px`, `padding: 40px 40px 16px 40px`. Sender and recipient each displayed as a COLUMN: row 1 avatar 64px top-center, row 2 name, row 3 department name + gray dot `·` separator (text-sm) + hero badge image (109×19px fixed). If sender is anonymous: omit row 3, show "Người dùng ẩn danh / Anonymous User" text-sm gray instead. Title badge (D.4) with pencil icon above content. Content in gold-bordered box (`border: 1px solid #FFEA9E`, `bg: rgba(255,234,158,0.40)`). Image gallery up to 5 images. Timestamp format `HH:MM - MM/DD/YYYY`. Heart count `24px/700` dark, Copy Link text button.
- Spotlight: full-width × `688px` canvas with `1px #998C5F` border (width is fluid — fills parent container). Animated star/constellation background inside canvas. "388 KUDOS" top-center inside canvas. Search bar top-left inside canvas. Names oscillate. Bottom-left: 7 recent kudos feed (fixed 330×136px, overflow hidden, only recipient name bold). Bottom-right: zoom-in/out icons + zoom ratio + fullscreen button.
- SpotlightWordCloud user popover: anchored near the hovered name. Dark background card with rounded corners. Row 1: full name in large white text with underline/link style + "View profile for [Name]" link at top. Row 2: department name + hero badge image (`109×19px` — same asset as kudo card row 3). Row 3: `1px` horizontal divider. Row 4: "Kudos đã nhận:" label + count. Row 5: "Kudos đã gửi:" label + count. Row 6: "Send KUDO" button (gold fill, opens Viết Kudo form with recipient pre-filled). Popover dismisses on mouse-leave.
- Sidebar stat values: `#FFEA9E` bold.
- "Mở quà" button: gold fill.
- Widget button: fixed at bottom-right (`bottom: 32px, right: 32px`), gold pill `105×64px`, `z-40`. Shared component — injected via `(main)/layout.tsx`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Feed MUST display kudos from `public.kudos` ordered by `created_at DESC`. Each kudo card MUST show: title (D.4 badge), sender/recipient info (3-row column layout: row 1 avatar 64px, row 2 name, row 3 department name + gray dot `·` (text-sm) + hero badge image (109×19px); if sender is anonymous: omit row 3 and show "Người dùng ẩn danh / Anonymous User" in text-sm gray), timestamp (`HH:MM - MM/DD/YYYY`), content in gold-bordered box (max 5 lines), image gallery (up to 5 images, if any), hashtag chips (single row, excess hidden with trailing "..."), heart count, Copy Link.
- **FR-002**: Heart button MUST toggle like/unlike and update `kudos.hearts_count` via API.
- **FR-003**: Highlight Kudos MUST show top 5 kudos by heart count. Content area of each Highlight Kudos card MUST be clamped to a maximum of 3 lines (`line-clamp-3`): if content exceeds 3 lines, display 2 full lines followed by `...` ellipsis on the 3rd line.
- **FR-004**: Feed MUST support filtering by `hashtag_id` via Dropdown Hashtag filter.
- **FR-005**: Feed MUST support filtering by `department_id` via Dropdown Phòng ban filter.
- **FR-006**: The write bar MUST open the Viết Kudo form on click.
- **FR-007**: Copy Link MUST copy the kudo's canonical URL to clipboard.
- **FR-008**: Sidebar stats MUST show the authenticated user's personal stats (received kudos, sent kudos, hearts, boxes opened, boxes remaining).
- **FR-009**: "Mở quà" MUST open the Secret Box modal if `unopened_count > 0`.
- **FR-010**: Spotlight board MUST show recipient names as word cloud (size proportional to kudos count) with: animated star background, "388 KUDOS" count top-center inside canvas, search bar top-left inside canvas, each name oscillating horizontally, bottom-left live feed of 7 newest kudos (fixed 330×136px, overflow hidden, only recipient name bold — no fading), bottom-right zoom controls (in/out/ratio/fullscreen).
- **FR-011**: Spotlight zoom MUST scale the entire map cloud — background grows and inter-name spacing expands proportionally to zoom level. Zoom range: **min 100% (1.0)**, **max 500% (5.0)**, step ±50% per click.
- **FR-012**: The write-kudos bar MUST display `cursor: pointer` on hover (behaves equivalent to a button).
- **FR-014**: The WidgetButton FAB MUST be visible at all scroll positions (fixed bottom-right). Provided by shared component `src/components/ui/WidgetButton.tsx` via `(main)/layout.tsx`.
- **FR-013**: After a kudo is successfully submitted via the Viết Kudo form, the following sections MUST refresh their data without a full page reload: (a) All Kudos feed; (b) Spotlight board (name counts); (c) sidebar personal stats (kudos sent).
- **FR-016**: Filter trigger buttons ("Hashtag", "Phòng ban") in the Highlight Kudos header MUST update their label to the selected option's display name when a filter is active (e.g. button shows `#celebrate` after selecting the #celebrate hashtag; button shows `Engineering` after selecting the Engineering department). The label resets to the default when the filter is cleared.
- **FR-017**: A "Xoá bộ lọc" (Clear filters) button MUST appear in the Highlight Kudos header, positioned after the two filter buttons, whenever at least one filter is active. Clicking it clears all active filters simultaneously and resets both filter button labels to their defaults. The button is hidden when no filters are active.
- **FR-018**: The Highlight Kudos carousel section MUST maintain a fixed `min-height` matching its loaded state height during filter-triggered loading to prevent layout shift (UI jitter).
- **FR-015**: Hovering over a sunner name in the SpotlightWordCloud MUST show a popover card with the following rows in order: (1) user's full name in large prominent text (link style) + "View profile for [Name]" link navigating to their profile page; (2) department name + hero badge image (109×19px, same asset as kudo card row 3); (3) 1px horizontal divider; (4) kudos received label + count; (5) kudos sent label + count; (6) "Send KUDO" button that opens the Viết Kudo form with the recipient field pre-filled with this user. The popover MUST close when the cursor leaves the name or the popover.

### Technical Requirements

- **TR-001**: Server Component for initial feed render (SSR for SEO).
- **TR-002**: Client Component for real-time heart updates (optimistic UI).
- **TR-003**: Infinite scroll or pagination for All Kudos feed.
- **TR-004**: Filter state stored in URL query params (`?hashtag=id&dept=id`) for shareability.
- **TR-005**: Sidebar stats fetched from authenticated user's profile + kudos counts.
- **TR-006**: Spotlight board uses D3.js or similar for word cloud rendering.
- **TR-007**: Page route: `/[locale]/sun-kudos`.

### Key Entities

- **Kudo**: `{ id, sender_id, recipient_id, content, is_anonymous, anonymous_name, created_at, hearts_count }`
- **KudoHashtag**: `{ kudo_id, hashtag_id }`
- **KudoImage**: `{ kudo_id, url, order_index }`
- **KudoHeart**: `{ kudo_id, user_id }` (junction for deduplication)
- **SecretBox**: `{ user_id, unopened_count, opened_count }`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/kudos` | GET | Fetch feed (with ?hashtag=&dept=&page=) | Predicted |
| `GET /api/kudos/highlights` | GET | Fetch top 5 kudos by hearts | Predicted |
| `POST /api/kudos/:id/heart` | POST | Toggle heart on a kudo | Predicted |
| `GET /api/kudos/spotlight` | GET | Fetch recipient names for Spotlight | Predicted |
| `GET /api/users/me/stats` | GET | Fetch current user's kudo stats | Predicted |
| `GET /api/hashtags` | GET | Hashtags for filter dropdown | Predicted |
| `GET /api/departments` | GET | Departments for filter dropdown | Predicted |

---

## Success Criteria

- **SC-001**: Kudo feed loads within 2 seconds for the first 20 kudos.
- **SC-002**: Heart toggle updates visually within 100ms (optimistic UI).
- **SC-003**: Highlight Kudos carousel navigates smoothly between all 5 cards with circular wrap-around (no disabled state on nav buttons).
- **SC-004**: Filter by hashtag/department updates the feed within 500ms.
- **SC-005**: Copy Link copies the correct URL and shows toast confirmation.

---

## Out of Scope

- Editing or deleting kudos.
- Commenting on kudos.
- Notification panel (separate component).

---

## Dependencies

- [x] `public.kudos`, `public.kudo_hashtags`, `public.kudo_images` tables exist
- [x] `public.hashtags`, `public.departments` tables exist
- [ ] Viết Kudo spec: `520:11602-Viết Kudo/spec.md`
- [ ] Open secret box spec: `1466:7676-Open secret box- chưa mở/spec.md`
- [ ] Dropdown Hashtag filter spec: `721:5580-Dropdown Hashtag filter/spec.md`
- [ ] Dropdown Phòng ban spec: `721:5684-Dropdown Phòng ban/spec.md`

---

## Notes

- The page is 1440px wide and 5862px tall — requires significant scrolling.
- "Highlight Kudos" are the top-5 by `hearts_count` across all kudos during the event lifetime.
- Anonymous kudos: sender column shows no row 3 (no dept/badge). Replace row 3 with "Người dùng ẩn danh / Anonymous User" in text-sm gray. Recipient column always shows full 3-row layout.
- "10 SUNNER NHẬN QUÀ MỚI NHẤT" in the sidebar shows the 10 most recent Secret Box openers.
- The Spotlight board is a word cloud — recipient names with more kudos appear larger.
