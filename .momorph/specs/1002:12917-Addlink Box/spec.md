# Feature Specification: Addlink Box

**Frame ID**: `1002:12917`
**Frame Name**: `Addlink Box`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A modal dialog overlay on the Viết Kudo screen for attaching a hyperlink to a kudo. The modal has two input fields: **Nội dung** (display text) and **URL** (the actual link). Has two action buttons: **Hủy** (cancel/close) and **Lưu** (save). The modal has a warm cream background (`#FFF8E1`) consistent with the Viết Kudo modal. On save, the link is embedded in the kudo content.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a link to a kudo (Priority: P1)

A user writing a kudo wants to attach a URL with a display text label.

**Why this priority**: Adding links enriches kudo content. This is the primary action of this modal.

**Independent Test**: In the Viết Kudo form, click the link toolbar button, verify the Addlink modal opens, enter display text "Sun* Blog" and URL "https://sun-asterisk.com", click "Lưu", verify the kudo editor contains a hyperlink with that text and URL.

**Acceptance Scenarios**:

1. **Given** the Viết Kudo form is open, **When** the user clicks the link icon in the rich text toolbar, **Then** the Addlink Box modal appears over the form.
2. **Given** the modal is open with both fields filled (valid text + valid URL), **When** the user clicks "Lưu", **Then** the modal closes and the link is inserted into the kudo rich text content.
3. **Given** the text field is "Sun* Blog" and URL is "https://sun-asterisk.com", **When** the user saves, **Then** the kudo editor shows "Sun* Blog" as a clickable hyperlink.

---

### User Story 2 - Validate link inputs (Priority: P1)

The system validates both fields before saving.

**Why this priority**: Invalid links would create broken kudo content.

**Acceptance Scenarios**:

1. **Given** the text field is empty, **When** the user clicks "Lưu", **Then** an error is shown on the text field and the save is blocked.
2. **Given** the URL field contains "not-a-url", **When** the user clicks "Lưu", **Then** an error is shown on the URL field requiring a valid http/https URL.
3. **Given** both fields are valid, **When** the user clicks "Lưu", **Then** no errors are shown and the link is saved.

---

### User Story 3 - Cancel without saving (Priority: P2)

A user can dismiss the modal without attaching a link.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user clicks "Hủy", **Then** the modal closes and the kudo content is unchanged.
2. **Given** the modal is open with data entered, **When** the user clicks "Hủy", **Then** the entered data is discarded.

---

### Edge Cases

- What if the URL is extremely long (> 2048 chars)? → Show validation error.
- What if the text is > 100 chars? → Show validation error with char count.
- What if the user clicks outside the modal? → Close without saving (same as Hủy).
- What if the same URL is added twice to the same kudo? → Allow it (no deduplication constraint).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Modal container | 1002:12682 | 752×388px, `#FFF8E1` bg, 24px radius, 40px padding | Backdrop click → close |
| A_Title | I1002:12682;1002:12500 | "Thêm đường dẫn", Montserrat 700 32px | Static |
| B_Text row | I1002:12682;1002:12501 | Label "Nội dung" + text input | Text input, required |
| B.2_Text box | I1002:12682;1002:12503 | 610×56px input, `#FFF` bg, `#998C5F` border | Free text, 1-100 chars |
| C_Link row | I1002:12682;1002:12652 | Label "URL" + URL input with link icon | URL input, required |
| C.2_Text box | I1002:12682;1002:12654 | 609×56px input | URL format, 5-2048 chars |
| D.1_Button Hủy | I1002:12682;1002:12544 | Cancel button — gold-tinted bg, border, "Hủy" + × | Click → close modal |
| D.2_Button Lưu | I1002:12682;1002:12545 | Save button — 502×60px, `#FFEA9E` bg, "Lưu" + link | Click → validate + save |

> See `design-style.md` for pixel-perfect specifications.

### Navigation Flow

- **From**: Viết Kudo form (link toolbar button click)
- **To**: Same Viết Kudo form (modal closes, link inserted in editor)
- **Dismiss**: Same Viết Kudo form (no link added)

### Visual Requirements

- Modal background `#FFF8E1` — same cream as Viết Kudo modal.
- Save button is full gold (`#FFEA9E`), 502px wide — prominent primary action.
- Cancel button is subtle: `rgba(255,234,158,0.10)` bg with gold border.
- Input fields use white bg + `#998C5F` border.
- Title 32px — larger than input labels (22px).
- See `design-style.md` for complete dimension table.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The modal MUST display two input fields: display text ("Nội dung") and URL.
- **FR-002**: The text field MUST be required (1-100 characters, no whitespace-only).
- **FR-003**: The URL field MUST be required and validate as a valid http/https URL (5-2048 chars).
- **FR-004**: Clicking "Lưu" MUST validate both fields; if valid, insert the link into the kudo editor and close.
- **FR-005**: Clicking "Hủy" or outside the modal MUST close without saving.
- **FR-006**: Both fields MUST show inline error messages for invalid input.
- **FR-007**: The "Lưu" button MUST be disabled (or show error on click) when fields are invalid.

### Technical Requirements

- **TR-001**: Client Component with local form state.
- **TR-002**: URL validation using native browser `URL` constructor or a regex pattern.
- **TR-003**: On save, call the rich text editor's `insertLink(text, url)` API.
- **TR-004**: Form state clears when modal closes.

### Key Entities

- **Link**: `{ text: string (1-100 chars), url: string (valid URL, 5-2048 chars) }`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| _None_ | — | Link insertion is client-side only (into the rich text editor state) | — |

---

## Success Criteria

- **SC-001**: Valid link (text + URL) inserts correctly into kudo editor in 100% of test runs.
- **SC-002**: Invalid inputs (empty text, bad URL) are blocked with error messages.
- **SC-003**: Modal closes cleanly on "Hủy" without affecting kudo content.

---

## Out of Scope

- Editing an existing link (this modal is for new link insertion only).
- Link preview/unfurl.
- Opening the URL in a new tab from within the modal.

---

## Dependencies

- [ ] Rich text editor (for kudo content) with `insertLink` capability
- [ ] Viết Kudo form spec: `520:11602-Viết Kudo/spec.md`

---

## Notes

- Modal title in Figma is "Thêm đường dẫn" (Add link/URL) — not "Add Link" in English.
- The Save button is intentionally much wider (502px) than the Cancel button — emphasizes primary action.
- The `#FFF8E1` background is the same warm cream used in the Viết Kudo modal — visual consistency for overlapping modals.
