# Design Style: Dropdown-profile

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5223
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (`Details-Container-2`) |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (`Details-Border`) |
| --color-item-hover-bg | #FFEA9E | 10% | Profile item hover/active background — rgba(255,234,158,0.10) |
| --color-item-label | #FFFFFF | 100% | Menu item label text |
| --color-glow | #FAE287 | — | Profile label glow effect color |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-menu-item | Montserrat | 16px | 700 | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Each menu item inner padding (all sides) |
| --spacing-item-gap | 4px | Gap between label and icon |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border-radius |
| --radius-item | 4px | Menu item border-radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --text-shadow-glow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Profile label glow (active/hover state) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | ~133px | Dropdown list width (positions: 41–174) |
| height | auto | Fits content |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| display | flex | — |
| flex-direction | column | Stacked items vertically |
| position | absolute | Overlay |
| z-index | 1 | Above page content |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────┐
│  Dropdown-profile frame (215×304px)       │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  A_Dropdown-List (~133×124px)    │   │
│   │  bg: #00070C                     │   │
│   │  border: 1px solid #998C5F       │   │
│   │  border-radius: 8px              │   │
│   │  padding: 6px                    │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.1 Profile (119×56px)    │  │   │
│   │  │ bg: rgba(255,234,158,0.10) │  │   │
│   │  │ border-radius: 4px         │  │   │
│   │  │ padding: 16px              │  │   │
│   │  │ ┌──────────┬────────────┐  │  │   │
│   │  │ │"Profile" │ 👤 (24×24) │  │  │   │
│   │  │ │ glow     │  icon      │  │  │   │
│   │  │ └──────────┴────────────┘  │  │   │
│   │  │     gap: 4px               │  │   │
│   │  └────────────────────────────┘  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.2 Logout (121×56px)     │  │   │
│   │  │ bg: transparent            │  │   │
│   │  │ border-radius: 4px         │  │   │
│   │  │ padding: 16px              │  │   │
│   │  │ ┌──────────┬────────────┐  │  │   │
│   │  │ │"Logout"  │ → (24×24)  │  │  │   │
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
| **Node ID** | 666:9601 | — |
| width | ~133px | `width: auto` |
| height | auto | `height: auto` |
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
| Hidden | display: none |

---

### A.1 Profile — Profile Menu Item

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844 | — |
| width | 119px | `width: 119px` |
| height | 56px | `height: 56px` |
| background | rgba(255,234,158,0.10) | `background-color: var(--color-item-hover-bg)` |
| border-radius | 4px | `border-radius: var(--radius-item)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Label "Profile":**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844;186:1497 | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |

**Profile Icon:**
| Property | Value |
|----------|-------|
| **Node ID** | I666:9601;563:7844;186:1498 |
| componentId | 186:1611 |
| width | 24px |
| height | 24px |
| position | right of label |

**States:**
| State | Changes |
|-------|---------|
| Default / Active | background: rgba(255,234,158,0.10), text-shadow glow |
| Hover | background: rgba(255,234,158,0.20) |
| Click | navigate to profile page |

---

### A.2 Logout — Logout Menu Item

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868 | — |
| width | 121px | `width: 121px` |
| height | 56px | `height: 56px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: var(--radius-item)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Label "Logout":**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868;186:1439 | — |
| width | 61px | — |
| height | 24px | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |

**Logout/Chevron Icon:**
| Property | Value |
|----------|-------|
| **Node ID** | I666:9601;563:7868;186:1441 |
| componentId | 335:10890 |
| width | 24px |
| height | 24px |
| position | right of label |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,234,158,0.10) |
| Click | execute logout action |

---

## Component Hierarchy with Styles

```
Dropdown-profile (frame: 215×304px, bg: #696969 canvas)
└── A_Dropdown-List (position: absolute, ~133px wide, flex-col, p: 6px)
    │   bg: #00070C, border: 1px solid #998C5F, border-radius: 8px
    │
    ├── A.1 Profile (w: 119px, h: 56px, border-radius: 4px)
    │   bg: rgba(255,234,158,0.10) [hover/active state shown in design]
    │   └── Inner (p: 16px, flex-row, gap: 4px, align: center)
    │       ├── "Profile" (Montserrat 700 16px, #FFF, glow: 0 0 6px #FAE287)
    │       └── IC / Profile icon (w: 24px, h: 24px, componentId: 186:1611)
    │
    └── A.2 Logout (w: 121px, h: 56px, border-radius: 4px)
        bg: transparent [default state]
        └── Inner (p: 16px, flex-row, gap: 4px, align: center)
            ├── "Logout" (Montserrat 700 16px, #FFF)
            └── IC / Chevron-right icon (w: 24px, h: 24px, componentId: 335:10890)
```

---

## Responsive Specifications

The dropdown is a floating overlay with fixed dimensions across all breakpoints.

| Component | All Breakpoints |
|-----------|----------------|
| Dropdown-List | width: ~133px, fixed |
| Menu Items | height: 56px, fixed (meets 44px touch target) |

---

## Icon Specifications

| Icon Name | Size | Usage | Node ID | Component ID |
|-----------|------|-------|---------|--------------|
| Profile / User icon | 24×24px | Profile menu item | I666:9601;563:7844;186:1498 | 186:1611 |
| Chevron-right / Logout arrow | 24×24px | Logout menu item | I666:9601;563:7868;186:1441 | 335:10890 |

> All icons **MUST BE** implemented as **Icon Components** — not `<img>` tags or inline SVGs.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown-List | opacity, transform (translateY) | 150ms | ease-out | Toggle open/close |
| Menu Item | background-color | 100ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 666:9601 | `absolute z-10 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<ProfileDropdown>` |
| Profile Item | I666:9601;563:7844 | `flex items-center gap-1 px-4 h-14 w-[119px] rounded bg-[rgba(255,234,158,0.10)] cursor-pointer` | `<ProfileMenuItem>` |
| Logout Item | I666:9601;563:7868 | `flex items-center gap-1 px-4 h-14 w-[121px] rounded cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<ProfileMenuItem>` |
| Menu Label | I666:9601;563:7844;186:1497 | `font-montserrat font-bold text-base text-white leading-6 tracking-[0.15px]` | `<span>` |
| Glow effect (Profile) | I666:9601;563:7844;186:1497 | `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | inline or CSS var |
| Icon | I666:9601;563:7844;186:1498 | `w-6 h-6` | `<Icon name="profile" />` / `<Icon name="chevron-right" />` |

---

## Notes

- **Glow text effect** on "Profile" label: `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` — this is a signature design detail that differentiates the active/current item.
- The Profile item is shown with `rgba(255,234,158,0.10)` background in the Figma design — half the opacity of the language dropdown's selected state (`0.20`). This may represent the "hover" state rather than a persistent "selected" state.
- Design tokens `--color-dropdown-bg` and `--color-dropdown-border` are shared with `Dropdown-ngôn ngữ` — already defined in `globals.css`.
- Font is **Montserrat** — already loaded in `layout.tsx`.
- Minimum touch target: 56px height satisfies the 44×44px WCAG requirement (constitution §V).
