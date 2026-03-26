# bug1: Wrong department list in seed data

**Link:** N/A
**Date:** 2026-03-19
**Status:** Fixed

---

## Summary

The `public.departments` table was seeded with 50 entries including many sub-departments (e.g., `CEVC1 - DSV - UI/UX 1`, `STVC - R&D - DTR`, `OPDC - HRF - C&B`). The correct list is 15 top-level departments only. `OPDC` was also missing as a standalone entry. The fix replaces the old 50-entry list with exactly the 15 correct departments. All spec documents were updated from "50" to "15" accordingly.

---

## Root Cause

`supabase/seeds/common/01_master_data.sql` contained an incorrect department list derived from old Figma design items data that included sub-departments. The correct business requirement is 15 top-level departments: BDV, CEVC1, CEVC2, CEVC3, CEVC4, CEVEC, CPV, CTO, FCOV, GEU, IAV, OPDC, PAO, SPD, STVC.

---

## Fix Applied

**Option chosen:** Option 1 — Replace departments in seed file

Replaced the 50-entry `INSERT INTO public.departments` block with exactly 15 correct top-level departments (alphabetical order). Mock user and kudo seeds do not need changes — they dynamically select department IDs at seed time via `SELECT array_agg(id ORDER BY name) INTO dept_ids FROM public.departments`.

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/seeds/common/01_master_data.sql` | Replaced 50 sub-departments with 15 correct top-level departments |
| `.momorph/specs/721:5684-Dropdown Phòng ban/spec.md` | Updated v1.1→v1.2: department count references 50→15 |
| `.momorph/specs/721:5684-Dropdown Phòng ban/design-style.md` | Updated Full Dept List section: 50 entries → 15 entries |
| `.momorph/specs/721:5684-Dropdown Phòng ban/plan.md` | Updated v1.1→v1.2: count references 50→15 |
| `.momorph/specs/721:5684-Dropdown Phòng ban/tasks.md` | Updated v1.1→v1.2: T007 and Notes count references 50→15 |

---

## Test Results

- Command: `npx supabase db reset`
- Result: ✅ All passed — migrations applied, seeds loaded with 15 correct departments

---

## Notes

- Re-run `supabase db reset` (or equivalent) to apply the seed changes to your local DB.
- Mock users (`01_mock_users.sql`) and mock kudos (`02_mock_kudos.sql`) do not need changes — both reference the departments table dynamically.
- After reset, users will be distributed across 15 departments instead of 50.
