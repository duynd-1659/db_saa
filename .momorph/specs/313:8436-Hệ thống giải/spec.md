# Feature Specification: Hệ thống giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft
**Version**: v2.2
**Last synced**: 2026-03-25

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v2.2 | 2026-03-25 | Cosmetic | Fix nav active state: border-bottom + icon gold + glow. Version bump only (no content changes for spec.md). |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added as shared component injected via (main)/layout.tsx. Updated: Screen Components table, Visual Requirements, FR section, Navigation Flow. |
| v1.2 | 2026-03-11 | Structural | Update visual requirements: icons in nav/cards, stat label styles |
| v1.1 | 2026-03-11 | Cosmetic | Update award card image description (composite asset, no CSS border) |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |

---

## Overview

The Awards Information page — a detailed reference page listing all 6 Sun* Annual Awards 2025 categories. Features a two-column layout: a sticky left navigation menu for category scrolling and a right column of award detail cards. Each card shows the award image, name, description, prize count, and prize value. Also includes a Sun* Kudos promotional block and footer. Read-only, no interactive forms.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse award categories (Priority: P1)

A user views the complete list of award categories on the Awards Information page.

**Why this priority**: Core informational page — users must be able to see all awards and understand the criteria.

**Independent Test**: Navigate to Awards Information, verify all 6 award cards (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) are visible with correct prize data.

**Acceptance Scenarios**:

1. **Given** the user is on the Awards Information page, **When** it loads, **Then** the page shows a keyvisual background image with the "ROOT FURTHER" logo at top-left and the title section ("Sun* Annual Awards 2025" caption + "Hệ thống giải thưởng SAA 2025" heading) positioned absolute at the bottom of the keyvisual, and 6 award cards below.
2. **Given** each award card, **When** rendered, **Then** it shows: award image, name, description, prize count (with unit type), and prize value (in VNĐ).
3. **Given** the left navigation menu, **When** the user clicks "Top Talent", **Then** the page scrolls to the Top Talent card.

---

### User Story 2 - Navigate via left menu (Priority: P1)

A user uses the sticky left navigation to jump to a specific award.

**Acceptance Scenarios**:

1. **Given** the left nav menu with 6 items, **When** the user clicks any item, **Then** the page scrolls to the corresponding award card and the clicked item becomes active (gold + underline).
2. **Given** the user scrolls the page manually, **When** an award section enters the viewport, **Then** the corresponding left nav item becomes active.
3. **Given** a nav item is active, **When** the user clicks it again, **Then** the page scrolls to the top of that section.

---

### User Story 3 - Navigate from homepage card links (Priority: P1)

Users arriving from the Homepage award cards should land at the correct award section.

**Acceptance Scenarios**:

1. **Given** the user clicked "Chi tiết" on the "Top Talent" card on Homepage, **When** they land on this page, **Then** the page scrolls to the Top Talent section (URL hash `#top-talent`).
2. **Given** a URL with hash `#mvp`, **When** the page loads, **Then** the browser scrolls to the MVP award section.

---

### User Story 4 - View Sun* Kudos promo (Priority: P2)

A user can navigate from the Kudos block to the Kudos live board.

**Acceptance Scenarios**:

1. **Given** the Sun* Kudos promo block at the bottom, **When** the user clicks "Chi tiết", **Then** they are navigated to the Sun* Kudos - Live board page.

---

### Edge Cases

- What if award images fail to load? → Show image placeholder/skeleton.
- What if the page is deep-linked to an invalid hash? → Ignore hash, scroll to top.
- What if award data changes (admin updates)? → Re-fetch on next page load (SSR/ISR).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Header | `313:8440` | Sticky nav, "Awards Information" active | Navigation |
| Keyvisual BG | `313:8437` | Full-width background image only (no text) | Static |
| KV: ROOT FURTHER | `313:8450` | "ROOT FURTHER" logo, positioned over keyvisual BG | Static |
| A: Title | `313:8453` | "Sun* Annual Awards 2025" caption + "Hệ thống giải thưởng SAA 2025" heading — **absolute-positioned at bottom of Keyvisual, horizontally centered** | Static |
| B: System Layout | `313:8458` | Left nav + award cards (1152px, gap: 80px) | Scroll navigation |
| C: Left Nav | `313:8459` | 6 items: Top Talent → MVP, sticky left | Click → scroll + active state |
| D.1: Top Talent | `313:8467` | Award card: image + content + stats | Static |
| D.2: Top Project | `313:8468` | Award card | Static |
| D.3: Top Project Leader | `313:8469` | Award card | Static |
| D.4: Best Manager | `313:8470` | Award card | Static |
| D.5: Signature 2025 | `313:8471` | Award card | Static |
| D.6: MVP | `313:8510` | Award card | Static |
| D1: Sun* Kudos | `335:12023` | Kudos promo block with "Chi tiết" CTA | Click → Kudos live board |
| Footer | `354:4323` | Logo + nav links + copyright | Navigation |
| Widget Button | — | Fixed FAB bottom-right: pencil + SAA icon (shared `src/components/ui/WidgetButton.tsx`) | Click → dropdown quick-action menu (spec TBD) |

> See `design-style.md` for visual specifications (colors, typography, dimensions).

### Navigation Flow

- **From**: Homepage SAA (award card click or "ABOUT AWARDS" button)
- **From**: Footer / Header "Awards Information" link
- **To (Kudos Chi tiết)**: Sun* Kudos - Live board page
- **Internal**: Left nav scrolls within page, URL hash updates

### Visual Requirements

- Page background: `#00101A`.
- Header active link: "Awards Information" in gold + underline.
- Left nav active item: gold text + gold icon + border-bottom indicator (`1px solid #FFEA9E`) + text-shadow glow.
- Award cards: image (336×336px) left + content right, composite image asset with gold glow baked in (no CSS border).
- Prize value: displayed in gold (`#FFEA9E`).
- Section gap: `80px` between award cards.
- Widget button: fixed at bottom-right (`bottom: 32px, right: 32px`), gold pill `105×64px`, `z-40`. Shared component — injected via `(main)/layout.tsx`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display all 6 award categories with name, description, prize count, prize value.
- **FR-002**: The left navigation MUST be sticky and scroll-spy the active category as the user scrolls.
- **FR-003**: Clicking a left nav item MUST smooth-scroll to the corresponding award card.
- **FR-004**: URL hash MUST be updated when scrolling (for deep-linking).
- **FR-005**: Page MUST support deep-link via URL hash (e.g., `/awards-information#top-talent`).
- **FR-006**: "Chi tiết" in Sun* Kudos block MUST navigate to the Sun* Kudos - Live board.
- **FR-007**: The WidgetButton FAB MUST be visible at all scroll positions (fixed bottom-right). Provided by shared component `src/components/ui/WidgetButton.tsx` via `(main)/layout.tsx`.

### Technical Requirements

- **TR-001**: Server Component — award data fetched at build time or via ISR.
- **TR-002**: Client Component for left nav scroll-spy and active state.
- **TR-003**: Award categories stored in `public.award_categories` or static JSON config.
- **TR-004**: Page route: `/[locale]/awards-information`.
- **TR-005**: `IntersectionObserver` used for scroll-spy.

### Key Entities

- **AwardCategory**: `{ id, slug, name, description, image_url, award_count, unit_type, award_value_vnd, special_note }`

**Award data:**

| Slug | Name | Count | Unit | Value (VNĐ) |
|------|------|-------|------|-------------|
| `top-talent` | Top Talent | 10 | Đơn vị | 7.000.000 |
| `top-project` | Top Project | 2 | Tập thể | 15.000.000 |
| `top-project-leader` | Top Project Leader | 3 | Cá nhân | 7.000.000 |
| `best-manager` | Best Manager | 1 | Cá nhân | 10.000.000 |
| `signature-2025-creator` | Signature 2025 - Creator | 1 | — | 5.000.000 / 8.000.000 |
| `mvp` | MVP (Most Valuable Person) | 1 | — | 15.000.000 |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/award-categories` | GET | Load all award categories | Predicted |

---

## Success Criteria

- **SC-001**: All 6 award cards render with correct name and prize data.
- **SC-002**: Deep-linking via hash scrolls to the correct section.
- **SC-003**: Left nav scroll-spy activates within 200ms of section entering viewport.
- **SC-004**: Page renders without errors in vi and en locales.

---

## Out of Scope

- Award voting or nomination from this page.
- Editing award data (admin-only feature).
- Displaying winners (separate page/section).

---

## Dependencies

- [x] `public.award_categories` table or static config
- [ ] Homepage SAA spec: `2167:9026-Homepage SAA/spec.md`
- [ ] Sun* Kudos - Live board spec: `2940:13431-Sun* Kudos - Live board/spec.md`

---

## Notes

- The Figma frame is 1440px wide (standard for all pages except Homepage which is 1512px).
- Content section uses `144px` horizontal padding — actual content width is `1152px`.
- The "Signature 2025 - Creator" award has different values for individual (5M) vs team (8M) — both should be displayed.
- Left nav is "sticky" during scroll through the awards section — it should NOT be sticky in the footer area.
