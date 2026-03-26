# Feature Specification: Viết Kudo

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft
**Version**: v2.8
**Last synced**: 2026-03-17
**Last updated**: 2026-03-26

---

## Overview

The kudo creation form — a full-page modal overlay where authenticated users write and send appreciation messages (kudos) to colleagues. The form has required fields (recipient, title/danh hiệu, message content, hashtags) and optional fields (images, anonymous posting). Rich text editing is supported (bold, italic, strikethrough, ordered list, link, quote). Upon successful submission, the kudo is saved to the database and the user returns to the Homepage SAA.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Write and send a kudo (Priority: P1)

An authenticated user writes an appreciation message to a colleague and submits it.

**Why this priority**: Core product feature — the entire application is built around kudo creation and sharing.

**Independent Test**: Navigate to Viết Kudo, select a recipient, write content, add 1 or more hashtags, click "Gửi", verify the kudo appears in the kudos page.

**Acceptance Scenarios**:

1. **Given** the user is on the Viết Kudo modal, **When** the user selects a recipient, writes content, selects 1 or more hashtags, and clicks "Gửi", **Then** the kudo is saved to the database.
2. **Given** the form is submitted successfully, **When** the user lands on kudos page, **Then** the new kudo appears at the top of the "ALL KUDOS" section.
3. **Given** the "Gửi" button, **When** required fields are empty (no recipient, no content, no hashtag), **Then** the button is disabled or shows validation errors on click.

---

### User Story 2 - Select recipient via dropdown (Priority: P1)

The user opens a dropdown, searches for a colleague, and selects them as the kudo recipient.

**Acceptance Scenarios**:

1. **Given** the recipient dropdown trigger, **When** the user clicks it, **Then** a dropdown panel opens with a search input at the top and a loading spinner appears while results are being fetched.
2. **Given** the dropdown is open and the user types 2+ characters, **When** results load, **Then** each option shows a circular avatar on the left and the colleague's name (bold) + department (muted) on the right.
3. **Given** the dropdown is open, **When** the user clicks an option, **Then** the dropdown closes and the trigger button displays the selected colleague's name.
4. **Given** no recipient is selected, **When** the user clicks "Gửi", **Then** the recipient field shows a validation error.
5. **Given** the dropdown is open and the authenticated user searches, **When** results load, **Then** the authenticated user's own profile appears in the list but is rendered as a disabled option — hover shows `cursor-not-allowed` and clicking does nothing.

---

### User Story 3 - Attach images to kudo (Priority: P2)

The user can attach up to 5 images to the kudo. The file picker supports selecting multiple files at once.

**Acceptance Scenarios**:

1. **Given** the image section, **When** the user clicks "Image", **Then** a file picker opens supporting multiple file selection.
2. **Given** the user selects N files where N ≤ remaining slots, **When** the picker confirms, **Then** all N images appear as local preview thumbnails (not yet uploaded to Storage).
3. **Given** the user selects N files where N would exceed 5 total, **When** the picker confirms, **Then** only the first files up to the cap of 5 are accepted; excess files are silently dropped.
4. **Given** 5 images are attached, **When** the images list reaches the limit, **Then** the "Image" button is hidden.
5. **Given** an image thumbnail, **When** the user clicks the × button, **Then** the image is removed and the "Image" button reappears (if count < 5).
6. **Given** the user selects a file larger than 10MB, **When** the file is added to the list, **Then** its thumbnail shows a red error border (`border-2 border-[#E46060]`) and an error text "Ảnh vượt quá 10MB" appears below the thumbnail row; the "Gửi" button is blocked until the oversized image is removed.

---

### User Story 4 - Send kudo anonymously (Priority: P2)

The user can send the kudo without revealing their identity.

**Acceptance Scenarios**:

1. **Given** the anonymous toggle is off, **When** the user enables it, **Then** a text field appears for entering a custom display name.
2. **Given** anonymous mode is on and a name is entered, **When** the kudo is submitted, **Then** the kudo shows the custom name (not the real user's name).
3. **Given** anonymous mode is on, **When** the kudo is submitted, **Then** `sender_id = null` and `anonymous_name = <entered name>` in the database.

---

### User Story 5 - Cancel kudo creation (Priority: P2)

A user can cancel without submitting.

**Acceptance Scenarios**:

1. **Given** the Viết Kudo form is open, **When** the user clicks "Hủy", **Then** the form closes and the user returns to Homepage SAA with no kudo created.

---

### Edge Cases

- What if the recipient search returns no results? → Show "Không tìm thấy đồng nghiệp" inside the dropdown panel.
- What if the authenticated user's name matches the search query? → Their profile appears in results but is shown as a disabled option (muted style, cursor-not-allowed, cannot be clicked).
- What if the content is empty on submit? → Show validation error.
- What if an image upload fails during submit? → The submit fails; show error message and keep form data intact so the user can retry.
- What if a selected image exceeds 10MB? → Accept into list with error state (red border + error text "Ảnh vượt quá 10MB" below thumbnail row); block submit until removed.
- What if the user navigates away (browser back) mid-form? → Prompt confirmation or discard silently.
- What if the kudo submission API fails? → Show error message, keep form data intact for retry.

---

## UI/UX Requirements _(from Figma)_

### Screen Components

| Component       | Node ID              | Description                                | Interactions                |
| --------------- | -------------------- | ------------------------------------------ | --------------------------- |
| Page overlay    | 520:11646            | Dark mask (rgba(0,16,26,0.8)) behind modal | Click outside → go back?    |
| Modal container | 520:11647            | 752×1012px, `#FFF8E1` bg, scrollable       | Scrolls vertically          |
| A: Title        | I520:11647;520:9870  | "Gửi lời cám ơn và ghi nhận đến đồng đội"  | Static                      |
| B: Người nhận   | I520:11647;520:9871  | Inline row: label (152px) + select trigger button (flex:1) — required | Select dropdown with inline search, required |
| B.NEW: Danh hiệu | I520:11647;1688:10448 | Inline row: label (152px) + text input (flex:1) + hint text — required title for the kudo | Text input, required |
| C: Toolbar      | I520:11647;520:9877  | Rich text toolbar: B, I, S, #, link, quote + "Tiêu chuẩn cộng đồng" link | Toggle formatting |
| D: Textarea     | I520:11647;520:9886  | Rich text content area                     | @mention support            |
| E: Hashtag      | I520:11647;520:9890  | Inline row: label (152px) + chips/add-button (flex:1) — max 5, required | Opens Dropdown list hashtag |
| F: Images       | I520:11647;520:9896  | Inline row: label + thumbnails (80×80px) + "Image" button (PlusIcon + 2-line text) — optional | File picker                 |
| G: Anonymous    | I520:11647;520:14099 | Toggle checkbox for anonymous sending      | Shows name field when on    |
| H: Actions      | I520:11647;520:9905  | "Hủy" + "Gửi" buttons                      | Form submit/cancel          |

> See `design-style.md` for visual specifications (colors, typography, dimensions).

### Navigation Flow

- **From**: Homepage SAA ("Write Kudo" button click)
- **To (Submit)**: Homepage SAA (kudo created)
- **To (Cancel)**: Homepage SAA (no kudo)
- **Sub-overlays**: Addlink Box (link toolbar), Dropdown list hashtag (hashtag picker)

### Visual Requirements

- Modal background `#FFF8E1` (warm cream) — different from dark page background.
- Form scrolls vertically — 1012px height requires scrolling on 1024px viewport.
- Form groups (B, B.NEW, E, F) use **inline row layout**: label fixed-width **152px** on left, input/content on right (flex:1).
- Rich text toolbar buttons share borders (connected bar), no gap between them. First button top-left rounded, last button top-right rounded.
- Toolbar icons are **dark/black** (24×24px) — toolbar background is transparent/white.
- "Tiêu chuẩn cộng đồng" text in coral red `#E46060` appears on the right of the toolbar.
- Required fields marked with asterisk (\*).

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The form MUST require: recipient (not empty), content (not empty), at least 1 hashtag.
- **FR-002**: The recipient field MUST be a select dropdown: a trigger button shows the selected colleague's name (or placeholder); clicking opens a panel containing a search input at the top, a loading spinner while fetching, and a results list where each option shows a circular avatar on the left and bold name + muted department on the right. Searches `public.profiles`. The authenticated user's own profile MAY appear in results but MUST be rendered as a disabled option (visually muted, `cursor-not-allowed` on hover, cannot be selected).
- **FR-003**: The content field MUST support rich text (bold, italic, strikethrough, ordered list, link, quote).
- **FR-004**: The hashtag field MUST allow selecting 1–5 hashtags via `Dropdown list hashtag` overlay.
- **FR-005**: The image field MUST allow uploading 0–5 images (optional). The file picker MUST support multi-file selection (`multiple` attribute). If the selection would exceed 5 total, only files up to the cap are accepted (excess silently dropped). The "Image" button hides when the count reaches 5 and reappears when an image is removed. Each file MUST be ≤ 10MB — files exceeding 10MB are accepted into the list but shown with a red error border and error message "Ảnh vượt quá 10MB" below the thumbnail row. The "Gửi" button MUST be blocked while any image has a size error. Images stored in Supabase Storage; URLs persisted in `kudo_images` on submit.
- **FR-006**: The anonymous toggle MUST set `is_anonymous = true` and show a custom name input.
- **FR-007**: The "Hủy" button MUST close the form without saving.
- **FR-008**: The "Gửi" button MUST validate all required fields; on success, create the kudo and navigate back.
- **FR-009**: Content MUST support @mention syntax (typing `@name` shows autocomplete).
- **FR-010**: The "Danh hiệu" field MUST be required. It stores the kudo title (displayed as the headline of the Kudos card). Placeholder: "Dành tặng một danh hiệu cho đồng đội". Hint: "Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."
- **FR-011**: The toolbar MUST show a "Tiêu chuẩn cộng đồng" link button on the right side (coral `#E46060`).

### Technical Requirements

- **TR-001**: Client Component for form state management.
- **TR-002**: Rich text editor using Tiptap, Quill, or Lexical.
- **TR-003**: Recipient search input inside the dropdown debounced at 300ms, queries `public.profiles` by name. Trigger is a button (not a text input) — shows selected name when a recipient is chosen.
- **TR-004**: Kudo submission inserts to `public.kudos`, `public.kudo_hashtags`, `public.kudo_images` atomically.
- **TR-005**: Images are stored as local `File` objects with blob preview URLs until submit. At submit time, all files are uploaded to Supabase Storage (`images` bucket) directly from the client via `supabase.storage`, then the returned public URLs are included in the kudo creation payload.
- **TR-006**: Form state cleared on successful submission.

### Key Entities

- **Kudo**: `{ sender_id, recipient_id, title, content, is_anonymous, anonymous_name }`
- **KudoHashtags**: `{ kudo_id, hashtag_id }[]` — 1 to 5
- **KudoImages**: `{ kudo_id, url, order_index }[]` — 0 to 5

---

## API Dependencies

| Endpoint                            | Method | Purpose                                | Status    |
| ----------------------------------- | ------ | -------------------------------------- | --------- |
| `GET /api/profiles/search?q={name}` | GET    | Recipient dropdown search              | Implemented |
| `POST /api/kudos`                   | POST   | Create kudo (body: `recipient_id, title, content, hashtag_ids[], image_urls[], is_anonymous, anonymous_name?`) | Predicted |
| Supabase Storage SDK (client-side)  | —      | Upload kudo images directly from browser at submit time | Implemented |

---

## Success Criteria

- **SC-001**: Valid form submission creates kudo in database within 2 seconds.
- **SC-002**: Submitted kudo appears in Homepage feed within 5 seconds of creation.
- **SC-003**: Form validation prevents submission with missing required fields in 100% of cases.
- **SC-004**: Image upload succeeds for JPEG/PNG files up to 10MB per file.

---

## Out of Scope

- Editing an existing kudo (this form is create-only).
- Drafts / saving kudo for later.
- Scheduling kudo for a future time.
- Sending kudo to multiple recipients in one submission.

---

## Dependencies

- [x] `public.kudos`, `public.kudo_hashtags`, `public.kudo_images` tables exist
- [x] Supabase Storage `images` bucket configured
- [x] Rich text editor library chosen and installed — **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, extensions: Link, Placeholder, Mention)
- [ ] `Dropdown list hashtag` spec: `1002:13013-Dropdown list hashtag/spec.md`
- [ ] `Addlink Box` spec: `1002:12917-Addlink Box/spec.md`
- [x] Profile dropdown search API (`GET /api/profiles/search`) — implemented

---

## Notes

- The form is a full-page overlay — NOT a separate route.
- Anonymous kudo: `sender_id = null` in the DB (not the actual user ID) — this hides identity at the data level, not just UI level.
- @mention renders as `<a href="/profile/{id}">@name</a>` inside the rich text content — profile URL can be updated once the profile page route is finalized. Mention data is not stored as a separate entity in this schema.
- The Figma form modal height (1012px) exceeds typical viewport height (1024px including header) — the modal must be scrollable.

---

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v2.8 | 2026-03-26 | Implementation | Tiptap confirmed as rich text library; profile search API marked Implemented; @mention now renders as profile link (`/profile/{id}`); AddLinkModal uses React portal to avoid nested form |
| v2.7 | 2026-03-25 | Structural | Requirement change: 10MB per-image size limit with error state — added US3 AC6, updated FR-005 (red border + error text + submit block), added Edge Case |
| v2.6 | 2026-03-25 | Structural | Requirement change: Images stored locally until submit — updated AC2 (preview not upload), Edge Case (upload fail on submit), TR-005 (client-side SDK at submit), API Dependencies (removed POST /api/storage/upload) |
| v2.5 | 2026-03-25 | Structural | Requirement change: Multi-file image selection with cap at 5 — updated US3 (5 scenarios), FR-005 (multi + cap + submit behavior) |
| v2.4 | 2026-03-17 | Cosmetic | Requirement change: Standardize all inline row label widths to 152px — updated Screen Components B (146px→152px), B.NEW (139px→152px), E (108px→152px); Visual Requirements label width note |
| v2.3 | 2026-03-17 | Structural | Requirement change: Own profile shown in results but disabled (not-allowed cursor, cannot select) — updated US2 AC5, FR-002, Edge Cases |
| v2.2 | 2026-03-17 | Structural | Requirement change: Exclude authenticated user from recipient search results — updated US2 AC5 (new), FR-002, Edge Cases |
| v2.1 | 2026-03-17 | Structural | Requirement change: Component B (Người nhận) changed from autocomplete text input to select dropdown — updated US2 title+ACs, FR-002, TR-003, Screen Components table B row, API Dependencies, Edge Cases, Dependencies checklist |
| v2.0 | 2026-03-17 | Structural | Added "Danh hiệu" required field (B.NEW) with FR-010; added FR-011 "Tiêu chuẩn cộng đồng" toolbar button; updated Key Entities (Kudo.title); updated Overview, Visual Requirements, Screen Components table, API body; form group layout updated to inline row |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |
