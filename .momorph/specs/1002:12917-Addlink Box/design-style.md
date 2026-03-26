# Design Style: Addlink Box

**Frame ID**: `1002:12917`
**Frame Name**: `Addlink Box`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=1002:12917
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-modal-bg | #FFF8E1 | 100% | Modal container background (warm cream) |
| --color-title-text | #00101A | 100% | Modal title and label text |
| --color-input-bg | #FFFFFF | 100% | Input field background |
| --color-input-border | #998C5F | 100% | Input field border |
| --color-btn-cancel-bg | #FFEA9E | 10% | Cancel button background — rgba(255,234,158,0.10) |
| --color-btn-cancel-border | #998C5F | 100% | Cancel button border |
| --color-btn-save-bg | #FFEA9E | 100% | Save/primary button background |
| --color-btn-text-dark | #00101A | 100% | Button label text |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 32px | 700 | 40px | 0px |
| --text-field-label | Montserrat | 22px | 700 | 28px | 0px |
| --text-btn-cancel | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-btn-save | Montserrat | 22px | 700 | 28px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding | 40px | Modal container padding (all sides) |
| --spacing-section-gap | 32px | Gap between sections (title → fields → buttons) |
| --spacing-row-gap | 16px | Gap within a form row (label + input) |
| --spacing-input-padding | 16px 24px | Input field padding |
| --spacing-btn-padding-cancel | 16px 40px | Cancel button padding |
| --spacing-btn-padding-save | 16px | Save button padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 24px | Modal container border-radius |
| --radius-input | 8px | Input field border-radius |
| --radius-btn-cancel | 4px | Cancel button border-radius |
| --radius-btn-save | 8px | Save button border-radius |
| --border-input | 1px solid #998C5F | Input field border |
| --border-btn-cancel | 1px solid #998C5F | Cancel button border |

---

## Layout Specifications

### Modal Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Fixed modal width |
| height | 388px | Fixed modal height |
| background | #FFF8E1 | Warm cream/yellow-white |
| border-radius | 24px | Heavily rounded corners |
| padding | 40px | All sides |
| display | flex | — |
| flex-direction | column | — |
| gap | 32px | Between sections |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────────────────┐
│  Addlink Box (752×388px, bg: #FFF8E1, radius: 24px)         │
│  padding: 40px                                             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ A_Title: "Thêm đường dẫn"                            │  │
│  │ Montserrat 700 32px, #00101A                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  gap: 32px                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ B_Text row (label + input, gap: 16px)                │  │
│  │ ┌────────────┐  ┌────────────────────────────────┐   │  │
│  │ │"Nội dung"  │  │ Text input (610×56px)          │   │  │
│  │ │22px bold   │  │ border: #998C5F, bg: white     │   │  │
│  │ └────────────┘  └────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ C_Link row (label + input, gap: 16px)                │  │
│  │ ┌────────┐  ┌──────────────────────────────────┐     │  │
│  │ │ "URL"  │  │ URL input (609×56px) + link icon  │     │  │
│  │ └────────┘  └──────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│  gap: 32px                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ D_Buttons row (gap: 24px)                            │  │
│  │ ┌──────────────────┐  ┌──────────────────────────┐   │  │
│  │ │ D.1 Hủy          │  │ D.2 Lưu (502×60px)      │   │  │
│  │ │ "Hủy" + X icon   │  │ bg: #FFEA9E, 22px bold   │   │  │
│  │ │ border: #998C5F  │  │ "Lưu" + link icon        │   │  │
│  │ └──────────────────┘  └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Title (Node: I1002:12682;1002:12500)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I1002:12682;1002:12500 | — |
| text | "Thêm đường dẫn" | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| color | #00101A | `color: #00101A` |

---

### B_Text — Label + Text Input Row (Node: I1002:12682;1002:12501)

**B.1 Label "Nội dung" (Node: I1002:12682;1002:12502):**
| Property | Value |
|----------|-------|
| font-size | 22px |
| font-weight | 700 |
| line-height | 28px |
| color | #00101A |
| width | 107px |

**B.2 Text Input (Node: I1002:12682;1002:12503):**
| Property | Value | CSS |
|----------|-------|-----|
| width | flex: 1 (fills remaining) | `flex: 1` |
| height | 56px | `height: 56px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 16px 24px | `padding: 16px 24px` |
| validation | required, 1-100 chars | — |

---

### C_Link — Label + URL Input Row (Node: I1002:12682;1002:12652)

**C.1 Label "URL" (Node: I1002:12682;1002:12653):**
| Property | Value |
|----------|-------|
| font-size | 22px |
| font-weight | 700 |
| color | #00101A |
| width | 47px |

**C.2 URL Input (Node: I1002:12682;1002:12654):**
| Property | Value | CSS |
|----------|-------|-----|
| width | flex: 1 | `flex: 1` |
| height | 56px | `height: 56px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 16px 24px | `padding: 16px 24px` |
| validation | required, URL format, 5-2048 chars | — |

**Link icon inside input:** componentId `186:1862`, 24×24px, positioned right

---

### D.1 Cancel Button (Node: I1002:12682;1002:12544)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I1002:12682;1002:12544 | — |
| background | rgba(255,234,158,0.10) | `background-color: rgba(255,234,158,0.10)` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 4px | `border-radius: 4px` |
| padding | 16px 40px | `padding: 16px 40px` |
| height | 60px | `height: 60px` |
| gap | 8px | `gap: 8px` |

**Label "Hủy":**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| color | #00101A |

**Close icon:** componentId `214:3851`, 24×24px

---

### D.2 Save Button (Node: I1002:12682;1002:12545)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I1002:12682;1002:12545 | — |
| width | 502px | `width: 502px` |
| height | 60px | `height: 60px` |
| background | #FFEA9E | `background-color: #FFEA9E` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex; align-items: center; justify-content: center` |
| gap | 8px | `gap: 8px` |

**Label "Lưu":**
| Property | Value |
|----------|-------|
| font-size | 22px |
| font-weight | 700 |
| color | #00101A |

**Link icon:** componentId `256:5195`, 24×24px

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E, enabled |
| Disabled | background: rgba(255,234,158,0.5), pointer-events: none |
| Hover | background: #FFE17A (darken slightly) |

---

## Responsive Specifications

This is a modal dialog — displayed as an overlay on the Viết Kudo screen.

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Modal | 752×388px fixed | Full-width, taller |
| Input fields | Fixed width with flex | Full-width |

---

## Animation & Transitions

| Element | Property | Duration | Notes |
|---------|----------|----------|-------|
| Modal | opacity, scale(0.95→1) | 200ms | ease-out, on open |
| Backdrop | opacity | 200ms | Darken when modal opens |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Modal container | 1002:12682 | `bg-[#FFF8E1] rounded-[24px] p-10 flex flex-col gap-8 w-[752px]` | `<AddLinkModal>` |
| Title | I1002:12682;1002:12500 | `font-montserrat font-bold text-[32px] leading-[40px] text-[#00101A]` | `<h2>` |
| Form row | I1002:12682;1002:12501 | `flex flex-row items-center gap-4 h-14` | `<div>` |
| Field label | I1002:12682;1002:12502 | `font-montserrat font-bold text-[22px] leading-[28px] text-[#00101A] shrink-0` | `<label>` |
| Text input | I1002:12682;1002:12503 | `flex-1 h-14 bg-white border border-[#998C5F] rounded-lg px-6 py-4` | `<input type="text">` |
| URL input | I1002:12682;1002:12654 | `flex-1 h-14 bg-white border border-[#998C5F] rounded-lg px-6 py-4` | `<input type="url">` |
| Button row | I1002:12682;1002:12543 | `flex flex-row gap-6 items-start` | `<div>` |
| Cancel button | I1002:12682;1002:12544 | `flex items-center gap-2 px-10 py-4 h-[60px] bg-[rgba(255,234,158,0.10)] border border-[#998C5F] rounded` | `<button>` |
| Save button | I1002:12682;1002:12545 | `flex items-center justify-center gap-2 w-[502px] h-[60px] bg-[#FFEA9E] rounded-lg` | `<button type="submit">` |
