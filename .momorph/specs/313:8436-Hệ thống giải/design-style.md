# Design Style: Hệ thống giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Version**: v2.2
**Last synced**: 2026-03-25

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v2.2 | 2026-03-25 | Cosmetic | Fix nav active state: border-bottom (not left), add icon gold + text-shadow glow, fix indicator to 1px solid #FFEA9E. |
| v2.1 | 2026-03-25 | Cosmetic | Fix C: Left Nav width: ~220px → 178px (Figma source of truth). |
| v2.0 | 2026-03-18 | Structural | Requirement change: WidgetButton added to Implementation Mapping table. |
| v1.2 | 2026-03-11 | Structural | Add icons to nav menu + award card titles, add diamond icon to count section, fix stat label styles (muted → bold gold), fix count layout (vertical → horizontal) |
| v1.1 | 2026-03-11 | Cosmetic | Remove redundant CSS border on award card images (composite assets already include gold glow) |
| v1.0 | 2026-03-10 | Initial | Initial spec from Figma |

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-page-bg` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Sticky header |
| `--color-cover-gradient` | `linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0.00) 52.79%)` | Keyvisual cover overlay |
| `--color-gold` | `rgba(255, 234, 158, 1)` | `#FFEA9E` — titles, active nav, award values |
| `--color-border` | `#998C5F` | Borders, card borders |
| `--color-white` | `rgba(255, 255, 255, 1)` | Body text |
| `--color-text-muted` | `rgba(255, 255, 255, 0.6)` | Labels, secondary text |
| `--color-nav-active` | `#FFEA9E` + underline | Active nav item |

### Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page section subheading | Montserrat | 14px | 700 | White |
| Section heading | Montserrat Alternates | 40px | 700 | `#FFEA9E` |
| Award card title | Montserrat | 24–28px | 700 | White |
| Award card description | Montserrat | 16px | 400 | White |
| Award stat label | Montserrat | 14px | 700 | `#FFEA9E` (gold) |
| Award stat value | Montserrat | 24px | 700 | `#FFEA9E` |
| Nav menu items | Montserrat | 16px | 600 | White / Gold (active) |
| Footer copyright | Montserrat Alternates | 16px | 700 | White |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-page-x` | `144px` | Horizontal page padding |
| `--spacing-page-y` | `96px` | Vertical section padding |
| `--spacing-section-gap` | `120px` | Gap between major sections |
| `--spacing-content-gap` | `80px` | Gap between items within sections |
| `--spacing-award-card-gap` | `40px` | ~~Gap between award detail cards~~ — **not used**; cards are separated by dividers, no gap |

### Borders

| Element | Border |
|---------|--------|
| Award card image | No CSS border — gold glow + rounded corners are baked into the composite image asset |
| Left nav active indicator | `border-bottom: 1px solid #FFEA9E` |
| Section dividers (within card stats) | `1px solid rgba(255, 234, 158, 0.1)` |
| **Divider between award cards** | `1px solid #2E3940` — separates each card, no gap spacing |

---

## Layout Specifications

### Page Structure (1440×6410px)

```
┌──────────────────────────────── 1440px ──────────────────────────────────┐
│ Header (fixed)                                              80px         │
│  [Logo] [About SAA 2025] [Awards Information*] [Sun* Kudos]              │
│                                                [Bell][VI/EN][Avatar]     │
├──────────────────────────────────────────────────────────────────────────┤
│ Keyvisual (relative container, padding: 96px 144px)            547px     │
│  background: linear-gradient(...) + url(url keyvisual bg image) — single CSS bg  │
│  ┌── KV: ROOT FURTHER Logo (absolute top-left) ─────────────────┐         │
│  └───────────────────────────────────────────────────────────────┘         │
│  ┌── A: Title Section (absolute bottom, horizontally centered) ─┐         │
│  │  "Sun* Annual Awards 2025" (caption)                           │         │
│  │  ── divider line ──                                             │         │
│  │  "Hệ thống giải thưởng SAA 2025" (heading)                    │         │
│  └───────────────────────────────────────────────────────────────┘         │
├──────────────────────────────────────────────────────────────────────────┤
│ Content area (padding: 96px 144px, gap: 120px)                           │
│  ┌── B: Award System (1152px, gap: 80px) ──────────────────────────┐    │
│  │  ┌─ C: Left Nav (220px) ─┐  ┌─ D: Award Detail Cards ─────────┐ │    │
│  │  │  Top Talent           │  │  D.1: Top Talent                 │ │    │
│  │  │  Top Project          │  │   [Image 336×336] + Content      │ │    │
│  │  │  Top Project Leader   │  │   Title / Description            │ │    │
│  │  │  Best Manager         │  │   Qty: 10 / Value: 7.000.000 VNĐ │ │    │
│  │  │  Signature 2025       │  │  D.2: Top Project                │ │    │
│  │  │  MVP*                 │  │  D.3: Top Project Leader         │ │    │
│  │  └───────────────────────┘  │  D.4: Best Manager               │ │    │
│  │                              │  D.5: Signature 2025 - Creator   │ │    │
│  │                              │  D.6: MVP                        │ │    │
│  │                              └───────────────────────────────── ┘ │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│  D1: Sun* Kudos promo block (1152×500px)                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ Footer (padding: 40px 90px)                                  144px        │
│   [Logo] [Links...] | © Sun* 2025                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header

| Property | Value |
|----------|-------|
| Node ID | `313:8440` |
| Dimensions | `1440×80px` |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Position | Fixed |

Active link: "Awards Information" — gold text + underline

### Keyvisual (Composite Section)

The Keyvisual is a **relative container** (547px height) containing:
1. Background via single CSS `background` shorthand: `linear-gradient(...), url(url keyvisual bg image)` — no separate `<Image>` or overlay div
2. ROOT FURTHER logo — absolute top-left
3. Title Section — absolute bottom, horizontally centered

| Property | Value |
|----------|-------|
| Container Node | `313:8449` "Bìa" |
| BG Image Node | `313:8437` |
| Dimensions | `1440×547px` |
| Position | `relative` (contains absolutely-positioned children) |
| Cover gradient | `linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0.00) 52.79%)` |

### KV: ROOT FURTHER Logo

| Property | Value |
|----------|-------|
| Node ID | `313:8450` |
| Position | **Absolute top-left** within Keyvisual container |
| Content | "ROOT FURTHER" logo image |
| Child | `2789:12915` — `MM_MEDIA_Root Further Logo` |

### A: Title Section

| Property | Value |
|----------|-------|
| Node ID | `313:8453` |
| Dimensions | `1152×129px` |
| Position | **Absolute bottom of Keyvisual, horizontally centered** |
| Layout | `flex column, gap: 16px` |

| Sub-element | Style |
|-------------|-------|
| Caption "Sun* Annual Awards 2025" | Montserrat 14px 700 white |
| Divider line | Rectangle separator |
| Heading "Hệ thống giải thưởng SAA 2025" | Montserrat Alternates 700 40px+ #FFEA9E |

### B: Award System Layout

| Property | Value |
|----------|-------|
| Node ID | `313:8458` |
| Dimensions | `1152×4833px` |
| Layout | `flex, gap: 80px` |

### C: Left Navigation Menu

| Property | Value |
|----------|-------|
| Node ID | `313:8459` |
| Width | 178px (sticky left) |
| Items | 6 categories |
| Item layout | [MM_MEDIA_Target icon] + text label (horizontal, gap 4px) |
| Active style | `border-bottom: 1px solid #FFEA9E` + text `color: #FFEA9E` + text-shadow glow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` + icon gold (inherit `currentColor`) |
| Non-active style | text `color: rgba(255,255,255,1)` (white) |
| Hover style | Highlight |

Items: Top Talent (C.1), Top Project (C.2), Top Project Leader (C.3), Best Manager (C.4), Signature 2025 (C.5), MVP (C.6)

### D: Award Detail Cards

Each award card shares the same template with **alternating layout** (odd/even cards mirror image+content order):

| Property | Value |
|----------|-------|
| Layout | `flex row`, **alternating**: odd cards (index 0, 2, 4) → image left + content right; even cards (index 1, 3, 5) → content left + image right (`flex-row-reverse`) |
| Image | `336×336px` square, composite asset (gold glow + rounded corners baked in, no CSS border needed) |
| Content | [MM_MEDIA_Target icon] (white) + Title (700 **gold** `#FFEA9E`) + Description (400 white) + Stats |

**Award stats row:**
- "Số lượng giải thưởng": [MM_MEDIA_Diamond icon] + Label (bold gold) + Number (**bold white** 24px) + Unit type (**bold white** 14px) — single horizontal row
- "Giá trị giải thưởng": [MM_MEDIA_License icon] + Label (bold gold), then Value (**bold white** 24px) on next line + "cho mỗi giải thưởng" (**bold white** 14px)
- **Signature 2025 — second value row**: same as first row (label: bold gold, value + perTeam: bold white)

**Award data:**

| Award | Qty | Type | Value |
|-------|-----|------|-------|
| Top Talent | 10 | Đơn vị | 7.000.000 VNĐ |
| Top Project | 2 | Tập thể | 15.000.000 VNĐ |
| Top Project Leader | 3 | Cá nhân | 7.000.000 VNĐ |
| Best Manager | 1 | Cá nhân | 10.000.000 VNĐ |
| Signature 2025 - Creator | 1 | — | 5.000.000 (cá nhân) / 8.000.000 VNĐ (tập thể) |
| MVP | 1 | — | 15.000.000 VNĐ |

### D1: Sun* Kudos Promo

| Property | Value |
|----------|-------|
| Node ID | `335:12023` |
| Dimensions | `1152×500px` |
| Background | `#0F0F0F` + `border-radius: 16px` + `kudos-illustration.png` as BG image (right-aligned, cover height) |
| Layout | `flex row`, content left (`ml-[65px]`, `w-[470px]`), KUDOS logo absolutely positioned right |

**Left content (D2_Content, gap: 32px):**

| Sub-element | Style |
|-------------|-------|
| Label "Phong trào ghi nhận" | Montserrat 24px 700 white, `line-height: 32px` |
| Title "Sun* Kudos" | Montserrat Alternates 57px 700 gold `#FFEA9E`, `line-height: 64px`, `letter-spacing: -0.25px` |
| Description | Montserrat 16px 700 white, `line-height: 24px`, `letter-spacing: 0.5px`, `text-align: justified` |
| Button "Chi tiết" | `h: 56px`, `bg: #FFEA9E`, `color: #00101A`, `border-radius: 4px`, `px: 16px`, 16px 700 + arrow icon 24×24px |

**Right side:**
- `MM_MEDIA_Logo/Kudos` — `saa-kudos-logo.svg` (`374×72px`): combined icon + KUDOS wordmark, absolutely positioned right (`right: 65px`, vertically centered)

### Footer

| Property | Value |
|----------|-------|
| Node ID | `354:4323` |
| Width | `1440px` |
| Padding | `40px 90px` |
| Content | Logo + nav links + copyright |
| Copyright | Montserrat Alternates 700 16px White |

---

## Responsive Specifications

| Breakpoint | Changes |
|------------|---------|
| Desktop (≥1280px) | Side-by-side nav + card layout |
| Tablet (768–1279px) | Nav collapses to top tabs or dropdown |
| Mobile (<768px) | Single column, all cards stacked |

---

## Implementation Mapping

| Node ID | Component | Tailwind / CSS |
|---------|-----------|----------------|
| `313:8440` | `<Header />` | `sticky top-0 bg-[rgba(16,20,23,0.8)]` |
| `313:8449` | `<AwardsKeyvisual />` | `relative h-[547px]` — composite: BG image + logo (abs top-left) + title section (abs bottom center) |
| `313:8453` | `<AwardsSectionTitle />` | `absolute bottom-0 left-1/2 -translate-x-1/2` inside `<AwardsKeyvisual />` |
| `313:8459` | `<AwardsNavMenu />` | `sticky top-20 w-[220px] flex flex-col` |
| `313:8467` | `<AwardCard id="top-talent" />` | `flex gap-10 items-start` |
| `335:12023` | `<KudosPromo />` | `flex items-center` |
| `354:4323` | `<Footer />` | `flex justify-between px-[90px] py-10` |
| — | `<WidgetButton />` (shared) | `fixed bottom-8 right-8 z-40` — `src/components/ui/WidgetButton.tsx`, injected by `(main)/layout.tsx` |
