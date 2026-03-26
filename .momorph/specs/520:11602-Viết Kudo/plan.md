# Implementation Plan: Viết Kudo (Write Kudo)

**Frame**: `520:11602-Viết Kudo`
**Date**: 2026-03-15
**Spec**: `specs/520:11602-Viết Kudo/spec.md`

---

## Summary

Global modal overlay form for creating kudos. The modal is **not a route** — it can be opened from any screen that has a trigger button (e.g. `WriteKudosBar`). Authenticated users write appreciation messages to colleagues with required fields (recipient via select dropdown, rich text content, 1–5 hashtags) and optional fields (0–5 images, anonymous toggle with custom name). Uses Tiptap for rich text editing. Submission creates records atomically across `kudos`, `kudo_hashtags`, and `kudo_images` tables. After submit/cancel, the modal closes and the user remains on the current page.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, Tailwind CSS 4, Tiptap (new), Zod
**Database**: Supabase (PostgreSQL) with RLS
**State Management**: React Context for modal open/close state; local `useReducer` for form state
**API Style**: REST (Next.js Route Handlers → Service layer)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (Prettier, `const`, kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Tiptap — new dependency, justified below)
- [x] Adheres to folder structure guidelines (`components/kudos/`, `services/`, `hooks/`, `types/`)
- [x] Meets security requirements (RLS, server-side auth, Zod validation, no `dangerouslySetInnerHTML`)
- [x] Follows testing standards

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| New dependency: `@tiptap/react` + extensions | Rich text editing (bold, italic, strikethrough, ordered list, link, blockquote) is a core spec requirement (FR-003). No existing library in the project. | Quill: less React-friendly, heavier. Lexical: steeper learning curve, more boilerplate for the same feature set. Tiptap is the lightest, most composable option for the required formatting subset. |

---

## Architecture Decisions

### Frontend Approach

- **Modal Architecture**: Global modal rendered via React Context + Portal. A `WriteKudoProvider` wraps the app layout, exposing `openWriteKudo()` / `closeWriteKudo()`. Any page component or trigger button (e.g. `WriteKudosBar`) can call `openWriteKudo()` to show the modal overlay. The modal renders at document body level via Portal, independent of the triggering page.
- **Component Structure**: Feature-scoped under `src/components/kudos/write-kudo/`. Main `WriteKudoModal` orchestrates sub-components for each form section (recipient search, rich text editor, hashtag picker, image upload, anonymous toggle, action buttons).
- **Styling Strategy**: Tailwind utilities mapped to CSS variables defined in `globals.css`. Design tokens from `design-style.md` added to `:root`.
- **Form State Management**: `useReducer` inside the modal component to manage form state (recipient, content, hashtags, images, anonymous fields, validation errors, loading). State resets on modal close. No global form state needed — the form is ephemeral.
- **Data Fetching**: Client-side `fetch` for profile autocomplete (debounced 300ms) and kudo submission. Hashtags fetched on modal open.
- **Rich Text**: Tiptap editor with extensions: `StarterKit` (bold, italic, strikethrough, ordered list, blockquote), `Link`, `Mention` (for @mentions). Content stored as HTML string.

### Backend Approach

- **API Design**:
  - `GET /api/profiles/search?q={name}` — Debounced autocomplete, returns `{ id, full_name, avatar_url, department_name }[]`
  - `POST /api/kudos` — Create kudo atomically (kudo + hashtags + image refs). Body: `{ recipient_id, title, content, hashtag_ids[], image_urls[], is_anonymous, anonymous_name? }`
  - Image upload: Direct Supabase Storage upload from client via `supabase.storage.from('images').upload()` — triggered **at submit time** (not on file select); files held as `File` objects with blob preview URLs until then
- **Data Access**: Service functions in `src/services/kudo-write-service.ts` (separate from existing read-focused `kudos-service.ts`)
- **Validation**: Zod schemas at API boundary. Client-side validation for immediate UX feedback.

### Integration Points

- **Existing Services**: `hashtag-service.ts` → `fetchHashtags()` for hashtag list
- **Existing Components**: `WriteKudosBar.tsx` → trigger point (call `openWriteKudo()` from context). `Button.tsx` → reuse for Cancel/Send.
- **Sub-overlay Specs**: `1002:13013-Dropdown list hashtag` (hashtag multi-select), `1002:12917-Addlink Box` (link insertion modal)
- **API Contracts**: POST body `{ recipient_id, title, content, hashtag_ids[], image_urls[], is_anonymous, anonymous_name? }`

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/520:11602-Viết Kudo/
├── spec.md              # Feature specification
├── design-style.md      # Design tokens & layout
├── plan.md              # This file
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
# New files
src/
├── components/kudos/write-kudo/
│   ├── WriteKudoModal.tsx          # Main modal container + form orchestration
│   ├── WriteKudoProvider.tsx       # React Context provider (open/close state)
│   ├── RecipientSearch.tsx         # Autocomplete recipient field
│   ├── RichTextEditor.tsx          # Tiptap editor + toolbar
│   ├── HashtagPicker.tsx           # Hashtag multi-select (uses Dropdown list hashtag)
│   ├── ImageUpload.tsx             # Image upload thumbnails + add button
│   └── AnonymousToggle.tsx         # Anonymous checkbox + name input
├── services/
│   ├── kudo-write-service.ts       # createKudo(), searchProfiles()
│   └── image-upload-service.ts     # uploadKudoImage() to Supabase Storage
├── hooks/
│   └── use-write-kudo.ts           # Form state reducer + submission logic
└── types/
    └── kudo-write.ts               # WriteKudoForm, RecipientProfile, CreateKudoPayload

# Modified files
src/
├── components/kudos/WriteKudosBar.tsx   # Use WriteKudo context to open modal
├── app/[locale]/layout.tsx              # Wrap with WriteKudoProvider
├── app/globals.css                      # Add missing design tokens
├── app/api/kudos/route.ts               # Add POST handler
└── app/api/profiles/
    └── search/route.ts                  # New route (profile autocomplete)
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | ^2.x | React integration for Tiptap editor |
| `@tiptap/starter-kit` | ^2.x | Bold, italic, strikethrough, ordered list, blockquote |
| `@tiptap/extension-link` | ^2.x | Hyperlink support in editor |
| `@tiptap/extension-mention` | ^2.x | @mention autocomplete in editor |
| `@tiptap/extension-placeholder` | ^2.x | Placeholder text in empty editor |

---

## Implementation Strategy

### Phase 0: Asset Preparation & Setup

- Download toolbar icons from Figma (bold, italic, strikethrough, list, link, quote, search, cancel-×, send) to `public/assets/kudos/icons/`
- Install Tiptap dependencies via Yarn
- Add missing CSS variables to `globals.css` (`--color-modal-bg`, `--color-overlay-mask`, etc.)
- Define TypeScript types in `src/types/kudo-write.ts`

### Phase 1: Global Modal Infrastructure

- Create `WriteKudoProvider` context (open/close state, renders `WriteKudoModal` via Portal)
- Wrap app layout (`src/app/[locale]/layout.tsx`) with `WriteKudoProvider`
- Build `WriteKudoModal` container (overlay mask, modal card, scroll, open/close animation)
- Wire `WriteKudosBar` → call `openWriteKudo()` from context

### Phase 2: Backend Foundation (US1 dependency)

- Create `GET /api/profiles/search?q={name}` route + `searchProfiles()` service (includes all profiles; own profile disabled client-side)
- Create `POST /api/kudos` route + `createKudo()` service (atomic insert: kudo + hashtags + images)
- Create `uploadKudoImage()` service for Supabase Storage upload
- Zod validation schemas for both endpoints

### Phase 3: Core Form UI (US1, US2 — Write & Send Kudo)

- Build `RecipientSearch` as select dropdown with inline search (FR-002, TR-003)
- Build `RichTextEditor` with Tiptap (toolbar + content area) (FR-003)
- Build `HashtagPicker` with multi-select dropdown (FR-004, 1–5 validation)
- Build `useWriteKudo` hook (form state, validation, submission)
- Connect Submit ("Gửi") + Cancel ("Hủy") buttons with form logic (FR-007, FR-008)

### Phase 4: Extended Features (US3, US4 — Images & Anonymous)

- Build `ImageUpload` component (multi-file picker `multiple`, thumbnails, remove, cap at 5 with excess dropped) (FR-005)
- Integrate Supabase Storage upload flow (TR-005) — upload all `File` objects at submit, revoke blob preview URLs after submit/cancel
- Build `AnonymousToggle` (checkbox → show name input, set `is_anonymous`) (FR-006)

### Phase 5: Sub-overlays & Polish

- Integrate `Addlink Box` modal for link insertion toolbar button
- @mention autocomplete in editor content (FR-009)
- Form validation error states (required field indicators, error messages)
- Loading states during submission
- Edge cases: API failure retry, empty search results, navigation-away handling
- Modal open/close animation (opacity + scale, 200ms ease-out)
- Responsive: full-width modal on mobile

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap bundle size | Medium | Medium | Import only needed extensions; tree-shake unused modules. Monitor bundle with `next/bundle-analyzer`. |
| Rich text content sanitization (XSS) | Medium | High | Tiptap outputs structured HTML — sanitize with DOMPurify before rendering in KudoCard. Never use `dangerouslySetInnerHTML` without sanitization. |
| Image upload failures (large files, network) | Medium | Medium | Client-side size check on add: files > 10MB are accepted into list but shown with red error border + "Ảnh vượt quá 10MB" text; submit blocked until removed. Upload happens at submit — if any file fails, entire submit fails; show error message, keep form data intact for retry. |
| Atomic kudo creation (multi-table insert) | Low | High | Use Supabase RPC or transaction pattern. If transaction fails, clean up uploaded images from Storage. |
| @mention UX complexity | Medium | Low | Start with basic @mention (text replacement only, no live suggestions). Enhance in follow-up if needed. |

### Estimated Complexity

- **Frontend**: High (rich text editor, autocomplete, multi-component form, sub-overlays, global modal context)
- **Backend**: Medium (2 API routes, atomic multi-table insert, storage upload)
- **Testing**: Medium (form validation, API contracts, image upload flow)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Form validation → submit flow, modal open/close from different pages, sub-overlay coordination
- [x] **External dependencies**: Supabase Auth (session), Supabase Storage (image upload), Supabase DB (kudo insert)
- [x] **Data layer**: Atomic insert across `kudos` + `kudo_hashtags` + `kudo_images`
- [x] **User workflows**: Write kudo end-to-end, anonymous kudo, image attachment

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form validation, submit flow, recipient autocomplete, modal open/close |
| App ↔ External API | Yes | Profile search, kudo creation, image upload |
| App ↔ Data Layer | Yes | Atomic multi-table insert, RLS enforcement |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Create kudo with recipient + content + 1 hashtag → kudo persisted, modal closes
   - [ ] Create kudo with 5 hashtags + 3 images + anonymous → all data persisted correctly
   - [ ] Recipient dropdown opens on click, search returns matching profiles, loading shown during fetch
   - [ ] Authenticated user's own profile appears in results but is disabled (cursor-not-allowed, cannot be selected)

2. **Error Handling**
   - [ ] Submit with missing required fields → validation errors shown, button disabled
   - [ ] API failure on submit → error message, form state retained
   - [ ] Image upload failure at submit → error message, form state retained for retry

3. **Edge Cases**
   - [ ] Cancel form → no kudo created, modal closes, user stays on current page
   - [ ] Search with no results → "Không tìm thấy đồng nghiệp" message
   - [ ] Anonymous kudo → `sender_id = null`, `anonymous_name` set in DB
   - [ ] Open modal from different pages → consistent behavior

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] Database tables exist (`kudos`, `kudo_hashtags`, `kudo_images`, `profiles`, `hashtags`)
- [x] Supabase Storage `images` bucket configured
- [ ] Rich text editor library installed (Tiptap — Phase 0)
- [ ] `Dropdown list hashtag` spec reviewed (`1002:13013`)
- [ ] `Addlink Box` spec reviewed (`1002:12917`)

### External Dependencies

- Supabase Storage bucket `images` must allow authenticated uploads with public read access
- Tiptap npm packages available and compatible with React 19

---

## Media Assets (from Figma)

| Asset | Node ID | Destination | Purpose |
|-------|---------|-------------|---------|
| Bold icon | `I520:11647;520:9881;186:1420` | `public/assets/kudos/icons/toolbar-bold.svg` | Rich text toolbar |
| Italic icon | `I520:11647;662:11119;186:1420` | `public/assets/kudos/icons/toolbar-italic.svg` | Rich text toolbar |
| Strikethrough icon | `I520:11647;662:11213;186:1420` | `public/assets/kudos/icons/toolbar-strikethrough.svg` | Rich text toolbar |
| Ordered list icon | `I520:11647;662:10376;186:1420` | `public/assets/kudos/icons/toolbar-ordered-list.svg` | Rich text toolbar |
| Link icon | `I520:11647;662:10507;186:1420` | `public/assets/kudos/icons/toolbar-link.svg` | Rich text toolbar |
| Quote icon | `I520:11647;662:10647;186:1420` | `public/assets/kudos/icons/toolbar-quote.svg` | Rich text toolbar |
| Search icon | `I520:11647;662:8911;186:2759` | `public/assets/kudos/icons/search.svg` | Recipient field |
| Add image icon | `I520:11647;662:9133;186:2759` | `public/assets/kudos/icons/add-image.svg` | Image upload |
| Cancel (×) icon | `I520:11647;520:9906;186:2761` | `public/assets/kudos/icons/cancel-x.svg` | Cancel button |
| Send icon | `I520:11647;520:9907;186:1766` | `public/assets/kudos/icons/send.svg` | Send button |
| Remove image icon | `I520:11647;662:9197;662:9287;186:1420` | `public/assets/kudos/icons/remove-image.svg` | Image thumbnail remove |

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The form is a **global modal overlay** — not a route, not page-specific. It can be opened from any screen that provides a trigger button (currently `WriteKudosBar` on Homepage SAA, but architecturally any page can trigger it).
- `WriteKudoProvider` context is mounted at the layout level so the modal is always available regardless of current route.
- After submit or cancel, the modal simply closes — the user stays on whatever page they were on.
- Anonymous kudo: `sender_id = null` in DB — identity hidden at data level, not just UI.
- `title` field (from "Danh hiệu") stores the kudo headline — displayed as the card title. Required, stored in `kudos.title` column (added via migration `20260317000000_add_kudos_title.sql`).
- `content` field stores Tiptap HTML output. Must be sanitized (DOMPurify) when rendering in `KudoCard`.
- @mention is for display/notification only — not stored as a separate entity.
- Modal height (1012px) exceeds typical viewport — must scroll. Use `max-h-[calc(100vh-2rem)]` with `overflow-y-auto`.
- Sub-overlays (Addlink Box, Dropdown list hashtag) render on top of the kudo modal — need z-index layering.
- Existing `WriteKudosBar.tsx` has a `TODO` placeholder for opening the form — will be updated to use context.
- Images are stored as `File` objects in client state with `URL.createObjectURL()` previews until submit. At submit time, `useWriteKudo` uploads all files to Supabase Storage (`uploadKudoImage()`), collects the returned public URLs, then includes them in the `POST /api/kudos` payload. Blob preview URLs are revoked after submit or cancel.

**Version**: 2.6.0
**Last synced**: 2026-03-17
**Last updated**: 2026-03-25

---

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| 2.6.0 | 2026-03-25 | Cosmetic | Requirement change: 10MB image size limit with error state — updated Risk Assessment (error state UX instead of silent rejection) |
| 2.5.0 | 2026-03-25 | Structural | Requirement change: Deferred image upload to submit time — updated API Design, Phase 4, Risk Table, Test Scenarios, Notes |
| 2.4.0 | 2026-03-25 | Structural | Requirement change: Multi-file image selection with cap at 5 — updated Phase 4 ImageUpload description |
| 2.3.0 | 2026-03-17 | Structural | Requirement change: Own profile visible but disabled in results — updated Phase 2 searchProfiles() description, Phase 3 RecipientSearch description, Test Scenarios |
| 2.2.0 | 2026-03-17 | Structural | Requirement change: Exclude current user from recipient search — updated Phase 2 searchProfiles() description, Test Scenarios |
| 2.1.0 | 2026-03-17 | Structural | Requirement change: RecipientSearch changed to select dropdown — updated Summary, Phase 3 RecipientSearch description, Test Scenarios (recipient flow) |
| 2.0.0 | 2026-03-17 | Structural | API Design: added `title` to POST /api/kudos body; API Contracts updated; Notes: added `title` column context and migration reference |
| 1.0.0 | 2026-03-15 | Initial | Initial implementation plan |
