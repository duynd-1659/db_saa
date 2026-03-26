# Design Style: Sun* Kudos - Live board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Version**: v8.4
**Last synced**: 2026-03-26

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v8.4 | 2026-03-26 | Structural | Fix B.1 header spec: subtitle white 24px/700 (not muted), title Montserrat 57px (not Alternates), add sub-element table. Add C.1 All Kudos Header section (same pattern: subtitle + divider + title). |
| v8.3 | 2026-03-26 | Structural | Add B.6 Spotlight Board Header section: subtitle "Sun* Annual Awards 2025" (white 24px/700) + divider (1px rgba(46,57,64)) + title "SPOTLIGHT BOARD" (Montserrat 57px/700/#FFEA9E, ls:-0.25px). Update ASCII layout. |
| v8.2 | 2026-03-26 | Cosmetic | A_KV Kudos: fix title text ("lời cảm ơn" → "và cảm ơn"); add A: KV Kudos section (1152×160px, flex-col, title top/logo bottom); fix A.1 width 1152px → 738px. |
| v8.1 | 2026-03-25 | Cosmetic | Requirement change: Hashtag chips row — single row (flex-nowrap, overflow-hidden), excess chips hidden with trailing "..." indicator. |
| v8.0 | 2026-03-20 | Structural | Requirement change: Highlight Kudos section — (1) filter buttons show selected option name when active; (2) "Xoá bộ lọc" clear button after filter chips; (3) Highlight card content line-clamp-3; (4) carousel min-height during loading. |
| v7.3 | 2026-03-19 | Cosmetic | Requirement change: (1) Canvas height 548→688px; (2) SpotlightRecentFeed fixed 330×136px + overflow-hidden; (3) feed text: only recipient name bold, no fade. |
| v7.2 | 2026-03-19 | Cosmetic | Requirement change: B.7 Spotlight canvas width changed from fixed 1157px to fluid 100% (fills container). Height remains 548px fixed. |
| v7.1 | 2026-03-19 | Cosmetic | Requirement change: Row 3 clarifications — department shows name (not ID); dot separator is text-sm; hero badge image fixed 109×19px. |
| v7.0 | 2026-03-19 | Structural | Requirement change: C.3 sender/recipient column — explicit 3-row layout (avatar / name / dept+dot+hero badge image); anonymous sender shows no row 3, "Người dùng ẩn danh / Anonymous User" gray text instead. |
| v6.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added to Implementation Mapping table. |
| v5.0 | 2026-03-18 | Structural | Figma sync: All Kudos kudo card (C.3). Added full C.3 Kudo Card spec (cream bg, 24px radius, column user-info, title badge, content box, image gallery, separators, action bar). Updated Implementation Mapping. |
| v4.0 | 2026-03-18 | Structural | Requirement change: (1) cursor pointer cho write bar; (2) post-submit refresh AllKudosFeed + SpotlightBoard + sidebar stats. Updated: A.1 Write Kudos Input Bar. |
| v3.2 | 2026-03-18 | Cosmetic | Requirement change: tăng zoom max từ 200% (2.0) lên 500% (5.0). |
| v3.1 | 2026-03-18 | Cosmetic | Sunner name animation: thay translateX left-right bằng float 2D (translate XY + rotate) `ease-in-out infinite`. |
| v3.0 | 2026-03-18 | Structural | SpotlightBoard (B.7): thêm background image (image 25, spotlight-bg.png, blend-mode screen); sửa zoom min=100% step=50%; sửa frame border-radius 47px; sửa search bar (pill, bg rgba(255,234,158,0.10), thêm result count); sửa tên sunner 9px/400/active #ff6b35; sửa stars thành fixed layer (trắng, đường nối đậm hơn); thêm drag-to-pan khi zoom>100%. |
| v2.0 | 2026-03-18 | Structural | SpotlightBoard (B.7): thêm animated star background, search bar trong canvas top-left, "388 KUDOS" trong canvas top-center, bottom-left recent kudos feed (7 items), bottom-right zoom controls (in/out/ratio/fullscreen), sunner name oscillation animation, zoom map behavior. Cập nhật ASCII layout diagram và implementation mapping. |
| v1.0 | 2026-03-10 | Initial | Initial design style from Figma |

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-page-bg` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Sticky header |
| `--color-cover-gradient` | `linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)` | Keyvisual overlay |
| `--color-gold` | `rgba(255, 234, 158, 1)` | `#FFEA9E` — titles, active links, CTA |
| `--color-border` | `#998C5F` | Borders, Spotlight frame border |
| `--color-white` | `rgba(255, 255, 255, 1)` | Text |
| `--color-heart-inactive` | `rgba(153, 153, 153, 1)` | Heart icon unclicked |
| `--color-heart-active` | `#FF4D4D` | Heart icon clicked |

### Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section subtitle | Montserrat | 14px | 500 | Muted white |
| Section heading | Montserrat Alternates | 36–48px | 700 | `#FFEA9E` |
| Kudo card sender/recipient name | Montserrat | 16px | 700 | White |
| Kudo card dept/star info | Montserrat | 12px | 400 | Muted white |
| Kudo card content | Montserrat | 15px | 400 | White (5 lines max) |
| Kudo card time | Montserrat | 12px | 400 | Muted white |
| Hashtag chip | Montserrat | 13px | 500 | `#D4271D` |
| Heart count | Montserrat | 14px | 700 | White |
| Stat label | Montserrat | 14px | 400 | Muted |
| Stat value | Montserrat | 24px | 700 | `#FFEA9E` |
| Spotlight KUDOS count | Montserrat Alternates | 28px | 700 | White |
| Copyright | Montserrat Alternates | 16px | 700 | White |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-page-x` | `144px` | Horizontal padding for content sections |
| `--spacing-page-y` | `96px` | Top padding |
| `--spacing-section-gap` | `120px` | Between major sections |
| `--spacing-content-gap` | `64px` | Within sections (hero area) |
| `--spacing-header-y` | `12px` | Header vertical padding |

### Borders & Effects

| Element | Style |
|---------|-------|
| Avatar button | `1px solid #998C5F` |
| Spotlight frame | `1px solid #998C5F` |
| Kudo card | Subtle gold border on hover |
| Filter dropdown | `#998C5F` border |

---

## Layout Specifications

### Page Structure (1440×5862px)

```
┌──────────────────────────────── 1440px ──────────────────────────────────┐
│ Header (sticky)                                              80px         │
│  [Logo] [About SAA] [Awards Info] [Sun* Kudos*]                         │
│                               [Bell][VI/EN][Avatar]                      │
├──────────────────────────────────────────────────────────────────────────┤
│ A: Keyvisual                                                 512px        │
│   BG cover image + gradient                                              │
│   A_KV Kudos (1152×160px, flex-col, gap 10px):                          │
│     ┌ Title: "Hệ thống ghi nhận và cảm ơn" (44px) ─────────────────┐   │
│     └ Logo: SAA2025 image + "KUDOS" text (104px) ──────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  A.1: "Write kudos" input bar (pill shape, full-width)           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│ B: Highlight Kudos                                           786px        │
│   B.1: Header — "HIGHLIGHT KUDOS" + [Hashtag ▾] [Phòng ban ▾]          │
│   B.2: Carousel (5 Kudo cards, nav prev/next, "2/5" indicator)          │
├──────────────────────────────────────────────────────────────────────────┤
│ B.6+B.7: Spotlight Board Section                             791px        │
│   B.6: Header (129px)                                                    │
│     "Sun* Annual Awards 2025" (white, 24px/700)                         │
│     ──────────────── divider 1px rgba(46,57,64) ───────────────────     │
│     "SPOTLIGHT BOARD" (gold, 57px/700, lh:64px, ls:-0.25px)            │
│   B.7: Spotlight canvas (full-width × 688px, #998C5F border)            │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │ [🔍 Tìm kiếm        ]        388 KUDOS          [star bg anim]  │   │
│   │  · names oscillate ·  · · names · · names · · names · ·         │   │
│   │ · · Nguyễn Hoàng Linh · · Nguyễn Bá Chức · · · ·               │   │
│   │  · · · · names · · · · · · · · · · · · · · ·                    │   │
│   │ [08:30PM Nguyễn Bá Chức đã nhận...]   [🔍-][🔍+] 100% [⛶]    │   │
│   └──────────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│ C: All Kudos                                                3237px        │
│   C.1: Header — "ALL KUDOS"                                              │
│   ┌─ Feed (flex row) ──────────────────┬─── D: Sidebar ───────────────┐ │
│   │  C.2: Kudo post cards (feed)       │  D.1: Stats + "Mở quà" btn  │ │
│   │  - C.3, C.5, C.6, C.7...          │  D.3: 10 Sunner nhận quà    │ │
│   └───────────────────────────────────┴─────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────┤
│ Footer (padding: 40px 90px)                                  144px        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header

| Property | Value |
|----------|-------|
| Node ID | `2940:13433` |
| Dimensions | `1440×80px` |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Nav gap | `64px` |
| Controls gap | `16px` |

Active link: "Sun* Kudos" — gold + underline

### A: KV Kudos

| Property | Value |
|----------|-------|
| Node ID | `2940:13437` |
| Dimensions | `1152×160px` |
| Layout | `flex column`, `gap: 10px` |
| Parent padding | `0px 144px` (Frame 487, 1440px wide) |

**Row 1 — Title** (`2940:13439`):
- Text: `"Hệ thống ghi nhận và cảm ơn"`
- Font: Montserrat `36px / 700`, color `#FFEA9E` (gold), `lineHeight: 44px`
- Dimensions: `559×44px`

**Row 2 — Logo group** (`2940:13440` `MM_MEDIA_Kudos logo`):
- Dimensions: `593×104px`
- Contains: SAA2025 image (`2940:13442`, `120×94px`) + "KUDOS" text (`2940:13441`)
  - "KUDOS" text: SVN-Gotham `139.78px / 400`, color `rgba(219, 209, 193, 1)`, `lineHeight: 34.95px`, `letterSpacing: -13%`

### A.1: Write Kudos Input Bar

| Property | Value |
|----------|-------|
| Node ID | `2940:13449` |
| Shape | Pill (border-radius ~28px) |
| Width | `738px` (shares row with A.2 Tìm kiếm sunner) |
| Placeholder | "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?" |
| Left icon | Pencil icon |
| Cursor | `pointer` (tương đương button) |
| Behavior | Click → Open Viết Kudo form |

### B: Highlight Kudos

| Property | Value |
|----------|-------|
| Node ID | `2940:13451` |
| Dimensions | `1440×786px` |
| Layout | `flex column, gap: 40px` |

**B.1 Header** (`2940:13452`, `1440×129px`, `flex column gap:16px padding:0 144px`):

| Sub-element | Node | Style |
|-------------|------|-------|
| Subtitle | `2940:13454` | `"Sun* Annual Awards 2025"` — Montserrat `24px / 700`, color white, `lineHeight: 32px` |
| Divider | `2940:13455` | `1152×1px`, `background: rgba(46, 57, 64, 1)` |
| Title row | `2940:13456` | `flex row`, `gap: 32px`, `height: 64px`, `align-items: center`, `justify-content: space-between` |
| Title text | `2940:13457` | `"HIGHLIGHT KUDOS"` — Montserrat `57px / 700`, color `#FFEA9E`, `lineHeight: 64px`, `letterSpacing: -0.25px` |
| Filter buttons | `2940:13458` | `flex row`, `gap: 8px` — [Hashtag ▾] [Phòng ban ▾] |

- Filters: [Hashtag dropdown] [Phòng ban dropdown] [Xoá bộ lọc] — same button style as Homepage filter chips
  - **Default state**: label = "Hashtag" / "Phòng ban"
  - **Active/selected state**: label changes to the selected option's display name (e.g. `#celebrate`, `Engineering`)
  - **"Xoá bộ lọc" button**: appears only when ≥1 filter is active; clicking clears all filters and resets button labels to defaults; style: text button (no fill), muted color, positioned immediately after the two filter buttons

**B.2 Carousel** (`2940:13461`):
- 5 cards, horizontal carousel
- Nav buttons: circle chevron left/right (disabled on first/last)
- Page indicator: "2/5" text
- **Loading state**: carousel container MUST declare a fixed `min-height` matching the loaded carousel height so that the section does not collapse/shift while filter-triggered data is being fetched

### C.1: All Kudos Header

| Property | Value |
|----------|-------|
| Node ID | `2940:14221` |
| Dimensions | `1440×129px` |
| Layout | `flex column`, `gap: 16px`, `padding: 0px 144px` |

| Sub-element | Node | Style |
|-------------|------|-------|
| Subtitle | `2940:14222` | `"Sun* Annual Awards 2025"` — Montserrat `24px / 700`, color white, `lineHeight: 32px` |
| Divider | `2940:14223` | `1152×1px`, `background: rgba(46, 57, 64, 1)` |
| Title row | `2940:14224` | `flex row`, `gap: 32px`, `height: 64px`, `align-items: center` |
| Title text | `2940:14225` | `"ALL KUDOS"` — Montserrat `57px / 700`, color `#FFEA9E`, `lineHeight: 64px`, `letterSpacing: -0.25px` |

### C.3: Kudo Card — All Kudos feed (node `3127:21871`)

| Property | Value |
|----------|-------|
| Node ID | `3127:21871` |
| Width | `680px` |
| Background | `rgba(255, 248, 225, 1)` — cream warm |
| Border-radius | `24px` |
| Padding | `40px 40px 16px 40px` |
| Layout | `flex column`, `gap: 16px` |

**Info user row** (sender ↔ recipient):
- Layout: `flex row`, `justify-content: space-between`, `gap: 24px`, width `600px`
- Each side (sender / recipient): `flex column`, `align-items: center`, width `235px`
  - Row 1 — Avatar: `64×64px`, `border: 1.869px solid #FFF`, `border-radius: 64px`
  - Row 2 — Name: Montserrat `16px / 700`, color `rgba(0, 16, 26, 1)` (dark navy), `text-align: center`
  - Row 3 — dept + badge: department **name** text `12px / 400 / gray rgba(153,153,153,1)` + gray dot separator `·` (`text-sm`) + hero badge `<Image>` `109×19px` fixed (from `profiles.hero_badge`, tier image asset)
  - **Anonymous sender exception**: omit Row 3; render `"Người dùng ẩn danh / Anonymous User"` — `text-sm`, color `rgba(153,153,153,1)` gray, `text-align: center`
- Center: sent icon

**Rectangle 14** (divider): `width: 600px, height: 1px` between info and content

**Content frame** (`256:5645`): `flex column`, `gap: 16px`, width `600px`
- **Timestamp** (C.3.4): `16px / 700 / Montserrat`, color `rgba(153, 153, 153, 1)` gray, format `"HH:MM - MM/DD/YYYY"`
- **Title badge (D.4)**: `flex row`, height `32px`. Title text `16px/700/rgba(0,16,26,1)`. Pencil icon (`MM_MEDIA_Pen`) `32×32px` right-aligned
- **Content box** (Frame 425): `border: 1px solid #FFEA9E`, `background: rgba(255, 234, 158, 0.40)`, `border-radius: 12px`, `padding: 16px 24px`
  - Content text (C.3.5): `20px / 700 / Montserrat`, color `rgba(0, 16, 26, 1)`, justified, max 5 lines + ellipsis
- **Image gallery** (C.3.6): `flex row`, `gap: 16px`, up to 5 images
  - Each image: `88×88px`, `border: 1px solid #998C5F`, `border-radius: 18px`
- **Hashtag chips** (C.3.7): single row — `flex flex-nowrap overflow-hidden`, `#D4271D` text; if chips overflow 1 line, hide excess and append a `...` indicator at the end of the row

**Rectangle 15** (divider): `width: 600px, height: 1px, background: rgba(255, 234, 158, 1)` (gold)

**Action bar** (C.4): `flex row`, `justify-content: space-between`, `gap: 24px`, height `56px`
- Hearts (C.4.1) LEFT: count `24px/700/rgba(0,16,26,1)` + heart icon
- Copy Link (C.4.2) RIGHT: text "Copy Link" `16px/700/rgba(0,16,26,1)` + link icon `24×24px`

### Kudo Card (Highlight, node `2940:13465`)

| Property | Value |
|----------|-------|
| Layout | Sender info → Send icon → Recipient info |
| Sender/Recipient | Avatar (circle, Gmail photo) + Name (700) + Dept + Stars |
| Content area | Time label + content text + hashtag chips + action bar |
| Content text | `line-clamp-3` — max 3 lines visible; if content > 3 lines: show 2 full lines + `...` truncation on 3rd line; fixed height equivalent to 3 lines for consistent card sizing in carousel |
| Hashtag chips | single row, `flex flex-nowrap overflow-hidden`, `#D4271D` text; excess chips hidden, trailing `...` shown |
| Heart button | Gray (inactive) / Red (active) + count |
| Copy link | Icon button |

### B.6: Spotlight Board Header

| Property | Value |
|----------|-------|
| Node ID | `2940:13476` |
| Dimensions | `1440×129px` |
| Layout | `flex column`, `gap: 16px`, `padding: 0px 144px` |

| Sub-element | Node | Style |
|-------------|------|-------|
| Subtitle | `2940:13477` | `"Sun* Annual Awards 2025"` — Montserrat `24px / 700`, color white, `lineHeight: 32px` |
| Divider | `2940:13478` | `1152×1px`, `background: rgba(46, 57, 64, 1)` |
| Title row | `2940:13479` | `flex row`, `gap: 32px`, `height: 64px`, `align-items: center` |
| Title text | `2940:13480` | `"SPOTLIGHT BOARD"` — Montserrat `57px / 700`, color `#FFEA9E`, `lineHeight: 64px`, `letterSpacing: -0.25px` |

### B.7: Spotlight Canvas

| Property | Value |
|----------|-------|
| Node ID | `2940:14174` |
| Width | `100%` (fluid — fills parent container, no fixed pixel width) |
| Height | `688px` (fixed) |
| Border | `1px solid #998C5F` |
| Border-radius | `47px` (Figma: `47.14px`) |
| Background color | `#00101A` |
| Background image | `public/assets/kudos/images/spotlight-bg.png` (image 25, node `2940:14181`), inside zoom+pan layer, `object-fit: cover`, `mix-blend-mode: screen` |
| Star layer | **Fixed** (không bị zoom, không bị pan) — separate layer OUTSIDE zoom+pan div. Canvas `requestAnimationFrame`, star color **white** `rgba(255,255,255,opacity)`, connecting lines **increased opacity** |
| Zoom+pan layer | Contains: background image + word cloud names. Scaled with `transform: translate(panX, panY) scale(zoom)` |
| Zoom constraints | Min: **100%** (`1.0`). Max: **500%** (`5.0`). Step: **±50%** (`0.5`) per click. No zoom-out below 100% |
| Drag-to-pan | Only when zoom > 1.0. Cursor: `grab` on hover, `grabbing` while dragging. Drag moves names + bg image. Stars always fixed |
| "388 KUDOS" count | **Trong canvas**, top-center (absolute, not scaled/panned), Montserrat 36px 700 white |
| Search bar | **Trong canvas**, góc **top-left** (absolute, not scaled/panned). Shape: pill `rounded-full`. Border: `0.682px solid #998C5F`. Background: `rgba(255, 234, 158, 0.10)`. Padding: `~10px 11px`. Icon kính lúp left. Placeholder "Tìm kiếm". Result count right: `"N kết quả"` (text-xs font-semibold text-white, hidden when query empty) |
| Sunner names | Font: **9px fixed**, weight **400** (`font-normal`). Default color: `rgba(255,255,255,opacity)` proportional to count. Search-active (highlighted) color: **`#ff6b35`**. CSS `@keyframes spotlight-oscillate` — float 2D (translate XY + rotate nhẹ, 10 bước, `ease-in-out infinite`) cho hiệu ứng trôi nổi tự nhiên |
| Bottom-left panel | Live feed 7 kudos mới nhất: `HH:MMam/pm [Tên] đã nhận được một Kudos mới`. **Chỉ tên recipient in đậm (bold)**; không fade các entry cũ. Fixed size: `330×136px`, `overflow: hidden` — ngăn đè lên `SpotlightWordCloud` khi zoom |
| Bottom-right controls | Icon zoom-in (+), icon zoom-out (–), tỉ lệ zoom (e.g. `100%`), button fullscreen (↗) |
| Hover on name | Hiển thị popup — **defer, chưa định nghĩa** |

### D: Sidebar Stats

| Property | Value |
|----------|-------|
| Node ID | `2940:13488` |
| Layout | Vertical stat list |
| Stats shown | Kudos nhận, Kudos gửi, Tim nhận, Secret Box đã mở, Secret Box chưa mở |
| Stat value style | Montserrat 700 24px `#FFEA9E` |

**"Mở quà" button** (`2940:13497`):
- Gold fill button
- Click → Open Secret Box modal

**D.3 — 10 Sunner nhận quà** (`2940:13510`):
- Header "10 SUNNER NHẬN QUÀ MỚI NHẤT"
- List: avatar (circle) + name + prize description
- Click name/avatar → open profile

---

## Responsive Specifications

| Breakpoint | Changes |
|------------|---------|
| Desktop (≥1280px) | Side-by-side feed + sidebar |
| Tablet (768–1279px) | Sidebar moves below feed |
| Mobile (<768px) | Single column, carousel scrolls horizontally |

---

## Implementation Mapping

| Node ID | Component | Tailwind / CSS |
|---------|-----------|----------------|
| `2940:13433` | `<Header />` | `sticky top-0 bg-[rgba(16,20,23,0.8)]` |
| `2940:13432` | `<KudosKeyvisual />` | `relative h-[512px]` |
| `2940:13449` | `<WriteKudosBar />` | `rounded-full flex items-center` |
| `2940:13451` | `<HighlightKudos />` | `flex flex-col gap-10` |
| `2940:13461` | `<KudosCarousel />` | `overflow-hidden relative` |
| `2940:14174` | `<SpotlightBoard />` | `border border-[#998C5F] rounded-[47px] relative overflow-hidden` — Layer 1 (fixed): `<SpotlightStarBackground />` (not zoomed/panned). Layer 2 (zoom+pan): spotlight-bg.png (blend-mode screen) + `<SpotlightWordCloud />`. UI controls fixed (not scaled): search pill top-left, count top-center, feed bottom-left, zoom controls bottom-right |
| `2940:13475` | `<AllKudosFeed />` | `flex gap-20 px-36` |
| `3127:21871` | `<KudoCard />` | `bg-[rgba(255,248,225,1)] rounded-[24px] p-[40px_40px_16px_40px] flex flex-col gap-4` |
| `2940:13488` | `<KudosSidebar />` | `w-[280px] flex flex-col gap-4` |
| `2940:13497` | `<OpenSecretBoxButton />` | `bg-[#FFEA9E] rounded-lg` |
| `2940:13522` | `<Footer />` | `flex justify-between px-[90px] py-10` |
| — | `<WidgetButton />` (shared) | `fixed bottom-8 right-8 z-40` — `src/components/ui/WidgetButton.tsx`, injected by `(main)/layout.tsx` |
