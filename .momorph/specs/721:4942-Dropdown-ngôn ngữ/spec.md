# Feature Specification: Dropdown-ngôn ngữ (Language Selector)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A floating dropdown component that allows users to switch the application's display language between Vietnamese (VN) and English (EN). The dropdown appears as an overlay panel containing two language options, each rendered with the corresponding country flag icon and language code. The currently selected language is visually highlighted. Selecting a language updates the UI locale and closes the dropdown.

This component is a locale-switcher tied to the Next.js i18n routing system (`next-intl` or equivalent). It is accessible from the navigation/header area across all authenticated and unauthenticated screens.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch to English (Priority: P1)

A user whose preferred language is English opens the language dropdown and selects "EN" to switch the entire application interface to English.

**Why this priority**: Language selection is a fundamental accessibility and usability feature. Users who cannot read Vietnamese must switch to English before they can use the application. This is a P1 blocker for non-Vietnamese speakers.

**Independent Test**: Navigate to any page showing the language dropdown trigger. Open the dropdown, click "EN", and verify the page reloads/re-renders with English content.

**Acceptance Scenarios**:

1. **Given** the application is displayed in Vietnamese, **When** the user opens the language dropdown and clicks the "EN" option, **Then** the application locale changes to English, all UI text updates to English, the dropdown closes, and the "EN" option is shown as selected on subsequent dropdown opens.
2. **Given** the dropdown is open showing VN (selected) and EN (unselected), **When** the user clicks EN, **Then** the URL locale segment updates (e.g., `/…` → `/en/…`) and the page navigates with English locale.
3. **Given** the EN option is in default (unselected) state, **When** the user hovers over it, **Then** the item background changes to the hover highlight color.

---

### User Story 2 - Switch to Vietnamese (Priority: P1)

A user whose preferred language is English opens the language dropdown and selects "VN" to switch the application interface to Vietnamese.

**Why this priority**: Symmetric to US1 — both directions of language switching must work. Vietnamese is the primary locale so this must always be functional.

**Independent Test**: Navigate to any page with the locale set to English. Open the dropdown, click "VN", and verify the interface updates to Vietnamese.

**Acceptance Scenarios**:

1. **Given** the application is displayed in English, **When** the user opens the language dropdown and clicks the "VN" option, **Then** the locale changes to Vietnamese, UI text updates, dropdown closes.
2. **Given** the VN option is in default (unselected) state, **When** the user hovers over it, **Then** the item background changes to the hover highlight.

---

### User Story 3 - Visual feedback for current language (Priority: P2)

A user opening the language dropdown can immediately identify which language is currently active without reading the text.

**Why this priority**: Good UX — the selected language should be clearly distinguished from unselected options via visual highlight.

**Independent Test**: Set locale to Vietnamese, open the dropdown, verify VN item has the selected highlight background; set locale to English, open dropdown, verify EN item is highlighted.

**Acceptance Scenarios**:

1. **Given** the current locale is Vietnamese, **When** the user opens the dropdown, **Then** the VN item displays with background `rgba(255, 234, 158, 0.20)` and the EN item has a transparent background.
2. **Given** the current locale is English, **When** the user opens the dropdown, **Then** the EN item displays with the selected highlight and VN item has transparent background.

---

### User Story 4 - Dismiss dropdown without changing language (Priority: P2)

A user who accidentally opens the language dropdown can close it without changing the current language.

**Why this priority**: Important for error-recovery UX. Users should be able to dismiss accidentally opened dropdowns.

**Independent Test**: Open the dropdown, click outside of it or press Escape, verify the dropdown closes and locale is unchanged.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes and the current language is unchanged.
2. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes without changing the language.

---

### Edge Cases

- What happens when a new locale is not supported? → Only `vi` and `en` are supported; the component should not render options beyond these two.
- What if the locale URL parameter is missing or invalid? → Default to Vietnamese (`vi`) per application fallback logic.
- What if the user rapidly clicks between VN and EN? → Each click should trigger a clean navigation; no race conditions or visual glitches.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| A_Dropdown-List (525:11713) | Floating container with dark background and gold border. Wraps both language options. | Appears/disappears on trigger click. Click outside to dismiss. |
| A.1 tiếng Việt (I525:11713;362:6085) | Vietnamese language option. Shows VN flag + "VN" label. Highlighted when active locale is `vi`. | Click → switch to Vietnamese. Hover → subtle highlight. |
| A.2 tiếng Anh (I525:11713;362:6128) | English language option. Shows GB-NIR flag + "EN" label. Highlighted when active locale is `en`. | Click → switch to English. Hover → subtle highlight. |

> See `design-style.md` for pixel-perfect visual specifications including colors, typography, spacing, and component dimensions.

### Navigation Flow

- **From**: Any screen where the language trigger button is rendered (header/navbar)
- **To**: Same screen with locale segment updated (e.g., `/login` → `/en/login`)
- **Triggers**: Click on language option → Next.js locale navigation

### Visual Requirements

- Refer to `design-style.md` → Layout Structure (ASCII) for exact dimensions and positioning.
- The dropdown floats above page content (`z-index: 1` / higher if needed).
- **Responsive**: Dropdown dimensions are fixed; positioning is relative to the trigger button across all breakpoints (mobile, tablet, desktop).
- **Animations**: Open/close with 150ms ease-out opacity + translateY transition.
- **Accessibility**: Minimum touch target 56px height (satisfies 44×44px WCAG requirement). Keyboard navigable (Escape to close, Enter/Space to select).

### Flag Icons

Flag icons (VN Vietnam, GB-NIR English) must be implemented as **Icon Components** — not `<img>` tags or raw SVGs. See constitution §VII and `design-style.md` Icon Specifications.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST display exactly two language options: Vietnamese (VN) and English (EN).
- **FR-002**: The currently active locale MUST be visually distinguished with the selected background (`rgba(255, 234, 158, 0.20)`).
- **FR-003**: Users MUST be able to switch locale by clicking a language option, which navigates to the same page with the new locale prefix.
- **FR-004**: The dropdown MUST close automatically after a language is selected.
- **FR-005**: The dropdown MUST close when the user clicks outside or presses Escape.
- **FR-006**: Each language item MUST display a country flag icon alongside the language code text.
- **FR-007**: Hover state MUST provide visual feedback on language items.

### Technical Requirements

- **TR-001**: Locale switching MUST use Next.js App Router locale-based routing — no full page reload beyond the natural Next.js navigation.
- **TR-002**: The component MUST be a Client Component (`'use client'`) since it requires state for open/close toggle and event handlers.
- **TR-003**: All locale values MUST be sourced from the i18n configuration — no hardcoded locale strings in the component beyond the config import.
- **TR-004**: The component MUST NOT contain business logic — locale navigation is the only side-effect.
- **TR-005**: Performance: initial render of dropdown list must be < 16ms (60fps), no layout thrash on open.

### Key Entities *(if feature involves data)*

- **Locale**: Represents the selected application language. Values: `vi` (Vietnamese) | `en` (English). Controlled by Next.js i18n routing.
- **LanguageOption**: UI data model `{ locale: string, code: string, flagIcon: string }`. E.g., `{ locale: 'vi', code: 'VN', flagIcon: 'flag-vn' }`.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| _None_ | — | Locale switching is client-side routing; no API call required | — |

> This feature is purely a client-side i18n navigation concern. No backend API calls are needed.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Locale switches within 200ms of user click (measured from click to page render with new locale content).
- **SC-002**: Selected language item is visually distinct (background token `rgba(255,234,158,0.20)`) in 100% of opens matching the current locale.
- **SC-003**: Dropdown dismisses correctly (closes without locale change) 100% of the time on outside-click or Escape key.

---

## Out of Scope

- Adding a third language (e.g., Japanese) — only VN and EN are in scope.
- Persisting language preference to user profile/database — locale is derived from URL routing only.
- Auto-detecting browser language preference — not included in this iteration.
- The trigger button that opens this dropdown (separate component/frame).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — _Not required for this feature_
- [ ] Database design completed (`.momorph/database.md`) — _Not required for this feature_
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The design uses **Montserrat** as the font family (not Inter). Ensure Montserrat is loaded in the project (check `globals.css` / `layout.tsx`).
- The dropdown border color `#998C5F` and background `#00070C` are named design tokens (`Details-Border` and `Details-Container-2` in Figma) — add them to `globals.css` if not already present.
- The frame visual reference image is available at: `https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/721:4942/33b849680cdef15298c122effb920fd4.png`
- Component should reside in `src/components/ui/LocaleDropdown.tsx` — **implemented and shared across all screens**.
