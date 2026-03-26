# Implementation Plan: Hover Avatar Info User

**Frame**: `721:5827-Hover Avatar info user`
**Spec**: `spec.md`
**Version**: v1.0
**Created**: 2026-03-19

## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v1.0 | 2026-03-19 | Initial | Initial plan |

---

## Constitution Compliance

| Requirement | Constitution Rule | Status |
|-------------|------------------|--------|
| TypeScript strict | No `any`, explicit return types | ✅ Planned |
| `'use client'` only where needed | Browser API + state required | ✅ Compliant — both components are client-only |
| Services layer | Route handler delegates to service | ✅ Planned |
| CSS variables / Tailwind | No hardcoded hex in components | ✅ Mapped in design-style.md |
| No raw `<img>` | Use Next.js `<Image>` | ✅ Planned |
| Single responsibility | Max ~150 lines/file | ✅ Trigger and Card are separate files |
| No business logic in route handlers | Delegate to `kudos-service.ts` | ✅ Planned |
| Supabase server client in route handlers | `createClient()` from `server.ts` | ✅ Planned |

---

## Architecture Decisions

### Component pattern
`SunnerHoverCardTrigger` is a **renderless wrapper** — it adds hover behavior (ring state, open/close logic, debounce) to whatever child it wraps, without rendering any DOM itself. `SunnerHoverCard` is a pure **presentational component** anchored via `position: fixed` calculated from the trigger's `getBoundingClientRect()`.

### Popover anchoring
No external floating UI library. Compute `top/left` from `triggerEl.getBoundingClientRect()`, flip if near viewport edge (check `window.innerWidth/Height`). `position: fixed` so it escapes any `overflow: hidden` parent (including the SpotlightBoard canvas).

### Debounce
`useRef<ReturnType<typeof setTimeout>>` inside `SunnerHoverCardTrigger` — 150ms delay on open, immediate on close.

### State management
Each `SunnerHoverCardTrigger` instance manages its own open state locally — no global state needed. Only one popover is visible at a time naturally (mouse can only hover one trigger).

### Stats fetching
On popover open, call `GET /api/users/[id]/spotlight-stats`. Use `useState` inside `SunnerHoverCard` + `useEffect` on `userId` prop change. No caching library — use a simple in-memory `Map<userId, stats>` ref to avoid re-fetching the same user within a session.

### Send KUDO pre-fill
`WriteKudoProvider.openWriteKudo()` must be extended to accept an optional `KudoProfile` as `defaultRecipient`. The form's initial `recipient` state is set from this prop. This is a **breaking change to the provider interface** — all existing callers must remain compatible (param is optional).

### `SpotlightEntry` type extension
Currently `SpotlightEntry = { name: string; count: number }`. Must add `user_id`, `department`, `hero_badge`, `avatar_url` to enable popover data without extra API calls. The Supabase query that populates spotlight entries must JOIN with user profiles.

### `HERO_BADGE_IMAGE` extraction
Currently defined inline in `KudoCard.tsx`. Must be moved to `src/config/hero-badge.ts` as a shared constant so both `KudoCard` and `SunnerHoverCard` can import it without duplication.

---

## Project Structure

### New Files

| File | Purpose |
|------|---------|
| `src/components/kudos/SunnerHoverCard.tsx` | Popover card UI — 6-row layout, stats display, Send KUDO button |
| `src/components/kudos/SunnerHoverCardTrigger.tsx` | Hover wrapper — ring state, debounce, anchor calc, open/close |
| `src/app/api/users/[id]/spotlight-stats/route.ts` | GET endpoint → `{ kudos_received, kudos_sent }` for any userId |
| `src/config/hero-badge.ts` | `HERO_BADGE_IMAGE: Record<HeroBadgeTier, string>` shared constant |
| `src/types/sunner-hover.ts` | `SunnerHoverTarget` interface (props passed from trigger to card) |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/kudos.ts` | Extend `SpotlightEntry` with `user_id`, `department`, `hero_badge`, `avatar_url` |
| `src/services/kudos-service.ts` | Add `fetchSpotlightStats(userId)` — reuse existing `user_stats` view |
| `src/components/kudos/write-kudo/WriteKudoProvider.tsx` | Extend `openWriteKudo(recipient?: KudoProfile)` — set default recipient in form state |
| `src/hooks/use-write-kudo.ts` | Add `SET_RECIPIENT` action; `initialState.recipient` defaults to null |
| `src/components/kudos/KudoCard.tsx` | Import `HERO_BADGE_IMAGE` from `@/config/hero-badge`; wrap sender/recipient with `SunnerHoverCardTrigger` |
| `src/components/kudos/SpotlightWordCloud.tsx` | Wrap each name `<span>` with `SunnerHoverCardTrigger` |
| `src/services/kudos-service.ts` | Extend Spotlight query to JOIN user profile fields |

### Dependencies

No new npm packages needed — uses React state/refs, browser APIs, existing Supabase client.

---

## Implementation Phases

### Phase 0: Shared config + type changes

**0.1** Extract `HERO_BADGE_IMAGE` from `KudoCard.tsx` → `src/config/hero-badge.ts`
- Update `KudoCard.tsx` import

**0.2** Extend `SpotlightEntry` in `src/types/kudos.ts`:
```ts
export interface SpotlightEntry {
  user_id: string;       // NEW
  name: string;
  count: number;
  department: string | null;    // NEW
  hero_badge: HeroBadgeTier | null; // NEW
  avatar_url: string | null;    // NEW
}
```

**0.3** Add `SunnerHoverTarget` type to `src/types/sunner-hover.ts`:
```ts
export interface SunnerHoverTarget {
  userId: string;
  name: string;
  department: string | null;
  heroBadge: HeroBadgeTier | null;
  avatarUrl: string | null;
}
```

**0.4** Fix TypeScript errors cascading from SpotlightEntry extension (Spotlight query + board props).

---

### Phase 1: API + Service

**1.1** Add `fetchSpotlightStats(userId: string)` to `src/services/kudos-service.ts`:
- Query `user_stats` view (already exists) filtered by `user_id`
- Return `{ kudos_received: number; kudos_sent: number }`

**1.2** Create `src/app/api/users/[id]/spotlight-stats/route.ts`:
- `GET` handler — validate param, call `fetchSpotlightStats`, return JSON
- Auth: must be authenticated (check session via `getUser()`)
- Error: 401 if no session, 500 on service error

**1.3** Update Spotlight data query in `kudos-service.ts` to JOIN profiles:
- Add `user_id`, `department`, `hero_badge`, `avatar_url` to spotlight query result

---

### Phase 2: WriteKudoProvider extension

**2.1** Add `SET_RECIPIENT` action to `use-write-kudo.ts` reducer:
- `recipient: KudoProfile | null` added to `WriteKudoFormState`
- `initialState.recipient = null`

**2.2** Extend `WriteKudoProvider`:
- `openWriteKudo(recipient?: KudoProfile)` — if `recipient` provided, dispatch `SET_RECIPIENT` before opening
- Context interface: `openWriteKudo: (recipient?: KudoProfile) => void`
- Ensure all existing callers (`FabWidget`, `RulesPanelDrawer`, `WriteKudosBar`) pass no arg → unchanged behavior

**2.3** Wire `defaultRecipient` into the write kudo form's recipient field initial value.

---

### Phase 3: Components

**3.1** Build `SunnerHoverCard.tsx`:
- Props: `SunnerHoverTarget` + `onSendKudo: () => void`
- Fetch stats on mount via `GET /api/users/[id]/spotlight-stats`
- In-memory cache ref to skip refetch for same userId
- Layout: 6 rows per design-style.md
- Use `<Image>` for hero badge, `<Link>` for View profile
- `role="dialog"` + `aria-label`

**3.2** Build `SunnerHoverCardTrigger.tsx`:
- Props: `SunnerHoverTarget` + `children: React.ReactNode`
- `onMouseEnter`: start 150ms timer → set open + calc anchor from `getBoundingClientRect()`
- `onMouseLeave`: clear timer → close (with 100ms grace to allow cursor to enter the card)
- Renders `{children}` + conditionally `<SunnerHoverCard>` via `ReactDOM.createPortal` to `document.body`
- Passes anchor coords to card as `style={{ position: 'fixed', top, left }}`
- Avatar ring: pass `isHovered` state as CSS class to child avatar element via `cloneElement` or a data attribute

---

### Phase 4: Integration

**4.1** `SpotlightWordCloud.tsx`:
- Wrap each name `<span>` with `<SunnerHoverCardTrigger>`, passing entry's `user_id`, `name`, `department`, `hero_badge`, `avatar_url`
- Note: SpotlightWordCloud names are text-only (no avatar rendered), so ring state applies to name text highlight only (cursor changes, color shift)

**4.2** `KudoCard.tsx`:
- Wrap sender column (avatar + name) with `<SunnerHoverCardTrigger>`
- Wrap recipient column (avatar + name) with `<SunnerHoverCardTrigger>`
- Pass `KudoProfile` fields: `id → userId`, `name`, `department`, `hero_badge → heroBadge`, `avatar_url → avatarUrl`
- Avatar `<Image>` ring state: add `group` class + `group-hover:border-[#FFEA9E]` transition

---

## Integration Points

| Surface | Trigger wraps | Data source |
|---------|--------------|-------------|
| `SpotlightWordCloud` | Name `<span>` | `SpotlightEntry` props (extended) |
| `KudoCard` sender | Avatar + name column | `KudoProfile` from `KudoWithDetails` |
| `KudoCard` recipient | Avatar + name column | `KudoProfile` from `KudoWithDetails` |
| Sidebar "10 Sunner" | Name + avatar (future) | `KudoProfile` or user list item |

---

## Testing Strategy

| Type | Focus | Notes |
|------|-------|-------|
| Unit | `fetchSpotlightStats` service | Mock Supabase, assert correct columns |
| Unit | `SunnerHoverCard` render | Stats loading, error, and complete states |
| Unit | `SunnerHoverCardTrigger` | Debounce open/close, portal render |
| Integration | `GET /api/users/[id]/spotlight-stats` | Authenticated vs unauthenticated |
| E2E | Hover a name → popover appears → Send KUDO opens with recipient pre-filled | Critical path |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| `SpotlightEntry` type extension breaks existing spotlight query | High | Fix cascading TS errors in Phase 0 before other phases |
| Portal + `position:fixed` doesn't escape SpotlightBoard overflow | Medium | Portal to `document.body` escapes all ancestors |
| WriteKudoProvider change breaks existing callers | Medium | `recipient` param is optional — all existing callers unchanged |
| `user_stats` view may not be queryable by `user_id` for other users | Medium | Verify RLS policy allows authenticated users to read any row |
| Avatar ring in SpotlightWordCloud (text-only, no avatar) | Low | Use name color/underline as hover indicator instead of ring |

---

## Open Questions

- [ ] Does the `user_stats` view allow reading stats for other users (RLS)? Or does it filter to `auth.uid()` only? → May need a separate query/view.
- [ ] Sidebar "10 Sunner" list: wrap with trigger in this feature or a separate task?
