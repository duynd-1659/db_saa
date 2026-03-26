```markdown
# Design Style: [FEATURE_NAME]

**Frame ID**: `[FRAME_ID]`
**Frame Name**: `[FRAME_NAME]`
**Figma File Key**: `[FILE_KEY]`
**Figma Link**: [FIGMA_DIRECT_LINK]
**Version**: v1.0
**Last updated**: [DATE]
**Extracted At**: [DATE]

---

## Changelog

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1.0 | [DATE] | Initial | Initial extraction from Figma |

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | RGBA | Usage |
|------------|-----------|---------|------|-------|
| --color-primary | #3B82F6 | 100% | rgba(59,130,246,1) | Primary buttons, links |
| --color-primary-hover | #2563EB | 100% | rgba(37,99,235,1) | Button hover state |
| --color-secondary | #6B7280 | 100% | rgba(107,114,128,1) | Secondary text |
| --color-background | #FFFFFF | 100% | rgba(255,255,255,1) | Page background |
| --color-surface | #F9FAFB | 100% | rgba(249,250,251,1) | Card backgrounds |
| --color-border | #E5E7EB | 100% | rgba(229,231,235,1) | Input borders |
| --color-error | #EF4444 | 100% | rgba(239,68,68,1) | Error messages |
| --color-success | #10B981 | 100% | rgba(16,185,129,1) | Success messages |
| --color-text-primary | #111827 | 100% | rgba(17,24,39,1) | Headings, body |
| --color-text-secondary | #6B7280 | 100% | rgba(107,114,128,1) | Labels, hints |

> **Note**: Always document RGBA alongside hex. Many Figma fills use fractional opacity (e.g., `rgba(255,234,158,0.40)`) — these cannot be expressed as plain hex.

### Gradients

| Token Name | Type | Value | Usage |
|------------|------|-------|-------|
| --gradient-hero | linear | `linear-gradient(180deg, #[start] 0%, #[end] 100%)` | Hero background |
| --gradient-overlay | radial | `radial-gradient(circle at 50% 50%, #[start] 0%, transparent 70%)` | Spotlight overlay |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Text Transform |
|------------|-------------|------|--------|-------------|----------------|----------------|
| --text-heading-1 | Inter | 32px | 700 | 40px | -0.02em | none |
| --text-heading-2 | Inter | 24px | 600 | 32px | -0.01em | none |
| --text-heading-3 | Inter | 20px | 600 | 28px | 0 | none |
| --text-body | Inter | 16px | 400 | 24px | 0 | none |
| --text-body-sm | Inter | 14px | 400 | 20px | 0 | none |
| --text-label | Inter | 14px | 500 | 20px | 0.5px | uppercase |
| --text-caption | Inter | 12px | 400 | 16px | 0.01em | none |
| --text-button | Inter | 16px | 500 | 24px | 0 | none |

> Add `Text Transform` column — uppercase labels are frequently missed in v1 template.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-xs | 4px | Tight gaps |
| --spacing-sm | 8px | Small gaps |
| --spacing-md | 16px | Default gaps |
| --spacing-lg | 24px | Section gaps |
| --spacing-xl | 32px | Large sections |
| --spacing-2xl | 48px | Page sections |
| --spacing-page-x | [X]px | Horizontal page padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-sm | 4px | Small elements |
| --radius-md | 8px | Buttons, inputs |
| --radius-lg | 12px | Cards |
| --radius-xl | 16px | Modals |
| --radius-full | 9999px | Pills, avatars |
| --border-width | 1px | Default border |
| --border-width-focus | 2px | Focus state |

### Shadows & Effects

| Token Name | Type | Value | Usage |
|------------|------|-------|-------|
| --shadow-sm | box-shadow | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| --shadow-md | box-shadow | `0 4px 6px rgba(0,0,0,0.1)` | Cards |
| --shadow-lg | box-shadow | `0 10px 15px rgba(0,0,0,0.1)` | Dropdowns |
| --shadow-xl | box-shadow | `0 20px 25px rgba(0,0,0,0.15)` | Modals |
| --shadow-glow | box-shadow | `0 0 20px rgba(255,234,158,0.4)` | Glow effects |
| --text-shadow-glow | text-shadow | `0 0 12px rgba(255,234,158,0.8)` | Text glow |
| --backdrop-blur | backdrop-filter | `blur(12px)` | Glassmorphism overlay |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| max-width | 1200px | Desktop max |
| padding-x | 24px | Horizontal padding |
| padding-y | 32px | Vertical padding |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack |
| gap | 16px | Between items |
| align-items | stretch | Full width children |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│  Container (max-width: [X]px, padding: [Y]px)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Header Section (height: [X]px, padding: [Y]px)       │  │
│  │  ┌─────────┐  ┌──────────────────────────────────┐    │  │
│  │  │  Logo   │  │  Title (font: [X], color: [Y])   │    │  │
│  │  └─────────┘  └──────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Main Content (gap: [X]px)                            │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Component A (w: [X], h: [Y], p: [Z])           │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Component B                                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Footer (padding: [X]px, gap: [Y]px)                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

> **Property extraction reference** — check Figma data for each of these when filling component tables. Only write rows that have an actual value; omit rows entirely if the property does not apply.
>
> - **Layout**: `width` `height` `min/max-width` `min/max-height` `position` `top/right/bottom/left` `z-index` `display` `flex-direction` `flex-wrap` `align-items` `justify-content` `align-self` `flex-grow` `flex-shrink` `gap` `padding` `overflow`
> - **Visual**: `background` `background-image` `opacity` `border` `border-radius` `box-shadow` `backdrop-filter` `mix-blend-mode` `filter` `cursor`
> - **Typography**: `font-family` `font-size` `font-weight` `line-height` `letter-spacing` `text-align` `text-transform` `text-decoration` `color` `text-shadow` `white-space` `text-overflow` `-webkit-line-clamp`
>
> **Output rules:**
> 1. Only write rows with actual extracted values — never copy placeholder rows.
> 2. If a typography style matches a token already defined in Design Tokens, write `→ --token-name` instead of repeating the full table. Only write a full table for typography that has no matching token or overrides one.
> 3. For repeated components (e.g. a list of cards), document **one template** section + a `Variants` table for differences. Do not duplicate full sections per instance.
> 4. Skip the States table entirely for static components.
> 5. Do not add a "Component Hierarchy with Styles" section — the ASCII layout diagram already captures this.

---

### [Component Name] — e.g., Primary Button

**Node ID**: `[FIGMA_NODE_ID]`
**Figma path**: `[FrameName > GroupName > ComponentName]`
**Type**: `INSTANCE` / `FRAME` / `TEXT`

#### Dimensions & Layout

| Property | Value |
|----------|-------|
| width | 200px |
| height | 52px |
| display | flex |
| align-items | center |
| padding | 14px 24px |
| gap | 8px |

#### Visual

| Property | Value |
|----------|-------|
| background | rgba(59, 130, 246, 1) |
| border-radius | 8px |
| cursor | pointer |

#### Typography

`→ --text-button` — color: `rgba(255, 255, 255, 1)`

#### States

> Only include state columns that differ from Default. Only include property rows that change across states.

| Property | Default | Hover | Disabled |
|----------|---------|-------|----------|
| background | rgba(59,130,246,1) | rgba(37,99,235,1) | rgba(59,130,246,0.4) |
| cursor | pointer | pointer | not-allowed |

> Hover state Node ID: `[NODE_ID]` / Disabled state Node ID: `[NODE_ID]`

---

### [Repeated Component Name] — e.g., Card (shared template for N instances)

> Use this pattern when multiple instances share the same structure with only minor differences.

**Template Node ID**: `[FIGMA_NODE_ID]` (first instance used as reference)

#### Dimensions & Layout

| Property | Value |
|----------|-------|
| width | 320px |
| display | flex |
| flex-direction | column |
| gap | 16px |
| padding | 24px |

#### Visual

| Property | Value |
|----------|-------|
| background | rgba(255, 255, 255, 1) |
| border | 1px solid rgba(229, 231, 235, 1) |
| border-radius | 12px |

#### Typography

`→ --text-body` — color: `rgba(17, 24, 39, 1)`

#### States

| Property | Default | Hover |
|----------|---------|-------|
| transform | none | `translateY(-2px)` |
| box-shadow | `0 1px 3px 0 rgba(0,0,0,0.1)` | `0 4px 12px 0 rgba(0,0,0,0.15)` |

#### Variants

| Instance | Node ID | Difference from template |
|----------|---------|--------------------------|
| Card A | `[ID]` | height: 420px |
| Card B | `[ID]` | — (identical) |
| Card C | `[ID]` | height: 480px, border-color: rgba(255,234,158,0.3) |

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 640px)

| Component | Property | Desktop value | Mobile value |
|-----------|----------|---------------|--------------|
| Container | padding-x | 24px | 16px |
| Title | font-size | 32px | 24px |
| Form | width | 400px max | 100% |
| Button | width | auto | 100% |
| Navigation | display | flex | none (hamburger) |

#### Tablet (640px – 1023px)

| Component | Property | Desktop value | Tablet value |
|-----------|----------|---------------|--------------|
| Container | padding-x | 24px | 20px |
| Form | max-width | 400px | 100% |

---

## Icon Specifications

| Icon Name | Size | Color | Figma Node ID | Usage |
|-----------|------|-------|---------------|-------|
| icon-email | 20×20 | #6B7280 | [NODE_ID] | Input prefix |
| icon-password | 20×20 | #6B7280 | [NODE_ID] | Input prefix |
| icon-eye | 20×20 | #6B7280 | [NODE_ID] | Password toggle |
| icon-check | 16×16 | #10B981 | [NODE_ID] | Success indicator |
| icon-error | 16×16 | #EF4444 | [NODE_ID] | Error indicator |

> Icons **MUST** use Icon Component, not raw `<svg>` or `<img>` tags.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger | Notes |
|---------|----------|----------|--------|---------|-------|
| Button | background-color | 150ms | ease-in-out | Hover | — |
| Input | border-color, box-shadow | 150ms | ease-in-out | Focus | — |
| Card | transform, box-shadow | 200ms | ease-out | Hover | — |
| Modal | opacity, transform | 200ms | ease-out | Open/Close | slide-in-from-top |
| Dropdown | opacity, transform | 150ms | ease-out | Toggle | fade-in |
| Carousel | transform | 300ms | ease-in-out | Navigate | — |

---

## Implementation Mapping

> Framework-specific class names (Tailwind, SCSS, CSS-in-JS) are determined during `plan.md` / `tasks.md` generation based on the project constitution. This table maps design elements to components and source files only.

| Design Element | Figma Node ID | Component | File Path |
|----------------|---------------|-----------|-----------|
| Primary Button | 123:456 | `<Button variant="primary">` | `src/components/ui/Button.tsx` |
| Input Field | 123:457 | `<Input />` | `src/components/ui/Input.tsx` |
| Card | 123:458 | `<Card />` | `src/components/ui/Card.tsx` |
| Form Container | 123:459 | `<Form />` | `src/components/ui/Form.tsx` |

---

## Extraction Verification Checklist

After filling this document, verify against the **frame image**:

### Colors
- [ ] All background colors match frame image (check RGBA opacity, not just hex)
- [ ] Text colors match — especially subtle grays that look similar
- [ ] Gradient direction and stops correct
- [ ] Overlay / blend mode colors correct

### Typography
- [ ] Font sizes match — especially distinguish 14px vs 16px vs 20px visually
- [ ] Font weights correct — 400 vs 500 vs 600 vs 700
- [ ] Letter spacing on labels (uppercase labels often have `tracking-[0.5px]`)
- [ ] Line heights correct — affects multi-line text layout
- [ ] Text transforms (`uppercase`, `capitalize`) captured

### Spacing & Dimensions
- [ ] Card/container widths match
- [ ] Padding values correct (top ≠ bottom is common in designs)
- [ ] Gap between elements measured correctly
- [ ] Border radius matches (Figma uses px, verify rounded value)

### Effects
- [ ] Box shadows complete (`spread` value often missed)
- [ ] `backdrop-filter` (blur) captured where present
- [ ] `text-shadow` / glow effects captured
- [ ] Opacity overlays on elements (not just on colors)

### States
- [ ] Hover state values extracted from Figma component variants
- [ ] Focus/selected state values correct
- [ ] Disabled state opacity / color difference captured

### Missing elements
- [ ] Scrollbar styling (if custom)
- [ ] Custom selection color (::selection)
- [ ] Skeleton / loading state dimensions

---

## Notes

- All colors use CSS variables for theming support
- Always use RGBA for semi-transparent colors — `rgba(255,234,158,0.40)` cannot be represented as hex
- Icons **MUST** use the Icon Component instead of raw svg or img tags
- Ensure color contrast meets WCAG AA: 4.5:1 for normal text, 3:1 for large text
- When Figma uses design tokens/variables, document the resolved value AND the variable name
- Framework-specific implementation (Tailwind classes, SCSS variables, CSS-in-JS) belongs in `plan.md` / `tasks.md`, not here
```
