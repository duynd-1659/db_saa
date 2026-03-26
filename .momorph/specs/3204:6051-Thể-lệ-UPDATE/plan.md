# Implementation Plan: Thể lệ UPDATE

**Frame**: `3204:6051-Thể-lệ-UPDATE`
**Spec**: `spec.md`
**Created**: 2026-03-18
**Version**: v1.2
**Last updated**: 2026-03-18

---

## Summary

Implement a right-side slide-in drawer (`RulesPanelDrawer`) that displays the SAA 2025 award rules. The drawer is triggered by clicking Button A "Thể lệ" in the `FabWidget`. It contains three static content sections (Người nhận KUDOS hero badges, Người gửi KUDOS collectible badges, Kudos Quốc Dân), and two footer CTAs (Đóng, Viết KUDOS).

State coordination between `FabWidget` and `RulesPanelDrawer` follows the existing `WriteKudoProvider` pattern: a new `RulesPanelProvider` context is added at `[locale]/layout.tsx`, the `FabWidget` calls `openPanel()` via context, and the drawer renders via `createPortal`. All content is static (no API calls). The component is WCAG AA accessible with focus trap, Escape-to-close, and backdrop-click-to-close.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React (useState, useEffect, useRef, useContext), next-intl, Next.js Image
**Database**: N/A — static content only
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: React Context (RulesPanelContext — mirrors WriteKudoContext pattern)
**API Style**: None — all data is static constants

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

| Requirement | Constitution Rule | Status |
|---|---|---|
| TypeScript strict | `strict: true`, no `any`, explicit return types | ✅ Compliant |
| Folder structure | Feature components → `src/components/rules/`; provider follows existing pattern | ✅ Compliant |
| `'use client'` only where needed | Drawer needs browser state + event handlers → Client Component | ✅ Compliant |
| CSS tokens | All colors/spacing via CSS variables in `globals.css`; no raw hex in components | ✅ Planned |
| Icons as `<Image>` | Must NOT use raw `<img>` or inline `<svg>` | ✅ Planned |
| Internal navigation | "Viết KUDOS" opens modal via context, not `<Link>` — correct | ✅ Compliant |
| Responsive breakpoints | Mobile (< 768px), Tablet (md:), Desktop (lg:) per §V | ✅ Planned |
| Accessibility | `role="dialog"` + `aria-modal` + focus trap + Escape key per §WCAG | ✅ Planned |
| Prettier formatted | All files formatted before commit | ✅ Compliant |
| No business logic in component | Drawer is pure UI; no service layer needed | ✅ Compliant |
| i18n | All text via `useTranslations('common.rules')` | ✅ Planned |

**Violations**: None.

---

## Architecture Decisions

### Frontend

- **Component pattern**: Two files — `RulesPanelProvider.tsx` (context + portal rendering) and `RulesPanelDrawer.tsx` (pure UI component with all sections). Follows the exact `WriteKudoProvider` / `WriteKudoModal` split already in the codebase.
- **State management**: New `RulesPanelContext` with `openPanel()` / `closePanel()` — `isOpen: boolean` local state inside provider. `FabWidget` calls `openPanel()`; the drawer renders conditionally.
- **Portal rendering**: The drawer and backdrop are rendered via `createPortal(…, document.body)` inside `RulesPanelProvider`, same as `WriteKudoProvider`. This ensures correct z-index stacking above all page content. Panel uses `z-[60]`, backdrop uses `z-[59]` — both above the sticky site header (`z-50`).
- **Body scroll lock**: A `useEffect` in `RulesPanelDrawer` adds `document.body.style.overflow = 'hidden'` when `isOpen` is true and removes it (restores empty string) on cleanup. This prevents background scrolling while the panel is open.
- **FAB wiring**: `FabWidget.tsx` is updated to import and call `useRulesPanelContext().openPanel()` inside `handleRules` (currently a stub that only collapses the FAB).
- **Static content**: Hero badge tiers and collectible badges are defined as typed constant arrays inside the component file (no API). Text labels come from i18n translations under `common.rules.*`.
- **Icons**: Downloaded from Figma → `public/assets/rules/icons/`. Rendered via `<Image>` per constitution §VII. MM_MEDIA_Close and MM_MEDIA_Pen are reused from `public/assets/fab/icons/` (already exist).
- **Animation**: CSS keyframe `@keyframes rules-slide-in` / `@keyframes rules-slide-out` appended to `globals.css`. Panel uses `animate-rules-slide-in` / `animate-rules-slide-out` Tailwind utility classes.
- **Focus trap**: On open, focus moves to "Đóng" button. Tab key cycles within the panel. On close, focus returns to FAB trigger button (passed as `triggerRef` via context or `document.activeElement` capture on open).
- **Escape key**: `useEffect` listening for `keydown` in drawer scope, closes panel on `Escape`.
- **Debounce for "Viết KUDOS"**: Single click-once guard (300ms, `useRef<boolean>`) to prevent double modal open.

### Backend

No backend changes. All content is static.

### Integration Points

- **`WriteKudoProvider`** (existing): `RulesPanelDrawer` calls `useWriteKudoContext().openWriteKudo()` when Button B.2 "Viết KUDOS" is clicked. Both providers are mounted at `[locale]/layout.tsx` — no scope issue.
- **`FabWidget`** (existing, `src/components/ui/FabWidget.tsx`): `handleRules` is updated to call `useRulesPanelContext().openPanel()`. The current stub only calls `setIsExpanded(false)`.
- **`[locale]/layout.tsx`** (existing): Wrap `WriteKudoProvider` with `RulesPanelProvider` (or nest them side-by-side — `RulesPanelProvider` wraps `WriteKudoProvider` wraps `children`).
- **`globals.css`** (existing): New Rules design token block appended.
- **i18n JSON files** (existing `vi.json`, `en.json`): New `common.rules` namespace added.

---

## Project Structure

### New Files

| File | Purpose |
|---|---|
| `src/components/rules/RulesPanelProvider.tsx` | Context (`RulesPanelContext`) + portal rendering of drawer + backdrop |
| `src/components/rules/RulesPanelDrawer.tsx` | Right-side drawer UI — all three content sections + footer CTAs |
| `public/assets/rules/icons/hero-new.svg` | MM_MEDIA_New Hero badge (Figma node `3007:17506`) |
| `public/assets/rules/icons/hero-rising.svg` | MM_MEDIA_Rising Hero badge (Figma node `3007:17509`) |
| `public/assets/rules/icons/hero-super.svg` | MM_MEDIA_Super Hero badge (Figma node `3007:17512`) |
| `public/assets/rules/icons/hero-legend.svg` | MM_MEDIA_Legend Hero badge (Figma node `3007:17516`) |
| `public/assets/rules/icons/badge-revival.svg` | MM_MEDIA_ Badge REVIVAL (Figma node `737:20446`) |
| `public/assets/rules/icons/badge-touch-of-light.svg` | MM_MEDIA_ Badge TOUCH OF LIGHT (Figma node `737:20450`) |
| `public/assets/rules/icons/badge-stay-gold.svg` | MM_MEDIA_ Badge STAY GOLD (Figma node `737:20449`) |
| `public/assets/rules/icons/badge-flow-to-horizon.svg` | MM_MEDIA_ Badge FLOW TO HORIZON (Figma node `737:20447`) |
| `public/assets/rules/icons/badge-beyond-the-boundary.svg` | MM_MEDIA_ Badge BEYOND THE BOUNDARY (Figma node `737:20448`) |
| `public/assets/rules/icons/badge-root-further.svg` | MM_MEDIA_ Badge ROOT FURTHER (Figma node `737:20451`) |

### Modified Files

| File | Changes |
|---|---|
| `src/app/[locale]/layout.tsx` | Wrap `WriteKudoProvider` with `RulesPanelProvider` |
| `src/components/ui/FabWidget.tsx` | Add `useRulesPanelContext()` import; update `handleRules` to call `openPanel()` |
| `src/app/globals.css` | Add Rules design tokens (`--color-rules-*`, `--radius-rules-*`, `--shadow-rules-*`) and slide-in/out keyframe animations |
| `src/i18n/messages/vi.json` | Add `common.rules.*` i18n keys (Vietnamese) |
| `src/i18n/messages/en.json` | Add `common.rules.*` i18n keys (English) |

### New Migrations

None required (static content, no DB interaction).

### Dependencies

No new npm packages required.

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download all 10 new SVG/PNG icons from Figma using the `get_media_files` tool:

| Asset | Figma Node ID | Destination |
|---|---|---|
| MM_MEDIA_New Hero badge | `3007:17506` | `public/assets/rules/icons/hero-new.svg` |
| MM_MEDIA_Rising Hero badge | `3007:17509` | `public/assets/rules/icons/hero-rising.svg` |
| MM_MEDIA_Super Hero badge | `3007:17512` | `public/assets/rules/icons/hero-super.svg` |
| MM_MEDIA_Legend Hero badge | `3007:17516` | `public/assets/rules/icons/hero-legend.svg` |
| MM_MEDIA_ Badge REVIVAL | `737:20446` | `public/assets/rules/icons/badge-revival.svg` |
| MM_MEDIA_ Badge TOUCH OF LIGHT | `737:20450` | `public/assets/rules/icons/badge-touch-of-light.svg` |
| MM_MEDIA_ Badge STAY GOLD | `737:20449` | `public/assets/rules/icons/badge-stay-gold.svg` |
| MM_MEDIA_ Badge FLOW TO HORIZON | `737:20447` | `public/assets/rules/icons/badge-flow-to-horizon.svg` |
| MM_MEDIA_ Badge BEYOND THE BOUNDARY | `737:20448` | `public/assets/rules/icons/badge-beyond-the-boundary.svg` |
| MM_MEDIA_ Badge ROOT FURTHER | `737:20451` | `public/assets/rules/icons/badge-root-further.svg` |

Note: MM_MEDIA_Close (`214:3851`) and MM_MEDIA_Pen (`214:3812`) already exist at `public/assets/fab/icons/fab-close.svg` and `public/assets/fab/icons/fab-pen.svg` — reuse these.

---

### Phase 1: Design Tokens & Animations

Add Rules-specific CSS tokens to `src/app/globals.css`:

```css
/* --- Rules Panel --- */
--color-rules-panel-bg: #00070c;
--color-rules-overlay: rgba(0, 16, 26, 0.8);
--color-rules-title: #ffea9e;
--color-rules-body: #ffffff;
--color-rules-btn-close-bg: rgba(255, 234, 158, 0.1);
--color-rules-btn-close-border: #998c5f;
--color-rules-btn-write-bg: #ffea9e;
--color-rules-btn-write-text: #00101a;
--color-rules-badge-icon-border: #ffffff;
--radius-rules-btn: 4px;
--radius-rules-hero-badge: 55.579px;
--radius-rules-collectible-icon: 100px;
--shadow-rules-panel: 0 0 40px rgba(0, 0, 0, 0.5);
```

Add `@theme inline` mappings for Tailwind consumption and `@keyframes` for slide-in/slide-out animations:

```css
@keyframes rules-slide-in {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes rules-slide-out {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}
```

---

### Phase 2: RulesPanelProvider (Context + Portal)

Create `src/components/rules/RulesPanelProvider.tsx`:

```tsx
'use client';

interface RulesPanelContextValue {
  openPanel: () => void;
  closePanel: () => void;
}

// Context + hook + Provider component
// Provider holds isOpen state, renders RulesPanelDrawer via createPortal
// Exports useRulesPanelContext()
```

Key behavior:
- `openPanel()` → `setIsOpen(true)`
- `closePanel()` → `setIsOpen(false)`
- Renders `<RulesPanelDrawer isOpen={isOpen} onClose={closePanel} />` via `createPortal(…, document.body)`

---

### Phase 3: RulesPanelDrawer — US1 (Read award rules)

Create `src/components/rules/RulesPanelDrawer.tsx`:

**Static data constants** (inside file, typed arrays):
```ts
const HERO_TIERS: HeroTier[] = [
  { id: 'new', icon: '/assets/rules/icons/hero-new.svg', label: 'New Hero', condition: '…', description: '…' },
  { id: 'rising', icon: '/assets/rules/icons/hero-rising.svg', label: 'Rising Hero', condition: '…', description: '…' },
  { id: 'super', icon: '/assets/rules/icons/hero-super.svg', label: 'Super Hero', condition: '…', description: '…' },
  { id: 'legend', icon: '/assets/rules/icons/hero-legend.svg', label: 'Legend Hero', condition: '…', description: '…' },
];

const COLLECTIBLE_BADGES: CollectibleBadge[] = [/* 6 entries */];
```

**Drawer layout** (matches design-style.md §Layout Structure):
- Backdrop: `fixed inset-0 bg-[rgba(0,16,26,0.8)] z-[44]` — click → `onClose`
- Panel: `fixed top-0 right-0 w-[553px] h-screen bg-[#00070C] z-[45] flex flex-col justify-between`
- Content area: `flex flex-col gap-6 flex-1 overflow-y-auto p-[24px_40px_0]`
- Footer: `flex flex-row gap-4 items-end pb-10 px-10`
- Full responsive behavior: `w-full` on mobile, `md:w-[480px]`, `lg:w-[553px]`
- Animation: `animate-[rules-slide-in_300ms_ease-out]` on open, `animate-[rules-slide-out_250ms_ease-in]` on close (manage closing animation via `isClosing` state flag + setTimeout)

**Accessibility**:
- Panel: `role="dialog" aria-modal="true" aria-label={t('ariaLabel')}`
- Focus trap: tab cycles within backdrop + panel; on open focus moves to Đóng button via `useRef`
- Escape key: `useEffect` + `keydown` listener
- Focus return: capture `document.activeElement` before opening, return on close

---

### Phase 4: Close panel — US2 (Close the panel)

Add three close mechanisms in `RulesPanelDrawer`:
1. **Đóng button** (B.1): `onClick={onClose}` — already wired in Phase 3 structure
2. **Escape key**: `useEffect(() => { if (e.key === 'Escape') onClose(); }, [isOpen])`
3. **Backdrop click**: Backdrop `<div>` wraps panel; `onClick` on backdrop div calls `onClose` (stop propagation on panel)

---

### Phase 5: Viết KUDOS button — US3 (Write KUDOS from panel)

Inside `RulesPanelDrawer`:
- Import `useWriteKudoContext`
- Button B.2 "Viết KUDOS": `onClick` → `debounce(() => { openWriteKudo(); onClose(); })`
- Debounce: 300ms click-once guard via `useRef<boolean>` (same pattern as `FabWidget`)

---

### Phase 6: Layout Wiring

1. Update `src/app/[locale]/layout.tsx`:
   - Import `RulesPanelProvider`
   - Wrap: `<RulesPanelProvider><WriteKudoProvider>{children}</WriteKudoProvider></RulesPanelProvider>`

2. Update `src/components/ui/FabWidget.tsx`:
   - Import `useRulesPanelContext`
   - In `handleRules`: add `openPanel()` call before `setIsExpanded(false)`

---

### Phase 7: Polish (i18n, Responsive, A11y)

1. **i18n** — Add `common.rules.*` keys to `vi.json` and `en.json`:
   - `ariaLabel`, `title`, `nguoiNhanHeading`, `nguoiNhanBody`, `nguoiGuiHeading`, `nguoiGuiBody`, `nguoiGuiSummary`, `kudosQuocDanHeading`, `kudosQuocDanBody`, hero tier keys, collectible badge names, `btnClose`, `btnVietKudos`
   - Replace all hardcoded strings in `RulesPanelDrawer` with `useTranslations('common.rules')` calls

2. **Responsive** — Apply breakpoint overrides:
   - Mobile: `w-full`, padding `p-[16px_20px_20px]`, title `text-[32px]`, headings `text-[18px]`, btn-write `w-full`
   - Tablet: `md:w-[480px]`, `md:p-[20px_32px_32px]`
   - Desktop: `lg:w-[553px]`, full Figma spec values

3. **Close animation** — Add `isClosing` boolean state flag:
   - On `onClose` call: set `isClosing=true` → wait 250ms → actually close (set `isOpen=false`)
   - Panel class: `isClosing ? animate-rules-slide-out : animate-rules-slide-in`

---

## Testing Strategy

| Type | Focus | Coverage |
|---|---|---|
| Unit (Vitest) | RulesPanelProvider state (open/close), Escape key handler, debounce guard | Core logic |
| E2E (Playwright) | FAB Button A opens drawer, all 3 sections visible, Đóng closes, Escape closes, backdrop click closes, Viết KUDOS opens WriteKudo modal | Critical paths |

### Key Test Scenarios

1. **US1 — Read rules**:
   - Render drawer → all three sections visible (Người nhận, Người gửi, Kudos Quốc Dân)
   - All 4 hero badge rows rendered with icon, condition, description
   - All 6 collectible badges in 3×2 grid

2. **US2 — Close**:
   - Click Đóng → drawer removed from DOM
   - Press Escape → drawer removed
   - Click backdrop → drawer removed
   - Focus returns to FAB trigger after close

3. **US3 — Write KUDOS**:
   - Click Viết KUDOS → `WriteKudoModal` opens, Rules drawer closes
   - Double-click → modal opens only once (debounce guard)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Close animation race condition (panel unmounts before animation completes) | Medium | Low | Use `isClosing` state + setTimeout(250ms) before unmounting |
| Focus trap breaking keyboard navigation | Low | Medium | Use `useEffect` with `querySelectorAll` on focusable elements; test with Tab key |
| Figma badge icons have unexpected formats (not SVG or have broken paths) | Medium | Low | Inspect downloaded assets; fall back to PNG if SVG render fails |
| `createPortal` SSR hydration mismatch | Low | Medium | Guard with `typeof window !== 'undefined'` check in provider or use `useEffect` mount flag |
| Hero badge images scale incorrectly inside pill shape | Low | Low | Use `<Image fill objectFit="contain">` inside pill container; verify dimensions post-download |
| RulesPanelProvider added to `[locale]/layout.tsx` breaks auth-only pages | Very Low | Low | Provider is a no-op until `openPanel()` is called — no visual side effects on auth pages |

---

## Open Questions

- [ ] Should the panel close automatically when the user navigates to another route (Next.js navigation)? If yes, use `usePathname()` in `RulesPanelProvider` to detect route changes and call `closePanel()`.
- [ ] Should the panel be accessible before authentication (e.g., on `/login`)? Per spec, the FAB only renders within `(main)/(protected)` — so no. But since `RulesPanelProvider` wraps all locale routes, a direct-URL scenario is impossible.
- [ ] Are the hero badge images (MM_MEDIA_New Hero etc.) full badge illustrations or just pill-shaped text badges? From design-style: they are pill components with border + text. Confirm whether they render best as SVG (with text) or PNG.

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` complete (3204:6051)
- [x] `design-style.md` complete (3204:6051)
- [x] `FabWidget.tsx` implemented (Button A stub exists — `handleRules` just collapses FAB)
- [x] `WriteKudoProvider` in scope at `[locale]/layout.tsx`
- [ ] Figma icons downloadable via `get_media_files` tool (Phase 0)

### External Dependencies

- Figma file `9ypp4enmFmdK3YAFJLIu6C` — accessible via MoMorph tools for icon downloads

---

## Notes

- **Reuse MM_MEDIA_Close and MM_MEDIA_Pen**: Both button icons already downloaded during FabWidget implementation at `public/assets/fab/icons/`. Import them from there — do not re-download.
- **Panel bg vs page bg**: `#00070C` (panel) ≠ `#00101A` (page). Do not reuse `--color-page-bg` for the panel.
- **`RulesPanelProvider` placement**: Wraps `WriteKudoProvider` in `[locale]/layout.tsx` so both providers are available in all locale routes (not just `(main)`). This is intentional — `RulesPanelDrawer` renders via portal to `document.body`, so it's always in scope.
- **Hero badge data**: The condition text and description for each badge tier should be stored as i18n keys, not hardcoded. The icon path is a static asset path (no i18n needed for paths).
- **Collectible badge names**: Names like "REVIVAL", "TOUCH OF LIGHT" are displayed as uppercase; use i18n keys so they can be translated in the English locale if needed.

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.2 | 2026-03-18 | Structural | Requirement change: z-index raised (panel z-60, backdrop z-59) to cover sticky header; added body scroll lock via useEffect. Updated: Architecture Decisions (Portal rendering + scroll lock). |
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: Hero Badge Row layout — BadgePill+Condition row 1, Description row 2. Updated: Phase 3 hero badge row description. |
| v1.0 | 2026-03-18 | — | Initial plan |
