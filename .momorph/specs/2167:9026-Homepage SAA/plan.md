# Implementation Plan: Homepage SAA

**Frame**: `2167:9026-Homepage SAA`
**Date**: 2026-03-10
**Spec**: `specs/2167:9026-Homepage SAA/spec.md`
**Version**: v3.2
**Last synced**: 2026-03-26

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v3.2 | 2026-03-26 | Structural | Figma sync: Updated Phase 2 HeroSection (Frame 487 gap-10, Frame 523 wrapper gap-4) and CTAButtons (gap-10 container, RedirectIcon in each button, B3.2 semi-transparent bg). |
| v3.1 | 2026-03-26 | Cosmetic | Requirement change: CountdownTimer hides entire block on expiry (not just "Coming soon"). Updated: Phase 2 CountdownTimer description, Test Scenarios edge case, Test Categories. |
| v3.0 | 2026-03-20 | Structural | Requirement change: Added QR button in CountdownTimer (expired state) and new /ticket page. Updated: Summary, Project Structure, Dependencies, Phase 2 (CountdownTimer), new Phase 8 (Ticket Page — US6), Integration Testing, Risk Assessment. |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton moved to src/components/ui/, (main)/layout.tsx added to project structure. Updated: Project Structure, Phase 4, Phase 2 page wiring, Integration Points. |
| v1.0 | 2026-03-10 | Initial | Initial implementation plan |

---

## Summary

Build the main landing page (post-auth entry point) of SAA 2025 at route `/[locale]/(protected)/page.tsx`. The page is a Server Component that fetches event config from `app_config` (Supabase) and renders award categories from static config. It includes a client-side countdown timer (shows "Lấy mã QR" button when expired), 6 award category cards, a Kudos promo block, a sticky header with profile/language dropdowns, a fixed widget FAB, and a footer. A separate `/ticket` page displays each employee's personal QR code (encoded from `user.id`) centered on a black background. No new database tables required.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 App Router
**Primary Dependencies**: React 18, Tailwind CSS 4.x, `@supabase/ssr` 2.x, `next-intl`
**Database**: Supabase PostgreSQL — reads `public.app_config` only
**Testing**: Playwright (E2E), Vitest (unit)
**State Management**: None (Server Component page + isolated Client Component for countdown)
**API Style**: Next.js Route Handler (REST)

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

- [x] Follows project coding conventions (kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Tailwind CSS 4 tokens, no raw hex in components)
- [x] Adheres to folder structure (`src/app/`, `src/components/[feature]/`, `src/services/`, `src/types/`)
- [x] Meets security requirements (Server Component for data fetch, Supabase server client, RLS on `app_config`)
- [x] Follows testing standards (E2E for critical navigation flows)
- [x] Server Component by default, `'use client'` only for countdown + dropdowns
- [x] Uses `<Image>` for all images, `<Link>` for all internal navigation
- [x] All URLs sourced from `SCREENFLOW.md` — no hardcoded routes

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/homepage/`. Atoms reused from `src/components/ui/`.
- **Rendering strategy**:
  - `page.tsx` → **Server Component** — fetches `event_start_datetime` from `app_config` via `homepage-service.ts`; renders static sections server-side.
  - `<CountdownTimer />` → **Client Component** (`'use client'`) — receives `targetDate: string` as prop; runs `setInterval` per minute client-side.
  - `<Header />` → **Client Component** — manages dropdown open/close state.
  - All other sections (Hero, Awards, Kudos promo, Footer) → **Server Components**.
- **Styling strategy**: Tailwind CSS 4 utilities + CSS variables from `globals.css`. No inline `style={{}}` except for dynamic gradient values that Tailwind cannot express.
- **Award data**: Static TypeScript config file (`src/config/award-categories.ts`) — no DB table needed. Award data is fixed for SAA 2025.

### Backend Approach

- **API Design**: Single new route handler `GET /api/config/event` — thin controller delegating to `homepage-service.ts`.
- **Data Access**: Supabase server client → `select('value').from('app_config').eq('key', 'event_start_datetime')`. Only required column fetched (constitution §IV).
- **Validation**: Zod schema on route handler response to guard against missing/malformed config values.

### Integration Points

- **Existing Services**: Supabase server client (`src/libs/supabase/server.ts`) — already implemented.
- **Shared Components**: `Button` (`src/components/ui/Button.tsx`) — reuse for CTA buttons.
- **Dropdowns**: `DropdownProfile` (homepage-scoped), `LocaleDropdown` (shared, `src/components/ui/LocaleDropdown.tsx`) — used in Header component.
- **API Contracts**: `GET /api/config/event` → `{ event_start_datetime: string }` (ISO-8601).

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2167:9026-Homepage SAA/
├── spec.md              ✅ Done
├── design-style.md      ✅ Done
├── plan.md              ✅ This file
└── tasks.md             ⬜ Next step
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── [locale]/
│   │   └── (protected)/
│   │       ├── (main)/
│   │       │   ├── layout.tsx                    # NEW — injects <WidgetButton /> for all non-admin pages
│   │       │   ├── page.tsx                      # NEW — Homepage Server Component
│   │       │   └── ticket/
│   │       │       └── page.tsx                  # NEW — QR Ticket page (Server Component, reads user.id)
│   └── api/
│       └── config/
│           └── event/
│               └── route.ts                      # NEW — GET /api/config/event
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx                            # EXISTING — reuse
│   │   └── WidgetButton.tsx                      # SHARED — Fixed FAB (Client Component)
│   └── homepage/                                 # NEW feature folder
│       ├── Header.tsx                            # Sticky nav (Client Component)
│       ├── NavLink.tsx                           # Single nav item with active state
│       ├── HeroSection.tsx                       # Hero keyvisual + content
│       ├── CountdownTimer.tsx                    # Client Component — interval logic + QR button when expired
│       ├── CountdownDigit.tsx                    # Single digit card (DAYS/HOURS/MIN)
│       ├── QRCodeDisplay.tsx                     # Client Component — renders QRCodeSVG from qrcode.react
│       ├── EventInfo.tsx                         # Static time + venue info
│       ├── CTAButtons.tsx                        # ABOUT AWARDS + ABOUT KUDOS
│       ├── AwardsSection.tsx                     # Section wrapper
│       ├── AwardCard.tsx                         # Single award category card
│       ├── KudosPromo.tsx                        # Sun* Kudos promo block
│       └── (WidgetButton moved to src/components/ui/)
│       └── Footer.tsx                            # Footer with nav links
│
├── config/
│   └── award-categories.ts                      # NEW — static award data
│
├── services/
│   └── homepage-service.ts                      # NEW — fetchEventConfig()
│
├── types/
│   └── homepage.ts                              # NEW — EventConfig, AwardCategory types
│
└── app/
    └── globals.css                              # MODIFY — add Homepage design tokens
```

### New Migrations

None required — `public.app_config` already exists with `event_start_datetime` seeded.

### Dependencies

No new npm packages required except for QR code rendering.

- `tailwindcss` 4.x ✅
- `@supabase/ssr` 2.x ✅
- `next-intl` ✅
- `zod` — check if installed; add if not.
- `qrcode.react` — add for QR code rendering on ticket page.

| Package | Version | Purpose                                            |
| ------- | ------- | -------------------------------------------------- |
| `zod`   | `^3.x`  | Route handler response validation (add if missing) |
| `qrcode.react` | `^3.x` | Client-side QR code SVG rendering on `/ticket` page |

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download required media assets from Figma using `get_media_files` tool:

| Asset                  | Figma Node                          | Destination                                      |
| ---------------------- | ----------------------------------- | ------------------------------------------------ |
| Keyvisual BG image     | `2167:9028` (MM_MEDIA_Keyvisual BG) | `public/assets/homepage/images/keyvisual-bg.jpg` |
| Hero gradient overlay  | CSS-only, no asset needed           | —                                                |
| Award card BG (shared) | `I2167:9075;214:1019;81:2442` (MM_MEDIA_Award BG) | `public/assets/homepage/images/award-bg.png` |
| Award name logos (×6) | `I2167:907x;214:1019;214:666;...` (MM_MEDIA_{Name}) | `public/assets/homepage/images/award-name-{slug}.png` |
| SAA Logo               | `I2167:9091;178:1033`               | `public/assets/homepage/logos/saa-logo.svg`      |
| Bell icon              | `I2167:9091;186:2101`               | `public/assets/icons/bell.svg`                   |
| Pencil icon (widget)   | `5022:15169`                        | `public/assets/icons/pencil.svg`                 |
| SAA widget icon        | `5022:15169`                        | `public/assets/icons/saa-widget.svg`             |
| "Chi tiết" arrow icon  | `I2167:9075;214:1023`               | `public/assets/icons/arrow-right.svg`            |

### Phase 1: Foundation

1. **Design tokens** — Add Homepage CSS variables to `src/app/globals.css`:

   ```css
   /* Homepage */
   --color-gold: #ffea9e;
   --color-border: #998c5f;
   --color-header-bg: rgba(16, 20, 23, 0.8);
   --color-cover-gradient: linear-gradient(12deg, #00101a 23.7%, ...);
   --spacing-page-x: 144px;
   --spacing-section-gap: 120px;
   ```

2. **Types** — Create `src/types/homepage.ts`:

   ```ts
   export interface EventConfig {
     event_start_datetime: string; // ISO-8601
     venue: string;
     time_display: string;
   }
   export interface AwardCategory {
     slug: string;
     name: string;
     card_description: string;   // short, from Figma card text
     description: string;        // full, for awards info page
     description_en?: string;
     image_url: string;          // shared BG: award-bg.png
     name_image_url: string;     // per-card name logo overlay
     name_image_width: number;   // intrinsic width from Figma
     name_image_height: number;  // intrinsic height from Figma
     award_count: number;
     unit_type: string;
     unit_type_en?: string;
     award_value_vnd: string;
     special_note?: string;
   }
   ```

3. **Static award config** — Create `src/config/award-categories.ts` with all 6 awards.

4. **Service** — Create `src/services/homepage-service.ts`:

   ```ts
   export async function fetchEventConfig(): Promise<EventConfig>;
   ```

   Uses Supabase server client, selects `value` from `app_config` where `key = 'event_start_datetime'`.

5. **Route handler** — Create `src/app/api/config/event/route.ts`:
   ```ts
   export async function GET(); // → { event_start_datetime: string }
   ```

### Phase 2: Core Page (US1, US3, US5 — P1)

Build the page skeleton and critical P1 stories:

1. **Page** (`src/app/[locale]/(protected)/page.tsx`):
   - `async` Server Component
   - Fetches `eventConfig` via `homepage-service.ts`
   - Renders `<Header />`, `<HeroSection />`, `<AwardsSection />`, `<KudosPromo />`, `<Footer />`
   - `<WidgetButton />` injected automatically by `(main)/layout.tsx` — NOT added in page.tsx

2. **Header** (`Header.tsx` — Client Component):
   - Sticky `top-0 z-50`, `bg-[var(--color-header-bg)]`, `backdrop-blur`
   - Logo → `/[locale]` (Home)
   - Nav links: `About SAA 2025` → `#about`, `Awards Information` → `/[locale]/awards-information`, `Sun* Kudos` → `/[locale]/sun-kudos`
   - Active state via `usePathname()` — gold text + underline
   - Icon buttons: Bell (40×40 no border), Language toggle, Avatar → opens `DropdownProfile`

3. **HeroSection** (`HeroSection.tsx`):
   - Full-width BG image via `<Image>` with `fill` + `object-cover`
   - Gradient overlay: CSS variable
   - "ROOT FURTHER" image as title
   - **Frame 487** outer flex-col container `gap-10` (40px) wrapping: ROOT FURTHER → Frame 523 block → CTA buttons
   - **Frame 523** inner flex-col container `gap-4` (16px) wrapping: `<CountdownTimer>` + `<EventInfo>`

4. **CountdownTimer** (`CountdownTimer.tsx` — Client Component):
   - Props: `targetDate: string`
   - `setInterval` every 60 000ms
   - Computes `{ days, hours, minutes }` from `targetDate - Date.now()`
   - When `<= 0`: **hide entire countdown block** (digits + any subtitle), **render only "Lấy mã QR" `<Link href="/ticket">` button** (gold fill, same style as ABOUT AWARDS) in its place
   - Renders 3× `<CountdownDigit unit="DAYS|HOURS|MINUTES" value={dd} />`

5. **CTAButtons** (`CTAButtons.tsx`):
   - Container: `flex row`, `gap-10` (40px) — matches B3_Call-To-Action
   - "ABOUT AWARDS": gold fill, `gap-2` (8px) between text + `<RedirectIcon>` 24×24 → `href="/[locale]/awards-information"`
   - "ABOUT KUDOS": semi-transparent gold bg + border `#998C5F`, `gap-2` + `<RedirectIcon>` 24×24 → `href="/[locale]/sun-kudos"`
   - Use `<Link>` from `next-intl/navigation`

### Phase 3: Award Cards + Kudos Promo (US2 — P1)

1. **AwardCard** (`AwardCard.tsx`):
   - Props: `award: AwardCategory`
   - `<Image>` for award image (square, gold border + glow on hover)
   - Title, description (2 lines, `line-clamp-2`)
   - `<Link href={/[locale]/awards-information#${award.slug}}>Chi tiết</Link>`
   - Hover: `group-hover:shadow-[0_0_16px_rgba(255,234,158,0.3)] group-hover:-translate-y-1`

2. **AwardsSection** (`AwardsSection.tsx`):
   - Header: caption + title "Hệ thống giải thưởng" + description
   - `<AwardGrid>`: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

3. **KudosPromo** (`KudosPromo.tsx`):
   - "Phong trào ghi nhận" label + "Sun\* Kudos" title + description + illustration
   - "Chi tiết" button → `href="/[locale]/sun-kudos"`

### Phase 4: Widget Button + Polish (US4 — P2)

1. **WidgetButton** (shared `src/components/ui/WidgetButton.tsx` — Client Component):
   - `fixed bottom-8 right-8 z-40`, gold pill `105×64px`
   - Injected via `src/app/[locale]/(protected)/(main)/layout.tsx` — NOT rendered directly in `page.tsx`
   - Click → quick-action dropdown (spec TBD)

2. **Footer** (`Footer.tsx`):
   - Logo + 4 nav links + copyright "Bản quyền thuộc về Sun\* © 2025"
   - Padding `40px 90px`

3. **Loading skeletons**:
   - Award card skeleton while image loads (`animate-pulse`)
   - Countdown shows "00" until hydrated

4. **Error states**:
   - If `fetchEventConfig` fails → countdown falls back to static date from env var `NEXT_PUBLIC_EVENT_START_DATETIME`
   - If award image fails to load → show placeholder bg with gold border

5. **Responsive**:
   - Test at 375px, 768px, 1024px, 1440px per constitution §V
   - Header nav collapses on mobile (hamburger — mark as out-of-scope for now, leave as scrollable)
   - Award grid: 1 col mobile → 2 col md → 3 col lg
   - Hero content: single column mobile, centered

### Phase 8: Ticket Page — QR Code (US6 — P1)

1. **QRCodeDisplay** (`QRCodeDisplay.tsx` — Client Component):
   - Props: `userId: string`
   - `'use client'` — `qrcode.react` requires browser
   - Renders `<QRCodeSVG value={userId} size={240} fgColor="#FFFFFF" bgColor="transparent" />`
   - Wrapped in `flex flex-col items-center justify-center min-h-screen bg-black`

2. **Ticket Page** (`src/app/[locale]/(protected)/(main)/ticket/page.tsx` — Server Component):
   - Reads current user from Supabase server session (`createServerClient`)
   - If no session → redirect to `/login`
   - Passes `user.id` to `<QRCodeDisplay userId={user.id} />`
   - Full-screen black background, no header/footer needed (standalone page)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Countdown updates on time change, Header dropdowns open/close
- [x] **External dependencies**: Supabase `app_config` read (server-side)
- [x] **User workflows**: Full homepage render → click award card → navigate to Awards page

### Test Categories

| Category         | Applicable? | Key Scenarios                                                                  |
| ---------------- | ----------- | ------------------------------------------------------------------------------ |
| UI ↔ Logic       | Yes         | Countdown zero-state hides entire countdown block, award card click navigates with hash |
| App ↔ Data Layer | Yes         | `fetchEventConfig` reads correct key from `app_config`                         |
| Cross-platform   | Yes         | Responsive layout at 4 breakpoints                                             |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Page renders all sections: header, hero, countdown, awards (×6), kudos promo, footer
   - [ ] Countdown shows correct DAYS/HOURS/MINUTES from `event_start_datetime`
   - [ ] Award card "Chi tiết" link navigates to `/awards-information#top-talent`
   - [ ] "ABOUT AWARDS" navigates to `/awards-information`
   - [ ] "ABOUT KUDOS" navigates to `/sun-kudos`
   - [ ] When countdown expired: "Lấy mã QR" button visible in hero section
   - [ ] Click "Lấy mã QR" → navigates to `/ticket`
   - [ ] `/ticket` renders QR code (240×240) centered on black background

2. **Error Handling**
   - [ ] If `app_config` has no `event_start_datetime` → fallback to env var, no crash
   - [ ] If award image 404 → placeholder rendered, no layout shift

3. **Edge Cases**
   - [ ] Countdown target in the past → entire countdown block hidden, only "Lấy mã QR" button shown
   - [ ] Unauthenticated user visiting `/` or `/` → redirected to `/login` (middleware)

### Tooling

- **Unit**: Vitest — `CountdownTimer` logic (time calculation, zero-state)
- **E2E**: Playwright — full page load, navigation flows
- **CI**: Run on every PR via GitHub Actions

### Coverage Goals

| Area               | Target        | Priority |
| ------------------ | ------------- | -------- |
| Countdown logic    | 100%          | High     |
| Navigation links   | 100%          | High     |
| Award card renders | 90%+          | High     |
| Responsive layout  | 4 breakpoints | Medium   |

---

## Risk Assessment

| Risk                                         | Probability | Impact | Mitigation                                                             |
| -------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------- |
| `app_config` key missing in staging DB       | Low         | Medium | Fallback to `NEXT_PUBLIC_EVENT_START_DATETIME` env var                 |
| Hero image too large → slow LCP              | Medium      | High   | Optimize with `<Image>` `priority` + WebP format; set explicit `sizes` |
| Award category images not in Figma yet       | Low         | Medium | Use placeholder gradient until assets are ready                        |
| Header dropdown z-index conflicts            | Low         | Low    | Set `z-50` on header, `z-[60]` on dropdowns                            |
| Countdown hydration mismatch (SSR vs client) | Medium      | Medium | Render "00" server-side, hydrate with real values on client            |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` + `design-style.md` complete
- [x] `public.app_config` seeded with `event_start_datetime`
- [x] `(protected)/layout.tsx` auth guard exists
- [ ] Figma media assets downloaded (Phase 0)
- [ ] `zod` installed (`yarn add zod` if missing)
- [ ] `qrcode.react` installed (`yarn add qrcode.react`)

### External Dependencies

- Supabase project running with `app_config` seeded
- Figma file accessible for asset export

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the task breakdown
2. **Start** Phase 0 — download assets from Figma
3. **Begin** Phase 1 — add design tokens + types + service

---

## Notes

- **Homepage route**: `/[locale]/(protected)/page.tsx` — the root protected route after login. SCREENFLOW confirms: "Successful Google OAuth → Homepage SAA".
- **Award data is static**: No `award_categories` DB table in the current migration. Static TypeScript config is simpler, type-safe, and sufficient for this version. If awards need to be editable by admins, create a migration in a later sprint.
- **Widget button target**: SCREENFLOW says widget opens "quick-action menu" — clarify with team whether it's a mini menu or direct link to `/write-kudo`. Plan uses direct link as default.
- **Dropdown-profile + Dropdown-ngôn ngữ**: These are built within the `<Header />` component. No separate page routes — they are overlay components per SCREENFLOW.
- **i18n**: All static text must use `useTranslations()` (next-intl). Create translation keys under `homepage.*` namespace in `vi.json` and `en.json`.
- **Countdown hydration**: Server renders "00" for all digits to avoid hydration mismatch. Client `useEffect` replaces with real values immediately after mount.
