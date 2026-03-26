# Design Style: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Version**: v3.1
**Last synced**: 2026-03-26

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v3.1 | 2026-03-26 | Structural | Figma sync: Added Frame 487 (gap 40px), Frame 523 wrapper (gap 16px), B3.1/B3.2 icon specs (MM_MEDIA_Up 24×24, gap 8px). Removed "Coming soon" from ASCII layout. Updated B3 container gap (40px). |
| v3.0 | 2026-03-20 | Structural | Requirement change: Added B3.1 QR Button post-countdown state and Ticket Page visual spec. |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton moved to src/components/ui/ and added to Implementation Mapping. |
| v1.0 | 2026-03-10 | Initial | Initial design style from Figma |

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-page-bg` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Sticky header |
| `--color-cover-gradient` | `linear-gradient(12deg, #00101A 23.7%, rgba(0, 18, 29, 0.46) 38.34%, rgba(0, 19, 32, 0.00) 48.92%)` | Hero cover overlay |
| `--color-gold` | `rgba(255, 234, 158, 1)` | `#FFEA9E` — gold accents, active links |
| `--color-border` | `#998C5F` | Borders, icon buttons |
| `--color-white` | `rgba(255, 255, 255, 1)` | Primary text |
| `--color-copyright` | `rgba(255, 255, 255, 1)` | Footer copyright |
| `--color-awards-section-bg` | Transparent (dark bg shows through) | Awards section |

### Typography

| Element | Font | Size | Weight | Line Height | Color |
|---------|------|------|--------|-------------|-------|
| Page nav links | Montserrat | 16px | 600 | auto | White / Gold (active) |
| Hero title (ROOT FURTHER) | — | — | — | — | Rendered as `<Image>` asset, not text |
| Section subtitle | Montserrat | 14px | 500 | auto | `rgba(255,255,255,0.6)` |
| C1 caption "Sun* annual awards 2025" | Montserrat | 24px | 700 | 32px | `#FFFFFF` |
| C1 title "Hệ thống giải thưởng" | Montserrat | 57px | 700 | 64px | `#FFEA9E` | letter-spacing: -0.25px |
| Body text | Montserrat | 16px | 400 | 1.5 | White |
| Footer copyright | Montserrat Alternates | 16px | 700 | auto | White |
| Award card title | Montserrat | 24px | 400 | 32px | `#FFEA9E` |
| Award card description | Montserrat | 16px | 400 | 24px | `#FFFFFF` | letter-spacing: 0.5px |
| Award card "Chi tiết" | Montserrat | 16px | 500 | 24px | `#FFFFFF` |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-page-x` | `144px` | Horizontal page padding |
| `--spacing-page-y` | `96px` | Vertical section padding |
| `--spacing-section-gap` | `120px` | Gap between major sections |
| `--spacing-header-y` | `12px` | Header vertical padding |
| `--spacing-nav-gap` | `64px` | Navigation items gap |
| `--spacing-award-grid-gap` | `32px` | Award card grid gap |

### Borders

| Element | Border |
|---------|--------|
| Icon button (avatar/lang/bell) | `1px solid #998C5F` |
| Award card image | `1px solid #FFEA9E`, `border-radius: 24px` |
| C1 section divider | `1px solid #2E3940` (between caption and title) |

### Shadows

| Element | Shadow |
|---------|--------|
| Award card image base | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287` |
| Award card image hover | `0 0 16px rgba(255, 234, 158, 0.3)` |

---

## Layout Specifications

### Page Structure (1512×4480px)

```
┌─────────────────────────────────────────── 1512px ──────────────────────────────────────────────┐
│ A1: Header (fixed)                                                                  80px        │
│  [Logo 52×48] [About SAA2025] [Awards Info] [Sun* Kudos]     [Bell] [VI/EN] [Avatar]            │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ B: Keyvisual / Hero Section                                                        1392px        │
│   Background: cover image                                                                        │
│   Cover gradient overlay                                                                         │
│   ┌──── Content (144px padding) ─────────────────────────────────────────────────────────┐      │
│   │  ROOT FURTHER (hero title)                                                            │      │
│   │  ┌── Frame 523 (gap: 16px) ──────────────────────────────────────────────────────┐   │      │
│   │  │  [DAYS] [HOURS] [MINUTES] countdown                                           │   │      │
│   │  │  Thời gian: 18h30  Địa điểm: Nhà hát nghệ thuật quân đội                     │   │      │
│   │  └────────────────────────────────────────────────────────────────────────────────┘   │      │
│   │  [ABOUT AWARDS ↗] [ABOUT KUDOS ↗]  (gap: 40px)                                     │      │
│   └───────────────────────────────────────────────────────────────────────────────────────┘      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ B4: Root Further description (144px padding x)                                      1090px       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ C: Award System Section (1224px content, 120px gap)                                1353px       │
│   C1: Header ("Hệ thống giải thưởng")                                                           │
│   C2: Award List (3-col grid)                                                                    │
│    [Top Talent] [Top Project] [Top Project Leader]                                              │
│    [Best Manager] [Signature 2025-Creator] [MVP]                                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ D: Sun* Kudos promo block (1224px)                                                   500px       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 7: Footer (90px x-padding)                                                           144px       │
│   [Logo] [About SAA 2025] [Awards Information] [Sun* Kudos] [Tiêu chuẩn chung] | © 2025        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A1: Header

| Property | Value |
|----------|-------|
| Node ID | `2167:9091` |
| Dimensions | `1512×80px` |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Layout | `flex, row, gap: 238px` |
| Position | Sticky top |

**Nav links container**: `Frame 488` — `606×56px`, `gap: 64px`
**Right controls**: `Frame 482` — `220×56px`, `gap: 16px`

#### Navigation link states:
| State | Style |
|-------|-------|
| Normal | White text, no bg |
| Hover | Light highlight bg |
| Selected/Active | Gold text + underline |

#### Icon buttons (Bell, Avatar):
- Size: `40×40px`
- Background: `rgba(0, 0, 0, 0)` (transparent)
- Padding: `10px`

### B: Hero / Keyvisual Section

| Property | Value |
|----------|-------|
| Node ID | `2167:9027` |
| Dimensions | `1512×1392px` |
| Background | Cover image + gradient overlay |
| Content padding | `144px` horizontal |

**Hero content container** (`2167:9030`): `1512×4220px` (full content area), `padding: 96px 144px`, `gap: 120px`

**Frame 487** (`2167:9031`): `1224×596px`, `flex column`, `gap: 40px`, `align-items: flex-start` — wraps ROOT FURTHER, Frame 523, B3 buttons

**Frame 523** (`2167:9034`): `1224×256px`, `flex column`, `gap: 16px`, `align-items: flex-start` — wraps `B1_Countdown time` + `B2_Thông tin sự kiện`

**B3_Call-To-Action** (`2167:9062`): `flex row`, `gap: 40px`, `align-items: flex-start`

**B3.1_Button-IC About** (`2167:9063`): `flex row`, `gap: 8px`, `padding: 16px 24px`, `height: 60px`, `border-radius: 8px`, `background: rgba(255,234,158,1)` — text: Montserrat 700 22px `rgba(0,16,26,1)` + `MM_MEDIA_Up` icon 24×24px

**B3.2_Button-IC Kudos** (`2167:9064`): `flex row`, `gap: 8px`, `padding: 16px 24px`, `border: 1px solid #998C5F`, `border-radius: 8px`, `background: rgba(255,234,158,0.10)` — text: Montserrat 700 22px `rgba(255,255,255,1)` + `MM_MEDIA_Up` icon 24×24px

**B3.1: QR Button (post-countdown zero state)**:
- Visible only when countdown has expired (`isExpired === true`)
- Style: identical to "ABOUT AWARDS" — gold fill (`bg-[var(--color-gold)]`), dark text (`text-[#00101A]`), same padding/border-radius
- Label: "Lấy mã QR" (vi) / "Get QR Code" (en)
- Action: navigates to `/ticket`
- Placement: replaces or sits below the CTA buttons row in the hero section

### B4: Root Further Description

| Property | Value |
|----------|-------|
| Node ID | `5001:14827` |
| Dimensions | `1152×1090px` |
| Position | `absolute`, `z-index: 1` |
| Padding | `0 144px` (horizontal) |
| Behavior | Static display only |

**Text children:**

| Node | Font | Size | Weight | Line Height | Align | Color |
|------|------|------|--------|-------------|-------|-------|
| `3204:10156` | Montserrat | 24px | 700 | 32px | justified | `rgba(255,255,255,1)` |
| `3204:10161` | Montserrat | 20px | 700 | 32px | center | `var(--Details-Text-Secondary-1, #FFF)` |
| `3204:10162` | Montserrat | 24px | 700 | 32px | justified | `rgba(255,255,255,1)` |

---

### C: Awards Section

| Property | Value |
|----------|-------|
| Node ID | `2167:9068` |
| Dimensions | `1224×1353px` |
| Layout | `flex column, gap: 80px` |

**C1 Header** (`2167:9069`):
- Caption: `Montserrat 24px 700` — "Sun* annual awards 2025" — color: `#FFFFFF`
- Divider: `1px solid #2E3940` (full width, between caption and title)
- Title: `Montserrat 57px 700 leading-[64px] tracking-[-0.25px]` — "Hệ thống giải thưởng" — color: `#FFEA9E`
- No description paragraph in C1

**C2 Award Cards** (`5005:14974`):
- Grid: 3 columns desktop, 2 columns tablet
- Each card: Image (square, `border 1px #FFEA9E`, `border-radius 24px`, base box-shadow + hover glow), Title (gold), Description (1–2 lines), "Chi tiết" link
- Entire card wrapped in `<Link>` → `/awards-information#{slug}`
- Hover: lift `-translate-y-1` + gold glow shadow

**Award card structure** (per card node `I2167:9075;214:1019`–`214:1023`):
- Image: `award-bg.png` (shared BG) + `award-name-{slug}.png` overlay (centered, intrinsic dimensions)
  - border: `1px solid #FFEA9E`, border-radius: `24px`
  - box-shadow: `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287`
  - hover shadow: `0 0 16px rgba(255,234,158,0.3)`
- Title: Montserrat 400 24px 32px, color `#FFEA9E`
- Description (`card_description`): Montserrat 400 16px 24px, color `#FFFFFF`, letter-spacing 0.5px, line-clamp-2
- "Chi tiết" link: Montserrat 500 16px, color `#FFFFFF`, `<RedirectIcon>` 24×24, gap 4px, py-4

### Ticket Page (`/ticket`)

| Property | Value |
|----------|-------|
| Route | `/ticket` |
| Background | `#000000` (black, full screen) |
| Layout | `flex flex-col items-center justify-center min-h-screen` |
| QR Code size | `240×240px` |
| QR Code fg color | `#FFFFFF` (white) |
| QR Code bg color | `transparent` |
| Label below QR | User display name or employee ID (optional, Montserrat 14px white muted) |

---

### D: Sun* Kudos Promo Block

| Property | Value |
|----------|-------|
| Node ID | `3390:10349` |
| Dimensions | `1224×500px` |
| Background | `#0F0F0F` + `border-radius: 16px` + `kudos-illustration.png` as BG image (right-aligned, cover height) |
| Layout | `flex row`, content left (`ml-[65px]`, `w-[470px]`), KUDOS logo absolutely positioned right |

### 6: Widget Button (FAB)

| Property | Value |
|----------|-------|
| Node ID | `5022:15169` |
| Dimensions | `105×64px` |
| Position | Fixed, bottom-right |
| Background | Gold pill |
| Icons | Pencil icon + SAA icon with "/" separator |

### 7: Footer

| Property | Value |
|----------|-------|
| Node ID | `5001:14800` |
| Width | `1512px` |
| Padding | `40px 90px` |
| Layout | `flex row` |
| Content | Logo + 4 nav links + copyright text |
| Copyright font | Montserrat Alternates 700 16px White |

---

## Responsive Specifications

| Breakpoint | Changes |
|------------|---------|
| Desktop (≥1280px) | 3-column award grid, full layout |
| Tablet (768–1279px) | 2-column award grid, stacked hero |
| Mobile (<768px) | 1-column, all sections stacked |

---

## Implementation Mapping

| Node ID | Component | Tailwind / CSS |
|---------|-----------|----------------|
| `2167:9091` | `<Header />` | `sticky top-0 z-50 bg-[rgba(16,20,23,0.8)]` |
| `2167:9027` | `<HeroSection />` | `relative h-[1392px] bg-cover` |
| `2167:9035` | `<CountdownSection />` | `flex gap-10` |
| — | `<QRButton />` (in CountdownTimer, shown when expired) | `bg-[var(--color-gold)] text-[#00101A]` — same as ABOUT AWARDS |
| — | `<QRCodeDisplay />` (ticket page) | `flex flex-col items-center justify-center min-h-screen bg-black` |
| `2167:9068` | `<AwardsSection />` | `flex flex-col gap-20 px-36` |
| `5005:14974` | `<AwardGrid />` | `grid grid-cols-3 gap-8` |
| `3390:10349` | `<KudosPromo />` | `flex items-center` |
| `5022:15169` | `<WidgetButton />` (shared) | `fixed bottom-8 right-8 z-40` — `src/components/ui/WidgetButton.tsx`, injected by `(main)/layout.tsx` |
| `5001:14800` | `<Footer />` | `flex justify-between px-[90px] py-10` |
