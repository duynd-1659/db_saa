# Tasks: Hover Avatar Info User

**Frame**: `721:5827-Hover Avatar info user`
**Version**: v1.0
**Created**: 2026-03-19

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v1.0 | 2026-03-19 | Initial | Initial task breakdown |

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 17 |
| Phase 1 — Setup | 3 |
| Phase 2 — Foundational | 5 |
| Phase 3 — US1 (Avatar ring) | 3 |
| Phase 4 — US2 (Hover popover) | 3 |
| Phase 5 — Polish | 3 |
| Parallelizable [P] | 7 |

---

## Phase 1: Setup — Types & Shared Config

> Prerequisite for all phases. Must complete before any component or service work.

### Independent test criteria
- `src/config/hero-badge.ts` exports `HERO_BADGE_IMAGE` correctly
- `SpotlightEntry` compiles with new fields
- `SunnerHoverTarget` type is importable

### Tasks

- [x] T001 Extract `HERO_BADGE_IMAGE` constant from `src/components/kudos/KudoCard.tsx` into `src/config/hero-badge.ts`; update `KudoCard.tsx` import to `@/config/hero-badge`
- [x] T002 Extend `SpotlightEntry` in `src/types/kudos.ts` — add `user_id: string`, `department: string | null`, `hero_badge: HeroBadgeTier | null`, `avatar_url: string | null`
- [x] T003 [P] Create `src/types/sunner-hover.ts` — export `SunnerHoverTarget` interface: `{ userId: string; name: string; department: string | null; heroBadge: HeroBadgeTier | null; avatarUrl: string | null }`

---

## Phase 2: Foundational — Service, API & WriteKudo Extension

> Blocks Phase 3 (API + type data needed for trigger) and Phase 4 (stats + Send KUDO pre-fill).
> Confirmed: `user_stats` view allows reading stats of other users.

### Independent test criteria
- `GET /api/users/[id]/spotlight-stats` returns `{ kudos_received, kudos_sent }` for a valid userId
- `GET /api/users/[id]/spotlight-stats` returns 401 when unauthenticated
- Spotlight board renders without TS errors after query extension
- `openWriteKudo(recipient)` opens the Viết Kudo form with recipient pre-filled

### Tasks

- [x] T004 Add `fetchSpotlightStats(userId: string): Promise<{ kudos_received: number; kudos_sent: number }>` to `src/services/kudos-service.ts` — query `user_stats` view filtered by `user_id`
- [x] T005 [P] Create `src/app/api/users/[id]/spotlight-stats/route.ts` — `GET` handler: validate session via `getUser()`, call `fetchSpotlightStats(params.id)`, return JSON; 401 if unauthenticated, 500 on error
- [x] T006 [P] Extend spotlight query in `src/services/kudos-service.ts` to JOIN user profile fields (`user_id`, `department`, `hero_badge`, `avatar_url`) — fix cascading TS errors in `SpotlightBoard.tsx` and `SpotlightWordCloud.tsx` from `SpotlightEntry` extension
- [x] T007 Add `SET_RECIPIENT` action to `src/hooks/use-write-kudo.ts` — add `recipient: KudoProfile | null` to `WriteKudoFormState`, `initialState.recipient = null`, handle action in reducer
- [x] T008 Extend `src/components/kudos/write-kudo/WriteKudoProvider.tsx` — `openWriteKudo(recipient?: KudoProfile)`: if recipient provided dispatch `SET_RECIPIENT` before setting `isOpen = true`; existing callers pass no arg and remain unchanged

---

## Phase 3: US1 — Avatar Ring Hover State

> Requires Phase 1 (types). Independent of Phase 2 (ring state needs no API data).

### Goal
When hovering a sunner name/avatar anywhere in the app, the avatar ring changes from white (`#FFFFFF`) to gold (`#FFEA9E`).

### Independent test criteria
- Hovering a name in SpotlightWordCloud → name color changes (no avatar in word cloud)
- Hovering a sender/recipient avatar in KudoCard → ring border changes to `#FFEA9E`
- Mouse-leave reverts ring to white
- After 150ms debounce, a portal placeholder renders at the correct anchor position

### Tasks

- [x] T009 [US1] Create `src/components/kudos/SunnerHoverCardTrigger.tsx` — `'use client'` wrapper accepting `SunnerHoverTarget` + `children: React.ReactNode`; `onMouseEnter` starts 150ms timer then sets `isOpen=true` + computes anchor from `getBoundingClientRect()` with viewport-edge flip; `onMouseLeave` clears timer + closes after 100ms grace; passes `isHovered` state as `data-hovered` attribute to child element via `cloneElement`; renders children + empty portal placeholder (card wired in Phase 4)
- [x] T010 [US1] Wrap each name `<span>` in `src/components/kudos/SpotlightWordCloud.tsx` with `<SunnerHoverCardTrigger>` passing `entry.user_id`, `entry.name`, `entry.department`, `entry.hero_badge`, `entry.avatar_url`
- [x] T011 [P] [US1] Wrap sender and recipient columns in `src/components/kudos/KudoCard.tsx` with `<SunnerHoverCardTrigger>`; add `group` + `data-hovered:border-[#FFEA9E]` transition on the avatar `<Image>` element; import `SunnerHoverTarget` from `@/types/sunner-hover`

---

## Phase 4: US2 — Hover Popover Card

> Requires Phase 2 (stats API + WriteKudo extension) and Phase 3 (trigger component exists).

### Goal
Hovering a sunner shows a popover card with: name (click to profile), dept + hero badge, divider, kudos stats (with loading/error states), Send KUDO button that pre-fills the Viết Kudo form.

### Independent test criteria
- Popover appears after 150ms hover on any trigger
- Row 1: full name (click navigates to profile)
- Row 2: department + hero badge `109×19px`
- Row 3: `1px` divider
- Rows 4–5: skeleton while API loads, then real counts; `–` on error
- Row 6: clicking "Send KUDO" opens Viết Kudo form with recipient pre-filled
- Popover closes on mouse-leave (both trigger and card)
- Only one popover open at a time

### Tasks

- [x] T012 [US2] Create `src/components/kudos/SunnerHoverCard.tsx` — `'use client'` component; props: `SunnerHoverTarget` + `anchorStyle: React.CSSProperties` + `onMouseEnter/Leave` (for grace period) + `onSendKudo: () => void`; fetch stats via `GET /api/users/[id]/spotlight-stats` on mount, cache in `useRef<Map<string, Stats>>`; render 6-row layout per `design-style.md` — use `<Image>` for hero badge (`w-[109px] h-[19px]`), skeleton spans for loading rows 4–5; `role="dialog"` + `aria-label`
- [x] T013 [US2] Wire `SunnerHoverCard` inside `SunnerHoverCardTrigger.tsx` — render card via `ReactDOM.createPortal(card, document.body)` when `isOpen=true`, pass computed `anchorStyle` (`position: fixed`, `top`, `left`) + relay `onMouseEnter/Leave` to extend grace period
- [x] T014 [P] [US2] Wire "Send KUDO" button in `SunnerHoverCard.tsx` — call `useWriteKudoContext().openWriteKudo(recipient)` where recipient is constructed from `SunnerHoverTarget` props; ensure `WriteKudoProvider` is available in tree (already mounted at `[locale]` layout level)

---

## Phase 5: Polish & Cross-Cutting

### Tasks

- [x] T015 [P] Verify keyboard accessibility in `SunnerHoverCardTrigger.tsx` — add `tabIndex={0}` + `onKeyDown` (Enter/Space → open, Escape → close); ensure "Send KUDO" `<button>` are Tab-reachable inside open popover
- [x] T016 [P] Verify TypeScript compilation is clean across all modified files — run `tsc --noEmit`; fix any remaining strict-mode errors from `SpotlightEntry` extension cascade
- [x] T017 [P] Verify Prettier formatting on all new/modified files — run `yarn prettier --check src/components/kudos/Sunner*.tsx src/config/hero-badge.ts src/types/sunner-hover.ts src/app/api/users/\[id\]/spotlight-stats/route.ts`

---

## Dependency Graph

```
T001 ──┐
T002 ──┤──► T006 ──► T010, T011
T003 ──┤──► T009 ──► T013
       │
T004 ──┤──► T005
       │──► T012 ──► T013 ──► T014
T007 ──┤
T008 ──┘──► T014

T009 ──► T010
T009 ──► T011
T009 ──► T013

T013 + T014 ──► T015, T016, T017
```

---

## Execution Flow

```
Phase 1          Phase 2              Phase 3         Phase 4          Phase 5
─────────        ─────────────────    ─────────────   ──────────────   ──────────
T001             T004                 T009            T012             T015 [P]
T002             T005 [P]             T010            T013             T016 [P]
T003 [P]         T006 [P]             T011 [P]        T014 [P]         T017 [P]
                 T007
                 T008
```

**Parallel opportunities within phases:**
- Phase 1: T003 can run alongside T001+T002
- Phase 2: T005, T006 can run in parallel after T004; T007+T008 can run in parallel
- Phase 3: T010 + T011 can run in parallel after T009
- Phase 4: T014 can start while T012+T013 are in review
- Phase 5: T015, T016, T017 all fully parallel

---

## MVP Scope

Implement Phase 1 + Phase 2 + Phase 3 first to unblock integration and validate data flow. Phase 4 adds the visible popover. Phase 5 is required before merge.

**Minimum shippable**: T001–T013 (trigger + card renders, stats load, closes on leave).
**Full feature**: all 17 tasks complete.

---

## Notes

- `user_stats` view confirmed to allow reading stats for other users — no RLS blocker.
- Profile page route format for profile link (click from name) — confirm with SCREENFLOW.md before implementing `<Link>` in T012.
- Sidebar "10 Sunner" integration is out of scope for this task set — treat as a separate follow-up.
