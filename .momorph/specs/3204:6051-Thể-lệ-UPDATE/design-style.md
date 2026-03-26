# Design Style: Thể lệ UPDATE

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=3204:6051
**Extracted At**: 2026-03-18
**Version**: v1.2
**Last updated**: 2026-03-18

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-page-bg` | `#00101A` | 100% | Page/canvas background (existing token) |
| `--color-rules-panel-bg` | `#00070C` | 100% | Panel/drawer background |
| `--color-rules-overlay` | `#00101A` | 80% | Backdrop overlay behind panel |
| `--color-rules-title` | `#FFEA9E` | 100% | Panel title "Thể lệ" and section headings |
| `--color-rules-body` | `#FFFFFF` | 100% | Body text on dark background |
| `--color-rules-section-sub` | `#FFEA9E` | 100% | Sub-section heading "KUDOS QUỐC DÂN" |
| `--color-rules-badge-border` | `#FFEA9E` | 100% | Hero badge pill border |
| `--color-rules-badge-icon-border` | `#FFFFFF` | 100% | Collectible badge icon circle border |
| `--color-rules-btn-close-bg` | `#FFEA9E` | 10% | "Đóng" button background (`rgba(255,234,158,0.10)`) |
| `--color-rules-btn-close-border` | `#998C5F` | 100% | "Đóng" button border |
| `--color-rules-btn-write-bg` | `#FFEA9E` | 100% | "Viết KUDOS" button background |
| `--color-rules-btn-write-text` | `#00101A` | 100% | "Viết KUDOS" button label text |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-rules-title` | Montserrat | 45px | 700 | 52px | 0px |
| `--text-rules-section-heading` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-rules-sub-heading` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-rules-body` | Montserrat | 16px | 700 | 24px | 0.5px |
| `--text-rules-badge-body` | Montserrat | 14px | 700 | 20px | 0.1px |
| `--text-rules-badge-name` | Montserrat | 12px | 700 | 16px | 0.5px |
| `--text-rules-hero-badge-name` | Montserrat | 13–15px | 700 | 18–20px | 0.094–0.106px |
| `--text-rules-btn` | Montserrat | 16px | 700 | 24px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-rules-panel-pt` | 24px | Panel top padding |
| `--spacing-rules-panel-pb` | 40px | Panel bottom padding |
| `--spacing-rules-panel-px` | 40px | Panel left/right padding |
| `--spacing-rules-content-gap` | 24px | Gap between main content sections |
| `--spacing-rules-section-gap` | 16px | Gap within a section (title → body) |
| `--spacing-rules-badge-gap` | 8px | Gap between hero badge icon and label |
| `--spacing-rules-grid-gap` | 16px | Gap between collectible badge columns |
| `--spacing-rules-btn-padding` | 16px | Internal padding for both CTA buttons |
| `--spacing-rules-footer-gap` | 16px | Gap between "Đóng" and "Viết KUDOS" buttons |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-rules-btn` | 4px | Both CTA buttons |
| `--radius-rules-hero-badge` | 55.579px | Hero badge pill border |
| `--radius-rules-collectible-icon` | 100px | Collectible badge icon circle |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-rules-panel` | `0 0 40px rgba(0,0,0,0.5)` | Panel drop shadow (implied from design depth) |

---

## Layout Specifications

### Panel Container

| Property | Value | Notes |
|----------|-------|-------|
| position | fixed | Floats above page content |
| top | 0 | Anchored to viewport top |
| right | 0 | Slides in from right edge |
| width | 553px | Fixed width on desktop |
| height | 100vh | Full viewport height |
| background | `#00070C` | Panel bg |
| padding | 24px 40px 40px 40px | top / sides / bottom |
| display | flex | |
| flex-direction | column | |
| align-items | flex-end | Right-aligned children |
| justify-content | space-between | Content top, buttons bottom |
| gap | 40px | Between content area and footer |
| overflow-y | auto | Scroll if content exceeds height |
| z-index | 60 | Above sticky header (z-50) and FAB (z-40); below modals (z-50 is now below panel) |

### Backdrop Overlay

| Property | Value | Notes |
|----------|-------|-------|
| position | fixed | Covers full viewport |
| inset | 0 | Top/right/bottom/left: 0 |
| background | `rgba(0, 16, 26, 0.8)` | Dark translucent overlay |
| z-index | 59 | Below panel (z-60), above sticky header (z-50) |

### Layout Structure (ASCII)

```
Viewport (1440px wide)
├── Backdrop (fixed, inset-0, z-59, rgba(0,16,26,0.8))
└── Panel (fixed, top-0 right-0, w:553px, h:100vh, bg:#00070C, z-60)
    │  padding: 24px 40px 40px 40px
    │  flex col, align-end, justify-between, gap:40px
    │
    ├── Content area (flex col, gap:24px, overflow-y:auto, flex:1)
    │   │
    │   ├── Title: "Thể lệ"
    │   │   ┌──────────────────────────────────────────┐
    │   │   │  Thể lệ  (Montserrat 700 45px/52px #FFEA9E) │
    │   │   └──────────────────────────────────────────┘
    │   │   (gap: 24px)
    │   │
    │   ├── Section: Người nhận KUDOS (flex col, gap:16px)
    │   │   ├── Heading (Montserrat 700 22px/28px #FFEA9E)
    │   │   │   "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC"
    │   │   ├── Body (Montserrat 700 16px/24px #FFFFFF ls:0.5px)
    │   │   │   "Dựa trên số lượng đồng đội gửi trao Kudos..."
    │   │   │   (gap: 16px between badge rows)
    │   │   ├── Hero row (flex col, gap:4px) × 4:
    │   │   │   ├── Row 1: [Badge pill 109px] + [condition 16px/24px] ← same line
    │   │   │   └── Row 2: [description 14px/20px] ← line below badge+condition
    │   │   │   (New Hero | Rising Hero | Super Hero | Legend Hero)
    │   │   (gap: 24px)
    │   │
    │   ├── Section: Người gửi KUDOS (flex col, gap:16px)
    │   │   ├── Heading (Montserrat 700 22px/28px #FFEA9E)
    │   │   │   "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN"
    │   │   ├── Body (16px/24px #FFFFFF ls:0.5px)
    │   │   │   "Mỗi lời Kudos bạn gửi sẽ được đăng tải..."
    │   │   ├── Badge grid (flex row, justify-between, w:377px)
    │   │   │   Row 1: [REVIVAL] [TOUCH OF LIGHT] [STAY GOLD]
    │   │   │   Row 2: [FLOW TO HORIZON] [BEYOND THE BOUNDARY] [ROOT FURTHER]
    │   │   │   Each cell: w:80px, flex col, center, gap:8px
    │   │   │     Icon: 64×64px circle, border 2px solid #FFF
    │   │   │     Name: Montserrat 700 11-12px, center, #FFFFFF
    │   │   └── Summary "Những Sunner thu thập trọn bộ 6 icon..." (16px/24px #FFFFFF)
    │   │   (gap: 24px)
    │   │
    │   └── Section: Kudos Quốc Dân
    │       ├── Sub-heading "KUDOS QUỐC DÂN" (24px/32px #FFEA9E)
    │       └── Body (16px/24px #FFFFFF ls:0.5px)
    │           "5 Kudos nhận về nhiều ❤️ nhất toàn Sun*..."
    │
    └── Footer: Buttons (flex row, gap:16px, align-end)
        ├── B.1 Đóng: [×icon 24px] [Đóng text]
        │   border 1px #998C5F, bg rgba(255,234,158,0.10), radius:4px, p:16px
        └── B.2 Viết KUDOS: [pen icon 24px] [Viết KUDOS text]
            flex-grow h:56px, bg:#FFEA9E, radius:4px, p:16px
```

---

## Component Style Details

### Panel Container

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6052` | — |
| position | fixed | `position: fixed` |
| top | 0 | `top: 0` |
| right | 0 | `right: 0` |
| width | 553px | `width: 553px` |
| height | 100vh | `height: 100vh` |
| background | `#00070C` | `background-color: var(--color-rules-panel-bg)` |
| padding | 24px 40px 40px | `padding: 24px 40px 40px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-end | `align-items: flex-end` |
| justify-content | space-between | `justify-content: space-between` |
| gap | 40px | `gap: 40px` |
| overflow-y | auto | `overflow-y: auto` |
| z-index | 45 | `z-index: 45` |

---

### Title "Thể lệ"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6055` | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 45px | `font-size: 45px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 52px | `line-height: 52px` |
| color | `#FFEA9E` | `color: var(--color-rules-title)` |
| letter-spacing | 0 | `letter-spacing: 0` |

---

### Section Heading (Người nhận / Người gửi)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `3204:6132`, `3204:6077` | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | `#FFEA9E` | `color: var(--color-rules-title)` |
| letter-spacing | 0 | `letter-spacing: 0` |

---

### Body Text (descriptions)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `3204:6133`, `3204:6078` | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | `#FFFFFF` | `color: var(--color-rules-body)` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| text-align | justified | `text-align: justify` |

---

### Hero Badge Row

Each hero badge row (`content` FRAME) contains:
- A badge pill component (hero name + background image)
- A condition text (e.g., "Có 1-4 người gửi Kudos cho bạn")
- A description text

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `3204:6161`, `3204:6170`, `3204:6179`, `3204:6188` | — |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 4px | `gap: 4px` |

**Hero badge row — Row 1** (BadgePill + Condition, same line):
| Property | Value |
|----------|-------|
| display | flex |
| flex-direction | row |
| align-items | center |
| gap | 16px |

**Hero badge pill** (e.g., MM_MEDIA_New Hero):
| Property | Value |
|----------|-------|
| width | ~109px |
| height | ~19px |
| border | 0.579px solid `#FFEA9E` |
| border-radius | 55.579px |
| text | 13–15px Montserrat Bold, color #FFFFFF |

**Condition text** (e.g., "Có 1-4 người gửi Kudos cho bạn"):
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| color | `#FFFFFF` |
| letter-spacing | 0.5px |

**Description text** (smaller detail):
| Property | Value |
|----------|-------|
| font-size | 14px |
| font-weight | 700 |
| line-height | 20px |
| color | `#FFFFFF` |
| letter-spacing | 0.1px |

---

### Collectible Badge Grid

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6079` | — |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px (between rows) | `gap: 16px` |
| padding | 0 24px | `padding: 0 24px` |

**Each badge cell** (e.g., MM_MEDIA_ Badge REVIVAL):
| Property | Value | CSS |
|----------|-------|-----|
| width | 80px | `width: 80px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |

**Badge icon circle**:
| Property | Value | CSS |
|----------|-------|-----|
| width | 64px | `width: 64px` |
| height | 64px | `height: 64px` |
| border-radius | 100px | `border-radius: 100px` |
| border | 2px solid `#FFFFFF` | `border: 2px solid var(--color-rules-badge-icon-border)` |

**Badge name label**:
| Property | Value | CSS |
|----------|-------|-----|
| width | 80px | `width: 80px` |
| font-family | Montserrat | — |
| font-size | 11–12px | `font-size: 12px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 16px | `line-height: 16px` |
| text-align | center | `text-align: center` |
| color | `#FFFFFF` | `color: var(--color-rules-body)` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |

---

### Sub-heading "KUDOS QUỐC DÂN"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6090` | — |
| font-family | Montserrat | — |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| color | `#FFEA9E` | `color: var(--color-rules-title)` |

---

### Button "Đóng" (B.1)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6093` | — |
| padding | 16px | `padding: 16px` |
| background | `rgba(255, 234, 158, 0.10)` | `background-color: var(--color-rules-btn-close-bg)` |
| border | 1px solid `#998C5F` | `border: 1px solid var(--color-rules-btn-close-border)` |
| border-radius | 4px | `border-radius: var(--radius-rules-btn)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 8px | `gap: 8px` |
| cursor | pointer | `cursor: pointer` |

**Icon**: MM_MEDIA_Close 24×24px (white, component ID `214:3851`)
**Label**: "Đóng" — Montserrat 700 16px/24px, `#FFFFFF`, letter-spacing 0.5px

**States:**
| State | Changes |
|-------|---------|
| Default | bg: `rgba(255,234,158,0.10)`, border: `#998C5F` |
| Hover | bg: `rgba(255,234,158,0.15)`, brightness slightly increased |
| Active | bg: `rgba(255,234,158,0.20)` |
| Focus | outline: 2px solid `#998C5F`, outline-offset: 2px |

---

### Button "Viết KUDOS" (B.2)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3204:6094` | — |
| width | flex-row | `flex-grow: 1` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | `#FFEA9E` | `background-color: var(--color-rules-btn-write-bg)` |
| border | none | `border: none` |
| border-radius | 4px | `border-radius: var(--radius-rules-btn)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 8px | `gap: 8px` |
| cursor | pointer | `cursor: pointer` |

**Icon**: MM_MEDIA_Pen 24×24px (dark `#00101A`, component ID `214:3812`)
**Label**: "Viết KUDOS" — Montserrat 700 16px/24px, `#00101A`, letter-spacing 0.5px

**States:**
| State | Changes |
|-------|---------|
| Default | bg: `#FFEA9E` |
| Hover | shadow: `0 4px 12px rgba(0,0,0,0.15)`, brightness: slightly increased |
| Active | brightness: slightly decreased |
| Focus | outline: 2px solid `#FFEA9E`, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
Backdrop (fixed, inset-0, bg:rgba(0,16,26,0.8), z-59)
Panel (fixed, top-0 right-0, w:553px, h:100vh, bg:#00070C, z-60)
├── flex, flex-col, align-end, justify-between, p:24px_40px_40px, gap:40px
│
├── Content (flex col, gap:24px, overflow-y:auto, flex:1, w:473px)
│   │
│   ├── Title "Thể lệ" (Montserrat 700 45px/52px #FFEA9E)
│   │
│   ├── Section: Người nhận (flex col, gap:16px)
│   │   ├── Heading (22px/28px bold #FFEA9E)
│   │   ├── Body description (16px/24px bold #FFF ls:0.5px)
│   │   ├── Hero row × 4 (flex col, gap:4px, width full)
│   │   │   ├── Row 1 (flex row, items-center, gap:16px):
│   │   │   │   ├── BadgePill (109px, pill border #FFEA9E, text 13-15px #FFF)
│   │   │   │   └── Condition (16px/24px bold #FFF ls:0.5px)
│   │   │   └── Row 2: Description (14px/20px bold #FFF ls:0.1px)
│   │   └── (rows: New Hero | Rising Hero | Super Hero | Legend Hero)
│   │
│   ├── Section: Người gửi (flex col, gap:16px)
│   │   ├── Heading (22px/28px bold #FFEA9E)
│   │   ├── Body description (16px/24px bold #FFF ls:0.5px)
│   │   ├── BadgeGrid (flex col, gap:16px, px:24px)
│   │   │   ├── Row 1 (flex row, justify-between, w:377px)
│   │   │   │   ├── BadgeCell REVIVAL (w:80px, flex col, center, gap:8px)
│   │   │   │   │   ├── Icon (64×64px, circle, border 2px #FFF)
│   │   │   │   │   └── Name (12px/16px bold #FFF center ls:0.5px)
│   │   │   │   ├── BadgeCell TOUCH OF LIGHT
│   │   │   │   └── BadgeCell STAY GOLD
│   │   │   └── Row 2 (same structure)
│   │   │       ├── BadgeCell FLOW TO HORIZON
│   │   │       ├── BadgeCell BEYOND THE BOUNDARY
│   │   │       └── BadgeCell ROOT FURTHER
│   │   └── Summary text (16px/24px bold #FFF ls:0.5px)
│   │
│   └── Section: Kudos Quốc Dân
│       ├── Sub-heading (24px/32px bold #FFEA9E)
│       └── Body (16px/24px bold #FFF ls:0.5px)
│
└── Footer Buttons (flex row, gap:16px, align-end)
    ├── B.1 Đóng (flex, center, p:16px, border #998C5F, bg rgba(255,234,158,0.10), radius:4px)
    │   ├── Icon MM_MEDIA_Close (24×24 white)
    │   └── Label "Đóng" (16px/24px bold #FFF ls:0.5px)
    └── B.2 Viết KUDOS (flex-grow h:56px, bg:#FFEA9E, p:16px, radius:4px)
        ├── Icon MM_MEDIA_Pen (24×24 #00101A)
        └── Label "Viết KUDOS" (16px/24px bold #00101A ls:0.5px)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Panel | `width: 100vw` — takes full screen width |
| Panel padding | Reduce to `16px 20px 20px` |
| Title | Scale down to 32px |
| Section headings | Scale down to 18px |
| Body text | Maintain 16px |
| Badge grid padding | Reduce to `0 8px` |
| Button B.2 "Viết KUDOS" | `width: 100%` — full width |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Panel | `width: 480px` |
| Panel padding | `20px 32px 32px` |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Panel | Full spec — `width: 553px`, padding as designed |

---

## Icon Specifications

| Icon Name | Figma Component ID | Size | Color | Usage |
|-----------|--------------------|------|-------|-------|
| MM_MEDIA_Close | `214:3851` | 24×24px | `#FFFFFF` | "Đóng" button icon |
| MM_MEDIA_Pen | `214:3812` | 24×24px | `#00101A` | "Viết KUDOS" button icon |
| MM_MEDIA_New Hero | `3007:17506` | ~109×19px badge | `#FFFFFF` text | Hero tier badge |
| MM_MEDIA_Rising Hero | `3007:17509` | ~109×19px badge | `#FFFFFF` text | Hero tier badge |
| MM_MEDIA_Super Hero | `3007:17512` | ~109×19px badge | `#FFFFFF` text | Hero tier badge |
| MM_MEDIA_Legend Hero | `3007:17516` | ~109×19px badge | `#FFFFFF` text | Hero tier badge |
| MM_MEDIA_ Badge REVIVAL | `737:20446` | 64×64px circle | — | Collectible badge |
| MM_MEDIA_ Badge TOUCH OF LIGHT | `737:20450` | 64×64px circle | — | Collectible badge |
| MM_MEDIA_ Badge STAY GOLD | `737:20449` | 64×64px circle | — | Collectible badge |
| MM_MEDIA_ Badge FLOW TO HORIZON | `737:20447` | 64×64px circle | — | Collectible badge |
| MM_MEDIA_ Badge BEYOND THE BOUNDARY | `737:20448` | 64×64px circle | — | Collectible badge |
| MM_MEDIA_ Badge ROOT FURTHER | `737:20451` | 64×64px circle | — | Collectible badge |

> All icons are Figma component instances. Implement via `<Image>` from `next/image` (same pattern as project). Download SVG/PNG assets from Figma using `get_media_files`. Do NOT use raw inline `<svg>` or `<img>` tags (constitution §VII).

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Panel | translateX (slide in from right) | 300ms | ease-out | Open |
| Panel | translateX (slide out to right) | 250ms | ease-in | Close |
| Backdrop | opacity 0 → 1 | 300ms | ease-out | Open |
| Backdrop | opacity 1 → 0 | 250ms | ease-in | Close |
| Button Đóng | background-color | 150ms | ease-in-out | Hover/Active |
| Button Viết KUDOS | box-shadow, filter:brightness | 150ms | ease-in-out | Hover/Active |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Backdrop overlay | — | `fixed inset-0 bg-[rgba(0,16,26,0.8)] z-[59]` | `<div onClick={onClose}>` |
| Panel container | `3204:6052` | `fixed top-0 right-0 w-[553px] h-screen bg-[#00070C] flex flex-col z-[60] overflow-y-auto` | `<rulesPanelDrawer>` |
| Content area | `3204:6053` | `flex flex-col gap-6 flex-1 w-full p-[24px_40px_40px]` | `<rulesPanelContent>` |
| Title | `3204:6055` | `font-montserrat font-bold text-[45px] leading-[52px] text-[#FFEA9E]` | inline `<h2>` |
| Section heading | `3204:6132` | `font-montserrat font-bold text-[22px] leading-7 text-[#FFEA9E]` | inline `<h3>` |
| Sub-heading Kudos Quoc Dan | `3204:6090` | `font-montserrat font-bold text-2xl leading-8 text-[#FFEA9E]` | inline `<h3>` |
| Body text | `3204:6133` | `font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px]` | inline `<p>` |
| Hero badge row | `3204:6161` | `flex flex-col gap-1 w-full` | `<HeroBadgeRow>` |
| Hero badge row — Row 1 | `3204:6161` | `flex flex-row items-center gap-4` | inner div (badge + condition) |
| Collectible badge grid | `3204:6079` | `flex flex-col gap-4 px-6` | `<CollectibleBadgeGrid>` |
| Collectible badge cell | `3204:6082` | `flex flex-col items-center gap-2 w-20` | `<CollectibleBadgeCell>` |
| Badge icon circle | (per badge) | `w-16 h-16 rounded-full border-2 border-white overflow-hidden` | `<Image>` |
| Badge name | (per badge) | `font-montserrat font-bold text-[12px] leading-4 text-white text-center tracking-[0.5px]` | inline `<span>` |
| Button "Đóng" | `3204:6093` | `flex items-center gap-2 p-4 border border-[#998C5F] bg-[rgba(255,234,158,0.10)] rounded-[4px]` | `<button onClick={onClose}>` |
| Button "Viết KUDOS" | `3204:6094` | `flex items-center justify-center gap-2 flex-1 h-14 p-4 bg-[#FFEA9E] rounded-[4px]` | `<button onClick={onVietKudos}>` |

---

## Notes

- Panel background `#00070C` is different from the main page bg `#00101A` — do not reuse `--color-page-bg`.
- The panel is a **right-side drawer**, not a centered modal — it slides from the right edge, not from the center.
- The "Đóng" button width is auto-sized (content-width), while "Viết KUDOS" button is flex-grow.
- Hero badge pills are Figma component instances with background images — they should be downloaded and used as `<Image>` components.
- Collectible badge icons have `border-radius: 100px` (fully circular) with a 2px white border — important for visual accuracy.
- Frame image reference: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/3204:6051/ea9a26f893c9c24235ce4cf2aa16d702.png

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.2 | 2026-03-18 | Cosmetic | Requirement change: Raise panel z-index to 60 and backdrop to 59 to cover sticky header (z-50). Updated: Panel Container, Backdrop Overlay, ASCII diagram, Component Hierarchy, Implementation Mapping. |
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: Hero Badge Row — BadgePill+Condition on row 1, Description on row 2 below. Updated: ASCII diagram, Hero Badge Row component details, Implementation Mapping. |
| v1.0 | 2026-03-18 | — | Initial extraction |
