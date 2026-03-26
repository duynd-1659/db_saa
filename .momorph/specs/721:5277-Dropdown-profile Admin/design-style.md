# Design Style: Dropdown-profile Admin

**Frame ID**: `721:5277`
**Frame Name**: `Dropdown-profile Admin`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5277
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (`Details-Container-2`) |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (`Details-Border`) |
| --color-item-hover-bg | #FFEA9E | 10% | Profile item active background — rgba(255,234,158,0.10) |
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
| --text-shadow-glow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Profile label glow (active state) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | ~165px | Dropdown list width (wider than user variant due to "Dashboard" label) |
| height | auto | Fits 3 items: Profile + Dashboard + Logout |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| display | flex | — |
| flex-direction | column | Stacked items vertically |
| position | absolute | Overlay |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────┐
│  Dropdown-profile Admin (215×304px)       │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  A_Dropdown-List (~165px wide)   │   │
│   │  bg: #00070C                     │   │
│   │  border: 1px solid #998C5F       │   │
│   │  border-radius: 8px              │   │
│   │  padding: 6px                    │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.1 Profile (151×56px)    │  │   │
│   │  │ bg: rgba(255,234,158,0.10) │  │   │
│   │  │ "Profile" + 👤 icon        │  │   │
│   │  └────────────────────────────┘  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.2 Dashboard (153×56px)  │  │   │
│   │  │ bg: transparent            │  │   │
│   │  │ "Dashboard" + □ icon       │  │   │
│   │  └────────────────────────────┘  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ A.3 Logout (153×56px)     │  │   │
│   │  │ bg: transparent            │  │   │
│   │  │ "Logout" + → icon          │  │   │
│   │  └────────────────────────────┘  │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown-List — Dropdown Container (Node: 666:9728)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 666:9728 | — |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: var(--color-dropdown-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-dropdown-border)` |
| border-radius | 8px | `border-radius: var(--radius-dropdown)` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| position | absolute | `position: absolute` |

---

### A.1 Profile — Profile Menu Item (Node: I666:9728;666:9277)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9277 | — |
| width | 151px | `width: 151px` |
| height | 56px | `height: 56px` |
| background | rgba(255,234,158,0.10) | `background-color: rgba(255,234,158,0.10)` |
| border-radius | 4px | `border-radius: var(--radius-item)` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |
| display | flex | `display: flex; flex-direction: row; align-items: center` |

**Label "Profile":**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | #FFFFFF |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |

**Profile Icon:** Node `I666:9728;666:9277;186:1498`, componentId `186:1611`, 24×24px

**States:**
| State | Changes |
|-------|---------|
| Default / Active | background: rgba(255,234,158,0.10), text-shadow glow |
| Hover | background: rgba(255,234,158,0.20) |
| Click | navigate to profile page |

---

### A.2 Dashboard — Dashboard Menu Item (Node: I666:9728;666:9452)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9452 | — |
| width | 153px | `width: 153px` |
| height | 56px | `height: 56px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: var(--radius-item)` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |

**Label "Dashboard":**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | #FFFFFF |

**Dashboard Icon:** Node `I666:9728;666:9452;186:1441`, componentId `662:10350`, 24×24px

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,234,158,0.10) |
| Click | navigate to admin dashboard |

---

### A.3 Logout — Logout Menu Item (Node: I666:9728;666:9278)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9278 | — |
| width | 153px | `width: 153px` |
| height | 56px | `height: 56px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: var(--radius-item)` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |

**Label "Logout":**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| color | #FFFFFF |

**Logout Icon:** Node `I666:9728;666:9278;186:1441`, componentId `335:10890`, 24×24px

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,234,158,0.10) |
| Click | execute logout action |

---

## Icon Specifications

| Icon Name | Size | Usage | Node ID | Component ID |
|-----------|------|-------|---------|--------------|
| Profile / User icon | 24×24px | Profile item | I666:9728;666:9277;186:1498 | 186:1611 |
| Dashboard icon | 24×24px | Dashboard item | I666:9728;666:9452;186:1441 | 662:10350 |
| Chevron-right / Logout | 24×24px | Logout item | I666:9728;666:9278;186:1441 | 335:10890 |

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
| Dropdown Container | 666:9728 | `absolute z-10 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<AdminProfileDropdown>` |
| Profile Item | I666:9728;666:9277 | `flex items-center gap-1 px-4 h-14 w-[151px] rounded bg-[rgba(255,234,158,0.10)] cursor-pointer` | `<ProfileMenuItem>` |
| Dashboard Item | I666:9728;666:9452 | `flex items-center gap-1 px-4 h-14 w-[153px] rounded cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<ProfileMenuItem>` |
| Logout Item | I666:9728;666:9278 | `flex items-center gap-1 px-4 h-14 w-[153px] rounded cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<ProfileMenuItem>` |
| Menu Label | — | `font-montserrat font-bold text-base text-white leading-6 tracking-[0.15px]` | `<span>` |
| Glow effect (Profile) | — | `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | inline style |
| Icon | — | `w-6 h-6` | `<Icon name="..." />` |

---

## Notes

- This variant adds **"Dashboard"** (A.2) between Profile and Logout — this is the only difference from the regular `Dropdown-profile` variant.
- Design tokens `--color-dropdown-bg` and `--color-dropdown-border` are shared across all dropdown components.
- The glow text effect on "Profile" label is identical to the regular user variant.
- Only users with `role = 'admin'` should see this dropdown variant.
