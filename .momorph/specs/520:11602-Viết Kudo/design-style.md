# Design Style: Viết Kudo

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=520:11602
**Extracted At**: 2026-03-10
**Version**: v3.1
**Last synced**: 2026-03-25

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Full page background |
| --color-overlay-mask | #00101A | 80% | Dark overlay behind modal |
| --color-modal-bg | #FFF8E1 | 100% | Kudo form modal background (cream) |
| --color-title-text | #00101A | 100% | Modal title, labels, button text |
| --color-input-bg | #FFFFFF | 100% | Input field background |
| --color-input-border | #998C5F | 100% | Input field border |
| --color-btn-primary-bg | #FFEA9E | 100% | Send/submit button background |
| --color-btn-secondary-bg | #FFEA9E | 10% | Cancel/secondary button background |
| --color-hint-text | #999999 | 100% | Hint/placeholder text |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 32px | 700 | 40px | 0px |
| --text-field-label | Montserrat | 22px | 700 | 28px | 0px |
| --text-input | Montserrat | 16px | 400/700 | 24px | 0.15px |
| --text-hint | Montserrat | 11px | 700 | 16px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding | 40px | Modal container padding |
| --spacing-field-gap | 32px | Gap between form field groups (modal flex gap) |
| --spacing-label-input-gap | 16px | Horizontal gap between inline label and input (label left, input right) |
| --spacing-toolbar-gap | 0px | Toolbar buttons share borders (no gap — connected bar layout) |
| --color-community-link | #E46060 | "Tiêu chuẩn cộng đồng" button text color |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 24px | Modal border-radius (implied from Addlink Box) |
| --radius-input | 8px | Input fields |
| --radius-chip | 8px | Hashtag chip |
| --border-input | 1px solid #998C5F | All input fields |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Full viewport width |
| height | 1024px | Full viewport height |
| background | #00101A | Same as homepage background |
| position | relative | Contains absolute layers |

### Modal (Viết KUDO)

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Centered modal |
| height | 1012px | Tall scrollable form |
| background | #FFF8E1 | Warm cream (same as Addlink Box) |
| border-radius | 24px | Heavily rounded |
| padding | 40px | All sides |
| display | flex | — |
| flex-direction | column | Stacked sections |
| gap | 32px | Between form sections |
| position | absolute | Centered on page |
| overflow-y | scroll | Modal content scrollable |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│  Page (1440×1024px, bg: #00101A)                             │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Header (1440×80px, rgba(16,20,23,0.8))               │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────┐  ← Mask overlay (rgba(#00101A,80%))│
│  │                      │                                    │
│  │  Viết KUDO modal     │ ← 752×1012px, bg: #FFF8E1         │
│  │  ┌────────────────┐  │   border-radius: 24px             │
│  │  │ A: Title       │  │   padding: 40px                   │
│  │  │ "Gửi lời cám..." │  │                                  │
│  │  ├────────────────┤  │                                    │
│  │  │ B: Người nhận  │  │ label (152px) | input (flex:1)     │
│  │  ├────────────────┤  │                                    │
│  │  │ NEW: Danh hiệu │  │ label (152px) | input (flex:1)    │
│  │  │                │  │ hint text below input              │
│  │  ├────────────────┤  │                                    │
│  │  │ C: Toolbar     │  │                                    │
│  │  │ B I S # ¶ "  │  │                                    │
│  │  ├────────────────┤  │                                    │
│  │  │ D: Textarea    │  │                                    │
│  │  │ (rich text)    │  │                                    │
│  │  ├────────────────┤  │                                    │
│  │  │ E: Hashtag     │  │ label (152px) | chips + btn (flex:1)│
│  │  ├────────────────┤  │                                    │
│  │  │ F: Images      │  │ label (fixed) | thumbnails + btn  │
│  │  ├────────────────┤  │                                    │
│  │  │ G: Anonymous   │  │                                    │
│  │  │ checkbox       │  │                                    │
│  │  ├────────────────┤  │                                    │
│  │  │ H: Actions     │  │                                    │
│  │  │ [Hủy] [Gửi ►] │  │                                    │
│  │  └────────────────┘  │                                    │
│  └──────────────────────┘                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A: Modal Title (Node: I520:11647;520:9870)

| Property | Value |
|----------|-------|
| text | "Gửi lời cám ơn và ghi nhận đến đồng đội" |
| font | Montserrat 700 32px, #00101A |
| text-align | center |

### B: Người nhận — Recipient Field (Node: I520:11647;520:9871)

**Container:** `display: flex; flex-direction: row; align-items: center; gap: 16px; width: 672px; height: 56px`

**Label (I520:11647;520:9872):** "Người nhận *" — Montserrat 700 22px, #00101A — width: 152px (fixed)

**Search Input (I520:11647;520:9873):**
| Property | Value |
|----------|-------|
| width | flex: 1 0 0 (fills remaining space) |
| height | 56px |
| background | #FFFFFF |
| border | 1px solid #998C5F |
| border-radius | 8px |
| padding | 16px 24px |
| placeholder | "Tìm kiếm" |
| validation | required, autocomplete from profiles |

### B.NEW: Danh hiệu — Title Field (Node: I520:11647;1688:10448)

**Container:** `position: absolute; width: 672px; height: 104px` (children use absolute positioning)

**Label (I520:11647;1688:10436):** "Danh hiệu *" — Montserrat 700 22px, #00101A — width: 152px (fixed)

**Input (I520:11647;1688:10437):**
| Property | Value |
|----------|-------|
| width | flex: 1 0 0 (fills remaining space) |
| background | #FFFFFF |
| border | 1px solid #998C5F |
| border-radius | 8px |
| padding | 16px 24px |
| placeholder | "Dành tặng một danh hiệu cho đồng đội" |
| validation | required |

**Hint Text (I520:11647;1688:10447):**
| Property | Value |
|----------|-------|
| width | 418px |
| height | 48px |
| font | Montserrat 700 16px |
| color | #999999 |
| content | "Ví dụ: Người truyền động lực cho tôi.\nDanh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." |

---

### C: Rich Text Toolbar (Node: I520:11647;520:9877)

**Container:** `display: flex; flex-direction: row; align-items: center; justify-content: flex-end; height: 40px`

All buttons share the same base style: `border: 1px solid #998C5F; height: 40px; padding: 10px 16px; background: transparent; display: flex; align-items: center; justify-content: center`. Adjacent borders collapse (no gap between buttons).

| Button | Node | border-radius | Width | Function |
|--------|------|---------------|-------|---------|
| Bold (B) | I520:11647;520:9881 | `8px 0 0 0` (top-left only) | auto | Toggle bold |
| Italic (I) | I520:11647;662:11119 | `0` | auto | Toggle italic |
| Strikethrough (S) | I520:11647;662:11213 | `0` | auto | Toggle strikethrough |
| Numbered list | I520:11647;662:10376 | `0` | auto | Toggle ordered list |
| Link | I520:11647;662:10507 | `0` | auto | Insert hyperlink |
| Quote | I520:11647;662:10647 | `0` | auto | Toggle blockquote |
| Tiêu chuẩn cộng đồng | I520:11647;3053:11619 | `0 8px 0 0` (top-right only) | 336px | Community standards link |

**"Tiêu chuẩn cộng đồng" button style:**
| Property | Value |
|----------|-------|
| text | "Tiêu chuẩn cộng đồng" |
| font | Montserrat 700 16px |
| color | #E46060 |
| text-align | right |
| width | 336px |
| border | 1px solid #998C5F |
| border-radius | 0 8px 0 0 |
| background | transparent |

**Toolbar icons:** 24×24px dark icons (MM_MEDIA_Bold, MM_MEDIA_Italic, etc.) — icons must be **dark colored** (not white) since toolbar background is transparent/white.

### D: Textarea (Node: I520:11647;520:9886)

| Property | Value |
|----------|-------|
| placeholder | "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!" |
| validation | required, supports @mentions |
| hint text | "Bạn có thể '@' + tên để nhắc tới đồng nghiệp khác" |

### E: Hashtag Field (Node: I520:11647;520:9890)

**Container:** `display: flex; flex-direction: row; align-items: flex-start; gap: 16px; width: 672px; height: 48px`

| Property | Value |
|----------|-------|
| label | "Hashtag *" — width: 152px (fixed), Montserrat 700 22px, #00101A |
| tag group | flex: 1 0 0 (fills remaining space), contains "Hashtag" chip + selected chips |
| trigger | "Hashtag" chip button — PlusIcon (24px) + 2-line text ("Hashtag" / "Tối đa 5") inside single span with `<br />` |
| max | 5 hashtags |
| chips | Selected hashtags displayed as removable chips |
| validation | required, min 1, max 5 |

### F: Image Upload (Node: I520:11647;520:9896)

**Container:** `display: flex; flex-direction: row; align-items: center; gap: 16px; width: 672px; height: 80px`

| Property | Value |
|----------|-------|
| label | "Image" — Montserrat 700 22px, #00101A (fixed width, left column) |
| thumbnails | 80×80px each, `border: 1px solid #998C5F`, `border-radius: 18px`, `aspect-ratio: 1/1` |
| thumbnail (error) | `border: 2px solid #E46060` (red border replaces normal border when file > 10MB) |
| error text | Montserrat 700 11px, color `#E46060`, shown below the thumbnail row; content: "Ảnh vượt quá 10MB" |
| add button | "Image" chip (hidden when 5 reached) — PlusIcon (24px) + 2-line text ("Image" / "Tối đa 5") inside single span with `<br />`, both lines inside the button |
| max | 5 images |
| max file size | 10MB per file |
| validation | optional (count); size validation required per file — oversized files show error state, block submit |

### G: Anonymous Toggle (Node: I520:11647;520:14099)

| Property | Value |
|----------|-------|
| label | "Gửi lời cám ơn và ghi nhận ẩn danh" |
| type | boolean checkbox/toggle |
| effect | When on: show anonymous name input field |

### H: Action Buttons (Node: I520:11647;520:9905)

**H.1 Hủy (Cancel) (Node: I520:11647;520:9906):**
| Property | Value |
|----------|-------|
| label | "Hủy" + × icon |
| background | rgba(255,234,158,0.10) |
| border | 1px solid #998C5F |

**H.2 Gửi (Send) (Node: I520:11647;520:9907):**
| Property | Value |
|----------|-------|
| label | "Gửi" + send icon |
| background | #FFEA9E |
| disabled | when required fields empty |

---

## Responsive Specifications

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Page | 1440×1024px | Full viewport |
| Modal | 752×1012px centered | Full-width, scrollable |

---

## Animation & Transitions

| Element | Property | Duration | Notes |
|---------|----------|----------|-------|
| Modal | opacity, scale | 200ms | ease-out, on open |
| Submit button | opacity | 150ms | Enabled/disabled state change |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page | 520:11602 | `relative min-h-screen bg-[#00101A] overflow-hidden` | `<WriteKudoPage>` |
| Overlay mask | 520:11646 | `absolute inset-0 bg-[#00101A]/80` | `<div>` |
| Modal | 520:11647 | `absolute bg-[#FFF8E1] rounded-[24px] p-10 w-[752px] flex flex-col gap-8 overflow-y-auto` | `<KudoForm>` |
| Title | — | `font-montserrat font-bold text-[32px] leading-[40px] text-[#00101A] text-center` | `<h2>` |
| Form group (B/E/F) | — | `flex flex-row items-center gap-4 w-full` | — |
| Field label | — | `w-[152px] shrink-0 font-montserrat font-bold text-[22px] leading-[28px] text-[#00101A]` | `<label>` |
| Search input | — | `flex-1 h-14 bg-white border border-[#998C5F] rounded-lg px-6 py-4` | `<RecipientSearch>` |
| Danh hiệu group | I520:11647;1688:10448 | `flex flex-row items-start gap-4` (label 152px, input flex-1, hint below) | `<DanhHieuField>` |
| Danh hiệu input | — | `flex-1 bg-white border border-[#998C5F] rounded-lg px-6 py-4` | `<input>` |
| Toolbar | — | `flex flex-row items-center` (no gap, shared borders) | `<RichTextToolbar>` |
| Toolbar btn (middle) | — | `h-10 px-4 py-[10px] bg-transparent border border-[#998C5F]` | `<button>` |
| Toolbar btn Bold | — | `h-10 px-4 py-[10px] bg-transparent border border-[#998C5F] rounded-tl-lg` | `<button>` |
| Toolbar "Tiêu chuẩn" | — | `w-[336px] h-10 px-4 bg-transparent border border-[#998C5F] rounded-tr-lg font-montserrat font-bold text-[16px] text-[#E46060] text-right` | `<button>` |
| Textarea | — | `w-full min-h-[120px] bg-white border border-[#998C5F] rounded-lg p-4` | `<RichTextEditor>` |
| Cancel btn | — | `flex items-center gap-2 px-10 py-4 bg-[rgba(255,234,158,0.10)] border border-[#998C5F] rounded` | `<button>` |
| Send btn | — | `flex items-center justify-center gap-2 flex-1 h-[60px] bg-[#FFEA9E] rounded-lg disabled:opacity-50` | `<button type="submit">` |

---

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v3.1 | 2026-03-25 | Cosmetic | Requirement change: Added image error state (red border + error text) to Component F for files exceeding 10MB |
| v3.0 | 2026-03-25 | Cosmetic | Fix modal gap token: 24px→32px (Figma source: gap:32px); update Implementation Mapping gap-6→gap-8 |
| v2.1 | 2026-03-17 | Cosmetic | Requirement change: Standardize all inline row label widths to 152px — updated B label (146px→152px), B.NEW label (139px→152px), B.NEW input (514px→flex:1), E label (108px→152px), E tag group (548px→flex:1); ASCII diagram; Implementation Mapping (Field label w-[152px], Danh hiệu group/input flex layout) |
| v2.0 | 2026-03-17 | Structural | Form groups (B/E/F) changed to inline row layout; new "Danh hiệu" field added (B.NEW section); toolbar styling overhauled (shared borders, border-radius per button, dark icons); "Tiêu chuẩn cộng đồng" button added; --spacing-toolbar-gap updated to 0px; --color-community-link token added |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |
