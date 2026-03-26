# Design Style: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=662:14387
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name              | Hex Value       | Opacity | Usage                                        |
| ----------------------- | --------------- | ------- | -------------------------------------------- |
| --color-background      | #00101A         | 100%    | Page background, main dark navy              |
| --color-header-bg       | #0B0F12         | 80%     | Header background (semi-transparent)         |
| --color-divider         | #2E3940         | 100%    | Footer border-top divider                    |
| --color-btn-primary     | #FFEA9E         | 100%    | Login button background (golden yellow)      |
| --color-btn-text        | #00101A         | 100%    | Login button text color                      |
| --color-text-white      | #FFFFFF         | 100%    | Header text, footer text, hero text          |
| --color-gradient-left   | #00101A         | 100%    | Left-fade gradient overlay start/solid       |
| --color-gradient-right  | rgba(0,16,26,0) | 0%      | Left-fade gradient overlay end (transparent) |
| --color-gradient-bottom | #00101A         | 100%    | Bottom-fade gradient overlay                 |

### Typography

| Token Name         | Font Family           | Size | Weight | Line Height | Letter Spacing |
| ------------------ | --------------------- | ---- | ------ | ----------- | -------------- |
| --text-hero-title  | (image/logo)          | -    | -      | -           | -              |
| --text-hero-body   | Montserrat            | 20px | 700    | 40px        | 0.5px          |
| --text-btn-primary | Montserrat            | 22px | 700    | 28px        | 0px            |
| --text-nav-label   | Montserrat            | 16px | 700    | 24px        | 0.15px         |
| --text-footer      | Montserrat Alternates | 16px | 700    | 24px        | 0%             |

### Spacing

| Token Name            | Value | Usage                                   |
| --------------------- | ----- | --------------------------------------- |
| --spacing-page-x      | 144px | Horizontal page padding (header & hero) |
| --spacing-page-y      | 96px  | Vertical hero section padding           |
| --spacing-footer-x    | 90px  | Footer horizontal padding               |
| --spacing-footer-y    | 40px  | Footer vertical padding                 |
| --spacing-hero-gap    | 120px | Gap between hero children               |
| --spacing-content-gap | 80px  | Gap between key visual & content block  |
| --spacing-btn-px      | 24px  | Login button horizontal padding         |
| --spacing-btn-py      | 16px  | Login button vertical padding           |
| --spacing-content-pl  | 16px  | Content block left padding              |
| --spacing-header-h    | 80px  | Header height                           |

### Border & Radius

| Token Name        | Value             | Usage                                  |
| ----------------- | ----------------- | -------------------------------------- |
| --radius-btn      | 8px               | Login button border-radius             |
| --radius-lang-btn | 4px               | Language selector button border-radius |
| --border-footer   | 1px solid #2E3940 | Footer top border                      |

### Shadows

| Token Name  | Value                | Usage                               |
| ----------- | -------------------- | ----------------------------------- |
| (btn-hover) | subtle lift / shadow | Login button hover state (per spec) |

---

## Layout Specifications

### Container

| Property   | Value    | Notes                                  |
| ---------- | -------- | -------------------------------------- |
| width      | 1440px   | Desktop frame width                    |
| height     | 1024px   | Desktop frame height                   |
| background | #00101A  | Dark navy page background              |
| position   | relative | Stacking context for absolute children |

### Layout Structure (ASCII)

```
┌───────────────────────────────────────────────────────────────────┐
│  PAGE (1440 × 1024px, bg: #00101A)                                │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  A_Header (1440 × 80px, bg: rgba(11,15,18,0.8))           │   │
│  │  padding: 12px 144px  display: flex row space-between      │   │
│  │  ┌──────────┐                              ┌───────────┐   │   │
│  │  │ A.1_Logo │                              │A.2_Language│  │   │
│  │  │ 52×56px  │                              │ 108×56px  │   │   │
│  │  └──────────┘                              └───────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Keyvisual background artwork fills full 1440×1022px]            │
│  [Gradient overlays: left-fade + bottom-fade]                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  B_Bìa (1440 × 845px, top: 88px)                          │   │
│  │  padding: 96px 144px  flex column  gap: 120px              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │  Frame 487 (1152 × 653px)  flex column  gap: 80px   │   │   │
│  │  │                                                     │   │   │
│  │  │  ┌───────────────────────────────────────────────┐  │   │   │
│  │  │  │  B.1_Key Visual (1152 × 200px)                │  │   │   │
│  │  │  │  "ROOT FURTHER" logo image (451 × 200px)      │  │   │   │
│  │  │  └───────────────────────────────────────────────┘  │   │   │
│  │  │                          gap: 80px                  │   │   │
│  │  │  ┌───────────────────────────────────────────────┐  │   │   │
│  │  │  │  Frame 550 (496px, p-left: 16px)              │  │   │   │
│  │  │  │  flex column  gap: 24px                       │  │   │   │
│  │  │  │  ┌──────────────────────────────────────────┐ │  │   │   │
│  │  │  │  │ B.2_content (480 × 80px)                 │ │  │   │   │
│  │  │  │  │ "Bắt đầu hành trình..." 20px bold white  │ │  │   │   │
│  │  │  │  └──────────────────────────────────────────┘ │  │   │   │
│  │  │  │  ┌──────────────────────────────────────────┐ │  │   │   │
│  │  │  │  │ B.3_Login (305 × 60px)                   │ │  │   │   │
│  │  │  │  │ bg: #FFEA9E  radius: 8px  p: 16px 24px   │ │  │   │   │
│  │  │  │  │ "LOGIN With Google" 22px bold + Google ☆  │ │  │   │   │
│  │  │  │  └──────────────────────────────────────────┘ │  │   │   │
│  │  │  └───────────────────────────────────────────────┘  │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  D_Footer (1440px, top: 933px)                             │   │
│  │  padding: 40px 90px  border-top: 1px solid #2E3940         │   │
│  │        "Bản quyền thuộc về Sun* © 2025" (centered)         │   │
│  └────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Header — Navigation Bar

| Property        | Value              | CSS                                    |
| --------------- | ------------------ | -------------------------------------- |
| **Node ID**     | `662:14391`        | -                                      |
| width           | 1440px             | `width: 100%`                          |
| height          | 80px               | `height: 80px`                         |
| background      | rgba(11,15,18,0.8) | `background-color: rgba(11,15,18,0.8)` |
| padding         | 12px 144px         | `padding: 12px 144px`                  |
| display         | flex               | `display: flex`                        |
| flex-direction  | row                | `flex-direction: row`                  |
| justify-content | space-between      | `justify-content: space-between`       |
| align-items     | center             | `align-items: center`                  |
| gap             | 238px              | `gap: 238px`                           |
| position        | absolute (top: 0)  | `position: fixed; top: 0`              |

---

### A.1_Logo — Sun Annual Awards 2025 Logo

| Property    | Value                  | CSS             |
| ----------- | ---------------------- | --------------- |
| **Node ID** | `I662:14391;186:2166`  | -               |
| width       | 52px                   | `width: 52px`   |
| height      | 56px                   | `height: 56px`  |
| type        | Image (media)          | `<img>` element |
| interaction | None (non-interactive) | -               |

---

### A.2_Language — Language Selector Button

| Property                   | Value                        | CSS                                           |
| -------------------------- | ---------------------------- | --------------------------------------------- |
| **Node ID**                | `I662:14391;186:1601`        | -                                             |
| width                      | 108px                        | `width: 108px`                                |
| height                     | 56px                         | `height: 56px`                                |
| display                    | flex                         | `display: flex`                               |
| flex-direction             | row                          | `flex-direction: row`                         |
| align-items                | center                       | `align-items: center`                         |
| gap                        | 16px                         | `gap: 16px`                                   |
| inner button border-radius | 4px                          | `border-radius: 4px`                          |
| inner button padding       | 16px                         | `padding: 16px`                               |
| inner button justify       | space-between                | `justify-content: space-between`              |
| flag icon                  | VN flag (24×24px)            | `<img>`                                       |
| text "VN"                  | Montserrat 16px 700 #FFFFFF  | `font: 700 16px/24px Montserrat; color: #fff` |
| chevron icon               | 24×24px down arrow           | `<img>`                                       |
| linked frame               | 721:4942 (Dropdown-ngôn ngữ) | -                                             |

**States:**
| State | Changes |
|-------|---------|
| Default | As above |
| Hover | Highlight effect, cursor: pointer |
| Active (dropdown open) | Chevron rotates 180deg |

---

### B.1_Key Visual — "ROOT FURTHER" Title Image

| Property     | Value              | CSS             |
| ------------ | ------------------ | --------------- |
| **Node ID**  | `662:14395`        | -               |
| width        | 1152px (container) | `width: 100%`   |
| height       | 200px              | `height: 200px` |
| image width  | 451px              | `width: 451px`  |
| image height | 200px              | `height: 200px` |
| type         | Image (logo/title) | `<img>`         |
| interaction  | None (decorative)  | -               |

---

### B.2_content — Hero Description Text

| Property            | Value                                       | CSS                                     |
| ------------------- | ------------------------------------------- | --------------------------------------- |
| **Node ID**         | `662:14753`                                 | -                                       |
| width               | 480px                                       | `width: 480px`                          |
| height              | 80px                                        | `height: auto`                          |
| font-family         | Montserrat                                  | `font-family: 'Montserrat', sans-serif` |
| font-size           | 20px                                        | `font-size: 20px`                       |
| font-weight         | 700                                         | `font-weight: 700`                      |
| line-height         | 40px                                        | `line-height: 40px`                     |
| letter-spacing      | 0.5px                                       | `letter-spacing: 0.5px`                 |
| color               | #FFFFFF                                     | `color: #FFFFFF`                        |
| text-align          | left                                        | `text-align: left`                      |
| content line 1      | "Bắt đầu hành trình của bạn cùng SAA 2025." | -                                       |
| content line 2      | "Đăng nhập để khám phá!"                    | -                                       |
| parent padding-left | 16px                                        | `padding-left: 16px`                    |
| interaction         | None (static)                               | -                                       |

---

### B.3_Login — Google Login Button

| Property            | Value                           | CSS                                     |
| ------------------- | ------------------------------- | --------------------------------------- |
| **Node ID**         | `662:14425` / inner `662:14426` | -                                       |
| width               | 305px                           | `width: 305px`                          |
| height              | 60px                            | `height: 60px`                          |
| background          | #FFEA9E                         | `background-color: #FFEA9E`             |
| border-radius       | 8px                             | `border-radius: 8px`                    |
| padding             | 16px 24px                       | `padding: 16px 24px`                    |
| display             | flex                            | `display: flex`                         |
| flex-direction      | row                             | `flex-direction: row`                   |
| align-items         | center                          | `align-items: center`                   |
| gap                 | 8px                             | `gap: 8px`                              |
| text                | "LOGIN With Google"             | -                                       |
| text font-family    | Montserrat                      | `font-family: 'Montserrat', sans-serif` |
| text font-size      | 22px                            | `font-size: 22px`                       |
| text font-weight    | 700                             | `font-weight: 700`                      |
| text line-height    | 28px                            | `line-height: 28px`                     |
| text color          | #00101A                         | `color: #00101A`                        |
| text letter-spacing | 0px                             | `letter-spacing: 0`                     |
| Google icon         | 24×24px                         | `<img width="24" height="24">`          |
| cursor              | pointer                         | `cursor: pointer`                       |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E, text: #00101A |
| Hover | Subtle lift shadow / brightness increase |
| Active (pressed) | Slight scale down |
| Disabled | Opacity reduced, non-responsive (shown during auth processing) |
| Loading | Button disabled + loading spinner icon |

---

### D_Footer — Copyright Bar

| Property         | Value                             | CSS                                                |
| ---------------- | --------------------------------- | -------------------------------------------------- |
| **Node ID**      | `662:14447`                       | -                                                  |
| width            | 1440px                            | `width: 100%`                                      |
| position         | absolute (bottom, top: 933px)     | `position: absolute; bottom: 0`                    |
| padding          | 40px 90px                         | `padding: 40px 90px`                               |
| border-top       | 1px solid #2E3940                 | `border-top: 1px solid #2E3940`                    |
| display          | flex                              | `display: flex`                                    |
| justify-content  | space-between                     | `justify-content: space-between`                   |
| align-items      | center                            | `align-items: center`                              |
| text             | "Bản quyền thuộc về Sun\* © 2025" | -                                                  |
| text font-family | Montserrat Alternates             | `font-family: 'Montserrat Alternates', sans-serif` |
| text font-size   | 16px                              | `font-size: 16px`                                  |
| text font-weight | 700                               | `font-weight: 700`                                 |
| text line-height | 24px                              | `line-height: 24px`                                |
| text color       | #FFFFFF                           | `color: #FFFFFF`                                   |
| interaction      | None (static)                     | -                                                  |

---

## Implementation Mapping

| Figma Node ID         | Component Name | CSS Class / Tailwind              | React Component             |
| --------------------- | -------------- | --------------------------------- | --------------------------- |
| `662:14391`           | A_Header       | `.header` / `fixed top-0 w-full`  | `<Header />`                |
| `I662:14391;186:2166` | A.1_Logo       | `.logo`                           | `<Logo />`                  |
| `I662:14391;186:1601` | A.2_Language   | `.lang-selector`                  | `<LanguageSelector />`      |
| `662:14388`           | C_Keyvisual    | `.keyvisual` / `absolute inset-0` | `<KeyVisual />` (bg)        |
| `662:14393`           | B_Bìa          | `.hero` / `relative`              | `<HeroSection />`           |
| `662:14395`           | B.1_Key Visual | `.hero-title-img`                 | `<HeroTitleImage />`        |
| `662:14753`           | B.2_content    | `.hero-desc`                      | `<HeroDescription />`       |
| `662:14425`           | B.3_Login      | `.login-btn` / `btn-primary`      | `<LoginWithGoogleButton />` |
| `662:14447`           | D_Footer       | `.footer` / `absolute bottom-0`   | `<Footer />`                |

---

## Responsive Breakpoints

| Breakpoint      | Width  | Notes                                               |
| --------------- | ------ | --------------------------------------------------- |
| Desktop         | 1440px | Primary Figma design target                         |
| (Not specified) | -      | No mobile/tablet breakpoints defined in Figma frame |
