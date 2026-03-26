# Feature Specification: Dropdown Phòng ban

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Version**: v1.2
**Last updated**: 2026-03-19
**Status**: Draft

---

## Overview

A floating dropdown overlay that allows users to filter the Homepage SAA kudo feed by a specific department (phòng ban). The dropdown lists all 15 top-level departments in the system (BDV, CEVC1, CEVC2, CEVC3, CEVC4, CEVEC, CPV, CTO, FCOV, GEU, IAV, OPDC, PAO, SPD, STVC). The currently selected department is highlighted. Selecting a department closes the dropdown and filters the feed to show only kudos received by employees in that department. Single-select, anchored to the department filter button on the Homepage.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter kudo feed by department (Priority: P1)

A user wants to see kudos sent to members of a specific department.

**Why this priority**: Department filtering is a primary feed navigation feature — allows users to focus on their team's kudos.

**Independent Test**: Open the department filter dropdown on Homepage, select "CEVC2", verify the feed shows only kudos where the recipient belongs to CEVC2 department.

**Acceptance Scenarios**:

1. **Given** the Homepage kudo feed shows all kudos, **When** the user opens the department dropdown and clicks "CEVC2", **Then** the dropdown closes and the feed shows only kudos for CEVC2 department members.
2. **Given** "CEVC2" is selected (highlighted), **When** the user opens the dropdown again, **Then** CEVC2 has `rgba(255,234,158,0.10)` background and glow text.
3. **Given** a department is selected, **When** the user clicks the same department, **Then** the filter is toggled off and the full feed is shown.

---

### User Story 2 - Switch between departments (Priority: P1)

A user already filtering by one department wants to switch to another.

**Acceptance Scenarios**:

1. **Given** "CEVC2" is the active filter, **When** the user opens the dropdown and clicks "CEVC3", **Then** the feed updates to show CEVC3 kudos.

---

### User Story 3 - Dismiss without changing filter (Priority: P2)

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside or presses Escape, **Then** the dropdown closes and the filter is unchanged.

---

### Edge Cases

- What if a department has no kudos? → Show empty state in the feed.
- What if the departments list exceeds visible items (15 total, 6 visible at once)? → The dropdown must be scrollable with a max-height.
- What if a department name is very long? → Truncate with ellipsis or wrap gracefully.
- What if the user's department is shown first? → Consider sorting by user's department first (UX enhancement, not in design).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A_Dropdown-List | 563:8027 | Container: `#00070C` bg, `#998C5F` border, 6 items shown, scrollable | Open/close with animation |
| A.1 CEVC2 (selected) | I563:8027;563:7956 | 90×56px, gold bg + glow | Click → toggle filter |
| A.2 CEVC3 | I563:8027;563:7957 | 90×56px, transparent | Click → select |
| A.3 CEVC4 | I563:8027;563:7958 | 91×56px, transparent | Click → select |
| A.4+ CEVC1, OPD, Infra | various | Same treatment as A.2 | Click → select |

> See `design-style.md` for visual specifications. Full department list: 15 top-level departments.

### Navigation Flow

- **From**: Homepage SAA (department filter button click)
- **To**: Same screen with filtered feed
- **Dismiss**: Same screen, filter unchanged

### Visual Requirements

- Text-only items, letter-spacing 0.5px.
- List scrollable (overflow-y: auto), max-height ~5-6 items.
- Selected: `rgba(255,234,158,0.10)` + glow.
- Hover: `rgba(255,234,158,0.10)`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST list all departments from `public.departments` table.
- **FR-002**: The currently selected department MUST be highlighted.
- **FR-003**: Clicking a department MUST close the dropdown and filter the feed by that department.
- **FR-004**: Clicking the active department MUST toggle the filter off.
- **FR-005**: The dropdown MUST be scrollable (15 departments total, max 6 visible at once).
- **FR-006**: The dropdown MUST close on outside click or Escape.
- **FR-007**: The filtered result MUST update the feed query to include only kudos with recipients in the matching department (lookup `departments.name` → `profiles.department_id`).

### Technical Requirements

- **TR-001**: Departments loaded from `public.departments` table on page load.
- **TR-002**: Selected department stored in URL query param using the department's name (e.g., `?dept=CEVC2`) for human-readable, shareable/bookmarkable filters.
- **TR-003**: Feed query resolves department name → `departments.id` lookup, then filters by `profiles.department_id`.
- **TR-004**: Client Component for dropdown state.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/departments` | GET | Fetch all departments for dropdown | Predicted |
| `GET /api/kudos?dept={name}` | GET | Fetch kudos filtered by recipient department name | Predicted |

---

## Success Criteria

- **SC-001**: All departments appear in the scrollable list.
- **SC-002**: Feed updates within 500ms of department selection.
- **SC-003**: Selected department highlighted correctly on subsequent opens.

---

## Out of Scope

- Multi-department filtering.
- Creating or editing departments from this dropdown.
- Searching/filtering departments within the dropdown.

---

## Dependencies

- [x] `public.departments` table exists
- [x] `public.profiles.department_id` FK exists
- [ ] Homepage feed API supports department filtering

---

## Notes

## Changelog

| Version | Date | Severity | Description |
|---------|------|----------|-------------|
| v1.2 | 2026-03-19 | Cosmetic | Requirement change: departments reduced from 50 sub-departments to 15 top-level departments (BDV, CEVC1, CEVC2, CEVC3, CEVC4, CEVEC, CPV, CTO, FCOV, GEU, IAV, OPDC, PAO, SPD, STVC). Updated: Overview, Edge Cases, UI/UX note, FR-005, Notes. |
| v1.1 | 2026-03-13 | Cosmetic | Requirement change: use department name instead of UUID for URL query param (`?dept=CEVC2`). Updated TR-002, TR-003, API Dependencies, added FR-007. |

---

- 15 top-level departments in the full list: BDV, CEVC1, CEVC2, CEVC3, CEVC4, CEVEC, CPV, CTO, FCOV, GEU, IAV, OPDC, PAO, SPD, STVC — the dropdown must scroll (15 > 6 visible).
- Figma shows only 6 sample items: CEVC2, CEVC3, CEVC4, CEVC1, OPD, Infra.
- The frame is wider (289px) than other dropdown frames due to right-side positioning on the homepage.
