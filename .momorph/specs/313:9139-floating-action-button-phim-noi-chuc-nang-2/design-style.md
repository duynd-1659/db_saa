# Design Style: Floating Action Button - phim nổi chức năng 2

**Frame ID**: `313:9139`
**Frame Name**: `Floating Action Button - phim nổi chức năng 2`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=313:9139
**Extracted At**: 2026-03-18
**Version**: v1.1
**Last updated**: 2026-03-18

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-page-bg` | `#00101A` | 100% | Page/canvas background |
| `--color-fab-action-bg` | `#FFEA9E` | 100% | "Thể lệ" and "Viết KUDOS" button backgrounds |
| `--color-fab-cancel-bg` | `#D4271D` | 100% | Cancel/Huỷ circular button background |
| `--color-fab-label` | `#00101A` | 100% | Button label text on yellow buttons |
| `--color-fab-icon-cancel` | `#FFFFFF` | 100% | Close icon color on red cancel button (implied white) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-fab-label` | Montserrat | 24px | 700 | 32px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-fab-padding` | 16px | Internal padding for all FAB action buttons |
| `--spacing-fab-gap` | 8px | Gap between icon and label inside buttons |
| `--spacing-fab-stack-gap` | 20px | Vertical gap between stacked buttons in the widget |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-fab-action` | 4px | Border radius for rectangular action buttons (A, B) |
| `--radius-fab-cancel` | 100px | Border radius for circular cancel button (C) |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-fab-hover` | `0 4px 12px rgba(0,0,0,0.15)` | Hover state shadow increase on action buttons |

---

## Layout Specifications

### Widget Container

| Property | Value | Notes |
|----------|-------|-------|
| position | fixed | Floats over page content |
| bottom | 32px | Distance from viewport bottom |
| right | 32px | Distance from viewport right edge |
| min-width | 214px | |
| height | 224px | Fixed height |
| display | flex | |
| flex-direction | column | Stack buttons vertically |
| align-items | flex-end | Right-align buttons of different widths |
| gap | 20px | Space between stacked buttons |

### Layout Structure (ASCII)

```
Viewport (1440px wide)
└── FAB Widget (fixed, bottom-right, 214×224px, flex col, align-end, gap:20px)
    │
    ├── A — Button thể lệ (149×64px, align-self: flex-end)
    │   ┌──────────────────────────────────┐
    │   │  [IC icon 24×24]  Thể lệ         │  padding: 16px
    │   │  ← gap: 8px →                   │  bg: #FFEA9E, radius: 4px
    │   └──────────────────────────────────┘
    │   (gap: 20px)
    ├── B — Button viết kudos (214×64px, full width)
    │   ┌──────────────────────────────────────────────┐
    │   │  [Pen icon 24×24]  Viết KUDOS               │  padding: 16px
    │   │  ← gap: 8px →                               │  bg: #FFEA9E, radius: 4px
    │   └──────────────────────────────────────────────┘
    │   (gap: 20px)
    └── C — Button huỷ (56×56px, align-self: flex-end)
        ┌──────────┐
        │  [× 24×24]│  padding: 16px, bg: #D4271D, radius: 100px
        └──────────┘
```

---

## Component Style Details

### A — Button thể lệ

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:9140;214:3799` | — |
| width | 149px | `width: 149px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| background | `#FFEA9E` | `background-color: var(--color-fab-action-bg)` |
| border | none | `border: none` |
| border-radius | 4px | `border-radius: var(--radius-fab-action)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: var(--spacing-fab-gap)` |
| cursor | pointer | `cursor: pointer` |

**Inner content (Frame 483 — Node `I313:9140;214:3799;186:1935`):**

| Property | Value |
|----------|-------|
| width | 108px |
| height | 32px |
| display | flex, row, gap 8px, items-center |

**Icon — MM_MEDIA_LOGO (Node `I313:9140;214:3799;186:1763`):**

| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |
| component set | `178:1020` |

**Label — "Thể lệ" (Node `I313:9140;214:3799;186:1568`):**

| Property | Value | CSS |
|----------|-------|-----|
| width | 76px | `width: 76px` |
| height | 32px | `height: 32px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| text-align | center | `text-align: center` |
| color | `#00101A` | `color: var(--color-fab-label)` |
| letter-spacing | 0px | `letter-spacing: 0` |

**States:**

| State | Changes |
|-------|---------|
| Default | background: `#FFEA9E` |
| Hover | box-shadow: `0 4px 12px rgba(0,0,0,0.15)`, brightness: slightly increased |
| Active | brightness: slightly decreased |
| Focus | outline: 2px solid `#FFEA9E`, outline-offset: 2px |

---

### B — Button viết kudos

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:9140;214:3732` | — |
| width | 214px | `width: 214px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| background | `#FFEA9E` | `background-color: var(--color-fab-action-bg)` |
| border | none | `border: none` |
| border-radius | 4px | `border-radius: var(--radius-fab-action)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: var(--spacing-fab-gap)` |
| cursor | pointer | `cursor: pointer` |

**Inner content (Frame 483 — Node `I313:9140;214:3732;186:1935`):**

| Property | Value |
|----------|-------|
| width | 182px |
| height | 32px |
| display | flex, row, gap 8px, items-center |

**Icon — MM_MEDIA_Pen (Node `I313:9140;214:3732;186:1763`):**

| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |
| component ID | `214:3812` |
| component set | `178:1020` |

**Label — "Viết KUDOS" (Node `I313:9140;214:3732;186:1568`):**

| Property | Value | CSS |
|----------|-------|-----|
| width | 150px | `width: 150px` |
| height | 32px | `height: 32px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| text-align | center | `text-align: center` |
| color | `#00101A` | `color: var(--color-fab-label)` |
| letter-spacing | 0px | `letter-spacing: 0` |

**States:**

| State | Changes |
|-------|---------|
| Default | background: `#FFEA9E`, box-shadow: none |
| Hover | box-shadow: `0 4px 12px rgba(0,0,0,0.15)`, brightness: slightly increased |
| Active | brightness: slightly decreased |
| Focus | outline: 2px solid `#FFEA9E`, outline-offset: 2px |

---

### C — Button huỷ

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:9140;214:3827` | — |
| width | 56px | `width: 56px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | `#D4271D` | `background-color: var(--color-fab-cancel-bg)` |
| border | none | `border: none` |
| border-radius | 100px | `border-radius: var(--radius-fab-cancel)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| cursor | pointer | `cursor: pointer` |

**Icon — MM_MEDIA_Close (Node `I313:9140;214:3827;186:1766`):**

| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |
| component ID | `214:3851` |
| component set | `178:1020` |
| color | White (implied from design) |

**States:**

| State | Changes |
|-------|---------|
| Default | background: `#D4271D` |
| Hover | background: `#B91C1C` (darker red) |
| Active | background: `#991B1B` |
| Focus | outline: 2px solid `#D4271D`, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
FAB Widget (position: fixed, bottom-right, w:214px, h:224px)
├── flex, flex-col, align-items:flex-end, gap:20px
│
├── A — ButtonRules (w:149px, h:64px, bg:#FFEA9E, radius:4px, p:16px)
│   └── InnerRow (flex, row, gap:8px, items-center, w:108px, h:32px)
│       ├── Icon MM_MEDIA_LOGO (w:24px, h:24px)
│       └── Text "Thể lệ" (Montserrat 700 24px/32px, color:#00101A)
│
├── B — ButtonVietKudos (w:214px, h:64px, bg:#FFEA9E, radius:4px, p:16px)
│   └── InnerRow (flex, row, gap:8px, items-center, w:182px, h:32px)
│       ├── Icon MM_MEDIA_Pen (w:24px, h:24px)
│       └── Text "Viết KUDOS" (Montserrat 700 24px/32px, color:#00101A)
│
└── C — ButtonHuy (w:56px, h:56px, bg:#D4271D, radius:100px, p:16px)
    └── Icon MM_MEDIA_Close (w:24px, h:24px, color:white)
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
| Widget container | Scale down; maintain fixed positioning; reduce right/bottom offset to ~16px |
| Button thể lệ | Scale proportionally or reduce font-size to 18px |
| Button viết kudos | Scale proportionally or reduce font-size to 18px |
| Button huỷ | Maintain 56×56px (already meets 44px touch target) |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Widget container | Full size design; bottom/right offsets may be ~24px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Widget container | right: 32px, bottom: 32px |

---

## Icon Specifications

| Icon Name | Figma Component ID | Size | Color | Usage |
|-----------|--------------------|------|-------|-------|
| MM_MEDIA_LOGO | `214:3752` | 24×24px | `#00101A` | Thể lệ button left icon |
| MM_MEDIA_Pen | `214:3812` | 24×24px | `#00101A` | Viết KUDOS button left icon |
| MM_MEDIA_Close | `214:3851` | 24×24px | `#FFFFFF` | Huỷ cancel button icon |

> All icons are instances from component set `178:1020`. Must be implemented as `<Icon>` components — not raw `<svg>` or `<img>` tags (per constitution §VII).

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Button A / B | box-shadow | 150ms | ease-in-out | Hover |
| Button A / B | filter:brightness | 150ms | ease-in-out | Hover/Active |
| Button C | background-color | 150ms | ease-in-out | Hover/Active |
| FAB sub-buttons | opacity + translateY | 200ms staggered | ease-out | FAB expand/collapse |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| FAB Widget container | `313:9140` | `fixed flex flex-col items-end gap-5 bottom-8 right-8` | `<FabWidget>` |
| Button thể lệ | `I313:9140;214:3799` | `flex items-center gap-2 px-4 py-4 bg-[#FFEA9E] rounded-[4px] w-[149px] h-16` | `<FabActionButton icon="logo" label="Thể lệ">` |
| Button viết kudos | `I313:9140;214:3732` | `flex items-center gap-2 px-4 py-4 bg-[#FFEA9E] rounded-[4px] w-[214px] h-16` | `<FabActionButton icon="pen" label="Viết KUDOS">` |
| Button huỷ | `I313:9140;214:3827` | `flex items-center justify-center w-14 h-14 bg-[#D4271D] rounded-full p-4` | `<FabCancelButton>` |
| Label text | `I313:9140;214:3799;186:1568` | `font-montserrat font-bold text-2xl leading-8 text-[#00101A]` | — (inline in FabActionButton) |

---

## Notes

- Colors should be added as CSS variables in `src/app/globals.css` per constitution §VII — do not hardcode hex values in component files.
- `Montserrat` font must be loaded via Next.js `next/font/google` or local font file — not a raw `@import` in CSS.
- The FAB widget should be rendered outside the main content scroll container (e.g., as a portal or at root layout level) to ensure correct fixed positioning.
- All icons **MUST BE** in an **Icon Component** instead of svg files or img tags (per constitution §VII and design-style-template notes).
- Frame image reference: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/313:9139/15801186ffe7c4fb8d845c238680b3ae.png

---

## Changelog

| Version | Date | Type | Notes |
|---------|------|------|-------|
| v1.1 | 2026-03-18 | Cosmetic | Requirement change: desktop FAB position updated to `bottom: 32px / right: 32px` (was `~120px / ~138px`). Figma not yet updated — run `momorph.syncdesign` after Figma is updated. Updated: Widget Container table, Desktop responsive row, Implementation Mapping. |
| v1.0 | 2026-03-18 | — | Initial extraction from Figma |
