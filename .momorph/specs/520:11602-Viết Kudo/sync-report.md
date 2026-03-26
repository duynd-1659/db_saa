# Sync Report: Viết Kudo

**Frame**: `520:11602`
**Date**: 2026-03-25
**Version bump**: v2.x → v3.0 (Cosmetic for design-style; i18n code additions)

---

## Discrepancies Found & Fixed

### Style Fix

| # | Area | Old Doc Value | Figma Value | Status |
|---|------|---------------|-------------|--------|
| 1 | Modal section gap | `~24px` / `gap-6` | `gap: 32px` / `gap-8` | ✅ Fixed in design-style.md |

### Missing: i18n (user-requested)

| # | Area | Issue | Status |
|---|------|-------|--------|
| 2 | `writeKudo` namespace | No translation keys existed for the Viết Kudo form | ✅ Added to vi.json + en.json |

### No Changes Needed

- All 24 design items: `unchanged` (behavior diffs = none)
- Label widths (152px) — intentional requirement override from v2.4, not a Figma discrepancy
- Colors, typography, border tokens — correct
- Modal dimensions (752×1012px), padding (40px) — correct
- Component structure (A→H) — correct

---

## Changes Applied

### Spec Documents

| Document | Sections Updated | Version |
|----------|-----------------|---------|
| `design-style.md` | Spacing tokens (--spacing-field-gap 24→32px); Modal specs table (gap ~24→32px); Implementation Mapping (gap-6→gap-8); Changelog | v2.1 → v3.0 |
| `spec.md` | No changes (i18n is default) | — |
| `plan.md` | No changes | — |
| `tasks.md` | No changes | — |

### Code Files

| File | Change |
|------|--------|
| `src/i18n/messages/vi.json` | Added `writeKudo` namespace (35 keys: labels, placeholders, hints, validation, aria) |
| `src/i18n/messages/en.json` | Added `writeKudo` namespace (35 keys, English translations) |

### Assets (first-time creation)

| File | Action |
|------|--------|
| `.momorph/specs/520:11602-Viết Kudo/assets/frame.png` | Downloaded from Figma |
| `.momorph/specs/520:11602-Viết Kudo/assets/frame-styles.json` | Saved from MCP list_frame_styles |
| `.momorph/specs/520:11602-Viết Kudo/assets/design-items.json` | Saved from MCP list_design_items |

---

## Remaining Actions

- [ ] Update component files to use `useTranslations('writeKudo')` (replaces hardcoded Vietnamese strings)
- [ ] Responsive spec — deferred to next sync round

---

## writeKudo Keys Added

```
modalTitle, labelRecipient, labelTitle, labelHashtag, labelImage,
searchPlaceholder, titlePlaceholder, titleHint,
contentPlaceholder, contentHint,
maxHashtags, maxImages, addHashtag, addImage,
anonymousLabel, anonymousNamePlaceholder,
cancelButton, submitButton, communityStandards, noRecipientFound,
validation.{recipientRequired, contentRequired, hashtagRequired, titleRequired, anonymousNameRequired},
aria.{modal, closeButton, boldButton, italicButton, strikeButton, listButton, linkButton, quoteButton, removeImage}
```
