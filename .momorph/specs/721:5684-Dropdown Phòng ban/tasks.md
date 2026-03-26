# Tasks: Dropdown Phong ban

**Frame**: `721:5684-Dropdown Phong ban`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Version**: v1.2
**Last updated**: 2026-03-19

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No project scaffolding needed - project already exists. This phase skips to asset/dependency checks.

*No setup tasks required. Project structure, dependencies, and formatting tools are already configured.*

**Checkpoint**: Setup confirmed - proceed to Foundation

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Create the Department type, service function, and API endpoint that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Create Department interface with id and name fields | src/types/department.ts
- [x] T002 [P] Create fetchDepartments() service using Supabase server client - select only id, name columns, order by name asc. Name is used as URL-friendly key for query params | src/services/department-service.ts
- [x] T003 Create GET /api/departments route handler - thin controller calling fetchDepartments(), returns { departments: Department[] }, generic error response | src/app/api/departments/route.ts

**Checkpoint**: Foundation ready - department data flows from DB to API. User story implementation can begin.

---

## Phase 3: User Story 1 - Filter kudo feed by department (Priority: P1) MVP

**Goal**: User opens department dropdown, selects a department, dropdown closes and feed filters to show only that department's kudos. Selected department is highlighted on reopen. Clicking selected department toggles filter off.

**Independent Test**: Open department filter dropdown on Homepage, select "CEVC2", verify feed shows only CEVC2 kudos. Reopen dropdown, verify CEVC2 is highlighted. Click CEVC2 again, verify full feed returns.

### Frontend (US1)

- [ ] T004 [US1] Create DepartmentFilterDropdown client component - scrollable list of departments, selected item highlighted with rgba(255,234,158,0.10) bg + glow text-shadow, click-outside and Escape close handlers, toggle-off when clicking selected item. Follow HashtagFilterDropdown pattern. Props: departments, selectedDepartmentName, onSelect(name), onClose | src/components/kudos/DepartmentFilterDropdown.tsx (RESYNC: updated per requirement change — use name instead of id for selection)
- [ ] T005 [US1] Wire DepartmentFilterDropdown into FilterChips - accept departments prop, add isDeptDropdownOpen state, render dropdown conditionally, connect onSelect to setDepartment() passing department name, replace TODO comment at line 53 | src/components/kudos/FilterChips.tsx (RESYNC: updated per requirement change — pass department name instead of id)

**Checkpoint**: User Story 1 complete and independently testable - select, highlight, toggle-off all work

---

## Phase 4: User Story 2 - Switch between departments (Priority: P1)

**Goal**: User already filtering by one department can switch to another without first clearing the filter.

**Independent Test**: With CEVC2 active filter, open dropdown, click CEVC3, verify feed updates to CEVC3 kudos and CEVC3 is now highlighted.

### Frontend (US2)

*No additional tasks needed.* The DepartmentFilterDropdown built in US1 already supports switching: clicking a different department calls `onSelect(newId)` which replaces the URL param via `setDepartment()`. The existing `useKudosFilters` hook and `/api/kudos?dept={id}` endpoint handle the rest.

**Checkpoint**: User Story 2 is implicitly complete via US1 implementation

---

## Phase 5: User Story 3 - Dismiss without changing filter (Priority: P2)

**Goal**: User can close the dropdown without changing the active filter by clicking outside or pressing Escape.

**Independent Test**: With CEVC2 active, open dropdown, click outside - verify dropdown closes and feed still shows CEVC2. Repeat with Escape key.

### Frontend (US3)

*No additional tasks needed.* Click-outside detection and Escape key handler are built into T004 (DepartmentFilterDropdown component). The onClose callback closes the dropdown without calling onSelect, preserving the current filter state.

**Checkpoint**: User Story 3 is implicitly complete via US1 implementation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify edge cases, responsive behavior, and animation

- [x] T006 [P] Add open/close animation to DepartmentFilterDropdown - opacity + translateY transition, 150ms ease-out per design-style.md | src/components/kudos/DepartmentFilterDropdown.tsx
- [x] T007 [P] Verify scrollability with all 15 departments and handle long department names (truncate with ellipsis if needed) | src/components/kudos/DepartmentFilterDropdown.tsx
- [x] T008 Verify responsive behavior at 375px, 768px, 1024px, 1440px breakpoints - dropdown positioning relative to filter button | src/components/kudos/FilterChips.tsx

**Checkpoint**: All user stories complete with polish applied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundation (Phase 2)**: No dependencies - can start immediately
  - T001 and T002 can run in parallel (different files)
  - T003 depends on T001 + T002 (uses Department type and fetchDepartments)
- **User Story 1 (Phase 3)**: Depends on Foundation completion
  - T004 depends on T001 (needs Department type)
  - T005 depends on T004 (needs DepartmentFilterDropdown component)
- **User Story 2 (Phase 4)**: Implicitly complete via US1
- **User Story 3 (Phase 5)**: Implicitly complete via US1
- **Polish (Phase 6)**: Depends on US1 completion
  - T006, T007 can run in parallel
  - T008 depends on T005 (needs full integration)

### Parallel Opportunities

```
Timeline:
  T001 ──┐
         ├── T003 ── T004 ── T005 ── T008
  T002 ──┘                    │
                              ├── T006 (parallel)
                              └── T007 (parallel)
```

### Within Each User Story

- Types before services (T001 before T002)
- Services before endpoints (T002 before T003)
- Foundation before UI components (T003 before T004)
- Component before integration (T004 before T005)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 2 (Foundation: T001-T003)
2. Complete Phase 3 (US1: T004-T005)
3. **STOP and VALIDATE**: Test independently - select dept, verify feed filters, toggle off, dismiss
4. Deploy if ready

### Incremental Delivery

1. Foundation (T001-T003) - department data pipeline
2. US1 (T004-T005) - core dropdown + integration -> Test -> Deploy
3. Polish (T006-T008) - animation, scroll, responsive -> Test -> Deploy

---

## Notes

- US2 and US3 require no additional tasks - they are fulfilled by the US1 implementation (switch = select different item, dismiss = click-outside/Escape)
- HashtagFilterDropdown in `src/components/kudos/HashtagFilterDropdown.tsx` is the reference implementation - mirror its patterns
- Existing CSS variables (`--color-hashtag-dropdown-bg`, etc.) already match the department dropdown design tokens - reuse them
- `FilterChips.tsx` line 53 has an explicit TODO comment marking where department dropdown should be wired
- `useKudosFilters` hook provides `setDepartment()` and reads `?dept={name}` from URL — needs update to use department name instead of uuid
- `/api/kudos` route accepts `dept` query param — needs update from uuid to name string, and service layer needs name → id resolution
- No database migrations needed - `departments` table with 15 rows already exists
- No new dependencies needed

## Changelog

| Version | Date | Severity | Description |
|---------|------|----------|-------------|
| v1.2 | 2026-03-19 | Cosmetic | Requirement change: departments reduced from 50 to 15 top-level departments. Modified: T007, Notes. |
| v1.1 | 2026-03-13 | Cosmetic | Requirement change: use department name instead of UUID for URL query param. Modified: T002 (clarification), T004, T005 (RESYNC — name-based props/selection). Updated Notes section. |
