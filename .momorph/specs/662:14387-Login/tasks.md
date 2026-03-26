# Tasks: Login

**Frame**: `662:14387-Login`
**Prerequisites**: plan.md ✅ · spec.md ✅ · design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets & Dependencies)

**Purpose**: Download Figma media assets and install new dependencies before any code is written.

- [ ] T001 Install `next-intl@^3.x` dependency via `yarn add next-intl` | `package.json`
- [ ] T002 Create `public/assets/login/logos/`, `public/assets/login/images/`, `public/assets/login/icons/` directories | `public/assets/login/`
- [ ] T003 [P] Download SAA 2025 logo (Node `I662:14391;178:1033;178:1030`) and save as | `public/assets/login/logos/saa-logo.png`
- [ ] T004 [P] Download "ROOT FURTHER" title image (Node `2939:9548`) and save as | `public/assets/login/images/root-further-logo.png`
- [ ] T005 [P] Download keyvisual background artwork (Node `662:14388` via frame screenshot) and save optimised as | `public/assets/login/images/keyvisual.png`
- [ ] T006 [P] Download VN flag SVG (Node `I662:14391;186:1696;186:1821;186:1709`) and save as | `public/assets/login/icons/vn-flag.svg`
- [ ] T007 [P] Download chevron-down SVG (Node `I662:14391;186:1696;186:1821;186:1441`) and save as | `public/assets/login/icons/chevron-down.svg`
- [ ] T008 [P] Download Google brand icon SVG (Node `I662:14426;186:1766`) and save as | `public/assets/login/icons/google-icon.svg`

**Checkpoint**: All 6 assets present in `public/assets/login/`; `next-intl` resolvable in `node_modules`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure required by BOTH user stories — must be complete before any US work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Add Login design tokens (CSS variables) to `src/app/globals.css` — add `--color-page-bg`, `--color-header-bg`, `--color-divider`, `--color-btn-login`, `--color-btn-login-text` under a `/* Login */` block and map them in `@theme` | `src/app/globals.css`
- [ ] T010 Add Montserrat and Montserrat Alternates via `next/font/google` to root layout and expose as CSS variables `--font-montserrat` and `--font-montserrat-alt` | `src/app/layout.tsx`
- [ ] T011 [P] Create `AuthUser` and `AuthSession` TypeScript interfaces (Google sub, email, name, avatar_url, preferred_locale) | `src/types/auth.ts`
- [ ] T012 [P] Configure `next-intl` routing — define `locales: ['vi', 'en']`, `defaultLocale: 'vi'` | `src/i18n/routing.ts`
- [ ] T013 Configure `next-intl` server-side request (reads locale from cookie/header, falls back to `vi`) | `src/i18n/request.ts`
- [ ] T014 [P] Create Vietnamese base message file with Login screen keys: `login.heroTagline`, `login.loginButton`, `login.footer`, `login.errors.*`, ARIA label keys | `src/i18n/messages/vi.json`
- [ ] T015 [P] Create English base message file with the same keys as `vi.json` | `src/i18n/messages/en.json`
- [ ] T016 Create global Next.js middleware that (1) refreshes Supabase session cookie via `src/libs/supabase/middleware.ts`, (2) redirects unauthenticated requests to `(protected)` routes → `/login`, (3) redirects authenticated requests to `/login` → `/`, (4) chains `next-intl` `createMiddleware` for locale sub-paths; configure `matcher` to exclude `_next`, `api`, and static assets | `src/middleware.ts`
- [ ] T017 Create `(auth)` route group layout (no auth guard, passes children through) | `src/app/(auth)/layout.tsx`
- [ ] T018 Create `(protected)` route group layout — server component that calls `supabase.auth.getUser()` and redirects unauthenticated users to `/login` as secondary guard | `src/app/(protected)/layout.tsx`

**Checkpoint**: `yarn dev` starts without errors; accessing `/login` does not 500; middleware file is recognised by Next.js; `next-intl` types resolve

---

## Phase 3: User Story 1 — Google Login Authentication (Priority: P1) 🎯 MVP

**Goal**: A user can authenticate via Google OAuth and be redirected to the dashboard on success.

**Independent Test**: Navigate to `/login` → click "LOGIN With Google" → complete Google consent → land on `/` (dashboard placeholder); revisiting `/login` while authed auto-redirects to `/`

### Components & UI (US1)

- [ ] T019 [P] [US1] Create generic `Button` atom — accepts `variant: 'primary' | 'ghost'`, `isLoading: boolean`, `disabled`, `children`, standard `<button>` HTML props; renders with correct Tailwind token classes; shows spinner slot when `isLoading` | `src/components/ui/Button.tsx`
- [ ] T020 [P] [US1] Create `LoginHeader` server component — renders 1440×80px header bar (`bg-[var(--color-header-bg)]`, `px-[144px]`), Next.js `<Image>` SAA logo left, `LanguageSelector` island right; export as server component with `LanguageSelector` as dynamic import | `src/components/login/LoginHeader.tsx`
- [ ] T021 [P] [US1] Create `LoginFooter` server component — full-width bar with `border-t border-[var(--color-divider)]`, `py-10 px-[90px]`, centred copyright text using `--font-montserrat-alt` | `src/components/login/LoginFooter.tsx`
- [ ] T022 [US1] Create `LoginButton` client component — `'use client'`; manages `'idle' | 'loading' | 'error'` state; on click calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL } })`; renders golden-yellow button (`bg-[var(--color-btn-login)]`, `text-[var(--color-btn-login-text)]`, `rounded-[8px]`, `w-[305px] h-[60px]`, `px-6 py-4`) with `<Image>` Google icon + "LOGIN With Google" text (Montserrat 22px bold); disabled + spinner in `loading`; inline error text in `error`; uses `Button` atom | `src/components/login/LoginButton.tsx`

### Backend (US1)

- [ ] T023 [US1] Create OAuth callback route handler — extract `code` (required) and `next` (optional, default `/`) query params; validate `next` is a relative path starting with `/` (block open-redirect); call `supabase.auth.exchangeCodeForSession(code)`; on success redirect to `next`; on error (missing `code` or Supabase error) redirect to `/login?error=auth_failed`; never leak internal errors to response body | `src/app/api/auth/callback/route.ts`

### Login Page Assembly (US1)

- [ ] T024 [US1] Create Login page as a Server Component — call `supabase.auth.getUser()`; if user exists redirect to `/`; render full-screen layout: `min-h-screen bg-[var(--color-page-bg)] relative overflow-hidden`; layer C_Keyvisual as `<Image fill priority sizes="100vw">` background, two gradient overlay `<div>`s (left-fade + bottom-fade via inline Tailwind gradient), then `<LoginHeader>`, hero `<section>` (padding `pt-24 px-[144px]`, flex column), `<Image>` ROOT FURTHER logo, two-line tagline, `<LoginButton>` island, and `<LoginFooter>` | `src/app/(auth)/login/page.tsx`
- [ ] T025 [US1] Add `NEXT_PUBLIC_AUTH_REDIRECT_URL` to `.env.example` with value `/api/auth/callback` | `.env.example`

**Checkpoint**: Full Google OAuth login flow works end-to-end in local dev; `/login` renders pixel-close to Figma frame screenshot; unauthenticated access to any `(protected)` route redirects to `/login`

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: User can switch UI language (VN ↔ EN) from the login page before authenticating; choice persists across page loads.

**Independent Test**: On `/login` click "VN" button → dropdown opens with language options → select EN → page reloads in English locale (`/en/login`); button now reads "EN"; hard-refreshing `/en/login` retains EN locale

### Components & Hook (US2)

- [ ] T026 [P] [US2] Create `use-language` hook — `'use client'`; reads current locale from `next-intl`'s `useLocale()`; exposes `switchLocale(locale: 'vi' | 'en'): void` that uses `next-intl`'s `useRouter` to push to the same path under the new locale | `src/hooks/use-language.ts`
- [ ] T027 [P] [US2] Create `LanguageDropdown` client component — `'use client'`; receives `locales: string[]`, `currentLocale: string`, `onSelect: (l: string) => void`, `onClose: () => void`; renders absolutely-positioned list of flags + locale labels; each item calls `onSelect` then `onClose`; Tailwind transition for open/close (`opacity-0 → opacity-100`, `translate-y-1 → translate-y-0`) | `src/components/login/LanguageDropdown.tsx`
- [ ] T028 [US2] Create `LanguageSelector` client component — `'use client'`; uses `use-language` hook; renders VN flag `<Image>`, locale label text, chevron `<Image>`; manages `isOpen` boolean state; closes dropdown on outside click (`useRef` + `useEffect`); composes `LanguageDropdown`; 108×56px, flexRow, gap-4, border-radius 4px inner button | `src/components/login/LanguageSelector.tsx`

### i18n Wiring (US2)

- [ ] T029 [US2] Add US2-specific translation keys to `vi.json` and `en.json`: `languageSelector.label` (e.g. "Ngôn ngữ" / "Language"), locale display names (`locales.vi`, `locales.en`), and `languageSelector.ariaLabel` | `src/i18n/messages/vi.json` and `src/i18n/messages/en.json`
- [ ] T030 [US2] Wire `LanguageSelector` into `LoginHeader` by replacing the static placeholder import with the real `LanguageSelector` component and passing it supported locales | `src/components/login/LoginHeader.tsx`

**Checkpoint**: Language toggle works; selecting EN updates URL to `/en/login` and all Login screen text renders in English; browser refresh retains locale; selecting VN restores Vietnamese

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, performance, and error-message display.

- [ ] T031 [P] Add responsive Tailwind overrides to Login page for `md:` (768px) and `lg:` (1024px) — adjust hero padding, font sizes, and button width so no horizontal scroll occurs at 375px, 768px; header padding reduces at mobile | `src/app/(auth)/login/page.tsx`
- [ ] T032 [P] Add `aria-label` and `role` attributes to `LoginButton` (e.g. `aria-label="Login with Google"`), `LanguageSelector` (`aria-haspopup="listbox"`, `aria-expanded`), `LanguageDropdown` (`role="listbox"`, each item `role="option"`), and decorative `<Image>` for keyvisual (`alt=""`) | `src/components/login/LoginButton.tsx`, `src/components/login/LanguageSelector.tsx`, `src/components/login/LanguageDropdown.tsx`, `src/app/(auth)/login/page.tsx`
- [ ] T033 [P] Add `alt="ROOT FURTHER – Sun Annual Awards 2025"` to ROOT FURTHER title `<Image>` and `alt="Sun Annual Awards 2025"` to SAA logo `<Image>` | `src/app/(auth)/login/page.tsx`, `src/components/login/LoginHeader.tsx`
- [ ] T034 [P] Add error message display to Login page — read `?error` search param in Server Component; pass error string to `LoginButton` as `initialError` prop; render localised error text below button (e.g. `login.errors.auth_failed`) | `src/app/(auth)/login/page.tsx`, `src/components/login/LoginButton.tsx`
- [ ] T035 [P] Optimise keyvisual `<Image>` — add `priority`, `quality={85}`, `sizes="100vw"` props; ensure `next.config.ts` is not disabling image optimisation for Cloudflare | `src/app/(auth)/login/page.tsx`, `next.config.ts`
- [ ] T036 Update root `src/app/page.tsx` to redirect to `/login` (or dashboard if authed) so the default Next.js placeholder is replaced | `src/app/page.tsx`
- [ ] T037 Update `src/app/layout.tsx` metadata — set `title: "SAA 2025 – Root Further"` and `description` from translation or hardcoded; add `lang` attribute driven by locale | `src/app/layout.tsx`

**Checkpoint**: Lighthouse accessibility score ≥ 90 on Login page; no horizontal scroll at 375px; `?error=auth_failed` shows a translated error message; keyvisual loads as priority image above the fold

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundation)           ← BLOCKS everything below
            ├── Phase 3 (US1 — P1)     ← MVP, deliver independently
            └── Phase 4 (US2 — P2)     ← Depends on Phase 3 (needs LoginHeader stub)
                    └── Phase 5 (Polish)
```

### Within Each Phase

- Phase 1: T003–T008 are all **[P]** — all asset downloads can run in parallel after T001–T002
- Phase 2: T011–T015 are **[P]** — types, routing config, and message files can be created in parallel; T016 depends on T012/T013 being done; T017/T018 depend on T016
- Phase 3: T019–T021 are **[P]** — Button atom, Header, Footer have no mutual dependencies; T022 depends on T019 (uses Button); T023 is independent backend; T024 requires T019–T023 all complete; T025 is independent
- Phase 4: T026/T027 are **[P]** (independent files); T028 depends on T026+T027; T029 is parallel to T026/T027; T030 depends on T028+T029
- Phase 5: T031–T035 are all **[P]** — polish tasks touch different aspects

### Parallel Opportunities Summary

| Phase | Parallel Group                 | Tasks                              |
| ----- | ------------------------------ | ---------------------------------- |
| 1     | Asset downloads                | T003, T004, T005, T006, T007, T008 |
| 2     | Types + i18n config + messages | T011, T012, T014, T015             |
| 3     | UI atoms                       | T019, T020, T021, T023, T025       |
| 4     | Hook + dropdown                | T026, T027, T029                   |
| 5     | All polish                     | T031, T032, T033, T034, T035       |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete **Phase 1** (assets + dependency)
2. Complete **Phase 2** (foundation)
3. Complete **Phase 3** (US1 only — Google Login)
4. **STOP and VALIDATE**: Full OAuth flow works, page renders correctly at desktop
5. Deploy Login MVP

### Incremental Delivery

1. Phase 1 + 2 → foundation ready
2. Phase 3 → Google Login works → deploy
3. Phase 4 → Language switching → deploy
4. Phase 5 → Polish → deploy

---

## Notes

- Commit after each phase checkpoint
- Before Phase 3 begins, confirm Google OAuth provider is enabled in the Supabase dashboard and `NEXT_PUBLIC_SUPABASE_URL` is set in `.env.local`
- `next-intl` approval: requires team sign-off per constitution governance before T001
- Mark tasks complete as you go: change `[ ]` to `[x]`
- Reference `design-style.md` for exact pixel values when implementing components
- All routes (`/login`, `/`, `/en/login`) must be sourced from `SCREENFLOW.md` — do not hardcode guess URLs
