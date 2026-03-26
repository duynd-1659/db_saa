# Feature Specification: Thể lệ UPDATE

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-18
**Version**: v1.1
**Last updated**: 2026-03-18
**Status**: Draft

---

## Overview

A right-side slide-in panel that displays the full award rules ("Thể lệ") for the SAA 2025 Kudos program. It is triggered when the user clicks the "Thể lệ" button (A) from the Floating Action Button widget (frame `313:9139`). The panel covers the right portion of the viewport (553px wide), overlaying the main content with a dark background.

The panel is divided into three content sections:
1. **Người nhận KUDOS** — Hero badge tiers earned by receiving kudos from teammates.
2. **Người gửi KUDOS** — 6 collectible secret-box icons earned by sending kudos; collecting all 6 wins a mystery gift.
3. **Kudos Quốc Dân** — Top 5 most-hearted kudos receive a special prize.

At the bottom, two CTAs allow the user to close the panel or jump directly to the KUDOS writing form.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read award rules (Priority: P1)

A user wants to understand the SAA 2025 award rules before participating, so they can plan how to send and receive kudos effectively.

**Why this priority**: The primary purpose of this screen. Without readable content, all other interactions are meaningless.

**Independent Test**: Render the panel; verify all three sections (Người nhận, Người gửi, Kudos Quốc Dân) are visible with correct text and hero-badge icons.

**Acceptance Scenarios**:

1. **Given** the user clicked "Thể lệ" from the FAB, **When** the panel opens, **Then** the title "Thể lệ" is visible at the top with all three content sections rendered below it.
2. **Given** the panel content exceeds the viewport height, **When** the user scrolls inside the panel, **Then** the content scrolls within the panel while the rest of the page remains stationary.
3. **Given** the panel is open, **When** the user reads the Người nhận section, **Then** all four Hero badge tiers are listed with their icon, condition (number of kudos), and description text.
4. **Given** the panel is open, **When** the user reads the Người gửi section, **Then** all 6 collectible badge icons are shown in a 3×2 grid with names and the secret-box collection rule is explained.

---

### User Story 2 - Close the panel (Priority: P1)

A user finishes reading the rules and wants to dismiss the panel without navigating away from their current page.

**Why this priority**: Close/dismiss is the mandatory safety exit for any overlay. Without it the panel traps the user.

**Independent Test**: Render the panel; click "Đóng"; confirm panel is removed from DOM and the underlying page is fully accessible.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user clicks the "Đóng" button (B.1), **Then** the panel closes and no navigation occurs.
2. **Given** the panel is open, **When** the user presses `Escape`, **Then** the panel closes.
3. **Given** the panel is open, **When** the user clicks the dark overlay backdrop (outside the panel), **Then** the panel closes.

---

### User Story 3 - Write KUDOS from within the panel (Priority: P2)

A logged-in user reads the rules and is motivated to immediately write a kudos without closing the rules panel first.

**Why this priority**: Conversion shortcut — removes friction between "reading rules" and "taking action".

**Independent Test**: Render the panel; click "Viết KUDOS" (B.2); confirm the WriteKudoModal (frame `520:11602`) opens and the Thể lệ panel is closed.

**Acceptance Scenarios**:

1. **Given** the panel is open, **When** the user clicks "Viết KUDOS" (B.2), **Then** the Thể lệ panel closes and the Viết Kudo modal opens immediately.
2. **Given** the panel is open, **When** the user hovers over the "Viết KUDOS" button, **Then** a hover visual state is applied (brightness/shadow change).

---

### Edge Cases

- What happens when the panel is opened on a mobile viewport (< 768px)? The panel should take full width or adapt its width to fit the screen.
- What if the user rapidly clicks "Viết KUDOS" twice? Only one WriteKudo modal should open (debounce/click-once guard).
- What if the user is unauthenticated? The "Viết KUDOS" button should redirect to login or be hidden (the panel itself lives in a protected route so this is the fallback).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Backdrop overlay | Full-viewport dark overlay (`#00101A` bg), covers page behind panel | Click → close panel |
| Panel container (Thể Lệ) | 553×1410px right-side panel, bg `#00070C`, padding 24px top / 40px sides & bottom | Scrollable content area |
| Title "Thể lệ" | 45px Montserrat Bold, yellow `#FFEA9E` | Display only |
| Section: Người nhận KUDOS | Header (22px bold yellow) + description + 4 Hero badge rows (New/Rising/Super/Legend) | Display only |
| Section: Người gửi KUDOS | Header (22px bold yellow) + description + 6 badge icon grid + summary text | Display only |
| Section: Kudos Quốc Dân | Sub-header (24px bold yellow) + description (16px white) | Display only |
| Button "Đóng" (B.1) | Secondary outlined button; close icon + label "Đóng"; bg `rgba(255,234,158,0.10)`, border `#998C5F` | Click → close panel; Hover → style change |
| Button "Viết KUDOS" (B.2) | Primary CTA; pen icon + label "Viết KUDOS"; bg `#FFEA9E`, text `#00101A` | Click → open WriteKudo modal + close panel; Hover → style change |

### Navigation Flow

- **From**: FAB widget expanded state (frame `313:9139`) — Button A "Thể lệ"
- **To (close)**: Back to current page (panel dismissed, URL unchanged)
- **To (Viết KUDOS)**: WriteKudo modal (frame `520:11602`) — panel closes, modal opens

### Visual Requirements

- **Responsive breakpoints**: Desktop — panel 553px wide on right edge; Tablet/Mobile — panel takes full width or adapted width
- **Animations/Transitions**: Panel slides in from right (`translateX(100%) → translateX(0)`, 300ms ease-out); closes with reverse animation; button hover transitions 150ms ease-in-out
- **Accessibility**: WCAG AA — all interactive elements have `aria-label`; panel has `role="dialog"` + `aria-modal="true"` + `aria-label`; focus trapped inside panel when open; `Escape` closes

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the panel with all three content sections (Người nhận, Người gửi, Kudos Quốc Dân) fully visible on open.
- **FR-002**: System MUST close the panel when the user clicks "Đóng" (B.1), presses `Escape`, or clicks outside the panel.
- **FR-003**: System MUST open the WriteKudo modal (frame `520:11602`) when the user clicks "Viết KUDOS" (B.2), and simultaneously close the Thể lệ panel.
- **FR-004**: System MUST render all four Hero badge tiers (New Hero, Rising Hero, Super Hero, Legend Hero) with their icon component, kudos threshold, and description.
- **FR-005**: System MUST render all six collectible badge icons (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) in a 3×2 grid layout.
- **FR-006**: System MUST allow the panel content area to scroll independently when content overflows the viewport height.

### Technical Requirements

- **TR-001**: The panel must render as an overlay using `position: fixed` with `z-index: 60` (`z-[60]`) and backdrop at `z-index: 59` (`z-[59]`). Both must sit above the sticky site header (`z-50`) to cover the full viewport.
- **TR-005**: When the panel is open, `document.body` must have `overflow: hidden` applied to prevent background page scrolling. This must be removed when the panel closes (including on Escape, backdrop click, and route change).
- **TR-002**: The panel must trap focus when open (WCAG 2.1 §2.1.2). Focus must return to the FAB trigger button on close.
- **TR-003**: The panel must be implemented as a Client Component (`'use client'`) triggered by the FAB widget state or a shared context/callback.
- **TR-004**: Content is static (no API calls) — all text and badge info are rendered from static data/constants.

### Key Entities *(if feature involves data)*

- **RulesPanel state**: Local component state `isOpen: boolean` controlling panel visibility. Managed by FAB parent or a shared context.
- **Hero badge tiers** (static data): Array of `{ id, icon, label, condition, description }` for 4 tiers.
- **Collectible badges** (static data): Array of 6 `{ id, icon, name }` badge items.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| *(none)* | — | All content is static; no API calls required for this panel | — |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three content sections render pixel-perfectly at 1440px viewport matching the Figma design.
- **SC-002**: Panel open/close animation completes in ≤ 300ms with no layout shift (CLS = 0).
- **SC-003**: Clicking "Viết KUDOS" opens the WriteKudo modal in < 300ms and the panel is no longer in the DOM.

---

## Out of Scope

- The FAB trigger button (covered by frame `313:9139` spec).
- The WriteKudo form content and submission logic (covered by frame `520:11602` spec).
- Dynamic data fetching for badge counts or user-specific badge status.
- Admin editing of the Thể lệ content.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`)
- [ ] Database design completed (`.momorph/contexts/database-schema.sql`)
- [ ] Screen flow documented (`SCREENFLOW.md`)
- [x] Parent trigger spec exists: `.momorph/specs/313:9139-floating-action-button-phim-noi-chuc-nang-2/spec.md`
- [x] WriteKudo modal spec exists: `.momorph/specs/520:11602-Viết Kudo/spec.md`

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.1 | 2026-03-18 | Structural | Requirement change: Raised z-index (panel→60, backdrop→59) to cover sticky header; added TR-005 body scroll lock. Updated: TR-001, new TR-005. |
| v1.0 | 2026-03-18 | — | Initial specification |

---

## Notes

- This panel is opened by the FAB widget's Button A (`313:9139`). Implementation must coordinate the open/close state between `FabWidget` and `RulesPanelDrawer` — either via a shared context (e.g., extending `WriteKudoProvider`-style pattern) or by lifting state to the `(main)/layout.tsx` level.
- The panel is a **right-side drawer**, not a centered modal — it slides in from the right edge of the viewport.
- All badge icons (Hero tiers + collectible icons) are Figma component instances — they must be downloaded as SVG assets and rendered via `<Image>` consistent with constitution §VII.
- Static text content (descriptions, conditions) should be stored in i18n JSON files under a `common.rules.*` namespace.
- Frame image reference: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/3204:6051/ea9a26f893c9c24235ce4cf2aa16d702.png
