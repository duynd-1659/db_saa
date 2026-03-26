<!--
## Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: "I. Clean Code & Single Responsibility" (added Prettier as mandatory formatter)
- Added sections: Prettier row in Tech Stack table
- Removed sections: none
- Templates requiring updates:
  - `.momorph/templates/plan-template.md` — ✅ no changes needed (constitution compliance check is generic)
  - `.momorph/templates/spec-template.md` — ✅ no changes needed
  - `.momorph/templates/tasks-template.md` — ✅ no changes needed (T003 already covers "Configure linting and formatting tools")
- Follow-up TODOs: none
-->

# SAA 2025 — Project Constitution

## Tech Stack

| Layer           | Technology                 | Version    |
| --------------- | -------------------------- | ---------- |
| Framework       | Next.js (App Router)       | 15.x       |
| Language        | TypeScript                 | 5.x strict |
| Styling         | Tailwind CSS               | 4.x        |
| Auth & Database | Supabase (`@supabase/ssr`) | 2.x        |
| Deployment      | Cloudflare (OpenNext)      | —          |
| Formatter       | Prettier                   | 3.x        |
| Package Manager | Yarn                       | 1.x        |
| Runtime target  | ES2024                     | —          |

---

## Core Principles

### I. Clean Code & Single Responsibility

- Every file, function, and component has **one clear responsibility**. If you need an "and" to describe what it does, split it.
- Maximum ~150 lines per file; split when a file grows beyond this threshold.
- Functions must be short, named after what they **do** (verb-first: `fetchUser`, `buildLoginUrl`, `validateSession`).
- No dead code, commented-out code, or `TODO`s left in merged branches.
- **Prettier is the sole code formatter.** All source files MUST be formatted by Prettier before commit. Manual formatting overrides are forbidden.
- Prettier configuration (`.prettierrc`):
  - `semi: true` — always use semicolons.
  - `singleQuote: true` — single quotes for strings.
  - `printWidth: 100` — line width target.
  - `tabWidth: 2` — 2-space indentation.
  - `trailingComma: "all"` — trailing commas everywhere.
  - `bracketSpacing: true` — spaces inside object braces.
  - `arrowParens: "always"` — always wrap arrow function params.
  - `endOfLine: "lf"` — Unix line endings.
- Template literals for string interpolation; regular quotes for static strings.
- `const` by default — `let` only when mutation is genuinely needed; never `var`.

### II. Source Code Organization

Strict folder structure under `src/`:

```
src/
├── app/                        # Next.js App Router pages & layouts
│   ├── (auth)/                 # Route group: unauthenticated pages
│   │   └── login/page.tsx
│   ├── (protected)/            # Route group: authenticated pages
│   │   └── dashboard/page.tsx
│   ├── api/                    # Route handlers (thin controllers only)
│   │   └── auth/callback/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/                 # Shared, reusable UI components
│   ├── ui/                     # Atoms / base elements (Button, Input, …)
│   └── [feature]/              # Feature-scoped composite components
├── libs/                       # External service integrations
│   └── supabase/               # client.ts | server.ts | middleware.ts
├── services/                   # Business logic layer (pure functions / classes)
├── hooks/                      # Custom React hooks (use-* naming)
├── types/                      # Shared TypeScript types & interfaces
└── middleware.ts               # Global Next.js middleware (auth guard)
```

Rules:

- **No business logic in `app/` route handlers or page components** — delegate to `services/`.
- **No UI code in `services/`** — services are framework-agnostic and independently testable.
- `components/ui/` contains only generic, stateless presentational atoms. Feature logic lives in `components/[feature]/`.
- Use `@/*` path alias (maps to `src/*`) everywhere — no relative `../../` imports across feature boundaries.
- Kebab-case for all non-component filenames (`user-service.ts`). PascalCase for React components and class files (`LoginButton.tsx`).

### III. Next.js Best Practices

- **Server Components by default.** Only add `'use client'` when the component needs browser APIs, event handlers, or React state/effects.
- **Route handlers are thin controllers.** They handle HTTP input/output only; all logic calls a service function.
- Middleware (`src/middleware.ts`) handles only lightweight concerns: session refresh, auth redirect, header manipulation. Never put DB queries in middleware.
- Data fetching: prefer `async` Server Components and `fetch` with caching over client-side `useEffect` for initial page data.
- Use Next.js `<Image>` for all images (automatic optimization, lazy-load, aspect-ratio). Never use raw `<img>`.
- Use Next.js `<Link>` for all internal navigation URLs — no window.location or raw `<a href>` for internal routes.
- All navigation URLs **must be derived from `SCREENFLOW.md` or group spec docs**. Hardcoding or guessing URLs is forbidden (see `guidelines/frontend.md`).
- Environment variables: server-only secrets use `process.env.SECRET_*` (never expose to client). Public vars must be prefixed `NEXT_PUBLIC_`.

### IV. Supabase Best Practices

- **Three distinct clients — use the right one for the context:**
  - `src/libs/supabase/client.ts` → `createBrowserClient()` — Client Components, browser-side only.
  - `src/libs/supabase/server.ts` → `createServerClient()` — Server Components, Route Handlers, Server Actions.
  - `src/libs/supabase/middleware.ts` → `createServerClient()` — Next.js Middleware session refresh.
- **Never import the browser client in Server Components or route handlers.** This leaks secrets and breaks SSR.
- Always call the middleware Supabase client inside `middleware.ts` to keep the session cookie fresh on every request.
- Use Supabase Row Level Security (RLS) as the primary data-access control layer — never rely solely on application-level checks.
- Never `select('*')` in production queries — always select only required columns.
- Use typed Supabase clients (`Database` generated types) for all queries to catch schema mismatches at compile time.

### V. Responsive Design (Mobile-First)

Three required breakpoints, all implemented with Tailwind `sm:` / `md:` / `lg:` prefix utilities:

| Breakpoint | Min Width | Target              |
| ---------- | --------- | ------------------- |
| Mobile     | < 768px   | Default (no prefix) |
| Tablet     | 768px     | `md:`               |
| Desktop    | 1024px+   | `lg:`               |

Rules:

- Write mobile styles first (no prefix), override upward with `md:` and `lg:`.
- Use `flex` / `grid` layouts — no absolute positioning for flow-critical structure.
- Minimum touch target size: **44×44px** for all interactive elements (buttons, links).
- Images must be responsive: `w-full h-auto` or configured `sizes` on `<Image>`.
- Test all screens at 375px, 768px, 1024px, and 1440px widths before marking a task complete.
- No horizontal scroll on any breakpoint.

### VI. Security Principles (OWASP-aligned)

**Authentication & Authorization**

- All protected routes must be guarded in `src/middleware.ts` — gate by checking Supabase session, redirect unauthenticated users to `/login`.
- Never trust client-supplied user IDs. Always derive the user identity from the server-side Supabase session (`getUser()` in server context).
- Supabase **RLS policies are mandatory** on every table that stores user data.

**Input & Output Safety**

- Never render user-supplied content as raw HTML (`dangerouslySetInnerHTML` is banned except with explicit sanitization via a vetted library like `DOMPurify`).
- Validate all inputs at the API boundary (Route Handlers / Server Actions) using a schema library (e.g., `zod`). Never trust client-side validation alone.
- All Supabase queries use parameterized client methods — string-concatenated SQL is forbidden (prevents SQL injection).

**Secrets Management**

- No credentials, API keys, or tokens in source code or git history.
- Server-only secrets must not use the `NEXT_PUBLIC_` prefix.
- `.env.local` is git-ignored; use `.env.example` to document required variables without values.

**CSRF & Transport**

- Supabase `@supabase/ssr` cookie handling provides CSRF protection for OAuth flows — do not bypass or replicate it manually.
- All API calls must be over HTTPS in production (enforced by Cloudflare).
- Sensitive cookies must have `HttpOnly`, `Secure`, and `SameSite=Lax` (or `Strict`) flags — do not override Supabase SSR defaults.

**Error Handling**

- API Route Handlers must never leak stack traces or internal error messages to the client. Return generic user-facing messages; log detail server-side only.
- Catch and handle all promise rejections — unhandled rejections in server code crash the process.

### VII. Design Tokens & Styling

- Design tokens (colors, spacing, font sizes, radii) are defined as CSS variables in `src/app/globals.css` and consumed via Tailwind `@theme` mapping.
- Never hard-code raw `#hex`, `px`, or `rem` values in component files — always use a CSS variable or Tailwind utility.
- Component-scoped styles use Tailwind utilities only. No CSS Modules or inline `style={{}}` objects except for dynamic values that Tailwind cannot express.
- Asset naming: kebab-case (`google-icon.svg`). Place under `public/assets/{group}/{icons|images|logos}/`.

### VIII. TypeScript Strictness

- `strict: true` is enabled in `tsconfig.json` and must never be disabled.
- No `any` — use `unknown` + type narrowing or proper generics.
- No non-null assertions (`!`) on values that could legitimately be null — use optional chaining (`?.`) and explicit null checks.
- All exported functions must have explicit return types.
- Prefer `interface` for object shapes that may be extended; `type` for unions, intersections, and utility types.

---

## Development Workflow

### Navigation & URL Rules

All links, routes, and redirects must be sourced from `SCREENFLOW.md` and group spec files. No URL may be arbitrarily hardcoded. See `guidelines/frontend.md` for the mandatory 3-step workflow.

### Agent & Automation Rules

- Every agent must read `guidelines/frontend.md` before generating or modifying UI code.
- Every agent must read `guidelines/backend.md` before generating or modifying API/service code.
- Specs live in `.momorph/contexts/specs/`; test cases live in `.momorph/contexts/testcases/`.
- SCREENFLOW.md and group spec files are the single source of truth for navigation, APIs, and business logic.

### Code Review Checklist (minimum gates)

- [ ] No business logic in page components or route handlers
- [ ] Correct Supabase client used for the render context (server vs. client)
- [ ] All routes guarded appropriately via middleware
- [ ] Responsive implementation tested at all four breakpoints
- [ ] No raw `<img>` tags, no hardcoded color values, no guessed URLs
- [ ] No `any` types, no disabled strict checks
- [ ] No secrets or credentials in source code
- [ ] All files formatted with Prettier (no formatting diff in PR)

---

## Governance

This constitution supersedes all other implicit conventions. Any deviation requires explicit documentation of the reason. Amendments must be:

1. Agreed upon by the team
2. Reflected in this file with a version bump
3. Accompanied by a migration note if existing code is affected

**Version**: 1.1.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-11
