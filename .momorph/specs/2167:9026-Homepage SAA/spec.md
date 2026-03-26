# Feature Specification: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft
**Version**: v3.1
**Last synced**: 2026-03-26

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v3.1 | 2026-03-26 | Cosmetic | Requirement change: On countdown expiry, hide entire countdown block (not just "Coming soon") — only QR button shown. Removed "Coming soon" as separate concept. Updated: FR-003, US3 AC3+AC4, Edge Cases, Screen Components B1/B1.2/B3.1. |
| v3.0 | 2026-03-20 | Structural | Requirement change: Added QR button in countdown block (post-expiry), new US6 for /ticket page, FR-010–FR-012, TR-007, updated Screen Components, Navigation Flow, Edge Cases, Dependencies. |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton moved to shared component injected via (main)/layout.tsx. Updated: Screen Components table, Visual Requirements, FR section, Navigation Flow. |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |

---

## Overview

The main landing page of Sun* Annual Awards 2025 (SAA). Serves as the entry point for all authenticated users. Displays a hero keyvisual with countdown, award system preview cards, a Sun* Kudos promo block, and a sticky navigation header. Features a floating widget button for quick actions (write kudo).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate the homepage (Priority: P1)

An authenticated user views the homepage and navigates to key sections.

**Why this priority**: Entry point for all users — must render correctly and navigation must work.

**Independent Test**: Visit the homepage, verify the hero keyvisual loads with countdown, awards section shows 6 category cards, footer is present, and all nav links work.

**Acceptance Scenarios**:

1. **Given** the user is on the homepage and the event has not started, **When** the page loads, **Then** the hero section displays "ROOT FURTHER", the countdown timer, event info (18h30, Nhà hát nghệ thuật quân đội), and two CTA buttons (ABOUT AWARDS, ABOUT KUDOS).
2. **Given** the user clicks a nav link, **When** it is "Awards Information", **Then** the user is navigated to the Hệ thống giải page.
3. **Given** the user clicks "Sun* Kudos" in nav, **When** clicked, **Then** the user navigates to the Sun* Kudos - Live board page.

---

### User Story 2 - View award category cards (Priority: P1)

A user can see and navigate to each award category.

**Acceptance Scenarios**:

1. **Given** the award section is visible, **When** the page loads, **Then** 6 award cards are displayed: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.
2. **Given** an award card is visible, **When** the user clicks the card image, title, or "Chi tiết" link, **Then** the user is taken to the Awards Information page anchored to that award section (using URL hash).
3. **Given** an award card, **When** hovered, **Then** a subtle lift and gold border glow effect appears.

---

### User Story 3 - Countdown timer (Priority: P1)

The hero section shows a real-time countdown to the event.

**Acceptance Scenarios**:

1. **Given** the event has not started, **When** the page loads, **Then** the countdown shows DAYS, HOURS, MINUTES with zero-padded 2-digit values.
2. **Given** the countdown is running, **When** time passes, **Then** the values update automatically (per minute).
3. **Given** the event start time is reached, **When** the countdown hits 0, **Then** the entire countdown block is hidden and only the "Lấy mã QR" button is shown.
4. **Given** the countdown has expired, **When** the user sees the hero section, **Then** the countdown block is hidden and only a "Lấy mã QR" button is displayed (gold fill, same style as "ABOUT AWARDS") in its place; clicking it navigates to `/ticket`.

---

### User Story 6 - View personal QR code ticket (Priority: P1)

An authenticated employee views their personal QR code to use for event check-in.

**Why this priority**: Required for physical event check-in — each employee must be able to show their QR on the day of the event.

**Independent Test**: After countdown expires, click "Lấy mã QR" → navigate to `/ticket`, see a unique QR code (240×240) centered on a black background. The QR code data encodes the user's unique `id`.

**Acceptance Scenarios**:

1. **Given** the user clicks "Lấy mã QR", **When** they land on `/ticket`, **Then** the page shows a black full-screen background with a white QR code (240×240px) centered on screen.
2. **Given** the user is on `/ticket`, **When** the QR code renders, **Then** the encoded value is the user's unique `id` (UUID from auth).
3. **Given** different employees visit `/ticket`, **When** each views their QR code, **Then** each QR code is unique (encodes their own `id`).

---

### User Story 4 - Floating widget button (Priority: P2)

A user can quickly access write-kudo action from any scroll position.

**Acceptance Scenarios**:

1. **Given** the user is scrolled down on the homepage, **When** they see the floating widget button (bottom right), **Then** the button is always visible over the page content.
2. **Given** the user clicks the widget button, **When** clicked, **Then** a quick-action menu opens with relevant options (e.g., write kudo).

---

### User Story 5 - Header navigation (Priority: P1)

> See shared component spec: [`shared/A1-Header/spec.md`](../shared/A1-Header/spec.md)

On this page, "About SAA 2025" is the active nav link (gold text + underline).

---

### Edge Cases

- What if the countdown target datetime is in the past? → Hide the entire countdown block; show only the "Lấy mã QR" button.
- What if an award image fails to load? → Show placeholder/skeleton.
- What if the user is not authenticated? → Avatar shows login button, bell may be hidden.
- What if the page is slow to load? → Show loading skeleton for award cards.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A1: Header | `2167:9091` | Fixed nav: logo, 3 links, bell, lang, avatar — see [shared/A1-Header/spec.md](../shared/A1-Header/spec.md) | Navigation, dropdowns |
| B: Keyvisual | `2167:9027` | Hero section: BG image + gradient + content | Static visual |
| B1: Countdown | `2167:9035` | Days/Hours/Minutes countdown | Auto-updates per minute; entire block hidden when countdown = 0 |
| B2: Event info | `2167:9053` | Time: 18h30, Venue: Nhà hát nghệ thuật quân đội | Static |
| B3: CTA Buttons | `2167:9062` | ABOUT AWARDS + ABOUT KUDOS | Navigate to respective pages |
| B3.1: QR Button | — | "Lấy mã QR" button — hidden until countdown = 0; replaces countdown block entirely when expired; gold fill (same style as ABOUT AWARDS) | Click → `/ticket` |
| B4: Root Further | `5001:14827` | Description paragraph | Static |
| C1: Awards Header | `2167:9069` | "Hệ thống giải thưởng" section title | Static |
| C2: Award List | `5005:14974` | 6 award cards grid | Click → Awards Info page w/ hash |
| D1: Sun* Kudos | `3390:10349` | Kudos promo block | "Chi tiết" → Kudos page |
| 6: Widget Button | `5022:15169` | Fixed FAB: pencil + SAA icon (shared `src/components/ui/WidgetButton.tsx`) | Click → dropdown quick-action menu (spec TBD) |
| 7: Footer | `5001:14800` | Logo + nav links + copyright | Navigation |

> See `design-style.md` for visual specifications (colors, typography, dimensions).

### Navigation Flow

- **From**: Direct URL (`/`) or logo click
- **To (ABOUT AWARDS)**: Hệ thống giải page
- **To (ABOUT KUDOS)**: Sun* Kudos - Live board page
- **To (Award Chi tiết)**: Awards Information page + hash anchor
- **To (Avatar)**: Dropdown-profile overlay
- **To (Lang)**: Dropdown-ngôn ngữ overlay
- **To (Widget)**: Quick-action dropdown (spec TBD)
- **To (QR Button)**: `/ticket` — personal QR code page

### Visual Requirements

- Page background: `#00101A` (deep dark navy).
- Hero: full-width cover image + bottom gradient fade to page bg.
- Header: semi-transparent dark `rgba(16,20,23,0.8)`, blurs background content behind it.
- Active nav link: gold text + underline.
- Award cards: square image with gold border + radial glow, hover lift effect.
- Widget button: fixed at bottom-right, gold pill shape (`105×64px`).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The countdown MUST display remaining DAYS, HOURS, MINUTES until event start datetime (from `app_config`).
- **FR-002**: The countdown MUST update automatically (per minute, client-side).
- **FR-003**: The entire countdown block (DAYS/HOURS/MINUTES digits + "Coming soon" subtitle) MUST be hidden when countdown reaches zero, AND the "Lấy mã QR" button MUST appear in its place.
- **FR-004**: Award cards MUST navigate to `Awards Information` page anchored to the correct award section.
- **FR-005**: The "ABOUT AWARDS" button MUST navigate to the Hệ thống giải page.
- **FR-006**: The "ABOUT KUDOS" button MUST navigate to the Sun* Kudos - Live board page.
- **FR-007**: The widget button MUST be fixed/floating at bottom-right on all scroll positions. Implemented as shared `src/components/ui/WidgetButton.tsx`, injected globally via `(main)/layout.tsx`.
- **FR-008**: The header MUST be sticky and accessible at all scroll positions.
- **FR-009**: All 6 award categories MUST be displayed (data from `public.award_categories` or static config).
- **FR-010**: The "Lấy mã QR" button MUST appear in the countdown block when countdown = 0, styled identically to "ABOUT AWARDS" (gold fill, dark text).
- **FR-011**: Clicking "Lấy mã QR" MUST navigate the user to `/ticket`.
- **FR-012**: The `/ticket` page MUST display the authenticated user's unique QR code (240×240px) centered on a full-screen black background. The QR code data encodes the user's `id`.

### Technical Requirements

- **TR-001**: Server Component for initial data fetching (event config, award categories).
- **TR-002**: Client Component for countdown timer (real-time updates).
- **TR-003**: Event start datetime stored in `app_config` table, fetched via `GET /api/config/event`.
- **TR-004**: Award category data from `public.award_categories` or static configuration.
- **TR-005**: Page uses Next.js `[locale]` routing for i18n (vi/en).
- **TR-006**: Award card images stored in Supabase Storage or static assets.
- **TR-007**: QR code content = `auth.user.id` (UUID). The `qrcode.react` library (`<QRCodeSVG>`) is used client-side to render the QR. No new DB migration required.

### Key Entities

- **EventConfig**: `{ event_start_datetime: ISO8601, venue: string, time_display: string }`
- **AwardCategory**: `{ id, slug, name, description, image_url, award_count, award_value }`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/config/event` | GET | Event start datetime for countdown | Predicted |
| `GET /api/award-categories` | GET | List of 6 award categories for cards | Predicted |

---

## Success Criteria

- **SC-001**: Page loads within 3 seconds (initial render).
- **SC-002**: Countdown displays correct values with 0-padding.
- **SC-003**: All 6 award category cards render with correct data.
- **SC-004**: Navigation to all linked pages works in 100% of test runs.

---

## Out of Scope

- User authentication flow (handled separately).
- Award voting or leaderboard (on Sun* Kudos page).
- Mobile-specific navigation (hamburger menu — separate task).

---

## Dependencies

- [x] `app_config` table exists
- [x] Header shared spec: `shared/A1-Header/spec.md`
- [x] Dropdown-ngôn ngữ spec: `721:4942-Dropdown-ngôn ngữ/spec.md` → implemented as shared `src/components/ui/LocaleDropdown.tsx`
- [x] Dropdown-profile spec: `721:5223-Dropdown-profile/spec.md`
- [ ] Hệ thống giải page spec: `313:8436-Hệ thống giải/spec.md`
- [ ] Sun* Kudos - Live board spec: `2940:13431-Sun* Kudos - Live board/spec.md`
- [ ] `qrcode.react` npm package installed (`yarn add qrcode.react`)

---

## Notes

- The "ROOT FURTHER" title is rendered as an **image asset**, not text — this simplifies cross-browser font concerns but requires an `alt="ROOT FURTHER"` attribute for accessibility.
- The hero section is 1392px tall on the 1512px-wide design — it intentionally extends below the fold.
- Homepage uses width 1512px (vs 1440px for other pages) — this is the Figma canvas width difference.
- Award cards click navigates to `Awards Information` with hash `#award-slug` for in-page anchor scrolling.
- The widget button (`6_Widget Button`) is a fixed FAB present on all scrollable pages.
