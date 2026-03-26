# Design Style: Dropdown Phòng ban

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5684
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border |
| --color-item-selected-bg | #FFEA9E | 10% | Selected/active item background — rgba(255,234,158,0.10) |
| --color-item-label | #FFFFFF | 100% | Item label text |
| --color-glow | #FAE287 | — | Active item label glow |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-dept-item | Montserrat | 16px | 700 | 24px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Each item inner padding |
| --spacing-item-gap | 4px | Gap between elements inside item |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown border-radius |
| --radius-item | 4px | Item border-radius |
| --border-dropdown | 1px solid #998C5F | Container border |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --text-shadow-glow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Selected item label glow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | ~101px | Dropdown list width (department codes are short) |
| height | auto | Fits 6 items = ~348px |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/olive border |
| border-radius | 8px | Rounded corners |
| position | absolute | Overlay |
| Frame total width | 289px | Wider Figma frame to accommodate right positioning |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────┐
│  Dropdown Phòng ban (289×410px frame)       │
│                                            │
│           ┌──────────────────────┐         │
│           │ A_Dropdown-List      │         │
│           │ (~101px wide)        │         │
│           │ bg: #00070C          │         │
│           │  ┌──────────────┐   │         │
│           │  │A.1 CEVC2 ✦  │   │         │
│           │  │ selected     │   │         │
│           │  │ 90×56px      │   │         │
│           │  └──────────────┘   │         │
│           │  ┌──────────────┐   │         │
│           │  │A.2 CEVC3     │   │         │
│           │  │ 90×56px      │   │         │
│           │  └──────────────┘   │         │
│           │  ┌──────────────┐   │         │
│           │  │A.3 CEVC4     │   │         │
│           │  └──────────────┘   │         │
│           │  ┌──────────────┐   │         │
│           │  │ CEVC1        │   │         │
│           │  └──────────────┘   │         │
│           │  ┌──────────────┐   │         │
│           │  │ OPD          │   │         │
│           │  └──────────────┘   │         │
│           │  ┌──────────────┐   │         │
│           │  │ Infra        │   │         │
│           │  └──────────────┘   │         │
│           └──────────────────────┘         │
└────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown-List — Dropdown Container (Node: 563:8027)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 563:8027 | — |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex; flex-direction: column` |

### A.1 Selected Department Item (Node: I563:8027;563:7956)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I563:8027;563:7956 | — |
| width | 90px | `width: 90px` |
| height | 56px | `height: 56px` |
| background | rgba(255,234,158,0.10) | selected highlight |
| border-radius | 4px | `border-radius: 4px` |
| padding | 16px | `padding: 16px` |

**Label (selected):**
| Property | Value |
|----------|-------|
| font | Montserrat 700 16px |
| letter-spacing | 0.5px |
| color | #FFFFFF |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |

### A.2+ Unselected Department Items

| Property | Value |
|----------|-------|
| width | 90-91px (varies by label) |
| height | 56px |
| background | transparent |
| border-radius | 4px |
| padding | 16px |
| font | Montserrat 700 16px |
| letter-spacing | 0.5px |
| color | #FFFFFF |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no glow |
| Selected | background: rgba(255,234,158,0.10), glow text |
| Hover | background: rgba(255,234,158,0.10) |

---

## Full Department List (15 top-level departments)

Visible in dropdown (sample): `CEVC2`, `CEVC3`, `CEVC4`, `CEVC1`, `OPD`, `Infra`

Full list (alphabetical): BDV, CEVC1, CEVC2, CEVC3, CEVC4, CEVEC, CPV, CTO, FCOV, GEU, IAV, OPDC, PAO, SPD, STVC

---

## Responsive Specifications

| Component | All Breakpoints |
|-----------|----------------|
| Dropdown-List | width: ~101px, fixed |
| Department Items | height: 56px, fixed |
| Scroll | enabled when list exceeds viewport |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown-List | opacity, translateY | 150ms | ease-out | Toggle open/close |
| Item | background-color | 100ms | ease-in-out | Hover/Select |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 563:8027 | `absolute z-10 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg overflow-y-auto max-h-80` | `<DepartmentFilterDropdown>` |
| Selected Item | I563:8027;563:7956 | `flex items-center px-4 h-14 w-[90px] rounded bg-[rgba(255,234,158,0.10)] cursor-pointer` | `<DeptItem active>` |
| Default Item | I563:8027;563:7957 | `flex items-center px-4 h-14 rounded cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<DeptItem>` |
| Label (selected) | — | `font-montserrat font-bold text-base text-white tracking-[0.5px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<span>` |
| Label (default) | — | `font-montserrat font-bold text-base text-white tracking-[0.5px]` | `<span>` |

---

## Notes

- The dropdown is wider (289px frame) than other dropdowns — positioned to the right side of the filter button.
- Department data comes from the `public.departments` table (15 top-level departments in full list).
- The list should be scrollable — show max ~5-6 items before scrolling.
- Selecting a department filters the kudo feed by `recipient.department_id`.
- Single-select: one department at a time. Selecting "All" (if implemented) shows all departments.
