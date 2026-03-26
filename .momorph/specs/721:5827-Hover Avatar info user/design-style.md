# Design Style: Hover Avatar Info User

**Frame ID**: `721:5827`
**Frame Name**: `Hover Avatar info user`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Version**: v1.0
**Last synced**: 2026-03-19

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v1.0 | 2026-03-19 | Initial | Extracted from Figma (avatar ring states). Popover visual spec from business requirement (no Figma design). |

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-avatar-ring-default` | `#FFFFFF` | Avatar ring in default state |
| `--color-avatar-ring-hover` | `#FFEA9E` | Avatar ring on hover (gold) |
| `--color-popover-bg` | `rgba(0, 16, 26, 0.95)` | Popover card background (dark, matches page bg) |
| `--color-popover-border` | `#998C5F` | Popover card border |
| `--color-white` | `#FFFFFF` | Name text, label text |
| `--color-gold` | `#FFEA9E` | Send KUDO button fill, links |
| `--color-text-muted` | `rgba(255,255,255,0.5)` | Department text, secondary labels |
| `--color-divider` | `rgba(255,255,255,0.15)` | Row 3 divider line |

### Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Avatar hover label (Figma) | Montserrat | 16px | 700 | `#FFFFFF` |
| Popover — Full name (Row 1) | Montserrat | 16px | 700 | `#FFFFFF` |
| Popover — View profile link | Montserrat | 12px | 400 | `#FFEA9E` |
| Popover — Department (Row 2) | Montserrat | 12px | 400 | `rgba(255,255,255,0.5)` |
| Popover — Stat label (Rows 4–5) | Montserrat | 12px | 400 | `rgba(255,255,255,0.5)` |
| Popover — Stat count (Rows 4–5) | Montserrat | 14px | 700 | `#FFFFFF` |
| Popover — Send KUDO button | Montserrat | 13px | 600 | `#00101A` (dark on gold) |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-popover-pad` | `16px` | Popover internal padding |
| `--spacing-popover-row-gap` | `8px` | Gap between rows in popover |
| `--spacing-badge-gap` | `6px` | Gap between dept name and hero badge |

### Borders & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-avatar` | `50%` (64px) | Avatar circular crop |
| `--radius-popover` | `12px` | Popover card corners |
| `--border-avatar-width` | `1.869px` | Avatar ring width (from Figma) |
| `--border-popover` | `1px solid #998C5F` | Popover card border |

---

## Component Style Details

### A: Avatar default (`490:5471`)

| Property | Value |
|----------|-------|
| Node ID | `490:5471` |
| Width | `64px` |
| Height | `64px` |
| Border radius | `64px` (= `50%`) |
| Border | `1.869px solid #FFFFFF` |
| Background | `cover center / lightgray` |
| aspect-ratio | `1 / 1` |

**States:**
| State | Border color |
|-------|-------------|
| Default | `#FFFFFF` |
| Hover (when `SunnerHoverCardTrigger` is active) | `#FFEA9E` |

---

### B: Avatar hover (`490:5469`)

| Property | Value |
|----------|-------|
| Node ID | `490:5469` |
| Width | `64px` |
| Height | `64px` |
| Border radius | `64px` (= `50%`) |
| Border | `1.869px solid #FFEA9E` |
| Background | `cover center / lightgray` |
| aspect-ratio | `1 / 1` |

---

### SunnerHoverCard — Popover card *(no Figma, spec from requirements)*

| Property | Value |
|----------|-------|
| Background | `rgba(0, 16, 26, 0.95)` |
| Border | `1px solid #998C5F` |
| Border radius | `12px` |
| Padding | `16px` |
| Min width | `220px` |
| Max width | `300px` |
| z-index | Above all canvas layers (z-50+) |
| Box shadow | `0 8px 24px rgba(0,0,0,0.5)` |

#### Row 1 — Full name + View profile

| Property | Value |
|----------|-------|
| Name font | Montserrat 16px/700 `#FFFFFF` |
| Name text-decoration | underline |
| View profile link font | Montserrat 12px/400 `#FFEA9E` |
| View profile position | Above name (top of card) |
| Row gap | `4px` between link and name |

#### Row 2 — Department + Hero badge

| Property | Value |
|----------|-------|
| Dept font | Montserrat 12px/400 `rgba(255,255,255,0.5)` |
| Badge image | `109×19px` fixed, same asset as kudo card row 3 |
| Layout | flex row, align-items center, gap `6px` |

#### Row 3 — Divider

| Property | Value |
|----------|-------|
| Height | `1px` |
| Color | `rgba(255,255,255,0.15)` |
| Margin | `8px 0` |

#### Rows 4–5 — Stats

| Property | Value |
|----------|-------|
| Layout | flex row, space-between |
| Label font | Montserrat 12px/400 `rgba(255,255,255,0.5)` |
| Count font | Montserrat 14px/700 `#FFFFFF` |
| Row gap | `6px` between rows 4 and 5 |

#### Row 6 — Send KUDO button

| Property | Value |
|----------|-------|
| Background | `#FFEA9E` (gold) |
| Text | "✏ Send KUDO" |
| Font | Montserrat 13px/600 `#00101A` |
| Border radius | `9999px` (pill) |
| Padding | `8px 16px` |
| Width | `100%` |
| Margin top | `8px` |

---

## ASCII Layout Diagram

```
┌─────────────────────────────┐  ← popover card, min-w: 220px, border-radius: 12px │
│  Full Name                  │  ← 16px/700 white, underline
│  Dept Name  [badge 109×19]  │  ← 12px/400 muted + badge image
│  ─────────────────────────  │  ← 1px divider rgba(255,255,255,0.15)
│  Kudos đã nhận:    9        │  ← label muted + count white/700
│  Kudos đã gửi:    12        │  ← label muted + count white/700
│  ┌─────────────────────┐    │
│  │  ✏  Send KUDO       │    │  ← pill button, gold fill, full width
│  └─────────────────────┘    │
└─────────────────────────────┘

Avatar trigger (anywhere in app):
┌──────────┐          ┌──────────┐
│  ○ img ○ │  hover   │  ◉ img ◉ │
│ white    │  ──────> │ gold     │
│ 1.869px  │          │ 1.869px  │
└──────────┘          └──────────┘
  490:5471              490:5469
  #FFFFFF ring          #FFEA9E ring
```

---

## Implementation Mapping

| Node / Element | Tailwind Classes | Component |
|----------------|-----------------|-----------|
| Avatar default ring | `rounded-full border-[1.869px] border-white w-16 h-16 object-cover` | `SunnerHoverCardTrigger` → child `<img>` |
| Avatar hover ring | `rounded-full border-[1.869px] border-[#FFEA9E] w-16 h-16 object-cover` | Applied via `hover:border-[#FFEA9E]` or state class |
| Popover card | `rounded-xl border border-[#998C5F] bg-[rgba(0,16,26,0.95)] p-4 min-w-[220px] max-w-[300px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-50` | `SunnerHoverCard` |
| Full name | `text-white text-base font-bold underline` | Row 1 `<p>` |
| Department | `text-[rgba(255,255,255,0.5)] text-xs` | Row 2 `<span>` |
| Hero badge | `w-[109px] h-[19px] object-contain` | Row 2 `<img>` |
| Divider | `border-t border-[rgba(255,255,255,0.15)] my-2` | Row 3 `<hr>` |
| Stat label | `text-[rgba(255,255,255,0.5)] text-xs` | Rows 4–5 `<span>` |
| Stat count | `text-white text-sm font-bold` | Rows 4–5 `<span>` |
| Send KUDO button | `w-full rounded-full bg-[#FFEA9E] text-[#00101A] text-[13px] font-semibold px-4 py-2 mt-2` | Row 6 `<button>` |
