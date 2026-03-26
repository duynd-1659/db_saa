# Tasks: Viết Kudo (Write Kudo)

**Frame**: `520:11602-Viết Kudo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, download assets, prepare types and design tokens

- [x] T001 Install Tiptap dependencies (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-mention`, `@tiptap/extension-placeholder`) | package.json
- [x] T002 Download Figma media assets (toolbar icons: bold, italic, strikethrough, ordered-list, link, quote, search, add-image, cancel-x, send, remove-image) to `public/assets/kudos/icons/` per plan.md Media Assets table | public/assets/kudos/icons/
- [x] T003 [P] Add missing CSS design tokens to globals.css (`--color-modal-bg: #FFF8E1`, `--color-overlay-mask: rgba(0,16,26,0.8)`, `--color-input-bg: #FFFFFF`, `--color-hint-text: #999999`) | src/app/globals.css
- [x] T004 [P] Define TypeScript types: `WriteKudoFormState`, `RecipientProfile`, `CreateKudoPayload`, `CreateKudoResponse` | src/types/kudo-write.ts

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Global modal infrastructure and backend APIs required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Global Modal Infrastructure

- [x] T005 Create `WriteKudoProvider` React Context with `openWriteKudo()` / `closeWriteKudo()` and render `WriteKudoModal` via React Portal | src/components/kudos/write-kudo/WriteKudoProvider.tsx
- [x] T006 Build `WriteKudoModal` container: overlay mask (`bg-[var(--color-overlay-mask)]`), modal card (752px, `bg-[var(--color-modal-bg)]`, rounded-[24px], p-10, `max-h-[calc(100vh-2rem)]` overflow-y-auto, centered), open/close animation (opacity+scale 200ms ease-out) | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [x] T007 Wrap app layout with `WriteKudoProvider` | src/app/[locale]/layout.tsx
- [x] T008 Update `WriteKudosBar` to call `openWriteKudo()` from context (replace TODO placeholder) | src/components/kudos/WriteKudosBar.tsx

### Backend APIs

- [x] T009 [P] Create `searchProfiles(query: string)` service: query `public.profiles` by `full_name` ilike, select `id, full_name, avatar_url`, join department name, limit 10 (includes all profiles — own profile disabled client-side in RecipientSearch) | src/services/profile-service.ts
- [x] T010 [P] Create `createKudo()` service: atomic insert into `kudos` + `kudo_hashtags` + `kudo_images`, derive `sender_id` from server session (or null if anonymous), return created kudo | src/services/kudo-write-service.ts
- [x] T011 Create `GET /api/profiles/search?q={name}` route handler: Zod validate query (q: string, min 2 chars), call `searchProfiles()`, return JSON array | src/app/api/profiles/search/route.ts
- [x] T012 Create `POST /api/kudos` route handler: Zod validate body (`recipient_id: uuid, content: string, hashtag_ids: uuid[] (1-5), image_urls: string[] (0-5), is_anonymous: boolean, anonymous_name?: string`), call `createKudo()`, return 201 | src/app/api/kudos/route.ts

**Checkpoint**: Modal opens/closes from WriteKudosBar, APIs return correct responses via manual testing

---

## Phase 3: User Story 1+2 — Write & Send Kudo + Recipient Autocomplete (Priority: P1) 🎯 MVP

**Goal**: User can open the modal, search and select a recipient, write rich text content, pick 1–5 hashtags, and submit the kudo. Cancel closes the modal.

**Independent Test**: Open modal → search recipient → select → type content → pick 1 hashtag → click "Gửi" → kudo appears in database → modal closes. Also: click "Hủy" → modal closes, no kudo created.

### Frontend (US1+US2)

- [ ] T013 [P] [US1] Create `RecipientSearch` component: label "Người nhận *", trigger button (flex-1, shows selected name or placeholder, chevron icon); click opens dropdown panel — search input at top, loading spinner while fetching (debounced 300ms to `/api/profiles/search?q=`), results list with option layout: circular avatar (left) + bold name + muted department (right); select → closes panel + updates trigger; no results → "Không tìm thấy đồng nghiệp"; own profile option rendered as disabled (opacity-50, cursor-not-allowed, click ignored) (RESYNC: updated per requirement change — own profile must appear but be unselectable with not-allowed cursor) | src/components/kudos/write-kudo/RecipientSearch.tsx
- [x] T014 [P] [US1] Create `RichTextEditor` component: Tiptap editor with StarterKit (bold, italic, strikethrough, orderedList, blockquote) + Link + Placeholder extensions. Toolbar row with icon buttons from `public/assets/kudos/icons/toolbar-*.svg`. Content area (min-h-[120px], bg-white, border, rounded-lg, p-4). Hint text below: "Bạn có thể '@' + tên để nhắc tới đồng nghiệp khác" | src/components/kudos/write-kudo/RichTextEditor.tsx
- [x] T015 [P] [US1] Create `HashtagPicker` component: label "Hashtag *", "Hashtag" chip button (PlusIcon + 2-line text "Hashtag\nTối đa 5" inside button), fetch hashtags from `hashtag-service.ts`, multi-select dropdown (max 5), selected hashtags as removable chips, disabled state when 5 reached | src/components/kudos/write-kudo/HashtagPicker.tsx
- [x] T016 [US1] Create `useWriteKudo` hook: `useReducer` for form state (recipient, content, hashtags[], images[] as `UploadedImage{file,previewUrl}`, isAnonymous, anonymousName, errors, isSubmitting), validation logic (all required fields), `submitKudo()` → upload all `File` objects to Storage → POST `/api/kudos` with returned URLs → revoke blob preview URLs → reset on success | src/hooks/use-write-kudo.ts
- [x] T017 [US1] Assemble form in `WriteKudoModal`: title "Gửi lời cám ơn và ghi nhận đến đồng đội" (Montserrat 700 32px center), sections A→H from design-style.md, action buttons row ("Hủy" ghost + cancel-x icon, "Gửi" primary + send icon), wire `useWriteKudo` hook, disable "Gửi" when invalid | src/components/kudos/write-kudo/WriteKudoModal.tsx

**Checkpoint**: Full kudo creation flow works end-to-end. Kudo with recipient + content + hashtags persisted in DB. Cancel discards form. Validation prevents empty submissions.

---

## Phase 4: User Story 3 — Attach Images (Priority: P2)

**Goal**: User can attach 0–5 images to the kudo. Files held locally as `File` objects with blob previews; uploaded to Supabase Storage at submit time, URLs stored in `kudo_images`.

**Independent Test**: Open modal → fill required fields → click "Image" → select file → thumbnail appears → add up to 5 → remove one → submit → images stored in Storage and `kudo_images` table.

### Backend (US3)

- [x] T018 [P] [US3] Create `uploadKudoImage()` service: upload file to Supabase Storage `images` bucket, return public URL. Validate file type (JPEG/PNG) and size (max 10MB) | src/services/image-upload-service.ts

### Frontend (US3)

- [ ] T019 [US3] Create `ImageUpload` component: label "Image", thumbnails row (80×80px) with × remove button showing blob preview via `URL.createObjectURL`, "Image" button with PlusIcon + 2-line text ("Image\nTối đa 5") inside button (hidden when 5 reached, reappears on remove), file picker with `multiple` attribute (accept image/jpeg,image/png), cap selection at remaining slots (excess silently dropped), store `File` objects in state — no upload on select; validate size on add: files > 10MB accepted but marked `hasError: true`, thumbnail shows `border-2 border-[#E46060]` + error text "Ảnh vượt quá 10MB" below row; submit blocked while any image has error | src/components/kudos/write-kudo/ImageUpload.tsx, src/types/kudo-write.ts, src/hooks/use-write-kudo.ts (RESYNC: updated per requirement change — 10MB size validation with error state UI)
- [x] T020 [US3] Integrate `ImageUpload` into `WriteKudoModal` form and `useWriteKudo` hook state (images[] as `UploadedImage{file,previewUrl}[]`, add/remove with blob URL revocation, upload all files at submit then pass returned URLs to createKudo payload) | src/components/kudos/write-kudo/WriteKudoModal.tsx, src/hooks/use-write-kudo.ts

**Checkpoint**: Local previews show immediately on select; submit triggers Storage upload; thumbnails display; remove works with blob URL cleanup; URLs saved in `kudo_images` on submit.

---

## Phase 5: User Story 4 — Send Kudo Anonymously (Priority: P2)

**Goal**: User can toggle anonymous mode, enter a custom display name, and submit with `sender_id = null`.

**Independent Test**: Open modal → fill required fields → check anonymous toggle → name input appears → enter name → submit → DB has `is_anonymous = true`, `sender_id = null`, `anonymous_name = <entered name>`.

### Frontend (US4)

- [x] T021 [P] [US4] Create `AnonymousToggle` component: checkbox with label "Gửi lời cám ơn và ghi nhận ẩn danh", when checked → show text input for anonymous name (same input styling as recipient field) | src/components/kudos/write-kudo/AnonymousToggle.tsx
- [x] T022 [US4] Integrate `AnonymousToggle` into `WriteKudoModal` form and `useWriteKudo` hook state (isAnonymous, anonymousName, conditional validation: name required when anonymous) | src/components/kudos/write-kudo/WriteKudoModal.tsx, src/hooks/use-write-kudo.ts

**Checkpoint**: Anonymous kudo stored with `sender_id = null` and `anonymous_name` in DB. Normal kudo still has correct `sender_id`.

---

## Phase 6: User Story 5 — Cancel Kudo Creation (Priority: P2)

**Goal**: User can cancel the form without creating a kudo.

**Independent Test**: Open modal → fill some fields → click "Hủy" → modal closes, no kudo in DB, user stays on current page.

> Note: Cancel behavior is already wired in T017 (Phase 3). This phase validates and polishes the cancel flow.

- [x] T023 [US5] Verify and polish cancel flow: "Hủy" button closes modal via context `closeWriteKudo()`, form state resets on close, no API call made, user stays on current page | src/components/kudos/write-kudo/WriteKudoModal.tsx

**Checkpoint**: Cancel is clean — no side effects, form resets, modal closes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Sub-overlays, edge cases, accessibility, responsive, animations

- [x] T024 [P] Integrate Addlink Box modal: link toolbar button opens Addlink Box sub-overlay (per spec `1002:12917`), confirmed link inserted into Tiptap editor | src/components/kudos/write-kudo/RichTextEditor.tsx
- [x] T025 [P] Implement @mention autocomplete in Tiptap: configure Mention extension, typing `@` + 2 chars triggers profile search dropdown inside editor, select inserts mention node | src/components/kudos/write-kudo/RichTextEditor.tsx
- [x] T026 [P] Add form validation error states: red border on invalid fields, error messages below fields ("Vui lòng chọn người nhận", "Vui lòng nhập nội dung", "Vui lòng chọn ít nhất 1 hashtag"), show on submit attempt | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [x] T027 [P] Add loading and error states: spinner on "Gửi" button during submission (reuse `Button` isLoading), error toast on API failure with form data retained for retry | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [x] T028 [P] Responsive layout: full-width modal on mobile (< 768px), adjust padding and font sizes per breakpoints, ensure 44×44px touch targets on all interactive elements | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [x] T029 [P] Accessibility: semantic HTML (`<form>`, `<label>`, `<fieldset>`), ARIA labels for icon buttons, keyboard navigation (Escape closes modal, Tab order through form fields), focus trap inside modal | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [x] T030 Format all new files with Prettier | all new files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 completion — BLOCKS all user stories
- **Phase 3 (US1+US2)**: Depends on Phase 2 — this is the MVP
- **Phase 4 (US3)**: Depends on Phase 3 (needs form infrastructure)
- **Phase 5 (US4)**: Depends on Phase 3 (needs form infrastructure). Can run in parallel with Phase 4.
- **Phase 6 (US5)**: Depends on Phase 3 (cancel already wired, this is validation only)
- **Phase 7 (Polish)**: Depends on Phase 3 minimum. Can start after MVP is complete.

### Within Each User Story

- Types before services
- Services before route handlers
- Backend APIs before frontend components that call them
- Individual components before modal assembly
- Hook before modal integration (hook provides state/logic)

### Parallel Opportunities

**Phase 1**: T003 ∥ T004 (CSS tokens and types are independent)
**Phase 2**: T009 ∥ T010 (profile service and kudo-write service are independent files)
**Phase 3**: T013 ∥ T014 ∥ T015 (RecipientSearch, RichTextEditor, HashtagPicker are independent components)
**Phase 4+5**: Phase 4 (US3 images) ∥ Phase 5 (US4 anonymous) can run in parallel
**Phase 7**: T024 ∥ T025 ∥ T026 ∥ T027 ∥ T028 ∥ T029 (all polish tasks are independent)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1+US2: Write & send kudo with recipient)
3. **STOP and VALIDATE**: Open modal → search recipient → write content → pick hashtag → submit → kudo in DB
4. Deploy if ready — core kudo creation is functional

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1+US2) → Test → Deploy MVP
3. Phase 4 (US3: images) + Phase 5 (US4: anonymous) → Test → Deploy
4. Phase 7 (Polish) → Test → Deploy

---

## Notes

- US1 (write & send) and US2 (recipient autocomplete) are merged into Phase 3 because they are inseparable — you cannot send a kudo without selecting a recipient.
- US5 (cancel) is trivially handled in Phase 3 (T017 wires the cancel button). Phase 6 is a validation pass only.
- The `POST /api/kudos` route handler is added to the existing `src/app/api/kudos/route.ts` file (which already has GET).
- Content sanitization (DOMPurify) for rendering kudo HTML is out of scope here — it belongs in the KudoCard display component, not the creation form.
- Sub-overlay specs (`1002:13013-Dropdown list hashtag`, `1002:12917-Addlink Box`) should be reviewed before implementing T015 and T024.

**Version**: 2.6.0
**Last synced**: 2026-03-17
**Last updated**: 2026-03-25

---

## Phase 8: Figma Sync — 2026-03-17

**Purpose**: Align implementation with Figma design discrepancies detected in sync report 2026-03-17.

### DB (blocking — must run before service/component tasks)

- [ ] T031 [DB] Create migration `20260317000000_add_kudos_title.sql`: add `title text NOT NULL` column to `public.kudos`, add CHECK constraint `kudos_title_not_empty`, update view `kudos_with_stats` if needed | supabase/migrations/20260317000000_add_kudos_title.sql
- [ ] T032 [DB] Regenerate Supabase types after migration | src/types/database.ts

### Types & API

- [ ] T033 [P] Update `CreateKudoPayload` and `WriteKudoFormState` types: add `title: string` field | src/types/kudo-write.ts
- [ ] T034 [P] Update `POST /api/kudos` route: add `title: z.string().min(1)` to Zod schema, pass to `createKudo()` | src/app/api/kudos/route.ts
- [ ] T035 [P] Update `createKudo()` service: include `title` in INSERT statement | src/services/kudo-write-service.ts

### Toolbar icons

- [ ] T036 [P] Re-download toolbar icon SVGs from Figma as **dark (black fill)** icons to replace existing white ones | public/assets/kudos/icons/toolbar-*.svg

### UI: Toolbar

- [ ] T037 Update `RichTextEditor` toolbar: remove `gap-2`, apply shared-border connected bar layout (each button: `border border-[#998C5F] h-10 px-4 py-[10px] bg-transparent`; Bold: `rounded-tl-lg`; last formatting btn: no radius); add "Tiêu chuẩn cộng đồng" button on right (`w-[336px] font-montserrat font-bold text-[16px] text-[#E46060] text-right rounded-tr-lg`) | src/components/kudos/write-kudo/RichTextEditor.tsx

### UI: Inline label layouts

- [ ] T038 [P] Update `RecipientSearch`: wrap in `flex flex-row items-center gap-4`, label `shrink-0 w-[152px]`, input `flex-1` | src/components/kudos/write-kudo/RecipientSearch.tsx
- [ ] T039 [P] Update `HashtagPicker`: wrap in `flex flex-row items-start gap-4`, label `shrink-0 w-[152px]`, tag group `flex-1` | src/components/kudos/write-kudo/HashtagPicker.tsx
- [ ] T040 [P] Update `ImageUpload`: wrap in `flex flex-row items-center gap-4`, label `shrink-0 w-[152px]`, thumbnails row `flex-1` | src/components/kudos/write-kudo/ImageUpload.tsx

### UI: New "Danh hiệu" field

- [ ] T041 Add `DanhHieuField` (inline in `WriteKudoModal`): label "Danh hiệu *" (`shrink-0 w-[152px]`), input `flex-1 bg-white border border-[#998C5F] rounded-lg px-6 py-4`, hint text below in `#999999`; wire to `useWriteKudo` state + validation | src/components/kudos/write-kudo/WriteKudoModal.tsx
- [ ] T042 Update `useWriteKudo` hook: add `title` to form state, add required validation for `title` | src/hooks/use-write-kudo.ts

### Checkpoint
- All form groups show inline label layout
- Toolbar has connected border bar + "Tiêu chuẩn cộng đồng" button
- "Danh hiệu" field appears between "Người nhận" and RichTextEditor
- `kudos.title` persisted to DB on submit

---

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| 2.6.0 | 2026-03-25 | Structural | Requirement change: 10MB image size limit with error state — Invalidated T019 (needs size validation, error state UI, submit block) |
| 2.5.0 | 2026-03-25 | Structural | Requirement change: Deferred image upload to submit time — Modified T016, T019, T020, Phase 4 Goal/Checkpoint |
| 2.4.0 | 2026-03-25 | Structural | Requirement change: Multi-file image selection with cap at 5 — Invalidated T019 (needs `multiple` attr + capping logic) |
| 2.3.1 | 2026-03-17 | Cosmetic | Requirement change: Standardize inline row label widths to 152px — Modified T038 (w-[146px]→w-[152px]), T039 (w-[108px]→w-[152px]), T040 (added w-[152px]), T041 (w-[139px]→w-[152px]) |
| 2.3.0 | 2026-03-17 | Structural | Requirement change: Own profile visible but disabled in results — Modified T009 (reverted server-side exclusion); Invalidated T013 (must add disabled state for own profile option) |
| 2.2.0 | 2026-03-17 | Structural | Requirement change: Exclude current user from recipient search — Invalidated T009 (needs self-exclusion filter in searchProfiles) |
| 2.1.0 | 2026-03-17 | Structural | Requirement change: Modified T013 — RecipientSearch changed from autocomplete text input to select dropdown with inline search, loading state, avatar+name+dept options |
| 2.0.0 | 2026-03-17 | Structural | Added Phase 8 (Figma Sync 2026-03-17): T031-T042 covering DB migration for kudos.title, inline label layouts for B/E/F, new Danh hiệu field, toolbar UI overhaul, icon color fix |
| 1.0.0 | 2026-03-15 | Initial | Initial task breakdown |
