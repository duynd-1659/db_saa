# Feature Specification: Floating Action Button - phim nổi chức năng 2

**Frame ID**: `313:9139`
**Frame Name**: `Floating Action Button - phim nổi chức năng 2`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-18
**Status**: Draft

---

## Overview

A Floating Action Button (FAB) group widget displayed in the expanded/open state, positioned fixed at the bottom-right of the screen. When expanded, it reveals two secondary action buttons — "Thể lệ" (Rules) and "Viết KUDOS" (Write KUDOS) — along with a circular cancel/close button. This component enables quick access to the two core actions of the SAA 2025 award system from any page.

The FAB group is shown in its **active/expanded state** (state 2), meaning the user has already tapped the main FAB trigger and the sub-actions are now visible.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dismiss FAB menu (Priority: P1)

A user who opened the FAB group by mistake (or finished viewing options) wants to close it without navigating away.

**Why this priority**: Cancel/close is the safety valve for the entire FAB interaction. Without it the overlay is a trap.

**Independent Test**: Render the FAB group in expanded state; click the red circular cancel button; confirm the FAB group collapses/closes and no navigation occurs.

**Acceptance Scenarios**:

1. **Given** the FAB group is expanded (phim nổi chức năng 2 state), **When** the user clicks the red circular "Huỷ" button (C), **Then** the FAB group collapses and no modal or new page is opened.
2. **Given** the FAB group is expanded, **When** the user presses `Escape`, **Then** the FAB group collapses.

---

### User Story 2 - Write KUDOS quick action (Priority: P1)

A logged-in employee wants to quickly open the KUDOS composition form from anywhere on the site to send a compliment to a colleague.

**Why this priority**: "Viết KUDOS" is the primary value action of the SAA platform — the FAB exists primarily to surface this action.

**Independent Test**: Render the FAB group; click "Viết KUDOS"; verify the Viết Kudo modal/page (frameId `520:11602`) opens.

**Acceptance Scenarios**:

1. **Given** the FAB group is expanded, **When** the user clicks the "Viết KUDOS" button (B), **Then** the Viết Kudo composition modal/page opens.
2. **Given** the FAB group is expanded, **When** the user hovers over the "Viết KUDOS" button, **Then** the button's shadow increases slightly and brightness changes to indicate interactivity.

---

### User Story 3 - View award rules (Priority: P2)

A user wants to quickly access the award rules ("Thể lệ") section to understand eligibility criteria without leaving the current context.

**Why this priority**: Thể lệ is a secondary action that supports informed participation but is not the primary conversion goal.

**Independent Test**: Render the FAB group; click "Thể lệ"; verify the Thể lệ UPDATE screen (frameId `3204:6051`) opens.

**Acceptance Scenarios**:

1. **Given** the FAB group is expanded, **When** the user clicks the "Thể lệ" button (A), **Then** the Thể lệ rules modal/section opens.
2. **Given** the FAB group is expanded, **When** the user hovers over the "Thể lệ" button, **Then** the button's shadow increases slightly to indicate interactivity.

---

### Edge Cases

- What happens when the FAB is rendered on a mobile viewport (< 768px)? The widget should remain anchored bottom-right with appropriate touch target sizing (min 44×44px).
- How does the system handle rapid multiple clicks on action buttons? Navigation should be triggered once; debounce or disable on first click.
- What if the user is not authenticated? The "Viết KUDOS" button should either be hidden or redirect to login.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Widget Button container | Flex column, align-end, gap 20px, 214×224px, absolute positioned bottom-right | Container only — no direct interaction |
| A — Button thể lệ | 149×64px pill-button, yellow bg (`#FFEA9E`), radius 4px; icon left + "Thể lệ" label | Click → open Thể lệ screen; Hover → subtle shadow increase |
| B — Button viết kudos | 214×64px pill-button, yellow bg (`#FFEA9E`), radius 4px; pen icon left + "Viết KUDOS" label | Click → open Viết Kudo modal; Hover → subtle shadow + brightness change |
| C — Button huỷ | 56×56px circular button, red bg (`#D4271D`), radius 100px; white close icon centered | Click → collapse FAB group; no navigation |

### Navigation Flow

- **From**: Any authenticated page where the FAB widget is mounted
- **To (Button A)**: Thể lệ UPDATE screen (`frameId: 3204:6051`)
- **To (Button B)**: Viết Kudo modal/screen (`frameId: 520:11602`)
- **Cancel (Button C)**: Stays on current page, collapses FAB

### Visual Requirements

- **Responsive breakpoints**: Mobile (default, fixed bottom-right, reduced size), Tablet `md:`, Desktop `lg:` (full size as designed)
- **Animations/Transitions**: FAB expand/collapse with staggered entry animation for sub-buttons; hover transitions on buttons (150ms ease-in-out)
- **Accessibility**: WCAG AA — buttons must have `aria-label`, minimum 44×44px touch targets on mobile, focus ring on keyboard navigation

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the FAB widget in its expanded state with all three buttons visible when the parent triggers expansion.
- **FR-002**: System MUST navigate to the Thể lệ screen when Button A is clicked.
- **FR-003**: System MUST open the Viết Kudo form/modal when Button B is clicked.
- **FR-004**: System MUST collapse the FAB group (hide sub-buttons) when Button C (Huỷ) is clicked without triggering any navigation.
- **FR-005**: System MUST render the FAB widget in a fixed position anchored to the bottom-right of the viewport.

### Technical Requirements

- **TR-001**: The FAB widget must render without layout shift (CLS = 0) using `position: fixed` outside of the main content flow.
- **TR-002**: Buttons must be accessible: each must have a descriptive `aria-label` and support keyboard activation (`Enter`/`Space`).
- **TR-003**: Navigation targets must be derived from `SCREENFLOW.md` — no hardcoded URLs (per constitution §III).

### Key Entities *(if feature involves data)*

- **FabState**: Local component state representing whether the FAB is open (`expanded`) or closed (`collapsed`).

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| *(none)* | — | The FAB itself is a pure UI navigation widget with no direct API calls | — |

> Navigation destinations (Thể lệ, Viết Kudo) may trigger API calls within their own screens/modals, but those are out of scope for this spec.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three buttons are rendered with correct colors, sizes, and labels matching the Figma design (pixel-perfect at 1440px viewport).
- **SC-002**: Clicking Button B successfully opens the Viết Kudo form in < 300ms (no navigation lag).
- **SC-003**: Button C closes the FAB group without triggering any route change — verified by URL remaining unchanged.

---

## Out of Scope

- The collapsed/closed FAB state (main FAB trigger button) — covered by a separate frame/spec.
- Animation timing for the expand/collapse transition — to be defined by the front-end engineer based on design intent.
- KUDOS form content and submission logic — covered by the Viết Kudo spec.
- Thể lệ content — covered by the Thể lệ spec.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [ ] Screen flow documented (`SCREENFLOW.md`)

---

## Notes

- This frame represents **state 2** of the FAB widget — the expanded/open state. The trigger button (state 1) is a separate design frame.
- Icon components (`MM_MEDIA_LOGO`, `MM_MEDIA_Pen`, `MM_MEDIA_Close`) are Figma component instances from the `178:1020` component set — they must be implemented as Icon Components in the codebase (SVG via Icon component, per constitution §VII).
- All button labels are in Vietnamese; i18n support should be considered if the app supports multiple locales.
- The background canvas color `#00101A` is the page/screen background — the widget itself floats above it.
