# Feature Specification: Dropdown Hashtag filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A floating dropdown overlay that allows users to filter the Homepage SAA kudo feed by a specific hashtag. The dropdown lists all available hashtags. The currently selected/active hashtag is highlighted with a subtle gold background and glow text. Selecting a hashtag closes the dropdown and filters the kudo feed. This is a single-select filter anchored to the hashtag filter button on the Homepage.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter kudo feed by hashtag (Priority: P1)

A user wants to see only kudos tagged with a specific hashtag.

**Why this priority**: Feed filtering is a primary navigation feature on the Homepage. Without it, users cannot find kudos relevant to specific values.

**Independent Test**: Open the hashtag dropdown on the Homepage, click a hashtag, verify the feed displays only kudos with that hashtag tag.

**Acceptance Scenarios**:

1. **Given** the Homepage kudo feed is showing all kudos, **When** the user opens the hashtag filter dropdown and clicks "#Dedicated", **Then** the dropdown closes and the feed shows only kudos tagged with "#Dedicated".
2. **Given** a hashtag is selected and highlighted, **When** the user opens the dropdown again, **Then** the selected hashtag has `rgba(255,234,158,0.10)` background and glow text.
3. **Given** a hashtag is selected, **When** the user clicks the same hashtag again (toggle), **Then** the filter is cleared and all kudos are shown.

---

### User Story 2 - Clear hashtag filter (Priority: P1)

A user who has filtered by hashtag wants to return to the full unfiltered feed.

**Acceptance Scenarios**:

1. **Given** a hashtag filter is active, **When** the user opens the dropdown and clicks the active hashtag, **Then** the filter is cleared and the full feed is shown.
2. **Given** a hashtag filter is active, **When** the user opens the dropdown and clicks a different hashtag, **Then** the filter switches to the newly selected hashtag.

---

### User Story 3 - Dismiss dropdown without filtering (Priority: P2)

A user who accidentally opens the hashtag filter dropdown can close it without changing the filter.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside, **Then** the dropdown closes and the current filter is unchanged.
2. **Given** the dropdown is open, **When** the user presses Escape, **Then** the dropdown closes without changing the filter.

---

### Edge Cases

- What if the hashtag list is empty? → Show "No hashtags available" or hide the filter button.
- What if the selected hashtag has no kudos? → Show empty state in the feed with a message.
- What if new hashtags are added to the database while the user is on the page? → Refresh dropdown list on next open (or via polling).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A_Dropdown-List | 563:8026 | Container: `#00070C` bg, `#998C5F` border, `8px` radius, `6px` padding, text-only items | Open/close with animation |
| A.1 Tag1 (selected) | I563:8026;525:13508 | Selected hashtag — 135×56px, gold bg+glow | Click → deselect/toggle |
| A.2 Tag2+ (default) | I563:8026;525:14864 | Default hashtag — 118×56px, transparent bg | Click → select and filter |

> See `design-style.md` for pixel-perfect visual specifications.

### Navigation Flow

- **From**: Homepage SAA (hashtag filter button click)
- **To**: Same screen with filtered feed
- **Dismiss**: Same screen, filter unchanged

### Visual Requirements

- Text-only items (no icons) — letter-spacing 0.5px.
- Selected item: `rgba(255,234,158,0.10)` bg + text glow `0 0 6px #FAE287`.
- Hover: `rgba(255,234,158,0.10)` background.
- List is scrollable for all 13 hashtags.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dropdown MUST list all hashtags from the `public.hashtags` table.
- **FR-002**: The currently selected hashtag MUST be visually highlighted.
- **FR-003**: Clicking a hashtag MUST close the dropdown and apply the filter to the feed.
- **FR-004**: Clicking the currently selected hashtag MUST toggle the filter off (clear filter).
- **FR-005**: The dropdown MUST close on outside click or Escape.
- **FR-006**: The filtered result MUST update the feed query to include only kudos with matching hashtag key (lookup `hashtags.key` → `kudo_hashtags.hashtag_id`).

### Technical Requirements

- **TR-001**: Client Component for dropdown state.
- **TR-002**: Hashtag list loaded from Supabase `public.hashtags` table on page load or dropdown open.
- **TR-003**: Selected hashtag stored in URL query param using the hashtag's key (e.g., `?hashtag=high-performance`) for human-readable, shareable/bookmarkable filters.
- **TR-004**: Feed query updated via router push/replace when filter changes.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /api/hashtags` | GET | Fetch all hashtags for dropdown list | Predicted |
| `GET /api/kudos?hashtag={key}` | GET | Fetch filtered kudos by hashtag key | Predicted |

---

## Success Criteria

- **SC-001**: All 13 hashtags appear in the dropdown.
- **SC-002**: Selected hashtag highlighted within 100ms of selection.
- **SC-003**: Feed updates with filtered results within 500ms of hashtag selection.

---

## Out of Scope

- Multi-select hashtag filtering (single select only per design).
- Creating or editing hashtags from the dropdown (admin-only feature elsewhere).
- Search within the dropdown.

---

## Dependencies

- [x] `public.hashtags` table exists in migration
- [x] `public.kudo_hashtags` junction table exists
- [ ] `public.hashtags.key` column exists (slug format, unique, not null)
- [ ] Seed data includes `key` values for all 13 hashtags
- [ ] Homepage SAA feed API supports hashtag filtering by key

---

## Notes

- Hashtag list from spec: Toàn diện, Giỏi chuyên môn, Hiệu suất cao, Truyền cảm hứng, Cống hiến, Aim High, Be Agile, Wasshoi, Hướng mục tiêu, Hướng khách hàng, Chuẩn quy trình, Giải pháp sáng tạo, Quản lý xuất sắc (13 total).
- Figma shows hashtags displayed with `#` prefix in the label (e.g., "#Dedicated", "#Inspring").
- Letter spacing is 0.5px — larger than other dropdowns.
