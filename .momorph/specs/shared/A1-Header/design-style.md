# Design Style: A1 Header

**Node ID**: `2167:9091`
**Component**: Shared Header
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`

---

## Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ A1: Header — fixed top, full width                                              80px      │
│  [Logo 52×48]  [About SAA 2025]  [Awards Information]  [Sun* Kudos]                      │
│                                               [Bell 40×40]  [VI/EN 108×56]  [Avatar 40×40]│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A1: Header container

| Property | Value |
|----------|-------|
| Node ID | `2167:9091` |
| Dimensions | `1512×80px` |
| Position | `fixed`, `top: 0`, `z-index: 1` |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Layout | `flex`, `row`, `justify-content: space-between`, `align-items: center` |
| Gap | `238px` |

---

### A1.1: Logo

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;178:1033` |
| Dimensions | `52×48px` |
| Layout | `flex`, `column` |
| Interaction | Click → navigate to `/` (or `/en` for English language) |

---

### Nav links container (Frame 488)

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;186:2166` |
| Dimensions | `606×56px` |
| Layout | `flex`, `row`, `align-items: center`, `gap: 64px` |

#### Nav link text typography (all states)

| Property | Value |
|----------|-------|
| Font | Montserrat |
| Font size | `14px` |
| Font weight | `700` |
| Line height | `20px` |
| Letter spacing | `0.1px` |

#### Nav link states

| State | Node ID | Wrapper | Text style |
|-------|---------|---------|------------|
| Normal | `I2167:9091;186:1593` | `117×52px`, `padding: 16px`, `border-radius: 4px`, transparent bg | White `rgba(255,255,255,1)` |
| Hover | `I2167:9091;186:1587` | `173×52px`, `padding: 16px`, `border-radius: 4px`, light highlight bg | White `rgba(255,255,255,1)` |
| Selected/Active | `I2167:9091;186:1579` | `padding: 16px`, `border-bottom: 1px solid #FFEA9E`, no bg | Gold `#FFEA9E`, `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |

---

### Right controls container (Frame 482)

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;186:1601` |
| Dimensions | `220×56px` |
| Layout | `flex`, `row`, `align-items: center`, `gap: 16px` |

---

### A1.6: Notification bell

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;186:2101` |
| Dimensions | `40×40px` |
| Background | Transparent |
| Badge | Red dot — visible when unread notifications exist |

---

### A1.7: Language switcher

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;186:1696` |
| Dimensions | `108×56px` |
| Layout | `flex`, `row` |
| Content | Flag icon + language code (VI/EN) + chevron down |
| Interaction | Click → opens Dropdown-ngôn ngữ |

---

### A1.8: Avatar button

| Property | Value |
|----------|-------|
| Node ID | `I2167:9091;186:1597` |
| Dimensions | `40×40px` |
| Background | `rgba(0, 0, 0, 0)` (transparent) |
| Border | `1px solid var(--Details-Border, #998C5F)` |
| Border radius | `4px` |
| Padding | `10px` |
| Interaction | Click → opens Dropdown-profile (or Dropdown-profile Admin for admin role) |

---

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `--Details-Text-Primary-1` | `#FFEA9E` | Active nav link text + underline color |
| `--Details-Border` | `#998C5F` | Avatar button border |
| Header bg | `rgba(16, 20, 23, 0.8)` | Header background (semi-transparent dark) |
