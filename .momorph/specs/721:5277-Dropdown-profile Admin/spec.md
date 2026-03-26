# Feature Specification: Dropdown-profile Admin

**Frame ID**: `721:5277`
**Frame Name**: `Dropdown-profile Admin`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

The admin variant of the profile dropdown menu. Appears when an admin-role user clicks their profile avatar in the navigation header. Displays three action items: **Profile** (navigate to profile page), **Dashboard** (navigate to admin dashboard), and **Logout** (sign out). The Profile item is visually active with a gold highlight and glow. This is identical in structure to `Dropdown-profile` (721:5223) but adds the **Dashboard** item between Profile and Logout.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Admin Dashboard (Priority: P1)

An admin user opens the profile dropdown and clicks "Dashboard" to access the admin control panel.

**Why this priority**: Dashboard is the primary admin-only action. Without it, admins cannot manage the application.

**Independent Test**: Log in as an admin user, click profile avatar, verify dropdown shows 3 items including "Dashboard", click "Dashboard", verify navigation to admin dashboard page.

**Acceptance Scenarios**:

1. **Given** the user has `role = 'admin'` and is on any authenticated screen, **When** the user clicks the profile avatar, **Then** the dropdown opens with 3 items: Profile (highlighted), Dashboard, Logout.
2. **Given** the admin dropdown is open, **When** the user clicks "Dashboard", **Then** the dropdown closes and the user is navigated to the admin dashboard page.
3. **Given** the "Dashboard" item is in default state, **When** the user hovers over it, **Then** the background changes to `rgba(255,234,158,0.10)`.

---

### User Story 2 - Navigate to Profile page (Priority: P1)

An admin user opens the profile dropdown and clicks "Profile" to view/edit their profile.

**Acceptance Scenarios**:

1. **Given** the admin dropdown is open, **When** the user clicks "Profile", **Then** the dropdown closes and the user navigates to their profile page.
2. **Given** the "Profile" item, **When** the user hovers, **Then** background changes to `rgba(255,234,158,0.20)`.

---

### User Story 3 - Logout (Priority: P1)

An admin user can sign out from the dropdown.

**Acceptance Scenarios**:

1. **Given** the admin dropdown is open, **When** the user clicks "Logout", **Then** the session is invalidated and the user is redirected to `/[locale]/login`.

---

### User Story 4 - Dismiss dropdown (Priority: P2)

Admin can close the dropdown without taking action.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside or presses Escape, **Then** the dropdown closes with no side effects.

---

### Edge Cases

- What if a non-admin user somehow opens this dropdown? → Guard with role check; render `Dropdown-profile` (user variant) instead.
- What if the admin dashboard page is not yet implemented? → Navigate to a placeholder or show a 404.
- What if the admin loses their admin role while the dropdown is open? → Close dropdown; subsequent actions should fail gracefully.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A_Dropdown-List | 666:9728 | Container: `#00070C` bg, `#998C5F` border, `8px` radius, `6px` padding | Open/close with animation |
| A.1 Profile | I666:9728;666:9277 | 151×56px, `rgba(255,234,158,0.10)` bg, glow text, profile icon | Click → profile page |
| A.2 Dashboard | I666:9728;666:9452 | 153×56px, transparent bg, dashboard icon (662:10350) | Click → admin dashboard |
| A.3 Logout | I666:9728;666:9278 | 153×56px, transparent bg, chevron-right icon | Click → logout |

> See `design-style.md` for pixel-perfect specifications.

### Navigation Flow

- **From**: Any authenticated screen (admin profile avatar click)
- **To (Profile)**: User profile page
- **To (Dashboard)**: Admin dashboard (route TBD, e.g., `/[locale]/admin`)
- **To (Logout)**: `/[locale]/login` after session invalidation
- **Dismiss**: Same screen, no navigation

### Visual Requirements

- Identical visual treatment to `Dropdown-profile` user variant.
- "Dashboard" item uses a unique icon (componentId `662:10350`) — different from the chevron-right used in Logout.
- Refer to `design-style.md` for all dimensions and color values.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST display exactly 3 items for admin users: "Profile", "Dashboard", "Logout" (in this order).
- **FR-002**: The dropdown MUST only render for users with `role = 'admin'`; regular users MUST see `Dropdown-profile` instead.
- **FR-003**: "Profile" MUST navigate to the user profile page.
- **FR-004**: "Dashboard" MUST navigate to the admin dashboard page.
- **FR-005**: "Logout" MUST invalidate the session and redirect to Login.
- **FR-006**: The dropdown MUST close after any item is clicked.
- **FR-007**: The dropdown MUST close on outside click or Escape key press.

### Technical Requirements

- **TR-001**: Client Component (`'use client'`) — same as user variant.
- **TR-002**: Role check MUST be performed server-side (from auth session/profile) before rendering.
- **TR-003**: Logout MUST call Supabase `auth.signOut()` via server action or API route.
- **TR-004**: Should share the same base component as `Dropdown-profile` with a prop/variant system (e.g., `role="admin"` shows Dashboard item).

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/auth/signout` | POST | Invalidate session, clear cookie | Predicted |

---

## Success Criteria

- **SC-001**: Admin dropdown renders with 3 items (Profile, Dashboard, Logout) for `role = 'admin'` users.
- **SC-002**: Regular users never see the Dashboard item.
- **SC-003**: Dashboard navigation works correctly within 300ms of click.

---

## Out of Scope

- Admin-specific settings page (not shown in this dropdown).
- The admin dashboard implementation itself.
- User management features accessible from the dropdown.

---

## Dependencies

- [x] `Dropdown-profile` (regular user variant) spec completed at `721:5223-Dropdown-profile/spec.md`
- [x] Database `public.profiles.role` column with `'admin'` value
- [ ] Admin dashboard page route defined

---

## Notes

- The only visual difference from the regular `Dropdown-profile` is the addition of "Dashboard" (A.2) between Profile and Logout.
- Prefer a shared component with a `variant` prop rather than two entirely separate components.
- The Dashboard icon componentId is `662:10350` — must be included in the Icon component set.
