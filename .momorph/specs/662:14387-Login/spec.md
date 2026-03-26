# Feature Specification: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

The **Login** screen is the entry point to the Sun Annual Awards 2025 (SAA 2025) application. It presents the event brand identity ("ROOT FURTHER") with a full-screen artistic key visual and provides a single authentication pathway via Google OAuth. Users are prompted to sign in to access the awards platform.

The screen includes a language selector (Vietnamese/English) in the header, a hero section with the event tagline, and a golden-yellow Google login button that initiates the OAuth flow. A copyright footer anchors the bottom of the page.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Google Login Authentication (Priority: P1)

A user visits the SAA 2025 platform for the first time (or while logged out) and authenticates using their Google account to gain access.

**Why this priority**: Authentication is the sole gateway to the entire application. Without completing this story, no other functionality is accessible. This is the MVP.

**Independent Test**: Navigate to `/login` → Click "LOGIN With Google" → Complete Google OAuth → Verify redirect to the post-login destination (dashboard/home).

**Acceptance Scenarios**:

1. **Given** the user is on the Login page, **When** they click "LOGIN With Google", **Then** the Google OAuth consent screen opens in a popup or redirect flow.
2. **Given** Google OAuth completes successfully, **When** the callback is received, **Then** the user is redirected to the application dashboard/home page and is authenticated.
3. **Given** the user has an existing valid session, **When** they visit the Login page, **Then** they are automatically redirected to the dashboard (no login required again).
4. **Given** the Google OAuth flow is in progress, **When** the login button is in processing state, **Then** the button is disabled and displays a loading indicator; it cannot be clicked again.
5. **Given** the Google OAuth flow fails or is cancelled, **When** the user is returned to the Login page, **Then** an appropriate error message is shown and the button returns to its default state.

---

### User Story 2 - Language Selection (Priority: P2)

A user wants to switch the application's display language between Vietnamese (VN) and other available languages.

**Why this priority**: Localization improves accessibility for non-Vietnamese users. The language selector is visible on the Login page and should function before authentication.

**Independent Test**: On the Login page, click the "VN" language button → Dropdown opens → Select a different language → Verify the UI updates to reflect the selected language.

**Acceptance Scenarios**:

1. **Given** the user is on the Login page, **When** they click the "VN" language selector button, **Then** a dropdown appears listing available language options (linked frame: `721:4942`).
2. **Given** the language dropdown is open, **When** the user selects a language, **Then** the dropdown closes and the UI language switches accordingly.
3. **Given** the language dropdown is open, **When** the user clicks outside it, **Then** the dropdown closes without changing the language.
4. **Given** the page loads, **When** no language preference has been set, **Then** the default language is "VN" (Vietnamese).

---

### Edge Cases

- What happens when the Google OAuth popup is blocked by the browser? → Display an instructional message to allow popups.
- How does the system handle a Google account that is not registered / not authorized for SAA 2025? → Show an "Access denied" or "Account not found" error.
- What if the network is unavailable when the user clicks login? → Display a network error message; the button returns to default state.
- What if a user tries to access the login page after already being authenticated? → Redirect to dashboard immediately.

---

## UI/UX Requirements _(from Figma)_

> Visual specifications are documented in full in [`design-style.md`](./design-style.md).

### Screen Components

| Component         | Node ID                  | Description                                                                           | Interactions                                                                   |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A_Header          | `662:14391`              | Top navigation bar with logo and language selector. Semi-transparent dark background. | Language button: click opens dropdown                                          |
| A.1_Logo          | `I662:14391;186:2166`    | Sun Annual Awards 2025 brand logo (52×56px image), top-left                           | None (non-interactive)                                                         |
| A.2_Language      | `I662:14391;186:1601`    | Language toggle button (VN flag + "VN" text + chevron), top-right                     | Click: opens language dropdown (frame `721:4942`); Hover: highlight            |
| C_Keyvisual       | `662:14388`              | Full-screen decorative background artwork (colorful wave design)                      | None (decorative)                                                              |
| Gradient overlays | `662:14392`, `662:14390` | Left-to-transparent and bottom-to-transparent dark gradient overlays for readability  | None                                                                           |
| B_Bìa (Hero)      | `662:14393`              | Main hero section containing title, description, and login button                     | Container only                                                                 |
| B.1_Key Visual    | `662:14395`              | "ROOT FURTHER" event title as an image logo (451×200px)                               | None (decorative)                                                              |
| B.2_content       | `662:14753`              | Two-line hero description text in Vietnamese                                          | None (static)                                                                  |
| B.3_Login         | `662:14425`              | Golden-yellow "LOGIN With Google" button with Google icon                             | Click: initiates Google OAuth; Hover: visual lift; Disabled: during processing |
| D_Footer          | `662:14447`              | Copyright bar at bottom with border-top divider                                       | None (static)                                                                  |

### Navigation Flow

- **From**: Unauthenticated state / direct URL access
- **To (success)**: Application dashboard / home page (post-authentication)
- **To (language)**: Language dropdown frame `721:4942` (overlay/popup)
- **Triggers**:
  - Click "LOGIN With Google" → initiates Google OAuth flow
  - Click "VN" language selector → opens language dropdown overlay

### Visual Requirements

- The page uses a **full-screen dark theme** (`#00101A` background).
- The **key visual artwork** fills the entire screen as a background layer.
- Two **gradient overlays** create depth: a left-side horizontal fade and a bottom vertical fade, ensuring text readability over the artwork.
- The **header is semi-transparent** (`rgba(11,15,18,0.8)`), positioned at the top.
- The **footer is anchored at the bottom** with a top border separator.
- Responsive breakpoints: Desktop (1440px) is the primary target. Mobile/tablet breakpoints are not specified in the current Figma frame.
- Animations/Transitions: Login button hover has a subtle lift/shadow effect. Language dropdown has a standard open/close animation.
- Accessibility: All interactive elements (login button, language selector) must have appropriate ARIA labels. Contrast ratio for the golden button text on background should meet WCAG AA.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display the Login page to any unauthenticated user who accesses the application.
- **FR-002**: System MUST provide a "LOGIN With Google" button that initiates Google OAuth 2.0 authentication.
- **FR-003**: System MUST redirect authenticated users away from the Login page to the main application.
- **FR-004**: System MUST disable the login button and show a loading state while authentication is in progress.
- **FR-005**: System MUST display an error state on authentication failure and reset the button to its default state.
- **FR-006**: System MUST display the language selector with the current active language (default: VN).
- **FR-007**: System MUST open a language selection dropdown when the language selector is clicked.
- **FR-008**: System MUST persist the user's language preference selection.

### Technical Requirements

- **TR-001**: Google OAuth 2.0 must be implemented securely; access tokens must not be exposed in URLs or client-side storage in plaintext.
- **TR-002**: Session management must use secure, HTTP-only cookies or equivalent server-side session mechanism.
- **TR-003**: The Google OAuth callback endpoint must validate the `state` parameter to prevent CSRF attacks.
- **TR-004**: The page must load within 3 seconds on standard broadband connections (hero image should be optimized).
- **TR-005**: The application must support internationalization (i18n) with at minimum Vietnamese (VN) as the default language.

### Key Entities

- **User**: Represents an authenticated user. Key attributes: Google account ID, email, display name, avatar, preferred language, session token.
- **Language Preference**: Persisted user or browser-level language setting (e.g., `vi`, `en`).

---

## API Dependencies

| Endpoint                | Method | Purpose                                                              | Status          |
| ----------------------- | ------ | -------------------------------------------------------------------- | --------------- |
| `/auth/google`          | GET    | Initiate Google OAuth flow; redirects to Google consent screen       | Predicted (New) |
| `/auth/google/callback` | GET    | Handle OAuth callback; validates authorization code, creates session | Predicted (New) |
| `/auth/session`         | GET    | Check current authentication status / session validity               | Predicted (New) |
| `/auth/logout`          | POST   | Invalidate current session                                           | Predicted (New) |

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can successfully log in with a valid Google account within 30 seconds of first page load.
- **SC-002**: Unauthenticated page access rate drops to 0% after authentication flow — all protected pages redirect properly.
- **SC-003**: Language switching works correctly for all supported locales; UI text updates immediately after selection.
- **SC-004**: The login button loading state appears within 200ms of click; OAuth redirect occurs within 1 second.
- **SC-005**: Zero incidents of session token exposure in browser history, local storage, or network logs in plaintext.

---

## Out of Scope

- Email/password authentication (only Google OAuth is in scope for this screen).
- Social logins other than Google (Facebook, GitHub, etc.).
- Mobile responsive design (current frame is desktop-only; mobile spec is a separate deliverable).
- User registration flow (handled by Google OAuth; no separate sign-up page required).
- Password recovery flow.
- Admin login or separate authentication paths.

---

## Dependencies

- [x] Figma design frame available (`662:14387`)
- [ ] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Language dropdown frame defined (`721:4942 - Dropdown-ngôn ngữ`) → implemented as shared `src/components/ui/LocaleDropdown.tsx`

---

## Notes

- The hero text is in **Vietnamese** ("Bắt đầu hành trình của bạn cùng SAA 2025. / Đăng nhập để khám phá!"); this should be i18n-ready.
- The "ROOT FURTHER" title is rendered as an image asset, not text — this simplifies cross-browser font concerns but requires an alt text attribute for accessibility.
- The footer copyright text references "Sun\* © 2025" — ensure this is configurable or uses the correct legal entity name.
- The event is **SAA 2025** (Sun Annual Awards 2025); the theme/tagline is "ROOT FURTHER".
