# Feature Specification: Hover Avatar Info User

**Frame ID**: `721:5827`
**Frame Name**: `Hover Avatar info user`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Version**: v1.0
**Last updated**: 2026-03-19

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v1.0 | 2026-03-19 | Initial | Initial spec from Figma + popover requirements. Figma covers avatar ring states only; popover layout specified via business requirement (no Figma design). Defined as a shared reusable component usable anywhere a sunner name or avatar appears. |

---

## Overview

**Feature**: `SunnerHoverCard` — a shared, reusable hover popover that appears whenever the user hovers over **any sunner name or avatar** in the application.

**Purpose**: Provide contextual identity + stats + a quick-action CTA at any hover point without requiring a page navigation.

**Scope**: Shared component used across:
- `SpotlightWordCloud` — name `<span>` elements
- Kudo card (`C.3`) — sender/recipient name and avatar
- Sidebar "10 Sunner" list — name and avatar
- Any future surface that renders a sunner name or avatar

**Note on Figma**: Frame `721:5827` specifies **only the avatar ring state change** (default white ring → hover gold ring). The **popover card layout** has no Figma design; it is specified via business requirements below. See also *Sun* Kudos - Live board* spec US8 scenarios 7–10 for the original popover context.

**Target users**: All authenticated users.

---

## User Stories

### US1: Avatar ring hover state [P1]

**As a** user browsing any page
**I want to** see a visual ring highlight on an avatar when I hover over a sunner
**So that** I get clear feedback about which sunner I am about to interact with

#### Acceptance Scenarios

**Scenario 1: Default ring**
- Given: Any sunner avatar is rendered anywhere in the app
- When: No cursor is hovering over it
- Then: The avatar displays a `1.869px solid #FFFFFF` circular ring

**Scenario 2: Hover ring**
- Given: A sunner avatar or name is rendered
- When: The user hovers the cursor over the avatar or name
- Then: The avatar ring changes to `1.869px solid #FFEA9E` (gold)

**Scenario 3: Ring reverts on leave**
- Given: The user is hovering over a sunner avatar or name
- When: The cursor leaves the element and the popover card
- Then: The avatar ring reverts to white and the popover closes

---

### US2: Hover popover card [P1]

**As a** user hovering over any sunner name or avatar
**I want to** see a summary card with their profile, stats, and a quick CTA
**So that** I can learn about them and send a kudo without leaving the current page

#### Acceptance Scenarios

**Scenario 1: Popover opens on hover**
- Given: A sunner name or avatar is hovered
- When: Hover starts (after ~150ms debounce)
- Then: `SunnerHoverCard` appears anchored near the trigger element, within viewport bounds

**Scenario 2: Row 1 — Full name + "View profile" link**
- Given: Popover is open
- When: Rendered
- Then: The sunner's full name is displayed in large prominent white text (underline/link style). A "View profile for [Full Name]" secondary link appears at the top of the card

**Scenario 3: Row 2 — Department + hero badge**
- Given: Popover is open
- When: Rendered
- Then: Department name is shown, followed by the hero badge image (`109×19px`, same asset as kudo card row 3)

**Scenario 4: Row 3 — Divider**
- Given: Popover is open
- When: Rendered
- Then: A `1px` horizontal divider separates identity rows from stats rows

**Scenario 5: Row 4 & 5 — Kudos stats**
- Given: `GET /api/users/[id]/spotlight-stats` has resolved
- When: Rows 4–5 render
- Then: "Kudos đã nhận:" + count (e.g., `9`); "Kudos đã gửi:" + count (e.g., `12`)

**Scenario 6: Loading state**
- Given: Popover opened but API not yet resolved
- When: Rows 4–5 are pending
- Then: Skeleton loaders or `–` shown for count values; rows 1–3 and row 6 render immediately

**Scenario 7: API error**
- Given: Stats API call fails
- When: Rows 4–5 cannot be populated
- Then: Both counts display `–`; no error toast shown inside the popover

**Scenario 8: Row 6 — Send KUDO button**
- Given: Popover is open
- When: User clicks "Send KUDO"
- Then: Viết Kudo form opens with the recipient field pre-filled with this sunner (name + avatar chip)

**Scenario 9: "View profile" navigation**
- Given: Popover is open
- When: User clicks "[Full Name]"
- Then: Navigated to that sunner's profile page

**Scenario 10: Popover closes on mouse-leave**
- Given: Popover is open
- When: Cursor leaves both the trigger element and the popover card
- Then: Popover closes; avatar ring reverts to default

**Scenario 11: One popover at a time**
- Given: A popover is already open for sunner A
- When: User hovers over sunner B
- Then: The previous popover closes and a new one opens for sunner B

---

## Functional Requirements

### FR-001 — Avatar ring states
The avatar MUST support two visual states:

| State | Border | Radius |
|-------|--------|--------|
| Default | `1.869px solid #FFFFFF` | `50%` |
| Hover | `1.869px solid #FFEA9E` | `50%` |

### FR-002 — Popover card layout (6 rows)

| Row | Content | Notes |
|-----|---------|-------|
| 1 | Full name (large, white, underline/link) + "View profile for [Name]" link | Link → user profile page |
| 2 | Department name + hero badge image | Badge `109×19px`, same asset as kudo card |
| 3 | `1px` horizontal divider | Separates identity from stats |
| 4 | "Kudos đã nhận:" label + count | From API |
| 5 | "Kudos đã gửi:" label + count | From API |
| 6 | "Send KUDO" gold button | Opens Viết Kudo form with recipient pre-filled |

### FR-003 — Reusability
`SunnerHoverCard` is a **shared component**. Any surface that renders a sunner name or avatar MUST be able to wrap it with `<SunnerHoverCardTrigger userId={id}>` (or equivalent wrapper pattern) to activate hover behavior — without duplicating popover logic.

### FR-004 — Debounce
Popover opens after `~150ms` hover delay to prevent flicker during fast cursor movement.

### FR-005 — Viewport-aware anchoring
Popover is anchored to the trigger element and adjusts position (flip/shift) when near viewport or canvas edges to stay fully visible.

### FR-006 — Stats API
On open, fetch `GET /api/users/[id]/spotlight-stats` → `{ kudos_received: number; kudos_sent: number }`. Cache result per session to avoid redundant calls.

### FR-007 — Send KUDO pre-fill
Clicking "Send KUDO" calls the Viết Kudo form open handler, passing `defaultRecipient` as the hovered sunner's identity object.

---

## Technical Requirements

### TR-001 — Component files
| File | Purpose |
|------|---------|
| `src/components/kudos/SunnerHoverCard.tsx` | Popover card UI (6 rows) |
| `src/components/kudos/SunnerHoverCardTrigger.tsx` | Wrapper that applies hover logic + ring state to any child avatar/name |
| `src/app/api/users/[id]/spotlight-stats/route.ts` | API route returning kudos stats |
| `src/services/users.ts` | `fetchUserSpotlightStats(userId)` service function |

### TR-002 — Trigger mechanism
`SunnerHoverCardTrigger` wraps any child with `onMouseEnter` / `onMouseLeave`. It manages open/close state and passes `userId` to `SunnerHoverCard`.

### TR-003 — No SSR
Both components are `'use client'` — no server rendering needed.

### TR-004 — Avatar size
Avatar is always `64×64px`, `border-radius: 50%`, `object-fit: cover`.

---

## Data Requirements

### Trigger input props
| Prop | Type | Description |
|------|------|-------------|
| `userId` | `string` | Sunner's user ID |
| `userName` | `string` | Display name |
| `avatarUrl` | `string \| null` | Avatar image URL |
| `department` | `string` | Department name |
| `heroBadgeUrl` | `string \| null` | Hero badge image URL |

### API response — `spotlight-stats`
| Field | Type | Description |
|-------|------|-------------|
| `kudos_received` | `number` | Total kudos received |
| `kudos_sent` | `number` | Total kudos sent |

---

## API Requirements *(predicted)*

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/users/[id]/spotlight-stats` | GET | Return kudos_received + kudos_sent |

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | States |
|-----------|---------|-------------|--------|
| Avatar default | `490:5471` | 64×64px circle, white ring `1.869px solid #FFF` | Default |
| Avatar hover | `490:5469` | 64×64px circle, gold ring `1.869px solid #FFEA9E` | On hover |
| SunnerHoverCard | — (no Figma) | Dark card, 6-row layout, gold CTA button | Open on hover, close on leave |

> See `design-style.md` for full visual specifications.

### Navigation Flow

- **Trigger**: Hover over any sunner name or avatar
- **To (View profile)**: User profile page
- **To (Send KUDO)**: Viết Kudo form overlay with recipient pre-filled

### Accessibility

- Popover must be accessible via keyboard (Tab into trigger → Enter/Space to open)
- "View profile" and "Send KUDO" must be keyboard-reachable inside the popover
- `role="tooltip"` or `role="dialog"` depending on interactivity level

---

## Dependencies

- [ ] Viết Kudo form supports `defaultRecipient` prop for pre-fill
- [ ] `GET /api/users/[id]/spotlight-stats` API route implemented
- [ ] Hero badge image asset available (already used in kudo card)
- [ ] `SpotlightWordCloud` name spans wrapped with `SunnerHoverCardTrigger`
- [ ] Kudo card sender/recipient columns wrapped with `SunnerHoverCardTrigger`

---

## Out of Scope

- Mobile / touch trigger (Spotlight board is desktop-only; hover not available on touch)
- Popover animation/transition beyond default
- Showing avatar image inside the popover card (not in Figma, not in requirement)
