# Implementation Plan: Login

**Frame**: `662:14387-Login`
**Date**: 2026-03-10
**Spec**: `specs/662:14387-Login/spec.md`

---

## Summary

Implement the Login screen for Sun Annual Awards 2025 (SAA 2025). The feature delivers:

1. A full-screen branded splash page ("ROOT FURTHER" key visual) with a single **Google OAuth** login CTA.
2. A **language selector** (VN default) in the header for pre-auth i18n switching.

Authentication is handled entirely through **Supabase** (`@supabase/ssr` + Google OAuth provider). A Next.js middleware guards all protected routes and refreshes the Supabase session cookie on every request. The design uses a dark-navy theme with golden-yellow accents and Montserrat typography, as documented in `design-style.md`.

---

## Technical Context

| Concern                | Decision                                                      |
| ---------------------- | ------------------------------------------------------------- |
| **Language/Framework** | TypeScript 5.x strict / Next.js 15 App Router                 |
| **Styling**            | Tailwind CSS 4.x + CSS variables in `globals.css`             |
| **Auth**               | Supabase `@supabase/ssr` 2.x — Google OAuth provider          |
| **Database**           | Supabase (PostgreSQL) — session managed by Supabase           |
| **i18n**               | `next-intl` 3.x (new dependency — see Compliance note)        |
| **Testing**            | Vitest (unit) + Playwright (E2E)                              |
| **State Management**   | No global store needed; local React state for button/dropdown |
| **API Style**          | Next.js Route Handlers (thin controllers)                     |
| **Deployment**         | Cloudflare via OpenNext                                       |

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

| Requirement                  | Rule                                                                         | Status            |
| ---------------------------- | ---------------------------------------------------------------------------- | ----------------- |
| TypeScript strict mode       | §VIII — `strict: true`, no `any`                                             | ✅ Compliant      |
| Folder structure             | §II — `(auth)/login`, `api/auth/callback`, `components/login/`               | ✅ Compliant      |
| Server Components by default | §III — Login page is a Server Component; button is `'use client'`            | ✅ Compliant      |
| Supabase client usage        | §IV — Browser client in `LoginButton`, Server client in callback route       | ✅ Compliant      |
| Middleware session refresh   | §IV / §VI — `src/middleware.ts` refreshes session on every request           | ✅ Compliant      |
| RLS enforcement              | §IV / §VI — Supabase RLS required on any user tables created                 | ✅ Compliant      |
| Design tokens                | §VII — All colors/spacing added to `globals.css`, consumed via Tailwind      | ✅ Compliant      |
| No raw `<img>`               | §III — Use Next.js `<Image>` for Logo, Key Visual, Google icon               | ✅ Compliant      |
| No hardcoded URLs            | §III / guidelines/frontend.md — routes derived from SCREENFLOW.md            | ✅ Compliant      |
| CSRF protection              | §VI — Supabase `@supabase/ssr` handles `state` param natively; do not bypass | ✅ Compliant      |
| Responsive (mobile-first)    | §V — Min 375px mobile, test at 375/768/1024/1440px                           | ✅ Compliant      |
| i18n library (`next-intl`)   | Not in constitution's approved list                                          | ⚠️ New dependency |

**Violations (if any)**:

| Violation          | Justification                                                                                                     | Alternative Rejected                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Adding `next-intl` | FR-008 requires persistent i18n with server-side support; App Router requires framework-level routing integration | Manual context-based i18n is non-scalable; router-agnostic `i18next` lacks App Router sub-path support |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based (`components/login/`) with atomic `components/ui/` atoms (Button, etc.)
- **Styling Strategy**: Tailwind CSS 4.x utilities generated from CSS variables. Design tokens for Login screen are added to `globals.css` under a `/* Login */` comment block.
- **Data Fetching**: No client-side data fetching needed for the login page. The Login page Server Component calls `supabase.auth.getUser()` to redirect already-authenticated users.
- **i18n**: `next-intl` with locale sub-paths (`/login`, `/en/login`) — vi is default, no prefix — the middleware handles locale detection and redirect. Fallback: Vietnamese (`vi`).

### Backend Approach

- **Auth flow**: Supabase Google OAuth — `supabase.auth.signInWithOAuth()` on the client triggers a redirect to Google. Google returns to the Supabase callback URL which passes a `code` to our `/api/auth/callback` route handler.
- **Callback route**: Exchanges `code` for a session via `supabase.auth.exchangeCodeForSession(code)`, then redirects to `/` (protected dashboard). Validates `next` redirect param against allow-list to prevent open-redirect attacks.
- **Session management**: Fully delegated to `@supabase/ssr` — session cookies are `HttpOnly`, `Secure`, `SameSite=Lax` by default.
- **Middleware**: `src/middleware.ts` uses the Supabase middleware client to refresh the session on every request, and redirects unauthenticated users from `(protected)` routes to `/login`.

### Integration Points

- **Supabase Auth** (`@supabase/ssr`): Existing `createBrowserClient`, `createServerClient`, and middleware client are already in `src/libs/supabase/`.
- **SCREENFLOW.md**: Source of truth for `/login` → `/` (dashboard) and language dropdown navigation.
- **No shared components yet** — `Header`, `Footer`, and `LoginButton` will be new; `LoginButton` may become a shared `ui/Button` atom.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/662:14387-Login/
├── spec.md              ✅ Feature specification
├── plan.md              ✅ This file
├── design-style.md      ✅ Visual specifications
└── assets/
    └── frame.png        ✅ Figma screenshot
```

### Assets (Phase 0 — download from Figma media)

| Figma Node ID                           | Local path                                         | Description                          |
| --------------------------------------- | -------------------------------------------------- | ------------------------------------ |
| `I662:14391;178:1033;178:1030`          | `public/assets/login/logos/saa-logo.png`           | SAA 2025 logo                        |
| `2939:9548`                             | `public/assets/login/images/root-further-logo.png` | "ROOT FURTHER" title image           |
| `I662:14391;186:1696;186:1821;186:1709` | `public/assets/login/icons/vn-flag.svg`            | VN country flag                      |
| `I662:14391;186:1696;186:1821;186:1441` | `public/assets/login/icons/chevron-down.svg`       | Dropdown chevron                     |
| `I662:14426;186:1766`                   | `public/assets/login/icons/google-icon.svg`        | Google brand icon                    |
| `662:14388` (keyvisual)                 | `public/assets/login/images/keyvisual.png`         | Background artwork (large, optimize) |

### Source Code (new & modified files)

```text
src/
├── app/
│   ├── (auth)/                        [NEW route group]
│   │   └── login/
│   │       └── page.tsx               [NEW] Login page (Server Component)
│   ├── (protected)/                   [NEW route group – placeholder for future screens]
│   │   └── layout.tsx                 [NEW] Auth guard layout
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts           [NEW] Supabase OAuth callback handler
│   └── globals.css                    [MODIFY] Add Login design tokens
│
├── components/
│   ├── login/
│   │   ├── LoginButton.tsx            [NEW] 'use client' – Google OAuth button
│   │   ├── LanguageSelector.tsx       [NEW] 'use client' – language toggle button
│   │   └── LanguageDropdown.tsx       [NEW] 'use client' – language dropdown overlay
│   └── ui/
│       └── Button.tsx                 [NEW] Generic atom button component
│
├── hooks/
│   └── use-language.ts                [NEW] Language preference hook (cookie r/w)
│
├── types/
│   └── auth.ts                        [NEW] User and Session TypeScript types
│
├── middleware.ts                      [NEW] Global Next.js middleware (auth guard + session refresh)
│
└── i18n/                              [NEW] next-intl configuration
    ├── routing.ts                     Locale definitions and default
    ├── request.ts                     Server-side locale resolution
    └── messages/
        ├── vi.json                    Vietnamese strings
        └── en.json                    English strings
```

### Dependencies to add

| Package     | Version | Purpose                                                       |
| ----------- | ------- | ------------------------------------------------------------- |
| `next-intl` | `^3.x`  | App Router-compatible i18n (locale routing + server messages) |

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download all 6 media assets from Figma (URLs from `get_media_files` tool output) to `public/assets/login/`. Verify dimensions and optimize the keyvisual PNG via Next.js `<Image>` `priority` + `sizes` props.

### Phase 1: Foundation

1. **Design tokens** — Add Login-specific CSS variables to `src/app/globals.css`:
   ```css
   /* Login */
   --color-page-bg: #00101a;
   --color-header-bg: rgba(11, 15, 18, 0.8);
   --color-divider: #2e3940;
   --color-btn-login: #ffea9e;
   --color-btn-login-text: #00101a;
   ```
2. **TypeScript types** — Create `src/types/auth.ts` with `AuthUser` interface.
3. **Global middleware** — Create `src/middleware.ts`:
   - Refresh Supabase session using `src/libs/supabase/middleware.ts` client.
   - Guard `(protected)` routes: redirect to `/login` if no session.
   - Redirect from `/login` to `/` if session exists.
   - Integrate `next-intl` locale middleware.
4. **i18n setup** — Configure `next-intl` routing with `vi` (default) and `en`. Add minimal message keys needed for the Login screen.
5. **Route groups** — Create empty `src/app/(auth)/` and `src/app/(protected)/` directory structure.

### Phase 2: Core Feature (US1 — Google Login Authentication)

1. **Auth callback route** (`src/app/api/auth/callback/route.ts`):
   - Extract `code` and `next` search params.
   - Validate `next` param against allow-list (only internal paths).
   - Call `supabase.auth.exchangeCodeForSession(code)`.
   - On success → redirect to `next` (default: `/`).
   - On error → redirect to `/login?error=auth_failed`.

2. **Login page** (`src/app/(auth)/login/page.tsx`):
   - Server Component; import Supabase server client.
   - Early redirect to `/` if user session already exists.
   - Render static layout: full-screen dark page, keyvisual image, gradient overlays, header, hero section, footer.
   - Compose `LoginButton` and `LanguageSelector` as client islands.

3. **LoginButton** (`src/components/login/LoginButton.tsx`):
   - `'use client'` directive.
   - State: `idle | loading | error`.
   - On click: set loading, call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback' } })`.
   - Disabled + spinner during `loading` state.
   - Show inline error message on `error` state.
   - Uses golden-yellow design token classes.

4. **Generic Button atom** (`src/components/ui/Button.tsx`):
   - Accepts `variant`, `isLoading`, `disabled`, `children`, standard button props.
   - Renders a `<button>` with Tailwind classes driven by CSS variables.

### Phase 3: Extended Feature (US2 — Language Selection)

1. **`use-language` hook** (`src/hooks/use-language.ts`):
   - Read current locale from `next-intl`'s `useLocale()`.
   - Expose `switchLocale(locale: string)` that updates the `next-intl` router locale cookie.

2. **LanguageSelector** (`src/components/login/LanguageSelector.tsx`):
   - `'use client'` directive.
   - Renders the VN-flag + "VN" text + chevron button.
   - On click: toggle `LanguageDropdown` visibility.
   - Closes on outside click (via `useRef` + `useEffect`).

3. **LanguageDropdown** (`src/components/login/LanguageDropdown.tsx`):
   - `'use client'` directive.
   - List of supported locales with flag icons (vi, en).
   - On locale select: call `switchLocale()`, close dropdown.
   - Animates open/close with Tailwind transition utilities.

4. **i18n translations** — Populate `vi.json` and `en.json` with Login-screen strings:
   - Hero tagline, button label, footer copyright, ARIA labels.

### Phase 4: Polish

1. **Error handling** — Map Supabase OAuth error codes to user-facing messages in translations.
2. **Loading state** — Keyvisual image: `priority={true}` + `sizes` on `<Image>`. Use `loading="eager"`.
3. **Accessibility** — Add `aria-label` to LoginButton and LanguageSelector. Ensure the keyvisual has `alt=""` (decorative). "ROOT FURTHER" image needs `alt="ROOT FURTHER – Sun Annual Awards 2025"`.
4. **Responsive** — Test at 375px, 768px, 1024px, 1440px. Apply `md:` and `lg:` overrides for padding/font sizes.

---

## Risk Assessment

| Risk                                                             | Probability | Impact | Mitigation                                                                                                                             |
| ---------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase Google OAuth not configured in Supabase dashboard       | Medium      | High   | Confirm Google OAuth is enabled in Supabase console and `NEXT_PUBLIC_SUPABASE_URL` env var is set before Phase 2                       |
| `next-intl` sub-path routing conflicts with existing middleware  | Low         | Medium | `next-intl` middleware must compose with Supabase middleware — chain them in `src/middleware.ts` using `createMiddleware` chain helper |
| Keyvisual image is very large → LCP regression                   | Medium      | Medium | Compress PNG, use `<Image priority sizes>`, consider converting to WebP                                                                |
| Open-redirect vulnerability in `/api/auth/callback` `next` param | Low         | High   | Validate `next` against allow-list of internal paths before redirect                                                                   |
| Language preference lost on hard refresh                         | Low         | Low    | Use a persistent cookie for locale (next-intl's `localeCookie` option)                                                                 |

### Estimated Complexity

- **Frontend**: Medium (mostly layout + OAuth button + i18n wiring)
- **Backend**: Low (single callback route handler)
- **Testing**: Low–Medium (OAuth flow requires mocking Supabase in integration tests)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: `LoginButton` ↔ Supabase browser client; `LanguageSelector` ↔ `use-language` hook ↔ next-intl router
- [x] **External dependencies**: Supabase Auth API (Google OAuth redirect + callback exchange)
- [x] **Data layer**: Supabase session cookie set/read via middleware
- [x] **User workflows**: Full login flow; language switch flow; unauthenticated redirect flow

### Test Categories

| Category           | Applicable? | Key Scenarios                                                                         |
| ------------------ | ----------- | ------------------------------------------------------------------------------------- |
| UI ↔ Logic         | Yes         | Login button state transitions (idle → loading → error/redirect); dropdown open/close |
| Service ↔ Service  | Yes         | Middleware session refresh → Supabase server client                                   |
| App ↔ External API | Yes         | Supabase Google OAuth redirect; callback code exchange                                |
| App ↔ Data Layer   | No          | No direct DB queries in Login screen                                                  |
| Cross-platform     | Yes         | Responsive at 375/768/1024/1440px                                                     |

### Test Environment

- **Environment type**: Local + CI (GitHub Actions)
- **Test data strategy**: Mock Supabase client with `vitest.mock()`; E2E uses a real test Supabase project with a dedicated test Google account
- **Isolation approach**: Each unit test resets module-level state; E2E tests sign out after each test run

### Mocking Strategy

| Dependency Type                                   | Strategy            | Rationale                                         |
| ------------------------------------------------- | ------------------- | ------------------------------------------------- |
| Supabase browser client (`signInWithOAuth`)       | Mock                | Prevents real OAuth redirect in unit tests        |
| Supabase server client (`exchangeCodeForSession`) | Mock                | Controls success/error paths for callback route   |
| `next-intl` locale routing                        | Stub                | Verifies locale cookie is set without full router |
| Keyvisual image                                   | Real (public asset) | No need to mock static assets                     |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Clicking "LOGIN With Google" calls `signInWithOAuth` with provider `'google'`
   - [ ] Callback route exchanges code and redirects to `/`
   - [ ] Visiting `/login` with an active session redirects to `/`
   - [ ] Language dropdown opens on click and closes on outside click
   - [ ] Selecting "EN" switches locale; "VN" text changes to "EN"

2. **Error Handling**
   - [ ] OAuth failure → callback redirects to `/login?error=auth_failed`
   - [ ] `/login?error=auth_failed` displayed → error message renders, button is re-enabled
   - [ ] Network error during `signInWithOAuth` → error state shown
   - [ ] Invalid `next` param in callback → falls back to `/` (no open redirect)

3. **Edge Cases**
   - [ ] Popup blocked by browser → instructional message shown
   - [ ] Rapid double-click on login button → second click ignored (disabled state)
   - [ ] Unknown/unauthorized Google account → Supabase returns error → error message shown
   - [ ] No language preference cookie → defaults to `vi`

### Tooling & Framework

- **Test framework**: Vitest (unit + integration) + Playwright (E2E)
- **Supporting tools**: `@testing-library/react`, `msw` (Mock Service Worker for API mocking)
- **CI integration**: Run Vitest on every PR; Playwright E2E on `main` branch merges

### Coverage Goals

| Area                            | Target              | Priority |
| ------------------------------- | ------------------- | -------- |
| LoginButton component logic     | 90%+                | High     |
| Auth callback route handler     | 95%+                | High     |
| LanguageSelector + use-language | 85%+                | Medium   |
| Middleware auth guard           | 90%+                | High     |
| E2E: full login flow            | 100% critical paths | High     |

---

## Open Questions

- [ ] **Google OAuth provider configured?** Confirm Supabase dashboard has Google OAuth enabled and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` env vars are set.
- [ ] **Which locales are supported?** Current assumption: `vi` (default) and `en`. Are others planned?
- [ ] **Dashboard route after login?** SCREENFLOW.md shows redirect to `/` (home/dashboard). What is the first protected screen?
- [ ] **Language dropdown design spec?** Frame `721:4942` ("Dropdown-ngôn ngữ") is referenced but not yet specified. Should this be implemented as a stub or fully specced first?
- [ ] **`next-intl` approved?** Requires team sign-off as a new dependency per constitution governance rules.
