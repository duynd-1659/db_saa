# Design Style: Countdown - Prelaunch page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=2268:35127
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Full page background |
| --color-text-primary | #FFFFFF | 100% | Headline and unit label text |
| --color-digit-border | #FFEA9E | 100% | Glass digit card border |
| --color-digit-bg-top | #FFFFFF | 100% | Digit card gradient top |
| --color-digit-bg-bottom | rgba(255,255,255,0.10) | 10% | Digit card gradient bottom |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-headline | Montserrat | 36px | 700 | 48px | 0px |
| --text-unit-label | Montserrat | 36px | 700 | 48px | 0px |
| --text-digit | Digital Numbers | 73.73px | 400 | — | 0% |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-padding | 96px 144px | Outer section padding (top/bottom, left/right) |
| --spacing-digit-gap | 21px | Gap between digit cards within a unit |
| --spacing-unit-gap | 60px | Gap between DAYS / HOURS / MINUTES groups |
| --spacing-section-gap | 120px | Gap between header/title and countdown section |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-digit-card | 12px | Digit card border-radius |
| --border-digit-card | 0.75px solid #FFEA9E | Digit card border |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --blur-digit-card | backdrop-filter: blur(24.96px) | Glass-morphism blur on digit cards |
| --gradient-cover | linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%) | Dark gradient overlay over background image |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px | Full viewport width |
| height | 1077px | Full viewport height |
| background | #00101A | Base dark background |
| position | relative | Contains absolute children |

### Layout Structure (ASCII)

```
┌───────────────────────────────────────────────────────────┐
│  Page (1512×1077px, bg: #00101A)                          │
│  ┌───────────────────────────────────────────────────────┐│
│  │ Background Image (1512×1077px, absolute)              ││
│  └───────────────────────────────────────────────────────┘│
│  ┌───────────────────────────────────────────────────────┐│
│  │ Cover Gradient (1512×1077px, absolute)                ││
│  │ linear-gradient(18deg, #00101A → transparent)         ││
│  └───────────────────────────────────────────────────────┘│
│  ┌───────────────────────────────────────────────────────┐│
│  │ Bìa (content area, padding: 96px 144px)               ││
│  │                                                       ││
│  │  "Sự kiện sẽ bắt đầu sau" (36px Montserrat 700)      ││
│  │  ────────────────────────────────────────────         ││
│  │  ┌──────────┐  gap:60px  ┌──────────┐  ┌──────────┐  ││
│  │  │1_Days    │            │2_Hours   │  │3_Minutes │  ││
│  │  │175×192px │            │175×192px │  │175×192px │  ││
│  │  │┌──┐┌──┐  │            │┌──┐┌──┐ │  │┌──┐┌──┐  │  ││
│  │  ││0 ││0 │  │            ││0 ││5 │ │  ││2 ││0 │  │  ││
│  │  ││77││77│  │            ││77││77│ │  ││77││77│  │  ││
│  │  │└──┘└──┘  │            │└──┘└──┘ │  │└──┘└──┘  │  ││
│  │  │"DAYS"    │            │"HOURS"  │  │"MINUTES" │  ││
│  │  └──────────┘            └──────────┘  └──────────┘  ││
│  └───────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Background Image (2268:35129)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2268:35129 | — |
| width | 1512px | `width: 100%` |
| height | 1077px | `height: 100%` |
| position | absolute | `position: absolute; inset: 0` |
| background-size | 109.39% | `background-size: cover` |

### Cover Gradient (2268:35130)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2268:35130 | — |
| position | absolute | `position: absolute; inset: 0` |
| background | linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%) | `background: linear-gradient(18deg, ...)` |

### Headline Text (2268:35137)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2268:35137 | — |
| text | "Sự kiện sẽ bắt đầu sau" | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 48px | `line-height: 48px` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |

### Digit Card Component (per digit — e.g. I2268:35141;186:2616)

| Property | Value | CSS |
|----------|-------|-----|
| **Component ID** | 186:2619 | — |
| width | 77px | `width: 77px` |
| height | 123px | `height: 123px` |
| border | 0.75px solid #FFEA9E | `border: 0.75px solid var(--color-digit-border)` |
| border-radius | 12px | `border-radius: 12px` |
| background | linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%) | `background: linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)` |
| backdrop-filter | blur(24.96px) | `backdrop-filter: blur(24.96px)` |
| opacity | 0.5 | `opacity: 0.5` |

### Digit Number Text (per digit — e.g. I2268:35141;186:2617)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Digital Numbers | `font-family: 'Digital Numbers', monospace` |
| font-size | 73.73px | `font-size: 73.73px` |
| font-weight | 400 | `font-weight: 400` |
| color | #FFFFFF | `color: white` |
| width | 59px | — |
| height | 95px | — |

### Unit Groups (1_Days, 2_Hours, 3_Minutes)

| Property | Value | Notes |
|----------|-------|-------|
| width | 175px | Fixed |
| height | 192px | Fixed (digits 123px + gap 21px + label 48px) |
| flex-direction | column | Digits row on top, label below |
| gap between elements | 21px | Between digit row and label |

### Unit Label (DAYS / HOURS / MINUTES)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 48px | `line-height: 48px` |
| color | #FFFFFF | `color: white` |

---

## Responsive Specifications

This is a full-screen prelaunch page — displayed before the event starts.

| Component | Breakpoint | Behavior |
|-----------|------------|----------|
| Page | Desktop (1440px+) | Fixed 1512px design width, scale to viewport |
| Countdown | Mobile | Stack units vertically or reduce font sizes |
| Digit cards | Mobile | Scale down proportionally |

---

## Animation & Transitions

| Element | Property | Duration | Notes |
|---------|----------|----------|-------|
| Countdown digits | content update | 1000ms | Live countdown, update every second |
| Page | opacity | 300ms | Fade in on load |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page container | 2268:35127 | `relative min-h-screen bg-[#00101A] overflow-hidden` | `<CountdownPage>` |
| Background image | 2268:35129 | `absolute inset-0 object-cover w-full h-full` | `<Image fill>` |
| Cover gradient | 2268:35130 | `absolute inset-0` (inline style gradient) | `<div>` |
| Content section | 2268:35131 | `absolute flex flex-col items-center justify-center gap-[120px] p-[96px_144px]` | `<section>` |
| Headline | 2268:35137 | `font-montserrat font-bold text-[36px] leading-[48px] text-white text-center` | `<h1>` |
| Time units row | 2268:35138 | `flex flex-row gap-[60px] items-center` | `<div>` |
| Unit group | 2268:35139 | `flex flex-col gap-[21px] items-start` | `<CountdownUnit>` |
| Digit cards row | 2268:35140 | `flex flex-row gap-[21px] items-center` | `<div>` |
| Single digit card | 186:2619 | `w-[77px] h-[123px] rounded-[12px] border border-[#FFEA9E]/75 opacity-50 backdrop-blur-[25px]` | `<DigitCard>` |
| Digit number | 186:2617 | `font-["Digital_Numbers"] text-[73px] font-normal text-white` | `<span>` |
| Unit label | 2268:35143 | `font-montserrat font-bold text-[36px] leading-[48px] text-white` | `<span>` |

---

## Notes

- The **"Digital Numbers"** font must be loaded (not a standard web font — check Google Fonts or self-host).
- Each countdown unit shows **2 digit cards** side-by-side (tens and units digits, e.g. "0" and "5" for 5 hours).
- The digit card has `opacity: 0.5` on the glass background — the digit number itself is full opacity white layered above.
- The countdown must be computed client-side using the event start datetime from `app_config` table key `event_start_datetime`.
- When the countdown reaches zero, redirect to Login or Homepage.
