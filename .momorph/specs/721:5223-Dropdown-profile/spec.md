# Feature Specification: Dropdown-profile (User Profile Menu)

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A floating dropdown menu component that appears when a regular (non-admin) user clicks their profile avatar in the navigation header. The dropdown presents two action items: **Profile** (navigate to profile page) and **Logout** (sign out). The Profile item is visually distinguished with a subtle gold highlight and text glow effect, indicating it is the current/active item. Logout has a transparent background by default.

This component is a UI overlay (no dedicated URL) anchored to the profile avatar button. It is shown only for users with the `user` role — admin users see a different variant (`Dropdown-profile Admin`, frame `721:5277`).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Profile page (Priority: P1)

A regular user opens the profile dropdown and clicks "Profile" to navigate to their profile page.

**Why this priority**: Accessing one's own profile is a core authenticated-user action. The dropdown is the primary entry point to the profile page from the global navigation.

**Independent Test**: Log in as a regular user, click the profile avatar, verify the dropdown opens, click "Profile", verify navigation to the profile page.

**Acceptance Scenarios**:

1. **Given** the user is authenticated as a regular user and on any authenticated screen, **When** the user clicks the profile avatar, **Then** the profile dropdown opens with two items: "Profile" (highlighted) and "Logout".
2. **Given** the profile dropdown is open, **When** the user clicks the "Profile" item, **Then** the dropdown closes and the user is navigated to the profile page.
3. **Given** the "Profile" item is rendered, **When** the user hovers over it, **Then** the background changes to `rgba(255, 234, 158, 0.20)` (double the default active opacity).

---

### User Story 2 - Logout (Priority: P1)

A regular user opens the profile dropdown and clicks "Logout" to sign out of the application.

**Why this priority**: Logout is a critical authentication action. Users must always be able to securely sign out. Failure to provide this results in a security gap.

**Independent Test**: Log in as a regular user, open the profile dropdown, click "Logout", verify the session is destroyed and the user is redirected to the Login screen.

**Acceptance Scenarios**:

1. **Given** the profile dropdown is open, **When** the user clicks the "Logout" item, **Then** the user session is invalidated, the dropdown closes, and the user is redirected to `/[locale]/login`.
2. **Given** the "Logout" item is in default state (transparent background), **When** the user hovers over it, **Then** the background changes to `rgba(255, 234, 158, 0.10)`.
3. **Given** the user has been logged out successfully, **When** the user attempts to navigate to a protected route, **Then** the user is redirected to the login page (session invalidated).

---

### User Story 3 - Dismiss dropdown without action (Priority: P2)

A user who accidentally opens the profile dropdown can close it without triggering any action.

**Why this priority**: Standard dropdown UX — users should be able to cancel out of accidentally opened menus.

**Independent Test**: Open the profile dropdown, click outside or press Escape, verify the dropdown closes and no navigation occurs.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes with no side effects.
2. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes with no navigation or logout action triggered.

---

### Edge Cases

- What if the logout API call fails? → Display an error notification; do not redirect. The dropdown should remain closable.
- What if the user is an admin? → This component must NOT render for admin users. Admin users see `Dropdown-profile Admin` (frame `721:5277`) instead.
- What if the user rapidly double-clicks "Logout"? → Debounce or disable the button on first click to prevent double logout requests.
- What if the profile page route doesn't exist yet? → Show a 404 or redirect gracefully; the dropdown action itself is correct.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A_Dropdown-List | 666:9601 | Floating container (`#00070C` bg, `1px solid #998C5F` border, `8px` radius, `6px` padding, flex-col). Wraps both menu items. | Appears on avatar click. Dismiss on outside click or Escape. 150ms ease-out open animation. |
| A.1 Profile | I666:9601;563:7844 | Profile menu item (119×56px). Shows "Profile" label with gold glow + profile icon (24×24). Default/active bg: `rgba(255,234,158,0.10)`. | Click → navigate to profile. Hover → bg: `rgba(255,234,158,0.20)`. |
| A.2 Logout | I666:9601;563:7868 | Logout menu item (121×56px). Shows "Logout" label + chevron-right icon (24×24). Default bg: transparent. | Click → execute logout. Hover → bg: `rgba(255,234,158,0.10)`. |

> See `design-style.md` for pixel-perfect visual specifications including colors, typography, spacing, and all component dimensions.

### Navigation Flow

- **From**: Any authenticated screen (profile avatar click in header)
- **To (Profile)**: User profile page (route TBD, e.g., `/[locale]/profile`)
- **To (Logout)**: Login screen `/[locale]/login` (after session invalidation)
- **Dismiss**: Same screen, no navigation

### Visual Requirements

- Refer to `design-style.md` → Layout Structure (ASCII) for exact dimensions and positioning.
- Dropdown is `position: absolute`, anchored to the right edge of the profile avatar trigger.
- Floats above page content; appropriate `z-index` required.
- **Animations**: Open/close with 150ms ease-out `opacity` + `translateY` transition.
- **Typography**: Montserrat 700 16px / 24px line-height / 0.15px letter-spacing for all labels.
- **Glow effect** on Profile label: `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` — signature design detail, active/default state.
- **Accessibility**: 56px height per item satisfies 44×44px WCAG touch target requirement. Keyboard navigable (Tab/Enter/Space to select, Escape to close).

### Icon Specifications

Icons MUST be implemented as **Icon Components** — not `<img>` tags or inline SVGs.

| Icon | Component ID | Size | Usage |
|------|-------------|------|-------|
| Profile / User icon | `186:1611` | 24×24px | Profile menu item (right of label) |
| Chevron-right / Logout arrow | `335:10890` | 24×24px | Logout menu item (right of label) |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST display exactly two items for regular users: "Profile" and "Logout" (in this order).
- **FR-002**: The dropdown MUST only be shown for users with `role = 'user'`; admin users MUST see `Dropdown-profile Admin` instead.
- **FR-003**: The "Profile" item MUST navigate the user to the profile page on click.
- **FR-004**: The "Logout" item MUST invalidate the user session and redirect to the Login screen on click.
- **FR-005**: The dropdown MUST close automatically after any item is clicked.
- **FR-006**: The dropdown MUST close when the user clicks outside it or presses Escape, without triggering any navigation or logout.
- **FR-007**: The "Profile" item MUST display a gold text glow (`text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) on its label in the default/active state.
- **FR-008**: Hover state MUST provide visual background feedback on both menu items.

### Technical Requirements

- **TR-001**: The dropdown MUST be a Client Component (`'use client'`) — it requires state for open/close toggle and interaction handlers.
- **TR-002**: Logout MUST call Supabase `auth.signOut()` (server-side via API route or server action) to invalidate the HTTP-only session cookie.
- **TR-003**: After logout, the redirect MUST go to `/[locale]/login` using the current active locale.
- **TR-004**: The component MUST NOT render for admin users — role check from auth context/session.
- **TR-005**: The dropdown animation MUST complete within 150ms and not cause layout shift.

### Key Entities *(if feature involves data)*

- **Profile**: The authenticated user's profile record from `public.profiles` (`id`, `full_name`, `email`, `avatar_url`, `role`).
- **Session**: Managed by Supabase Auth via HTTP-only cookies. Logout destroys the session server-side.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/auth/logout` (Supabase) | POST | Invalidate user session, clear auth cookie | Required |
| `/api/auth/signout` | POST | Next.js route handler wrapping Supabase signOut | Predicted |

> Profile navigation is client-side routing — no API call. Logout requires a server-side call to invalidate the Supabase session cookie securely.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dropdown opens within 150ms of profile avatar click (animation completes within 150ms).
- **SC-002**: Clicking "Profile" navigates to the profile page within 300ms.
- **SC-003**: Clicking "Logout" invalidates the session and redirects to Login within 500ms.
- **SC-004**: Dropdown dismisses correctly (closes, no side effects) 100% of the time on outside-click or Escape key.
- **SC-005**: The component does NOT render for admin-role users — confirmed by role check.

---

## Out of Scope

- The "Settings" item — not present in this design frame (the SCREENFLOW describes Settings as navigable but it does not appear in frame `721:5223`).
- The admin variant `Dropdown-profile Admin` (frame `721:5277`) — separate spec.
- The profile avatar trigger button (separate component, part of the header/navbar).
- Profile page implementation — this spec covers the dropdown navigation action only.
- Editing user profile data — out of scope for this dropdown.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [ ] Profile page route defined — needed for the Profile navigation target
- [ ] API specifications for logout endpoint (`.momorph/API.yml`) — Predicted above
- [x] Database design completed — `public.profiles` table with `role` column exists in migration

---

## Notes

- The Profile item is shown with `rgba(255,234,158,0.10)` background in the Figma design, which appears to represent the **active/current** state (user is on profile-related page). The hover state raises this to `rgba(255,234,158,0.20)`.
- Design tokens `--color-dropdown-bg` (`#00070C`) and `--color-dropdown-border` (`#998C5F`) are shared with `Dropdown-ngôn ngữ` — verify they are already in `globals.css` before adding.
- Font is **Montserrat** — already loaded in `layout.tsx`.
- The frame visual reference image is available at: `.momorph/specs/721:5223-Dropdown-profile/assets/`
- Component should reside in `src/components/profile/ProfileDropdown.tsx` or `src/components/layout/ProfileDropdown.tsx` per the folder structure in constitution §II.
- Minimum touch target: 56px height satisfies the 44×44px WCAG requirement.
