# BUG-award-card-layout: Award card layout alternating + color/text discrepancies

**Date:** 2026-03-24
**Status:** Fixed

---

## Summary

Award cards on `/awards-information` had 3 bugs: (1) image and content positions were identical across all cards, missing the Figma-specified alternating layout (odd = image left, even = image right); (2) description text used 80% opacity white instead of full white; (3) Signature 2025's second prize value label used muted/medium style instead of bold gold.

---

## Root Cause

1. **Alternating layout**: `AwardCard` had no `reversed` prop and `AwardsLayout` did not pass index, so all cards rendered `md:flex-row` (image always left).
2. **Description color**: `text-white/80` was used instead of `text-white` — likely a conservative choice during initial implementation.
3. **Signature second label**: The second "Giá trị giải thưởng:" label in the Signature special case block used `font-medium text-[var(--color-text-muted)]` instead of matching the first row's `font-bold text-[var(--color-gold)]`. Also `design-style.md` did not document this distinction.

---

## Fix Applied

**Option chosen:** Surgical prop + index fix

- Added `reversed?: boolean` prop to `AwardCard`; applies `md:flex-row-reverse` when true
- `AwardsLayout` passes `reversed={index % 2 !== 0}` when mapping cards
- Fixed description color: `text-white/80` → `text-white`
- Fixed Signature second value label: `font-medium text-[var(--color-text-muted)]` → `font-bold text-[var(--color-gold)]`
- Updated `design-style.md` to document alternating layout pattern and Signature second row style

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/awards/AwardCard.tsx` | Add `reversed` prop, fix `flex-row-reverse`, fix description color, fix Signature second label style |
| `src/components/awards/AwardsLayout.tsx` | Pass `reversed={index % 2 !== 0}` to `AwardCard` |
| `.momorph/specs/313:8436-Hệ thống giải/design-style.md` | Document alternating layout and Signature second value row style |

---

## Notes

- `design-style.md` previously described layout as `flex row, image left + content right` for all cards — missing the alternating pattern visible in Figma. Updated.
- No existing E2E tests cover this layout behavior. Consider adding a test asserting `flex-row-reverse` on even-indexed cards.
