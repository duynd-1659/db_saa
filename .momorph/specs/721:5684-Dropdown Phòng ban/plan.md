# Implementation Plan: Dropdown Phong ban

**Frame**: `721:5684-Dropdown Phong ban`
**Date**: 2026-03-13
**Version**: v1.2
**Last updated**: 2026-03-19
**Spec**: `specs/721:5684-Dropdown Phong ban/spec.md`

---

## Summary

A department filter dropdown for the Homepage SAA kudo feed. Lists all 15 top-level departments from `public.departments`. Single-select, URL-driven (`?dept={name}`, e.g. `?dept=CEVC2`), with toggle-off and dismiss behaviors. The infrastructure is ~70% built: the kudo feed API, filters hook, service layer, and database already support `department_id` filtering. The remaining work is the dropdown UI component, a departments API endpoint, a department service function, wiring it into `FilterChips`, and updating the filter pipeline to resolve department name → id.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, Tailwind CSS 4, Zod 4, next-intl
**Database**: PostgreSQL via Supabase
**Testing**: N/A (no test framework configured yet)
**State Management**: URL search params via `useKudosFilters` hook
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Tailwind, Supabase, Zod)
- [x] Adheres to folder structure guidelines (`components/kudos/`, `services/`, `types/`)
- [x] Meets security requirements (RLS on departments, server-side session)
- [x] Follows testing standards (no test framework configured yet - N/A)

**Violations (if any)**: None. All patterns follow existing HashtagFilterDropdown precedent.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-scoped under `components/kudos/`. New `DepartmentFilterDropdown.tsx` mirrors existing `HashtagFilterDropdown.tsx` pattern.
- **Styling Strategy**: Tailwind utilities using existing CSS variables (`--color-hashtag-dropdown-bg`, `--color-hashtag-dropdown-border`, etc.). Same tokens apply - no new CSS variables needed.
- **Data Fetching**: Server-side initial fetch in homepage, passed as props. Client-side refetch not needed for the department list (static data).
- **State Management**: URL search params via existing `useKudosFilters` hook (`?dept={name}`). `setDepartment(name)` callback — currently passes id, needs update to pass department name instead.

### Backend Approach

- **API Design**: New `GET /api/departments` endpoint returning `{ departments: Department[] }`.
- **Data Access**: Direct Supabase query via server client. Select only `id, name` columns, ordered by `name`.
- **Validation**: Zod schema for response typing (minimal - no query params needed).

### Integration Points

- **Existing Services**: `fetchKudosFeed()` in `kudos-service.ts` already filters by `department_id`.
- **Existing Hook**: `useKudosFilters()` manages `?dept` URL param with `setDepartment()` — needs update to store department name instead of id.
- **Existing Component**: `FilterChips.tsx` has a TODO comment for department dropdown integration.
- **Shared Components**: Follows `HashtagFilterDropdown` pattern for consistent UX.
- **API Contracts**: `/api/kudos` accepts `dept` query param — needs update from uuid validation to string (department name), and service layer needs name → id resolution before filtering.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721:5684-Dropdown Phong ban/
  spec.md              # Feature specification
  design-style.md      # Design specifications
  plan.md              # This file
  tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
# New Files
src/
  app/api/departments/route.ts          # GET /api/departments endpoint
  components/kudos/DepartmentFilterDropdown.tsx  # Dropdown component
  services/department-service.ts        # fetchDepartments()
  types/department.ts                   # Department interface

# Modified Files
src/
  components/kudos/FilterChips.tsx      # Wire department dropdown (replace TODO)
```

---

## Implementation Strategy

### Phase 1: Foundation - Types & Service

Create the `Department` type interface and the `fetchDepartments()` service function.

**New files**:
- `src/types/department.ts` - `Department` interface (`id: string`, `name: string`)
- `src/services/department-service.ts` - `fetchDepartments()` using Supabase server client

**Key decisions**:
- Select only `id, name` columns (constitution: never `select('*')`)
- Order by `name` ascending for alphabetical listing
- Return typed array `Department[]`
- `name` serves as the URL-friendly key (e.g., `CEVC2`) — used in query params instead of uuid

### Phase 2: API Endpoint

Create `GET /api/departments` route handler.

**New file**: `src/app/api/departments/route.ts`

**Key decisions**:
- Thin controller pattern: calls `fetchDepartments()` from service
- Returns `{ departments: Department[] }` JSON
- Error handling: generic message to client, log server-side
- No auth required (departments are public data per RLS policy)

### Phase 3: Core UI - DepartmentFilterDropdown (US1 + US2)

Build the dropdown component following `HashtagFilterDropdown` pattern.

**New file**: `src/components/kudos/DepartmentFilterDropdown.tsx`

**Props**:
- `departments: Department[]` - full department list
- `selectedDepartmentName: string | undefined` - currently selected (by name)
- `onSelect: (name: string | undefined) => void` - selection callback (passes department name)
- `onClose: () => void` - dismiss callback

**Behavior**:
- Client Component (`'use client'`)
- Click-outside detection via `useRef` + `useEffect`
- Escape key handler
- Toggle: clicking selected department calls `onSelect(undefined)` to clear filter
- Scrollable list: `overflow-y-auto`, `max-h-[348px]` (~6 items)
- Selected state: `rgba(255,234,158,0.10)` bg + text glow shadow
- Hover state: `rgba(255,234,158,0.10)` bg
- Open/close animation: opacity + translateY, 150ms ease-out

**Styling** (from design-style.md):
- Container: `bg-[var(--color-hashtag-dropdown-bg)]`, `border border-[var(--color-hashtag-dropdown-border)]`, `rounded-lg`, `p-1.5`
- Items: `h-14 px-4 rounded`, `font-montserrat font-bold text-base text-white tracking-[0.5px]`
- Selected label: `[text-shadow:var(--text-shadow-hashtag-glow)]`

### Phase 4: Integration - Wire into FilterChips (US1 + US2 + US3)

Modify `FilterChips.tsx` to:
1. Accept `departments` prop (fetched from parent/API)
2. Track `isDeptDropdownOpen` state
3. Render `DepartmentFilterDropdown` when open
4. Connect `onSelect` to `setDepartment()` from `useKudosFilters` (passes department name)
5. Replace the TODO comment with working implementation

### Phase 5: Polish

- Verify toggle-off behavior (US1 AC3)
- Verify dismiss on outside click / Escape (US3)
- Verify selected highlight persists on reopen (US1 AC2)
- Verify scrollability with 15 departments (edge case)
- Verify long department names truncate gracefully
- Test at 375px, 768px, 1024px, 1440px breakpoints

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Montserrat font not loaded | Low | Medium | Check if font is already configured in layout; add if missing |
| 15 departments slow to render | Low | Low | Simple list - no performance concern at this scale |
| Dropdown positioning conflicts with page layout | Medium | Medium | Use absolute positioning relative to filter button; test on all breakpoints |

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: DepartmentFilterDropdown + FilterChips + useKudosFilters
- [x] **External dependencies**: Supabase departments query
- [x] **User workflows**: Select department -> feed filters -> reopen shows selected

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Open dropdown, select department, feed filters correctly
   - [ ] Switch between departments, feed updates
   - [ ] Toggle off selected department, full feed returns

2. **Dismiss**
   - [ ] Click outside closes dropdown, filter unchanged
   - [ ] Escape key closes dropdown, filter unchanged

3. **Edge Cases**
   - [ ] All 15 departments render and scroll
   - [ ] Long department names display correctly
   - [ ] URL `?dept={name}` persists on page reload (e.g., `?dept=CEVC2`)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core filter flow (select/toggle/switch) | High | High |
| Dismiss behaviors | Medium | Medium |
| Scroll + long names | Low | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] Codebase research completed
- [x] Database schema exists (`public.departments` with 15 rows seeded)
- [x] Feed API supports `?dept` filtering (needs update: uuid → name resolution)
- [x] `useKudosFilters` hook supports `setDepartment()` (needs update: pass name instead of id)

### External Dependencies

- None. All infrastructure is internal to the project.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The HashtagFilterDropdown is the primary reference implementation. DepartmentFilterDropdown should mirror its patterns closely for consistency.
- CSS variables for dropdown styling already exist (prefixed `--color-hashtag-*`). Consider renaming to generic `--color-filter-dropdown-*` in a future refactor, but for now reuse as-is to avoid scope creep.
- The `FilterChips.tsx` TODO comment (line 53) explicitly marks where department dropdown integration should go.
- No new database migrations needed - `departments` table and `profiles.department_id` FK already exist.
- Department list is relatively static (15 items) - can be fetched once on page load and passed as props. No need for client-side caching or SWR.

## Changelog

| Version | Date | Severity | Description |
|---------|------|----------|-------------|
| v1.2 | 2026-03-19 | Cosmetic | Requirement change: departments reduced from 50 to 15 top-level departments. Updated: Summary, Phase 5 Polish, Risk Assessment, Test Scenarios (edge case), Dependencies, Notes. |
| v1.1 | 2026-03-13 | Cosmetic | Requirement change: use department name instead of UUID for URL query param. Updated: Summary, State Management, Integration Points, Phase 3 props, Phase 4 integration, Test Scenarios, Dependencies. |
