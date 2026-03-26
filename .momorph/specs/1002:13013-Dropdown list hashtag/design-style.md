# Design Style: Dropdown list hashtag

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=1002:13013
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown list container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown border and chip trigger border |
| --color-item-selected-bg | #FFEA9E | 20% | Selected hashtag item background — rgba(255,234,158,0.20) |
| --color-item-label | #FFFFFF | 100% | Hashtag label text |
| --color-chip-bg | #FFFFFF | 100% | Chip/trigger button background |
| --color-chip-hint | #999999 | 100% | Chip hint text color |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-hashtag-item | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-chip-hint | Montserrat | 11px | 700 | 16px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-list-padding | 6px | Dropdown list container padding |
| --spacing-item-padding | 16px (horiz) | Hashtag row horizontal padding |
| --spacing-chip-padding | 4px 8px | Chip trigger padding |
| --spacing-item-gap | 2px | Gap between list items |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border-radius |
| --radius-item | 2px | Hashtag row border-radius |
| --radius-chip | 8px | Chip trigger border-radius |
| --border-dropdown | 1px solid #998C5F | Container and chip border |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 318px | Wider than other dropdowns — contains full hashtag text |
| height | auto | Fits content |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| padding | 6px | All sides |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────┐
│  Dropdown list hashtag (318×421px)            │
│                                              │
│  ┌─────────────────┐  ← Chip trigger button  │
│  │ + Hashtag       │    (116×48px, white bg) │
│  │   Tối đa 5      │    border: #998C5F      │
│  └─────────────────┘                         │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ Dropdown-List (318px)                │    │
│  │ bg: #00070C, border: #998C5F        │    │
│  │  ┌────────────────────────────────┐ │    │
│  │  │ A ✓ #High-perorming (selected) │ │    │
│  │  │ 306×40px, rgba(255,234,158,.2) │ │    │
│  │  └────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────┐ │    │
│  │  │ B ✓ #BE PROFESSIONAL (selected)│ │    │
│  │  │ 306×40px, rgba(255,234,158,.2) │ │    │
│  │  └────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────┐ │    │
│  │  │ C ✓ #BE OPTIMISTIC (selected)  │ │    │
│  │  └────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────┐ │    │
│  │  │ D   #BE A TEAM (unselected)    │ │    │
│  │  │ 306×40px, transparent          │ │    │
│  │  └────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────┐ │    │
│  │  │     #THINK OUTSIDE THE BOX     │ │    │
│  │  └────────────────────────────────┘ │    │
│  │  (more items...)                    │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

---

## Component Style Details

### Chip Trigger Button (Node: 1002:15115)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1002:15115 | — |
| width | 116px | `width: 116px` |
| height | 48px | `height: 48px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 4px 8px | `padding: 4px 8px` |

**Chip hint text:**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 11px |
| font-weight | 700 |
| line-height | 16px |
| letter-spacing | 0.5px |
| color | #999999 |
| content | "Hashtag\nTối đa 5" |

**Plus icon:** Node `I1002:15115;186:2759`, componentId `490:5726`, 24×24px

---

### Dropdown List Container (Node: 1002:13102)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1002:13102 | — |
| width | 318px | `width: 318px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 6px | `padding: 6px` |
| display | flex | `display: flex; flex-direction: column` |

---

### Selected Hashtag Row (Nodes: 1002:13185, 1002:13207, 1002:13216)

| Property | Value | CSS |
|----------|-------|-----|
| width | 306px | `width: 306px` |
| height | 40px | `height: 40px` |
| background | rgba(255,234,158,0.20) | `background-color: rgba(255,234,158,0.20)` |
| border-radius | 2px | `border-radius: 2px` |
| padding | 0 16px | `padding: 0 16px` |
| gap | 2px | `gap: 2px` |
| display | flex | `display: flex; flex-direction: row; align-items: center` |

**Hashtag label text:**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | #FFFFFF |
| width | 253px |

**Check icon (selected):** Node `1002:13204`, componentId `1002:13201`, 24×24px

---

### Unselected Hashtag Row (Node: 1002:13104 and similar)

| Property | Value | CSS |
|----------|-------|-----|
| width | 306px | `width: 306px` |
| height | 40px | `height: 40px` |
| background | transparent | `background-color: transparent` |
| border-radius | 0px | `border-radius: 0` |
| padding | 0 16px | `padding: 0 16px` |

**Label text:** same typography as selected, no checkmark icon visible

**States:**
| State | Changes |
|-------|---------|
| Unselected | background: transparent, no check icon |
| Selected | background: rgba(255,234,158,0.20), check icon visible |
| Hover | background: rgba(255,234,158,0.10) |
| Max reached (5) | unselected items: pointer-events: none, opacity: 0.5 |

---

## Full Hashtag List (from design items)

Available hashtags: `#High-perorming`, `#BE PROFESSIONAL`, `#BE OPTIMISTIC`, `#BE A TEAM`, `#THINK OUTSIDE THE BOX`, `#GET RISKY`, `#GO FAST`, `#WASSHOI`

(Full list from database — 13 total: Toàn diện, Giỏi chuyên môn, Hiệu suất cao, Truyền cảm hứng, Cống hiến, Aim High, Be Agile, Wasshoi, Hướng mục tiêu, Hướng khách hàng, Chuẩn quy trình, Giải pháp sáng tạo, Quản lý xuất sắc)

---

## Icon Specifications

| Icon Name | Size | Usage | Component ID |
|-----------|------|-------|-------------|
| Plus icon | 24×24px | Chip trigger (add hashtag) | 490:5726 |
| Check icon | 24×24px | Selected item indicator | 1002:13201 |

---

## Animation & Transitions

| Element | Property | Duration | Notes |
|---------|----------|----------|-------|
| Dropdown list | opacity, translateY | 150ms | ease-out, open/close |
| Hashtag row | background-color | 100ms | ease-in-out, hover/select |
| Check icon | opacity | 100ms | Appear/disappear on toggle |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Chip trigger | 1002:15115 | `flex items-center gap-2 px-2 py-1 bg-white border border-[#998C5F] rounded-lg h-12 w-[116px]` | `<HashtagChipTrigger>` |
| Chip hint | I1002:15115;186:2760 | `font-montserrat font-bold text-[11px] leading-[16px] text-[#999] tracking-[0.5px]` | `<span>` |
| Plus icon | I1002:15115;186:2759 | `w-6 h-6` | `<Icon name="plus" />` |
| Dropdown list | 1002:13102 | `absolute z-20 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg w-[318px]` | `<HashtagList>` |
| Selected row | 1002:13185 | `flex items-center justify-between px-4 h-10 rounded-sm bg-[rgba(255,234,158,0.20)]` | `<HashtagRow selected>` |
| Unselected row | 1002:13104 | `flex items-center justify-between px-4 h-10 cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<HashtagRow>` |
| Hashtag label | — | `font-montserrat font-bold text-base text-white tracking-[0.15px] flex-1` | `<span>` |
| Check icon | 1002:13204 | `w-6 h-6` | `<Icon name="check" />` |
