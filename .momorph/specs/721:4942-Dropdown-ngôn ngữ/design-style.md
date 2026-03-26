# Design Style: Dropdown-ngôn ngữ

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:4942
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown list container background (`Details-Container-2`) |
| --color-dropdown-border | #998C5F | 100% | Dropdown list container border (`Details-Border`) |
| --color-selected-bg | #FFEA9E | 20% | Selected language item background (rgba(255,234,158,0.20)) |
| --color-item-label | #FFFFFF | 100% | Language code text (VN, EN) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-lang-code | Montserrat | 16px | 700 | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Each language item inner padding |
| --spacing-flag-label-gap | 4px | Gap between flag icon and language code |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border-radius |
| --radius-item-selected | 2px | Selected item border-radius |
| --radius-item-inner | 4px | Inner button border-radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

_No shadows defined for this component._

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 122px | Dropdown list width (positions: 47–169) |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| display | flex | — |
| flex-direction | column | Stacked items vertically |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────┐
│  Dropdown-ngôn ngữ frame (215×304px)      │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  A_Dropdown-List (122×124px)     │   │
│   │  bg: #00070C                     │   │
│   │  border: 1px solid #998C5F       │   │
│   │  border-radius: 8px              │   │
│   │  padding: 6px                    │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.1 tiếng Việt (108×56px) │  │   │
│   │  │ bg: rgba(255,234,158,0.20) │  │   │
│   │  │ border-radius: 2px         │  │   │
│   │  │ padding: 16px              │  │   │
│   │  │ ┌──────────┬────────────┐  │  │   │
│   │  │ │ 🇻🇳 (24×24) │ VN (25×24) │  │  │   │
│   │  │ └──────────┴────────────┘  │  │   │
│   │  │     gap: 4px               │  │   │
│   │  └────────────────────────────┘  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.2 tiếng Anh (110×56px)  │  │   │
│   │  │ bg: transparent            │  │   │
│   │  │ border-radius: 0px         │  │   │
│   │  │ padding: 16px              │  │   │
│   │  │ ┌──────────┬────────────┐  │  │   │
│   │  │ │ 🏴 (24×24) │ EN (24×24) │  │  │   │
│   │  │ └──────────┴────────────┘  │  │   │
│   │  │     gap: 4px               │  │   │
│   │  └────────────────────────────┘  │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown-List — Dropdown Container

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 525:11713 | — |
| width | ~122px | `width: 122px` |
| height | ~124px | `height: auto` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: var(--color-dropdown-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-dropdown-border)` |
| border-radius | 8px | `border-radius: var(--radius-dropdown)` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| position | absolute | `position: absolute` |
| z-index | 1 | `z-index: 1` |

**States:**
| State | Changes |
|-------|---------|
| Visible | opacity: 1, pointer-events: auto |
| Hidden | display: none or opacity: 0, pointer-events: none |

---

### A.1 tiếng Việt — Selected Language Item (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085 | — |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| background | rgba(255,234,158,0.20) | `background-color: var(--color-selected-bg)` |
| border-radius | 2px | `border-radius: var(--radius-item-selected)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| padding | 16px | `padding: 16px` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |

**Inner content (flag + label):**
| Property | Value | CSS |
|----------|-------|-----|
| gap | 4px | `gap: 4px` |
| align-items | center | `align-items: center` |

**Flag icon:**
| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |
| content | VN Vietnam flag SVG |

**Language code label:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1439 | — |
| width | 25px |  |
| height | 24px |  |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |
| text | VN | — |

**States:**
| State | Changes |
|-------|---------|
| Selected | background: rgba(255,234,158,0.20) (current state shown in design) |
| Hover | background: rgba(255,234,158,0.10) |
| Default | background: transparent |

---

### A.2 tiếng Anh — Language Item (EN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128 | — |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| background | transparent | `background-color: transparent` |
| border-radius | 0px | `border-radius: 0` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| padding | 16px | `padding: 16px` |
| flex-direction | row | `flex-direction: row` |

**Inner content (flag + label):**
| Property | Value | CSS |
|----------|-------|-----|
| gap | 4px | `gap: 4px` |
| align-items | center | `align-items: center` |

**Flag icon:**
| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |
| content | GB-NIR (Northern Ireland/English flag) SVG |

**Language code label:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1439 | — |
| width | 24px | — |
| height | 24px | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |
| text | EN | — |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,234,158,0.10) |
| Selected | background: rgba(255,234,158,0.20) |

---

## Component Hierarchy with Styles

```
Dropdown-ngôn ngữ (frame: 215×304px, bg: #696969 canvas)
└── A_Dropdown-List (position: absolute, w: ~122px, flex-col, p: 6px)
    │   bg: #00070C, border: 1px solid #998C5F, border-radius: 8px
    │
    ├── A.1 tiếng Việt (w: 108px, h: 56px, border-radius: 2px)
    │   bg: rgba(255,234,158,0.20) [selected state]
    │   └── Button inner (p: 16px, flex-row, justify: space-between)
    │       └── Flag+Label (flex-row, gap: 4px, align: center)
    │           ├── IC / VN Flag (w: 24px, h: 24px)
    │           └── "VN" (Montserrat 700 16px, #FFF, lh: 24px)
    │
    └── A.2 tiếng Anh (w: 110px, h: 56px, border-radius: 0px)
        bg: transparent [default/unselected state]
        └── Content inner (p: 16px, flex-row, justify: space-between)
            └── Flag+Label (flex-row, gap: 4px, align: center)
                ├── IC / GB-NIR Flag (w: 24px, h: 24px)
                └── "EN" (Montserrat 700 16px, #FFF, lh: 24px)
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

The dropdown is a floating overlay and maintains fixed dimensions across all breakpoints. Positioning relative to the trigger button may shift but component dimensions remain constant.

| Component | All Breakpoints |
|-----------|----------------|
| Dropdown-List | width: ~122px, fixed |
| Language Items | height: 56px, fixed |
| Minimum touch target | 56px height meets 44px minimum |

---

## Icon Specifications

| Icon Name | Size | Color | Usage | Node ID |
|-----------|------|-------|-------|---------|
| VN Vietnam Flag | 24×24px | — | Vietnamese language option | I525:11713;362:6085;186:1821;186:1709 |
| GB-NIR English Flag | 24×24px | — | English language option | I525:11713;362:6128;186:1903;186:1709 |

> All flag icons **MUST BE** implemented as **Icon Components** rather than `<img>` tags or inline SVG files.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown-List | opacity, transform (scale/translateY) | 150ms | ease-out | Toggle open/close |
| Language Item | background-color | 100ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 525:11713 | `absolute z-10 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<LanguageDropdown>` |
| VN Item (selected) | I525:11713;362:6085 | `flex items-center px-4 py-0 w-[108px] h-14 rounded-sm bg-[rgba(255,234,158,0.20)]` | `<LanguageOption locale="vi" selected>` |
| EN Item (default) | I525:11713;362:6128 | `flex items-center justify-center px-4 py-0 w-[110px] h-14` | `<LanguageOption locale="en">` |
| Flag Icon | I525:11713;362:6085;186:1821;186:1709 | `w-6 h-6` | `<Icon name="flag-vn" />` |
| Language Code | I525:11713;362:6085;186:1821;186:1439 | `font-montserrat font-bold text-base text-white leading-6 tracking-[0.15px]` | `<span>` |

---

## Notes

- The dropdown uses a dark theme (`#00070C` background) with a gold/olive border (`#998C5F`), matching the `Details-Container-2` and `Details-Border` design tokens.
- The selected state uses a subtle warm highlight (`rgba(255,234,158,0.20)`) — 20% opacity golden yellow.
- Font is **Montserrat** (not the Inter default from the template) — ensure Montserrat is loaded in the project.
- All colors must use CSS variables aligned with `globals.css` design tokens per constitution §VII.
- Minimum touch target of 56px height on language items satisfies the 44×44px requirement from constitution §V.
