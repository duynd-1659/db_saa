# Sync Report: Sun* Kudos - Live board — SpotlightBoard
**Frame**: `2940:13431`
**Date**: 2026-03-18
**Version**: v1.0 → v2.0 (Structural)
**Focus**: SpotlightBoard (B.7 / node `2940:14174`)

---

## Discrepancies Found & Fixed

| # | Area | Old Doc Value | Figma Value | Fixed |
|---|------|---------------|-------------|-------|
| 1 | Animated star background | Không đề cập | Dark canvas với animated star/constellation network + orange graphic góc trái | ✓ |
| 2 | Search bar position | Không rõ (ngoài canvas) | **Trong canvas**, góc top-left | ✓ |
| 3 | "388 KUDOS" position | Ngoài canvas, căn trái | **Trong canvas**, top-center | ✓ |
| 4 | Bottom-left: 7 recent kudos | Không tồn tại | Live feed 7 kudos mới nhất, format `HH:MMam/pm [Tên] đã nhận được một Kudos mới` | ✓ |
| 5 | Bottom-right zoom controls | "Pan/Zoom toggle" | Icon zoom-in, icon zoom-out, zoom ratio label, fullscreen button | ✓ |
| 6 | Zoom behavior | Toggle pan/zoom mode | Scale toàn bộ map cloud: bg + inter-name spacing | ✓ |
| 7 | Sunner name sizes | Không rõ | Nhỏ, proportional theo kudos count | ✓ |
| 8 | Sunner name animation | Không đề cập | Oscillate trái-phải biên độ nhỏ (CSS @keyframes) | ✓ |
| 9 | Hover popup | Mention chung | Deferred — chưa định nghĩa | ✓ (noted) |

---

## Documents Updated

| Document | Sections Updated | Type |
|----------|-----------------|------|
| design-style.md | B.7 table (9 new rows), ASCII layout diagram, Implementation Mapping, Changelog | Structural |
| spec.md | User Story 8 (7 scenarios), FR-010 expanded + FR-011 added, Screen Components B.7, Visual Requirements, Changelog | Structural |
| plan.md | Phase 5 (T018–T020 updated, T021-SP–T023-SP added), Notes, Version, Changelog | Structural |
| tasks.md | Phase 9 (T043 reopened, T043a/b + T044a/b/c/d added, hover deferred), Version, Changelog | Structural |

---

## Code Impact

| File | What to Change | Priority |
|------|---------------|----------|
| `src/components/kudos/SpotlightBoard.tsx` | Thêm animated star bg, in-canvas layout (search top-left, count top-center, bottom-left feed, bottom-right zoom), name oscillation, zoom map behavior | High |
| `src/services/kudos-service.ts` | Thêm `fetchRecentSpotlightKudos(limit=7)` | High |
| `src/app/api/kudos/spotlight/recent/route.ts` | NEW — `GET /api/kudos/spotlight/recent` | High |

Code update: chưa thực hiện — deferred to `/momorph.implement`.

---

# Sync Report: Sun* Kudos - Live board — All Kudos / Kudo Card
**Frame**: `2940:13431`
**Date**: 2026-03-18
**Version**: v4.0 → v5.0 (Structural)
**Focus**: Section C — All Kudos, kudo card C.3 (node `3127:21871`)

---

## Discrepancies Found & Fixed

### Critical (affects layout/behavior)

| # | Area | Old Doc Value | Figma Value | Fixed |
|---|------|---------------|-------------|-------|
| 1 | Card background | Not specified | `rgba(255,248,225,1)` cream, `rounded-[24px]`, `px-10 pt-10 pb-4` | ✓ |
| 2 | User info layout | Side-by-side (row) | Column-centered, `w-[235px]`, avatar on top + name below | ✓ |
| 3 | Avatar size | Not specified | `64×64px`, `rounded-full`, `border-[1.869px] border-white` | ✓ |
| 4 | Sender/recipient connector | Not specified | Arrow-right SVG icon (`/assets/icons/arrow-right.svg`), `opacity-40` | ✓ |
| 5 | Content area order | Not specified | timestamp → title badge → content box → image gallery → hashtags | ✓ |
| 6 | Content box styling | Not specified | `rounded-[12px] border border-[#FFEA9E] bg-[rgba(255,234,158,0.40)] px-6 py-4` | ✓ |
| 7 | Content text style | Not specified | `text-[20px] font-bold leading-8 line-clamp-5` | ✓ |
| 8 | Title display (D.4) | Not specified | Title text left + pencil icon right (`/assets/icons/pencil.svg`, `32×32px`, `opacity-40`) | ✓ |
| 9 | Image gallery | Not implemented | Up to 5 images, `88×88px`, `rounded-[18px]`, `border border-[#998C5F]` | ✓ |
| 10 | Two separators | Single separator | Dark separator `bg-[rgba(0,16,26,0.1)]` above content + gold `bg-[rgba(255,234,158,1)]` above actions | ✓ |
| 11 | Heart count text | Not specified | `text-2xl font-bold text-[rgba(0,16,26,1)]` | ✓ |
| 12 | Copy Link button | Icon only | Text label "Copy Link" + link icon (24×24px) | ✓ |
| 13 | Action bar hover | `hover:bg-white/10` | `hover:bg-black/5` | ✓ |

### Minor (style/content)

| # | Area | Old Doc Value | Figma Value | Fixed |
|---|------|---------------|-------------|-------|
| 1 | `title` field | Missing from `Kudo` type | Required field in kudos table | ✓ |
| 2 | Timestamp format | Not specified | `HH:MM - MM/DD/YYYY` | ✓ |
| 3 | Action bar layout | Not specified | `flex items-center justify-between` (hearts LEFT, copy RIGHT) | ✓ |
| 4 | Department shown | Department name | `department_id` (ID string) | ✓ (matches current data) |

---

## Documents Updated

| Document | Sections Updated | Type |
|----------|-----------------|------|
| design-style.md | Added C.3 Kudo Card section (full spec), Changelog | Structural |
| spec.md | US1 scenario 2, FR-001, Screen Components C.3 row, Visual Requirements, Changelog | Structural |
| plan.md | T001 (title field), T021 (full KudoCard spec), Changelog | Structural |
| tasks.md | Reopened T024, T028; Added T053, T054; Changelog | Structural |

---

## Code Files Updated

| File | Changes |
|------|---------|
| `src/types/kudos.ts` | Added `title: string` to `Kudo` interface |
| `src/services/kudos-service.ts` | Added `title` to select in `fetchKudosFeed` + `fetchHighlightKudos`; added `title` to mapper |
| `src/components/kudos/KudoCard.tsx` | Full redesign — cream card, column user info, content box, image gallery, two separators |
| `src/components/kudos/KudoCardActions.tsx` | Dark text, Copy Link label + icon, `hover:bg-black/5` |
| `src/components/kudos/KudoImageGallery.tsx` | NEW — renders up to 5 images at 88×88px with gold border |
