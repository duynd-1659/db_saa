# Implementation Plan: Hệ thống giải (Awards Information)

**Frame**: `313:8436-Hệ thống giải`
**Date**: 2026-03-11
**Spec**: `specs/313:8436-Hệ thống giải/spec.md`
**Version**: v2.2
**Last synced**: 2026-03-25

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v2.2 | 2026-03-25 | Cosmetic | Fix nav active style: border-bottom + icon gold + text-shadow glow. |
| v2.1 | 2026-03-25 | Cosmetic | Fix AwardsNavMenu width: 220px → 178px (Figma source of truth). Updated Phase 3 description. |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added to Integration Points (injected via (main)/layout.tsx). |
| v1.2 | 2026-03-11 | Structural | Update AwardCard/AwardsNavMenu component descriptions with icons and stat styles |
| v1.1 | 2026-03-11 | Cosmetic | Remove CSS border from AwardCard image description |
| v1.0 | 2026-03-11 | Initial | Initial plan |

---

## Summary

Build the Awards Information page at route `/[locale]/(protected)/awards-information`. This is a read-only reference page listing all 6 SAA 2025 award categories with a two-column layout: sticky left navigation (scroll-spy) and right column of award detail cards. Supports deep-linking via URL hash. Reuses existing Header, Footer, KudosPromo components, award config data, and design tokens. The page is a Server Component; only the left nav scroll-spy logic requires a Client Component with `IntersectionObserver`.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 App Router
**Primary Dependencies**: React 18, Tailwind CSS 4.x, `next-intl`
**Database**: None — award data is static config (`src/config/award-categories.ts`)
**Testing**: Playwright (E2E), Vitest (unit)
**State Management**: None (Server Component page + isolated Client Component for scroll-spy)
**API Style**: N/A — no API endpoint needed (static data)

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

- [x] Follows project coding conventions (kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Tailwind CSS 4 tokens, no raw hex in components)
- [x] Adheres to folder structure (`src/app/`, `src/components/[feature]/`, `src/types/`)
- [x] Meets security requirements (Server Component by default, route under `(protected)` group)
- [x] Follows testing standards (E2E for critical navigation flows)
- [x] Server Component by default, `'use client'` only for scroll-spy nav
- [x] Uses `<Image>` for all images, `<Link>` for all internal navigation
- [x] All URLs sourced from `SCREENFLOW.md` — no hardcoded routes
- [x] All files formatted with Prettier

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/awards/`. Reuses shared components from `src/components/ui/` (Header, Footer, KudosPromo).
- **Rendering strategy**:
  - `page.tsx` -> **Server Component** — imports static award config, renders all sections server-side.
  - `<AwardsNavMenu />` -> **Client Component** (`'use client'`) — `IntersectionObserver` for scroll-spy, smooth-scroll on click, URL hash update.
  - Header, Footer, KudosPromo -> **Reuse existing** from `src/components/ui/`.
  - AwardsKeyvisual, AwardsSectionTitle, AwardCard -> **Server Components** (static content).
- **Styling strategy**: Tailwind CSS 4 utilities + existing CSS variables from `globals.css`. May need a few new tokens for awards-specific spacing.
- **Award data**: Import `AWARD_CATEGORIES` from existing `src/config/award-categories.ts`.

### Backend Approach

- No API endpoint needed. Award data is static config.
- No database changes required.

### Integration Points

- **Existing Components**: `Header` (`src/components/ui/Header.tsx`), `Footer` (`src/components/ui/Footer.tsx`), `KudosPromo` (`src/components/ui/KudosPromo.tsx`)
- **Shared UI**: `<WidgetButton />` from `src/components/ui/WidgetButton.tsx` — injected automatically via `src/app/[locale]/(protected)/(main)/layout.tsx`; no per-page import needed
- **Existing Config**: `AWARD_CATEGORIES` (`src/config/award-categories.ts`)
- **Existing Types**: `AwardCategory` (`src/types/homepage.ts`)
- **Existing Design Tokens**: `--color-gold`, `--color-page-bg`, `--color-border`, `--spacing-page-x`, `--spacing-page-y` in `globals.css`
- **Deep-link from Homepage**: Homepage award cards link to `/awards-information#<slug>` — this page must handle hash on load.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313:8436-Hệ thống giải/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
└── tasks.md             # Next step
```

### Source Code (affected areas)

```text
src/
├── app/
│   └── [locale]/
│       └── (protected)/
│           └── awards-information/
│               └── page.tsx                    # NEW — Awards Information Server Component
│
├── components/
│   ├── homepage/
│   │   ├── Header.tsx                          # EXISTING — reuse (already links to /awards-information)
│   │   ├── Footer.tsx                          # EXISTING — reuse (already links to /awards-information)
│   │   └── KudosPromo.tsx                      # EXISTING — reuse
│   └── awards/                                 # NEW feature folder
│       ├── AwardsKeyvisual.tsx                 # Hero banner: BG + logo + title section (absolute bottom)
│       ├── AwardsSectionTitle.tsx              # Title section rendered inside AwardsKeyvisual (absolute bottom center)
│       ├── AwardsNavMenu.tsx                   # Client Component — sticky left nav with scroll-spy
│       ├── AwardCard.tsx                       # Single award detail card (image + content + stats)
│       └── AwardsLayout.tsx                    # Two-column layout wrapper (nav + cards)
│
├── config/
│   └── award-categories.ts                     # EXISTING — static award data
│
├── types/
│   └── homepage.ts                             # EXISTING — AwardCategory type (consider renaming to shared types)
│
└── app/
    └── globals.css                             # MODIFY — add awards-specific tokens if needed
```

### New Migrations

None required.

### Dependencies

No new npm packages required.

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download required media assets from Figma using `get_media_files` tool:

| Asset | Figma Node | Destination |
|-------|-----------|-------------|
| Awards keyvisual BG | `313:8437` | Reuse `public/assets/homepage/images/keyvisual-bg.png` |
| ROOT FURTHER logo | `2789:12915` | `public/assets/awards/images/root-further-logo.png` |
| Award card images (x6) | Per award card node | `public/assets/awards/images/award-{slug}.png` |
| Sun* Kudos promo illustration | `335:12023` | Check if already exists from Homepage |

**Note**: Check if award images and ROOT FURTHER logo already exist at `public/assets/homepage/images/` from the Homepage implementation. If so, reuse them.

### Phase 1: Foundation (Design Tokens + Page Route)

1. **Design tokens** — Review `globals.css` for any missing awards-specific tokens:
   - `--spacing-content-gap: 80px` (gap between award cards within the section)
   - `--spacing-award-card-gap: 40px` (gap between award detail cards)
   - Most tokens already exist from Homepage implementation.

2. **Page route** — Create `src/app/[locale]/(protected)/awards-information/page.tsx`:
   - Server Component
   - Import `AWARD_CATEGORIES` from config
   - Render: `<Header />`, `<AwardsKeyvisual />` (includes Title Section at bottom), `<AwardsLayout />`, `<KudosPromo />`, `<Footer />`
   - Page background: `bg-[var(--color-page-bg)]`

### Phase 2: Static Sections (US1 — P1)

Build all the static/server-rendered sections:

1. **AwardsKeyvisual** (`AwardsKeyvisual.tsx`):
   - Composite section (relative container, 547px height) containing:
     - Background via single CSS `background` shorthand: `linear-gradient(...), url(/assets/homepage/images/keyvisual-bg.png)` — reuse homepage asset, same pattern as HeroSection
     - "ROOT FURTHER" logo — **absolute top-left**
     - `<AwardsSectionTitle />` — **absolute bottom, horizontally centered**
   - Node `313:8437` = BG image, `313:8450` = ROOT FURTHER logo, `313:8453` = Title Section

2. **AwardsSectionTitle** (`AwardsSectionTitle.tsx`):
   - Caption: "Sun* Annual Awards 2025" (Montserrat 14px 700 white)
   - Divider line (horizontal separator)
   - Heading: "Hệ thống giải thưởng SAA 2025" (Montserrat Alternates 700 40px gold)
   - Layout: `flex flex-col gap-4`, width `1152px`
   - **Rendered inside AwardsKeyvisual**, positioned absolute bottom center

3. **AwardCard** (`AwardCard.tsx`):
   - Props: `award: AwardCategory`
   - Layout: `flex row` — image left (336x336px) + content right
   - Image: `<Image>` — composite asset with gold glow + rounded corners baked in (no CSS border needed)
   - Content: [target icon] + award name (Montserrat 700 24-28px white), description (Montserrat 400 16px white)
   - Stats row:
     - "So luong giai thuong": [diamond icon] + label (bold gold) + value (gold 24px 700) + unit type — single horizontal row
     - "Gia tri giai thuong": [license icon] + label (bold gold), value (gold 24px 700) on next line + "cho moi giai thuong" (muted)
   - Each card has `id={award.slug}` for hash deep-linking
   - "Signature 2025 - Creator" card: display both 5M (individual) and 8M (team) values

4. **AwardsLayout** (`AwardsLayout.tsx`):
   - Two-column layout: `flex gap-[80px]`
   - Left: `<AwardsNavMenu />` (220px, sticky)
   - Right: Award cards mapped from `AWARD_CATEGORIES`, gap `40px`
   - Content width: `1152px` centered with `px-[var(--spacing-page-x)]`

### Phase 3: Scroll-Spy Navigation (US2, US3 — P1)

1. **AwardsNavMenu** (`AwardsNavMenu.tsx` — Client Component):
   - `'use client'` directive
   - 6 nav items corresponding to award slugs, each with [target icon] + text label
   - **Scroll-spy**: `IntersectionObserver` on each `#award-slug` section
     - `threshold: 0.3` (or similar) to detect when section enters viewport
     - Update active item state when section is in view
   - **Click handler**: `element.scrollIntoView({ behavior: 'smooth' })` + update `window.location.hash`
   - **Active style**: `border-bottom: 1px solid #FFEA9E` + text `color: var(--color-gold)` + text-shadow glow + icon gold (inherit)
   - **Sticky behavior**: `sticky top-20` (below header) — must unstick before footer
   - **Deep-link on load**: `useEffect` to check `window.location.hash` on mount and scroll to section
   - **Width**: `178px`

2. **Responsive behavior**:
   - Desktop (>=1280px): Side-by-side nav + cards
   - Tablet (768-1279px): Nav collapses to horizontal tabs above cards
   - Mobile (<768px): Nav hidden or collapsed to dropdown, single column cards stacked

### Phase 4: Polish + Edge Cases

1. **Image fallbacks**: If award image fails to load, show placeholder with gold border
2. **Invalid hash**: If URL hash doesn't match any slug, ignore and scroll to top
3. **Responsive testing**: Verify at 375px, 768px, 1024px, 1440px per constitution SS V
4. **i18n**: All static text uses `useTranslations('awards-information')` — add keys to `vi.json` and `en.json`
5. **Header active state**: "Awards Information" nav link must be gold + underlined on this page
6. **Accessibility**: Proper heading hierarchy (h1 for page title, h2 for award names), `aria-current` on active nav item

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Scroll-spy activates correct nav item, click nav scrolls to card
- [x] **User workflows**: Homepage award card click -> land on awards page at correct section
- [x] **Deep-linking**: URL with hash loads and scrolls to correct section

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI <-> Logic | Yes | Scroll-spy active state, smooth scroll on nav click |
| Cross-platform | Yes | Responsive layout at 4 breakpoints |
| Navigation | Yes | Deep-link hash, homepage -> awards navigation |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Page renders all sections: header, keyvisual, title, 6 award cards, kudos promo, footer
   - [ ] Each award card shows correct name, description, prize count, and prize value
   - [ ] Clicking left nav item scrolls to corresponding award card
   - [ ] Scrolling page updates active left nav item
   - [ ] "Chi tiet" in Kudos promo navigates to `/sun-kudos`

2. **Deep-linking**
   - [ ] URL `/awards-information#top-talent` scrolls to Top Talent section on load
   - [ ] URL `/awards-information#mvp` scrolls to MVP section on load
   - [ ] URL with invalid hash (e.g., `#nonexistent`) stays at top

3. **Edge Cases**
   - [ ] Award image 404 -> placeholder rendered, no layout shift
   - [ ] Page renders correctly in both `vi` and `en` locales
   - [ ] Unauthenticated user -> redirected to `/login`

### Tooling

- **Unit**: Vitest — `AwardsNavMenu` scroll-spy logic (IntersectionObserver mock)
- **E2E**: Playwright — full page load, nav click scrolling, deep-link hash
- **CI**: Run on every PR via GitHub Actions

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Award card renders (all 6) | 100% | High |
| Navigation + deep-linking | 100% | High |
| Scroll-spy accuracy | 90%+ | High |
| Responsive layout | 4 breakpoints | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Award images not yet exported from Figma | Medium | Medium | Use placeholder gradient with gold border until assets ready |
| Scroll-spy jitter on fast scroll | Medium | Low | Debounce IntersectionObserver callback, use `rootMargin` for offset |
| Sticky nav overlapping footer | Low | Medium | Use IntersectionObserver on footer to unstick nav, or calculate scroll bounds |
| Header active state not updating for this route | Low | Low | Verify Header uses `usePathname()` matching `/awards-information` |
| Responsive left nav UX on tablet | Medium | Medium | Start with horizontal tabs; iterate based on testing |
| Hydration mismatch on hash scroll | Low | Low | Perform hash-based scroll in `useEffect` (client-only) |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` + `design-style.md` complete
- [x] `AWARD_CATEGORIES` config exists (`src/config/award-categories.ts`)
- [x] `AwardCategory` type exists (`src/types/homepage.ts`)
- [x] Header, Footer, KudosPromo components exist
- [x] Design tokens defined in `globals.css`
- [x] `(protected)` layout with auth guard exists
- [ ] Figma media assets downloaded (Phase 0)

### External Dependencies

- Figma file accessible for asset export (keyvisual + award card images)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the task breakdown
2. **Start** Phase 0 — download assets from Figma
3. **Begin** Phase 1 — create page route + verify design tokens
4. **Continue** Phase 2 — build static sections (AwardCard, Keyvisual, Title)
5. **Then** Phase 3 — implement scroll-spy nav (Client Component)
6. **Finally** Phase 4 — polish, responsive, i18n, edge cases

---

## Notes

- **Reuse over rebuild**: Header, Footer, and KudosPromo are already implemented for the Homepage. Import and reuse them directly. If awards-specific styling differences exist (e.g., Header active state), verify the existing component handles it via `usePathname()`.
- **Award data values**: The spec lists specific award values (e.g., Top Talent: 10 awards, 7M VND) but the existing config in `award-categories.ts` may have different values (e.g., 3 awards, 50M VND). **Verify with stakeholders** which data source is authoritative — Figma spec or existing config. Update config if needed.
- **"Signature 2025 - Creator"**: This award has dual values (5M individual / 8M team). The `AwardCard` component must handle this special case via the `special_note` field.
- **Left nav sticky bounds**: The nav should be sticky only within the awards section (between title and kudos promo). It must NOT remain sticky over the footer. Use a scroll container or IntersectionObserver on the parent section boundary.
- **Content width**: The Figma frame is 1440px. Content area is 1152px (1440 - 2*144px padding). Use `max-w-[1152px] mx-auto` or `px-[var(--spacing-page-x)]` on a 1440px container.
- **Font**: Heading uses "Montserrat Alternates" (700, 40px) which is different from body "Montserrat". Ensure both fonts are loaded.
- **i18n namespace**: Use `awards-information` as the translation namespace. Create keys for all static labels (section title, stat labels "So luong giai thuong", "Gia tri giai thuong", "cho moi giai thuong", etc.).
