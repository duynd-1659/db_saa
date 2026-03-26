# Implementation Plan: Floating Action Button – Expanded State

**Frame**: `313:9139-floating-action-button-phim-noi-chuc-nang-2`
**Spec**: `spec.md`
**Created**: 2026-03-18
**Version**: v1.1
**Last updated**: 2026-03-18

---

## Summary

Upgrade the existing `WidgetButton` (collapsed FAB trigger) into a full `FabWidget` component that supports both collapsed and expanded states. When expanded it renders three action sub-buttons — "Thể lệ" (A), "Viết KUDOS" (B), and "Huỷ" (C) — matching the Figma design exactly. The component lives in the `(main)` layout so it appears on every protected main-app page. Button B integrates with the already-mounted `WriteKudoProvider` context; Button A navigates to `/awards-information` via `<Link>`; Button C collapses the widget.

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

| Requirement | Constitution Rule | Status |
|---|---|---|
| TypeScript strict | `strict: true`, no `any`, explicit return types | ✅ Compliant |
| Folder structure | `src/components/ui/` for generic atoms | ✅ Compliant |
| `'use client'` only where needed | FAB needs browser state + event handlers → Client Component | ✅ Compliant |
| CSS tokens | Colors/spacing via CSS variables in `globals.css`; no raw hex in components | ✅ Planned |
| Icons as `<Icon>` component | Must NOT use raw `<img>` or inline `<svg>` | ✅ Planned |
| Internal navigation via `<Link>` | Button A navigates to `/awards-information`; use `<Link>` | ✅ Planned |
| URL from SCREENFLOW.md | Button A → `/awards-information`, Button B → `openWriteKudo()` — sourced from SCREENFLOW | ✅ Compliant |
| Responsive + touch targets | min 44×44px on mobile; fixed positioning maintained | ✅ Planned |
| Prettier formatted | All files formatted before commit | ✅ Compliant |
| No business logic in component | FAB is pure navigation/UI; no service layer needed | ✅ Compliant |

**Violations**: None.

---

## Architecture Decisions

### Frontend

- **Component pattern**: Single `FabWidget` Client Component manages both collapsed and expanded states via local `useState`. No separate hook needed — state is trivially simple (`boolean`).
- **State management**: Local `isExpanded: boolean` state inside `FabWidget`. No global state or context required for FAB itself.
- **Integration with WriteKudo**: `FabWidget` calls `useWriteKudoContext().openWriteKudo()` when Button B is clicked. `WriteKudoProvider` is already mounted at `src/app/[locale]/layout.tsx`, so context is always available within the FAB's render tree.
- **Navigation (Button A)**: Use Next.js `<Link href="/awards-information">` as the button wrapper — derived from `SCREENFLOW.md` (FABExpanded → PrizeSystem = Hệ thống giải = `/awards-information`).
- **Collapse on action**: Clicking Button A or Button B also collapses the FAB (`setIsExpanded(false)`) so the overlay closes after navigation/modal open.
- **Escape key**: `useEffect` listening for `Escape` keydown collapses FAB (US1 AC2).
- **Animation**: Staggered opacity + translateY on sub-buttons using Tailwind `transition` + CSS animation classes.
- **Icon approach**: Download three SVG icons from Figma → `public/assets/fab/icons/`. Render via `<Image>` (same pattern as existing `WidgetButton`). Per constitution §VII and design-style notes, icons must be encapsulated — do NOT use raw inline `<svg>`.

### Backend

No backend changes. The FAB is a pure UI/navigation widget with no API calls.

### Integration Points

- **Replaces**: `src/components/ui/WidgetButton.tsx` — `FabWidget` supersedes it; `WidgetButton` will be deleted after `FabWidget` is in place.
- **Layout injection point**: `src/app/[locale]/(protected)/(main)/layout.tsx` — swap `<WidgetButton />` for `<FabWidget />`.
- **WriteKudoProvider**: Already mounted at `src/app/[locale]/layout.tsx`; `FabWidget` can call `useWriteKudoContext()` directly.
- **New CSS tokens**: Add FAB-specific tokens to `src/app/globals.css`.

---

## Project Structure

### New Files

| File | Purpose |
|---|---|
| `src/components/ui/FabWidget.tsx` | Main FAB Client Component — collapsed trigger + expanded panel |
| `public/assets/fab/icons/fab-logo.svg` | Icon MM_MEDIA_LOGO (Thể lệ button) — downloaded from Figma node `214:3752` |
| `public/assets/fab/icons/fab-pen.svg` | Icon MM_MEDIA_Pen (Viết KUDOS button) — downloaded from Figma node `214:3812` |
| `public/assets/fab/icons/fab-close.svg` | Icon MM_MEDIA_Close (Huỷ button) — downloaded from Figma node `214:3851` |

### Modified Files

| File | Changes |
|---|---|
| `src/app/[locale]/(protected)/(main)/layout.tsx` | Replace `<WidgetButton />` import + usage with `<FabWidget />` |
| `src/app/globals.css` | Add FAB design tokens: `--color-fab-action-bg`, `--color-fab-cancel-bg`, `--color-fab-label`, `--color-fab-icon-cancel`, `--radius-fab-action`, `--radius-fab-cancel`, `--shadow-fab-hover` |
| `src/components/ui/WidgetButton.tsx` | Delete — fully replaced by `FabWidget` |

### New Migrations

None required.

### Dependencies

No new npm packages required.

---

## Implementation Approach

### Phase 0: Asset Preparation

Download FAB icons from Figma using the `get_media_files` tool:

| Asset | Figma Node ID | Destination |
|---|---|---|
| MM_MEDIA_LOGO icon | `214:3752` | `public/assets/fab/icons/fab-logo.svg` |
| MM_MEDIA_Pen icon | `214:3812` | `public/assets/fab/icons/fab-pen.svg` |
| MM_MEDIA_Close icon | `214:3851` | `public/assets/fab/icons/fab-close.svg` |

Verify SVG quality, correct colors (`#00101A` for logo/pen, `#FFFFFF` for close), and naming.

---

### Phase 1: Design Tokens

Add missing FAB tokens to `src/app/globals.css` under the `@theme` block:

```css
--color-fab-action-bg: #FFEA9E;
--color-fab-cancel-bg: #D4271D;
--color-fab-label: #00101A;
--color-fab-icon-cancel: #FFFFFF;
--radius-fab-action: 4px;
--radius-fab-cancel: 100px;
--shadow-fab-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
```

---

### Phase 2: Core FAB Widget — FabWidget Component (US1, US2, US3)

Create `src/components/ui/FabWidget.tsx`:

**Collapsed state** (trigger button — matches existing `WidgetButton` design):
- Fixed position: `fixed bottom-8 right-8 z-40` (mobile) / responsive offsets at `lg:`
- Circular/pill button, gold background, pen + SAA logo icons
- `onClick` → `setIsExpanded(true)`
- `aria-label` from i18n translations

**Expanded state** (this frame — state 2):
- Fixed container: `fixed flex flex-col items-end gap-5 z-40`
  - Mobile: `bottom-4 right-4`
  - Desktop `lg:`: `bottom-8 right-8`
- Three sub-buttons rendered in order: A (Thể lệ), B (Viết KUDOS), C (Huỷ)
- Staggered entrance animation: each button animates in with `opacity-0 → opacity-100` + `translateY(8px) → translateY(0)` with 50ms delay between items

**Button A — Thể lệ:**
- `w-[149px] h-16`, yellow bg, radius 4px, padding 16px
- Icon `fab-logo.svg` (24×24) + label "Thể lệ" (Montserrat 700 24px)
- Rendered as `<Link href="/awards-information">` wrapper
- `onClick` → `setIsExpanded(false)` (collapse after navigate)
- Hover: `hover:shadow-[var(--shadow-fab-hover)] hover:brightness-105`
- `aria-label="Xem thể lệ giải thưởng"`

**Button B — Viết KUDOS:**
- `min-w-[214px] h-16`, yellow bg, radius 4px, padding 16px
- Icon `fab-pen.svg` (24×24) + label "Viết KUDOS" (Montserrat 700 24px)
- `onClick` → `openWriteKudo()` + `setIsExpanded(false)`
- Same hover styles as Button A
- `aria-label="Viết KUDOS tặng đồng đội"`

**Button C — Huỷ:**
- `w-14 h-14` (56×56px), red bg `var(--color-fab-cancel-bg)`, `rounded-full`, padding 16px
- Icon `fab-close.svg` (24×24) white
- `onClick` → `setIsExpanded(false)`
- Hover: `hover:bg-[#B91C1C]`
- `aria-label="Đóng menu hành động nhanh"`

**Escape key handler** (US1 AC2):
```ts
useEffect(() => {
  if (!isExpanded) return;
  function handleKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') setIsExpanded(false);
  }
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [isExpanded]);
```

**Auth guard for Button B** (edge case from spec):
- Since the FAB lives in `(protected)/(main)` layout, unauthenticated users never see it. No explicit auth check needed inside the component.

---

### Phase 3: Layout Wiring

1. Update `src/app/[locale]/(protected)/(main)/layout.tsx`:
   - Replace `import { WidgetButton }` with `import { FabWidget }`
   - Replace `<WidgetButton />` with `<FabWidget />`

2. Delete `src/components/ui/WidgetButton.tsx`.

---

### Phase 4: Polish & Edge Cases

1. **Rapid click debounce**: Disable Button A and B `onClick` for 300ms after first click to prevent double navigation (spec edge case).
2. **Responsive sizing**:
   - Mobile (< 768px): sub-button font-size scaled to `text-lg` (18px); right/bottom offset `right-4 bottom-4`
   - Tablet (768-1023px): full size, `right-6 bottom-6`
   - Desktop (≥ 1024px): `right-8 bottom-8` (32px)
3. **Focus management**: When FAB expands, focus moves to Button C (Huỷ) as the "escape hatch" for keyboard users.
4. **i18n**: Add translation keys to `vi.json` + `en.json` under `common.fab.*`:
   - `fab.ariaLabel`, `fab.rulesLabel`, `fab.vietKudosLabel`, `fab.huyLabel`
5. **Accessibility**: Wrap expanded panel in `role="region"` + `aria-label="Menu hành động nhanh"`.

---

## Testing Strategy

| Type | Focus | Coverage |
|---|---|---|
| Unit (Vitest) | FabWidget state transitions (expand/collapse), Escape key | Core logic |
| E2E (Playwright) | Button A navigates to `/awards-information`, Button B opens WriteKudo modal, Button C collapses without navigation | Critical paths |

### Key Test Scenarios

1. **US1 — Dismiss**:
   - Render FabWidget in expanded state → click Huỷ → confirm `isExpanded = false`, URL unchanged
   - Press `Escape` → confirm FAB collapses

2. **US2 — Viết KUDOS**:
   - Click Viết KUDOS → `WriteKudoModal` appears (E2E: modal visible in DOM)
   - FAB collapses after click

3. **US3 — Thể lệ**:
   - Click Thể lệ → URL changes to `/awards-information`
   - FAB collapses after click

4. **Edge Cases**:
   - Rapid double-click on Button B → modal opens only once
   - Mobile viewport: FAB anchored bottom-right with correct offset

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| `WidgetButton` deletion breaks other imports | Low | Medium | Grep codebase for all imports before deleting |
| WriteKudoProvider not wrapping FabWidget | Very Low | High | Provider is at `[locale]/layout.tsx` — wraps all locale routes including `(main)` |
| Figma icon SVGs have wrong colors embedded | Medium | Low | Verify SVG source; override color via Tailwind `[&_path]:fill-[...]` if needed |
| Fixed positioning clashes with modal z-index | Low | Medium | FAB `z-40`; WriteKudoModal `z-50` — modal always on top |
| URL for Button A (`/awards-information`) not yet live | Low | Low | Page already built and routed per awards-information plan.md |

---

## Open Questions

- [ ] Should the FAB trigger button (collapsed state) visually change when transitioning to expanded (e.g., rotate animation)? — Out of scope per spec, but worth confirming with designer.
- [ ] Is the "Thể lệ UPDATE" screen (`3204:6051`) different from the existing `/awards-information` page (`313:8436`)? SCREENFLOW.md maps FAB Button A → PrizeSystem (313:8436 = `/awards-information`). Confirm with stakeholder.

---

## Next Steps

After plan approval:
1. Run `/momorph.tasks` to generate the task breakdown
2. Start Phase 0 — download FAB icons from Figma
3. Phase 1 — add CSS tokens to `globals.css`
4. Phase 2 — build `FabWidget.tsx`
5. Phase 3 — wire into `(main)/layout.tsx`, delete `WidgetButton`
6. Phase 4 — polish, responsive, i18n, edge cases

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: desktop FAB position updated to `bottom-8 right-8` (32px). Updated: Phase 2 expanded state desktop position, Phase 4 responsive sizing desktop row. |
| v1.0 | 2026-03-18 | — | Initial plan |
