# Feature Specification: Dropdown list hashtag

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A multi-select hashtag picker used inside the **Viết Kudo** form. Allows the user to select 1–5 hashtags to attach to the kudo being written. Triggered by clicking the "+ Hashtag / Tối đa 5" chip button in the form. Shows all available hashtags with checkmarks on selected ones. Selection state persists while the dropdown is open.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select hashtags for a kudo (Priority: P1)

A user writing a kudo selects 1–5 hashtags to tag the kudo appropriately.

**Why this priority**: Hashtag selection is a required field in the kudo form — the form cannot be submitted without at least one hashtag.

**Independent Test**: Open the Viết Kudo form, click "+ Hashtag", verify dropdown opens with all hashtags, click "#BE A TEAM", verify checkmark appears and item is selected, close dropdown, verify selected hashtag appears as a chip in the form.

**Acceptance Scenarios**:

1. **Given** the kudo form is open and no hashtags are selected, **When** the user clicks the "+ Hashtag" chip, **Then** the hashtag dropdown opens showing all available hashtags (unselected).
2. **Given** the dropdown is open, **When** the user clicks "#BE A TEAM", **Then** the item shows a checkmark, the background changes to `rgba(255,234,158,0.20)`, and the hashtag is added to the form's selection.
3. **Given** 3 hashtags are selected, **When** the user closes the dropdown, **Then** the form shows 3 hashtag chips.
4. **Given** a hashtag is selected, **When** the user clicks it again, **Then** the checkmark disappears and the hashtag is deselected.

---

### User Story 2 - Enforce maximum 5 hashtags (Priority: P1)

The system prevents selecting more than 5 hashtags.

**Why this priority**: Business rule — kudos may have at most 5 hashtags (per `kudo_hashtags` validation and design spec).

**Acceptance Scenarios**:

1. **Given** 5 hashtags are already selected, **When** the user clicks an unselected hashtag, **Then** the click is ignored (item remains unselected) and/or a tooltip shows "Tối đa 5 hashtag".
2. **Given** 5 hashtags are selected, **When** the dropdown is open, **Then** all unselected items appear disabled (reduced opacity, pointer-events: none).
3. **Given** 5 hashtags are selected, **When** the user deselects one, **Then** other items become selectable again.

---

### User Story 3 - Dismiss hashtag picker (Priority: P2)

A user can close the dropdown without changing the current selection.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with 2 hashtags selected, **When** the user clicks outside, **Then** the dropdown closes and the 2 previously selected hashtags remain.

---

### Edge Cases

- What if all hashtags are deselected and the user tries to submit the form? → Show validation error: "Vui lòng chọn ít nhất 1 hashtag".
- What if the hashtag list loads slowly? → Show a loading spinner inside the dropdown.
- What if no hashtags are available in the database? → Show "Không có hashtag nào" message.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Chip trigger | 1002:15115 | White chip: "Hashtag / Tối đa 5" + plus icon | Click → open dropdown |
| Dropdown-List | 1002:13102 | 318×~330px container, `#00070C` bg, scrollable | Contains selected + unselected rows |
| Selected row (A,B,C) | 1002:13185, 1002:13207, 1002:13216 | 306×40px, `rgba(255,234,158,0.20)` bg + checkmark | Click → deselect |
| Unselected row (D+) | 1002:13104 | 306×40px, transparent, no checkmark | Click → select (if <5) |
| Check icon | 1002:13201 | 24×24px checkmark, visible on selected rows | — |
| Plus icon | 490:5726 | 24×24px, in chip trigger | — |

> See `design-style.md` for pixel-perfect specifications.

### Navigation Flow

- **From**: Viết Kudo form (hashtag chip click)
- **To**: Same form with updated hashtag selection
- **Dismiss**: Same form, selection unchanged

### Visual Requirements

- Selected item background: `rgba(255,234,158,0.20)` (double the filter dropdown's 0.10).
- Checkmark icon visible on selected items, hidden on unselected.
- Unselected items: transparent background.
- Disabled (after 5 selected): opacity 0.5 on unselected items.
- Chip trigger: white background, `#998C5F` border, hint text "Hashtag / Tối đa 5".
- Letter-spacing: 0.15px (different from filter dropdown's 0.5px).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST list all available hashtags from `public.hashtags`.
- **FR-002**: Selected hashtags MUST show a checkmark icon and highlighted background.
- **FR-003**: Users MUST be able to toggle hashtag selection by clicking.
- **FR-004**: The system MUST prevent selecting more than 5 hashtags (disable unselected items when count = 5).
- **FR-005**: Selected hashtags MUST persist in the form state when the dropdown is closed.
- **FR-006**: Closing the dropdown (outside click or trigger click) MUST retain the current selection.
- **FR-007**: The dropdown trigger chip MUST update to reflect the selected count or show selected hashtags.

### Technical Requirements

- **TR-001**: Client Component with local state `string[]` of selected hashtag IDs.
- **TR-002**: Max 5 selections enforced client-side before API call.
- **TR-003**: Selection state lifted to parent `KudoForm` component.
- **TR-004**: Hashtags loaded from `public.hashtags` table (13 items, pre-loaded with form).

### Key Entities

- **Hashtag**: `{ id: uuid, name: string }` from `public.hashtags`
- **Selection**: `string[]` of hashtag IDs, min 1, max 5

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/hashtags` | GET | Load all hashtags for the picker | Predicted |

---

## Success Criteria

- **SC-001**: All hashtags load and display in the dropdown.
- **SC-002**: Selection/deselection toggles checkmark within 50ms (instant visual feedback).
- **SC-003**: Attempting to select a 6th hashtag is blocked — confirmed in 100% of test runs.
- **SC-004**: Selected hashtags appear as chips in the kudo form after dropdown closes.

---

## Out of Scope

- Searching/filtering within the hashtag list.
- Creating new hashtags from this picker.
- The hashtag chips display in the kudo form (separate component).

---

## Dependencies

- [x] `public.hashtags` table exists with seed data
- [x] `public.kudo_hashtags` junction table for storing selections
- [ ] Viết Kudo form spec completed at `520:11602-Viết Kudo/spec.md`

---

## Notes

- Selected item bg opacity is **0.20** in this component (vs 0.10 for filter dropdowns) — this is intentional (stronger highlight for multi-select).
- Hashtag list from Figma (8 shown, 13 total): #High-perorming, #BE PROFESSIONAL, #BE OPTIMISTIC, #BE A TEAM, #THINK OUTSIDE THE BOX, #GET RISKY, #GO FAST, #WASSHOI.
- Note: "#High-perorming" is a typo in the Figma design ("performing" misspelled). Use the database value.
