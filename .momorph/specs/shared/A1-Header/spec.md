# Shared Component Specification: A1 Header

**Node ID**: `2167:9091`
**Component Type**: Shared / Global
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-24
**Status**: Draft
**Version**: v1.0

> This is a shared component spec. It is referenced by all screen specs that include the fixed header.
> For visual properties, see `design-style.md` in this directory.

---

## Overview

The primary navigation header displayed at the top of all main pages. Fixed to the top of the viewport at all scroll positions. Contains the SAA logo, three main navigation links, a notification bell, a language switcher, and a user avatar button.

**Used on screens**:
- Homepage SAA (`2167:9026`)
- Hệ thống giải (`313:8436`)
- Sun* Kudos - Live board (`2940:13431`)
- All other authenticated main pages

**Implementation**: `src/components/ui/Header.tsx` (or equivalent shared path)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Fixed navigation (Priority: P1)

The header remains accessible at all scroll positions.

**Acceptance Scenarios**:

1. **Given** the user scrolls down any page, **When** at any scroll position, **Then** the header is fixed at the top of the viewport with background `rgba(16, 20, 23, 0.8)`.
2. **Given** the user is on any page, **When** they click the SAA logo, **Then** they are navigated to the homepage (`/`).

---

### User Story 2 — Navigation links (Priority: P1)

Users can navigate to all main sections via the three nav links.

**Acceptance Scenarios**:

1. **Given** the user is on any page, **When** they see the header, **Then** three nav links are visible: "About SAA 2025", "Awards Information", "Sun* Kudos".
2. **Given** a nav link corresponds to the current page, **When** the page is active, **Then** that link shows gold text + gold underline (selected state).
3. **Given** the user hovers a non-active nav link, **When** hovered, **Then** a light highlight background with `border-radius: 4px` appears.
4. **Given** the user clicks "About SAA 2025", **When** clicked, **Then** they navigate to the homepage; if already on homepage, scroll to top.
5. **Given** the user clicks "Awards Information", **When** clicked, **Then** they navigate to the Hệ thống giải page.
6. **Given** the user clicks "Sun* Kudos", **When** clicked, **Then** they navigate to the Sun* Kudos - Live board page.

---

### User Story 3 — Language switcher (Priority: P1)

Users can switch between Vietnamese and English.

**Acceptance Scenarios**:

1. **Given** the user clicks the language button (VI/EN), **When** clicked, **Then** the Dropdown-ngôn ngữ overlay opens.
2. **Given** the dropdown is open, **When** the user selects a language, **Then** the UI re-renders in the chosen language and the dropdown closes.

---

### User Story 4 — Notification bell (Priority: P2)

Users are alerted to unread notifications.

**Acceptance Scenarios**:

1. **Given** there are unread notifications, **When** the page loads, **Then** a red dot badge appears on the bell icon.
2. **Given** the user clicks the bell icon, **When** clicked, **Then** the notification panel opens.

---

### User Story 5 — User avatar / profile menu (Priority: P1)

Users can access their profile and sign-out options.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they click the avatar button (top-right), **Then** Dropdown-profile opens.
2. **Given** the user has the Admin role, **When** they click the avatar button, **Then** Dropdown-profile Admin opens (includes "Admin Dashboard" option).
3. **Given** the dropdown is open, **When** the user clicks outside it, **Then** the dropdown closes.

---

## UI/UX Requirements

### Sub-components

| ID | Node ID | Name | Description |
|----|---------|------|-------------|
| A1.1 | `I2167:9091;178:1033` | Logo | SAA logo `52×48px`, click → homepage |
| A1.2 | `I2167:9091;186:1579` | Nav — Selected state | Gold text + underline, click → page (scroll top if already active) |
| A1.3 | `I2167:9091;186:1587` | Nav — Hover state | Light highlight bg, `border-radius: 4px` |
| A1.5 | `I2167:9091;186:1593` | Nav — Normal state | White text, transparent bg |
| A1.6 | `I2167:9091;186:2101` | Notification bell | `40×40px`, red badge when unread, click → notification panel |
| A1.7 | `I2167:9091;186:1696` | Language switcher | `108×56px`, current lang label + flag + chevron, click → Dropdown-ngôn ngữ |
| A1.8 | `I2167:9091;186:1597` | Avatar button | `40×40px`, gold border, click → Dropdown-profile or Dropdown-profile Admin |

### Navigation targets

| Link | Target |
|------|--------|
| Logo click | `/` (homepage) |
| About SAA 2025 | `/` (scroll top if already there) |
| Awards Information | Hệ thống giải page |
| Sun* Kudos | Sun* Kudos - Live board page |
| Language switcher | Opens `Dropdown-ngôn ngữ` (`721:4942`) |
| Avatar | Opens `Dropdown-profile` (`721:5223`) or `Dropdown-profile Admin` (`721:5277`) for admins |

---

## Functional Requirements

- **FR-H-001**: Header MUST be fixed (`position: fixed; top: 0`) and overlay page content at all scroll positions.
- **FR-H-002**: The active nav link MUST reflect the current page (gold text + underline).
- **FR-H-003**: Clicking logo MUST navigate to `/`.
- **FR-H-004**: Notification badge MUST appear when there are unread notifications.
- **FR-H-005**: Language switcher MUST open `Dropdown-ngôn ngữ` and apply the selected locale globally.
- **FR-H-006**: Avatar button MUST open the correct dropdown based on user role (standard vs admin).

## Technical Requirements

- **TR-H-001**: Server-side role detection for admin vs standard dropdown.
- **TR-H-002**: Active link state derived from current route (`usePathname`).
- **TR-H-003**: Unread notification count fetched via API or real-time subscription.
- **TR-H-004**: Language state managed via `next-intl` locale routing.
- **TR-H-005**: Header component is a Client Component (requires `usePathname`, interactive dropdowns).

---

## Dependencies

- [x] Dropdown-ngôn ngữ spec: `721:4942-Dropdown-ngôn ngữ/spec.md`
- [x] Dropdown-profile spec: `721:5223-Dropdown-profile/spec.md`
- [x] Dropdown-profile Admin spec: `721:5277-Dropdown-profile Admin/spec.md`
- [ ] Notification panel spec (TBD)

---

## Out of Scope

- Mobile hamburger menu (separate spec).
- Notification panel contents (separate spec).
