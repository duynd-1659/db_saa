# Feature Specification: Countdown - Prelaunch page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A full-screen prelaunch page displayed before the SAA 2025 event goes live. Shows a live countdown timer to the event start time with DAYS, HOURS, MINUTES units rendered in glass-morphism digit cards. Background is a branded key visual image with a dark gradient overlay. When the countdown reaches zero, the application redirects to the Login screen.

This page is shown to all users (authenticated or not) before the event launch date, replacing the normal app entry flow.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View live countdown (Priority: P1)

A user visits the app before the event starts and sees the remaining time displayed as a real-time countdown.

**Why this priority**: Core purpose of this screen. Without a working countdown, the prelaunch page has no functionality.

**Independent Test**: Visit the app before the event start datetime. Verify the countdown shows correct DAYS/HOURS/MINUTES values and decrements every second/minute.

**Acceptance Scenarios**:

1. **Given** the current datetime is before `event_start_datetime` in `app_config`, **When** the user visits the app root URL, **Then** the Countdown page is displayed with correct remaining time (DAYS / HOURS / MINUTES).
2. **Given** the countdown is running, **When** one minute passes, **Then** the MINUTES value decrements by 1 (and cascades to HOURS/DAYS if needed).
3. **Given** the digit value is a single digit (e.g. 5), **When** displayed, **Then** it appears as "05" (zero-padded, two digit cards per unit).

---

### User Story 2 - Auto-redirect when countdown expires (Priority: P1)

When the countdown reaches 00:00:00, the page automatically redirects to the Login screen.

**Why this priority**: The countdown page is a gate — once the event starts, users must be routed to the actual app.

**Independent Test**: Set `event_start_datetime` to a time 2 seconds in the future, visit the countdown page, verify redirect to Login after 2 seconds.

**Acceptance Scenarios**:

1. **Given** the countdown reaches 00 DAYS / 00 HOURS / 00 MINUTES, **When** the final second elapses, **Then** the page redirects to `/[locale]/login`.
2. **Given** `event_start_datetime` is already in the past, **When** a user visits the countdown page directly, **Then** they are immediately redirected to Login.

---

### User Story 3 - Visual fidelity of countdown design (Priority: P2)

The countdown digits use the branded glass-morphism card design with Digital Numbers font.

**Why this priority**: Visual brand consistency is important for the event experience.

**Acceptance Scenarios**:

1. **Given** the page is rendered, **When** any digit is displayed, **Then** each digit appears in a 77×123px card with: backdrop blur, 0.75px #FFEA9E border, 12px border-radius, and white-to-transparent gradient background.
2. **Given** the headline is rendered, **Then** "Sự kiện sẽ bắt đầu sau" appears in Montserrat 700 36px centered above the digits.

---

### Edge Cases

- What if `event_start_datetime` is null or missing in `app_config`? → Show a fallback state (e.g., "Sắp ra mắt") without crashing.
- What if the user's local clock is ahead of the server time? → Use server-side timestamp from `app_config` for accuracy.
- What if DAYS reaches 0 but HOURS and MINUTES haven't? → Continue showing "00 DAYS 04 HOURS 30 MINUTES".
- What if the user refreshes the page after the event starts? → Immediately redirect to Login.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Background image | 2268:35129 | Full-screen key visual artwork | Static, decorative |
| Cover gradient | 2268:35130 | Dark diagonal gradient overlay | Static, decorative |
| Headline | 2268:35137 | "Sự kiện sẽ bắt đầu sau" in Montserrat 700 36px centered | Static |
| 1_Days | 2268:35139 | Two digit cards + "DAYS" label | Auto-updates every hour |
| 2_Hours | 2268:35144 | Two digit cards + "HOURS" label | Auto-updates every hour |
| 3_Minutes | 2268:35149 | Two digit cards + "MINUTES" label | Auto-updates every minute |
| Digit card | 186:2619 (component) | 77×123px glass-morphism card with digit number | Animated update |

> See `design-style.md` for pixel-perfect visual specifications including the Digital Numbers font, glass-morphism effect, and layout dimensions.

### Navigation Flow

- **Entry**: App root URL when `countdown_enabled = true` in `app_config`
- **Exit**: Automatic redirect to `/[locale]/login` when countdown reaches zero
- **No user-triggered navigation** — this is a passive wait screen

### Visual Requirements

- Refer to `design-style.md` → Layout Structure (ASCII) for exact dimensions.
- Background uses event key visual image from `/assets/countdown/keyvisual.png` (or equivalent).
- Digits use **"Digital Numbers"** font — must be loaded.
- Glass-morphism: `backdrop-filter: blur(24.96px)` + semi-transparent gradient + 0.75px gold border.
- **Responsive**: Scale proportionally on smaller screens.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display when the current server time is before `event_start_datetime` in `app_config`.
- **FR-002**: The countdown MUST show remaining DAYS, HOURS, MINUTES (no seconds shown per design).
- **FR-003**: Each unit MUST display as two zero-padded digits (e.g., "05").
- **FR-004**: The countdown MUST update in real-time (client-side interval, synced to server time).
- **FR-005**: When the countdown reaches zero, the page MUST redirect to `/[locale]/login`.
- **FR-006**: If `event_start_datetime` is past or missing, the page MUST redirect immediately to Login.

### Technical Requirements

- **TR-001**: Event start time MUST be loaded from `app_config` table key `event_start_datetime` (ISO-8601 string).
- **TR-002**: The countdown computation MUST be done client-side using `setInterval` or `requestAnimationFrame`.
- **TR-003**: The **"Digital Numbers"** font must be loaded via `next/font` or self-hosted in `public/fonts/`.
- **TR-004**: The page MUST be a Server Component for initial render; countdown logic in a Client Component.
- **TR-005**: The `countdown_enabled` config key should gate whether this page is shown (allows disabling the countdown without code changes).

### Key Entities

- **app_config**: `event_start_datetime` (ISO-8601), `countdown_enabled` (boolean string "true"/"false")

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/config/event` | GET | Fetch `event_start_datetime` and `countdown_enabled` from `app_config` | Predicted |

---

## Success Criteria *(mandatory)*

- **SC-001**: Countdown displays correct time within ±1 second of actual remaining time.
- **SC-002**: Redirect to Login occurs within 1 second of countdown reaching zero.
- **SC-003**: Page renders with correct visual design (glass digits, background image, headline) in 100% of test runs.

---

## Out of Scope

- Showing seconds — only DAYS / HOURS / MINUTES per design.
- User authentication on this page (it is pre-auth).
- Multiple event countdown timers.
- Admin controls for the countdown timer (managed via `app_config` directly).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [ ] "Digital Numbers" font file available
- [ ] Background key visual image asset at correct path
- [x] `app_config` table with `event_start_datetime` key exists in migration

---

## Notes

- The frame uses `rgba(105, 105, 105, 1)` as the Figma canvas background — this is NOT a design color, just the artboard background.
- The actual page background is `#00101A` with the key visual image on top.
- Only MINUTES update frequently — HOURS and DAYS change much less often. Consider optimizing the update interval.
- The Figma design shows sample values: 00 DAYS / 05 HOURS / 20 MINUTES.
