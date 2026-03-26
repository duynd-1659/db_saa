# Design Style: Dropdown Hashtag filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5580
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border |
| --color-item-selected-bg | #FFEA9E | 10% | Selected/active item background — rgba(255,234,158,0.10) |
| --color-item-label | #FFFFFF | 100% | Menu item label text |
| --color-glow | #FAE287 | — | Active item label glow color |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-hashtag-item | Montserrat | 16px | 700 | 24px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Each hashtag item inner padding (all sides) |
| --spacing-item-gap | 4px | Gap between elements inside item |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border-radius |
| --radius-item | 4px | Hashtag item border-radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --text-shadow-glow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Selected item label glow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | ~147px | Dropdown list width (text-only, no icons) |
| height | auto | Fits content (6 items shown = ~348px) |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| display | flex | — |
| flex-direction | column | Stacked items vertically |
| position | absolute | Overlay |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────┐
│  Dropdown Hashtag filter (215×410px)        │
│                                            │
│   ┌──────────────────────────────────┐     │
│   │ A_Dropdown-List (~147px wide)    │     │
│   │ bg: #00070C, border: #998C5F    │     │
│   │ border-radius: 8px, padding: 6px│     │
│   │  ┌────────────────────────────┐ │     │
│   │  │ A.1 #Dedicated (selected) │ │     │
│   │  │ 135×56px, glow text       │ │     │
│   │  │ bg: rgba(255,234,158,0.10)│ │     │
│   │  └────────────────────────────┘ │     │
│   │  ┌────────────────────────────┐ │     │
│   │  │ A.2 #Inspring             │ │     │
│   │  │ 118×56px, transparent bg  │ │     │
│   │  └────────────────────────────┘ │     │
│   │  ┌────────────────────────────┐ │     │
│   │  │ A.3+ more hashtags...     │ │     │
│   │  └────────────────────────────┘ │     │
│   └──────────────────────────────────┘     │
└────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown-List — Dropdown Container (Node: 563:8026)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 563:8026 | — |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: var(--color-dropdown-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-dropdown-border)` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex; flex-direction: column` |
| position | absolute | `position: absolute` |

---

### A.1 Selected Hashtag Item (Node: I563:8026;525:13508)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I563:8026;525:13508 | — |
| width | 135px | `width: 135px` |
| height | 56px | `height: 56px` |
| background | rgba(255,234,158,0.10) | `background-color: rgba(255,234,158,0.10)` |
| border-radius | 4px | `border-radius: 4px` |
| padding | 16px | `padding: 16px` |
| gap | 4px | `gap: 4px` |

**Label (selected):**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.5px |
| color | #FFFFFF |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |

---

### A.2+ Unselected Hashtag Items (Node: I563:8026;525:14864, etc.)

| Property | Value | CSS |
|----------|-------|-----|
| height | 56px | `height: 56px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: 4px` |
| padding | 16px | `padding: 16px` |

**Label (unselected):**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| letter-spacing | 0.5px |
| color | #FFFFFF |
| text-shadow | none |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no glow |
| Selected | background: rgba(255,234,158,0.10), glow text |
| Hover | background: rgba(255,234,158,0.10) |

---

## Full Hashtag List (from design items data)

13 hashtags available in this dropdown:
`Toàn diện`, `Giỏi chuyên môn`, `Hiệu suất cao`, `Truyền cảm hứng`, `Cống hiến`, `Aim High`, `Be Agile`, `Wasshoi`, `Hướng mục tiêu`, `Hướng khách hàng`, `Chuẩn quy trình`, `Giải pháp sáng tạo`, `Quản lý xuất sắc`

---

## Responsive Specifications

Fixed overlay dimensions across all breakpoints.

| Component | All Breakpoints |
|-----------|----------------|
| Dropdown-List | width: ~147px, fixed |
| Hashtag Items | height: 56px, fixed |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown-List | opacity, translateY | 150ms | ease-out | Toggle open/close |
| Hashtag Item | background-color | 100ms | ease-in-out | Hover/Select |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 563:8026 | `absolute z-10 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<HashtagFilterDropdown>` |
| Selected Item | I563:8026;525:13508 | `flex items-center px-4 h-14 rounded bg-[rgba(255,234,158,0.10)] cursor-pointer` | `<HashtagItem active>` |
| Default Item | I563:8026;525:14864 | `flex items-center px-4 h-14 rounded cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<HashtagItem>` |
| Label (selected) | — | `font-montserrat font-bold text-base text-white tracking-[0.5px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<span>` |
| Label (default) | — | `font-montserrat font-bold text-base text-white tracking-[0.5px]` | `<span>` |

---

## Notes

- This is a **text-only** dropdown — no icons (unlike the profile dropdown).
- Letter spacing is **0.5px** (larger than profile dropdown's 0.15px).
- Single-select: selecting a hashtag closes the dropdown and filters the feed.
- The dropdown is scrollable if all 13 hashtags don't fit in the viewport.
- Hashtag data comes from the `public.hashtags` table in the database.
