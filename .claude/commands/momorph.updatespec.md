---
description: Update spec documents when business requirements change (not from Figma). Detects impact on spec.md, plan.md, tasks.md and cascades changes downstream. For Figma-driven changes, use momorph.syncdesign instead.
---

# MoMorph: Update Spec from Business Requirements

You are a **Design-Code Sync Specialist** responsible for detecting and resolving discrepancies between **new business requirements** and the existing spec documents + implementation code for a frame. Unlike `momorph.syncdesign` (where Figma is the source of truth), here the **user's requirement change** is the source of truth.

## Purpose

When business requirements change **without a Figma design update** (e.g., new user story, changed acceptance criteria, added edge case, removed feature, altered API contract), this command:

1. Analyzes the requirement change against existing docs
2. Updates `spec.md`, `design-style.md` (if visual changes apply), `plan.md`, and `tasks.md` in dependency order
3. Identifies code files that need updating based on the doc changes
4. Optionally updates implementation code to match

**Note on `design-style.md`**: Figma is the ideal source of truth for visual design. However, in practice, Figma may not be updated before requirements change. If the requirement change implies visual/style changes (e.g., new dimensions, colors, layout tokens), update `design-style.md` directly as part of this command. Flag that a Figma update is still recommended afterward, so the design stays in sync.

## Prerequisites

The following files MUST already exist for the target frame:

```
.momorph/specs/{frame_id}-{frame_name}/
  spec.md
  design-style.md
  plan.md
  tasks.md
```

**If ANY file is missing, STOP and report:**

```
Error: Cannot update — required spec documents missing.
Please run momorph.specify, momorph.plan, and momorph.tasks first for this frame.
Missing: [list missing files]
```

## Inputs

User provides:

- `frameId` — Frame ID (e.g., `721:5580`) or frame name
- **Requirement change description** — What changed and why (e.g., "Add multi-select support", "Remove US3", "Change filter to support search", "API now returns paginated results")

## Workflow

### Phase 1: Gather Current State

**1.1. Load existing spec documents:**
Read ALL documents from `.momorph/specs/{frame_id}-{frame_name}/`:

- `spec.md` — Feature specification
- `design-style.md` — Visual specifications (update if requirement implies style/layout changes)
- `plan.md` — Implementation plan
- `tasks.md` — Task list

Also load:

- `.momorph/constitution.md` — Project standards

**1.2. Load current database schema:**
Read migration files from `supabase/migrations/` and seed files from `supabase/seeds/` to understand the current DB schema. This is needed to detect whether the requirement change implies database modifications.

**1.3. Parse the requirement change:**
From the user's input, identify:

- **Change type**: Add (new story/requirement), Modify (change existing), Remove (delete requirement)
- **Affected user stories**: Which US are impacted (US1, US2, US3, etc.)
- **Affected requirements**: Which FR/TR/AC are impacted
- **Scope**: Functional only, visual implication, database implication, or combination

### Phase 2: Impact Analysis

**2.1. Analyze impact across documents:**

Compare the requirement change against each document. Categorize impact into:

#### A. Spec Impact (`spec.md`)

- New/modified/removed user stories
- New/modified/removed acceptance scenarios
- New/modified/removed functional requirements (FR-xxx)
- New/modified/removed technical requirements (TR-xxx)
- New/modified/removed edge cases
- Changed API dependencies
- Changed success criteria

#### B. Plan Impact (`plan.md`)

- Architecture decision changes (new component, different state management, etc.)
- New/modified/removed files in project structure
- Changed implementation phases
- New/modified dependencies
- Changed risk assessment

#### C. Tasks Impact (`tasks.md`)

- Existing tasks that are now invalid or need modification
- New tasks required for the change
- Tasks that can be removed
- Changed dependencies between tasks
- Phase restructuring needed

#### D. Visual Impact (update design-style.md + flag Figma update)

- Does the change imply new UI elements or states?
- Does the change remove UI elements?
- Does the change alter layout dimensions, colors, spacing, typography, or interactions?
- If yes to any: update `design-style.md` directly with the new values, and flag that Figma should be updated afterward to stay in sync.

#### E. Database Impact

- Does the change require new columns, tables, or indexes?
- Does the change modify existing column types, constraints, or defaults?
- Does the change affect RLS policies?
- Does seed data need updating (new rows, modified values, new columns in INSERT)?
- Does the change affect existing migration files or require a new migration?

**2.2. Create an impact report:**

```markdown
# Requirement Change Impact Report: {frame_name}

**Frame**: {frame_id}
**Date**: {today}
**Change**: {brief description of requirement change}

## Impact Summary

| Document        | Impact Level         | Sections Affected                                       |
| --------------- | -------------------- | ------------------------------------------------------- |
| spec.md         | High/Medium/Low/None | {list sections}                                         |
| plan.md         | High/Medium/Low/None | {list sections}                                         |
| tasks.md        | High/Medium/Low/None | {list sections}                                         |
| design-style.md | High/Medium/Low/None | {list sections updated, or "None" if no visual changes} |
| database        | High/Medium/Low/None | {list: tables, columns, seeds, RLS}                     |

## Detailed Changes

### design-style.md (if visual changes apply)

| #   | Type              | Section | Current | Proposed | Rationale |
| --- | ----------------- | ------- | ------- | -------- | --------- |
| 1   | Add/Modify/Remove | ...     | ...     | ...      | ...       |

### spec.md

| #   | Type              | Section | Current | Proposed | Rationale |
| --- | ----------------- | ------- | ------- | -------- | --------- |
| 1   | Add/Modify/Remove | ...     | ...     | ...      | ...       |

### plan.md

| #   | Type              | Section | Current | Proposed | Rationale |
| --- | ----------------- | ------- | ------- | -------- | --------- |
| 1   | Add/Modify/Remove | ...     | ...     | ...      | ...       |

### tasks.md

| #   | Type                         | Task ID | Current | Proposed | Rationale |
| --- | ---------------------------- | ------- | ------- | -------- | --------- |
| 1   | Add/Modify/Remove/Invalidate | T0XX    | ...     | ...      | ...       |

### Database Impact (if applicable)

| #   | Type                               | Object         | Current | Proposed | Rationale |
| --- | ---------------------------------- | -------------- | ------- | -------- | --------- |
| 1   | Add Column/Add Table/Modify/Remove | {table.column} | ...     | ...      | ...       |

**Migration file**: `supabase/migrations/{timestamp}_{description}.sql`
**Seed data update**: `supabase/seeds/common/{file}` (if applicable)

### ⚠️ Figma Update Recommended (if design-style.md was modified)

- design-style.md was updated to reflect requirement changes. Figma should be updated to match for long-term sync.
- After Figma is updated, run `momorph.syncdesign` to verify Figma matches design-style.md.
```

**2.3. Present the report to the user:**
Show the impact report and ask for confirmation before making changes:

- "Proceed with ALL changes?"
- "Proceed with specific changes only? (list numbers)"
- "Skip — investigate further first?"

If user narrows scope, only apply the approved changes.

### Phase 3: Update Documents

Apply changes in **dependency order** — upstream docs first, downstream docs last:

**Order: design-style.md (if visual) → spec.md → plan.md → tasks.md**

#### 3.0. Update `design-style.md` (only if requirement implies visual/style changes)

For each approved visual change:

- Update design token values (colors, typography, spacing, dimensions) in the Tokens tables
- Update component style details (label widths, input sizes, container dimensions, border-radius, etc.)
- Update the ASCII layout diagram if dimensions or layout changed
- Update the Implementation Mapping table if Tailwind classes need changing

**Rules:**

- **Surgical edits only** — use the Edit tool to change the minimum scope. Never rewrite the entire file.
- Use the exact new value specified in the requirement — no approximation.
- Update ALL occurrences of the changed value across the document (token table + component sections + mapping table).
- After updating, flag in the summary that Figma should be updated to match.

#### 3.1. Update `spec.md`

For each approved change:

- Add/modify/remove user stories with proper priority labels (P1, P2, P3)
- Add/modify/remove acceptance scenarios (preserve Given/When/Then format)
- Add/modify/remove functional requirements (FR-xxx numbering)
- Add/modify/remove technical requirements (TR-xxx numbering)
- Update edge cases section
- Update API dependencies table
- Update success criteria
- Update out of scope section
- Update dependencies checklist

**Rules:**

- Maintain sequential numbering (FR-001, FR-002, etc.) — renumber if items are removed
- New user stories get the next priority level unless user specifies otherwise
- Preserve existing format and structure from the template
- Mark removed items clearly — do not leave orphaned references

#### 3.2. Update `plan.md`

For each approved change:

- Update architecture decisions if component structure changed
- Update project structure (new/modified/removed files)
- Update implementation phases to reflect new/changed user stories
- Update risk assessment if new risks are introduced
- Update testing strategy if test scope changed
- Update dependencies section

**Rules:**

- **Surgical edits only** — use the Edit tool to change the smallest possible scope per edit (a line, a table row, a paragraph). NEVER rewrite the entire file or large unchanged sections. Each Edit call should have a focused `old_string` that targets only the content being changed.
- Only update sections affected by the requirement change — leave unrelated sections completely untouched (no reformatting, rewording, or restructuring).
- Preserve existing phase structure unless changes require restructuring.
- Update component descriptions and file paths to match spec changes.
- Keep architecture decisions aligned with constitution.
- Changes are tracked via the **Version + Changelog** section (Phase 3.5). The changelog entry MUST list which specific sections of plan.md were modified (e.g., "Updated: Summary, State Management, Phase 0.5 added, Integration Points"). No inline annotations needed.

#### 3.3. Update `tasks.md`

**⚠️ CRITICAL: Surgical edits only.** Use the Edit tool to change individual task lines or insert new blocks at specific positions. NEVER rewrite the entire file or large sections. This preserves original task descriptions, completion states `[x]`/`[ ]`, and document structure.

For each approved change:

- **Modified tasks**: Edit ONLY the specific task line(s) affected. If a completed task `[x]` is invalidated by the requirement change, change it back to `[ ]` and append: `(RESYNC: updated per requirement change — {brief description})`. Tasks not affected by the change MUST retain their original description and checkbox state.
- **New tasks**: Insert new task lines at the correct position within the appropriate existing phase. If no existing phase fits, insert a new phase section at the correct position. New tasks are identifiable by their higher task IDs (continuing from last existing ID).
- **Removed tasks**: Delete ONLY the specific task line (do not leave commented-out tasks).
- **Dependency graph & execution flow**: Only add/modify/remove the specific lines that changed (e.g., insert a new node in the flow, add a dependency arrow). Do NOT regenerate the entire graph — this destroys the original structure and makes diffs unreadable.
- **Unchanged phases/sections**: Leave completely untouched. Do not reformat, reword, or restructure anything that is not affected by the requirement change.

**Database tasks** (add when Phase 2 identified database impact):

- Migration task: `- [ ] T### [DB] Create migration to {description} | supabase/migrations/{timestamp}_{slug}.sql`
- Seed update task: `- [ ] T### [DB] Update seed data to {description} | supabase/seeds/common/{file}.sql`
- Type regeneration task (if using typed Supabase client): `- [ ] T### [DB] Regenerate Supabase types after migration | src/types/database.ts`
- DB tasks MUST be placed in Phase 1 (Setup) or a dedicated "Phase 0: Database Migration" since they block downstream service/component work.

**Rules:**

- New tasks follow the strict checklist format: `- [ ] T### [P?] [Story?] Description | file/path.ts`
- Maintain task ID ordering — new tasks get the next available ID
- Update total task count in Notes section
- If adding a new user story phase, insert it in priority order
- **Blast radius check before saving**: Verify that unchanged tasks still have their original description and checkbox state. If a task was `[x]` and wasn't invalidated by the requirement change, it MUST remain `[x]`.
- Changes are tracked via the **Version + Changelog** section (Phase 3.5). The changelog entry MUST list which tasks were added/modified/removed (e.g., "Added: T014, T015, T016, T017. Modified: T002, T003, T006, T008").

### Phase 3.5: Version Bump

After updating documents, bump the version and append a changelog entry in each modified spec doc.

**3.5.1. Determine bump type based on change severity:**

| Severity       | Criteria                                                               | Bump                      |
| -------------- | ---------------------------------------------------------------------- | ------------------------- |
| **Cosmetic**   | Wording changes, clarifications, edge case additions                   | `rev` bump: v1.1 → v1.2   |
| **Structural** | Add/remove user stories, new requirements, changed acceptance criteria | `minor` bump: v1.x → v2.0 |
| **Breaking**   | Feature removal, flow restructure, API contract changes                | `major` bump: vX → vX+1   |

Use the **highest severity** among all changes to determine the bump type.

**3.5.2. Update version header in each modified doc:**

Update or add:

- `**Version**:` line with the new version
- `**Last updated**:` line with today's date

**3.5.3. Append changelog entry:**

Add a new row at the top of the `## Changelog` table:

```markdown
| {new_version} | {today} | {Cosmetic|Structural|Breaking} | Requirement change: {brief summary} |
```

If no `## Changelog` section exists, create one.

### Phase 4: Identify Code Impact

**4.1. Find affected source files:**

Based on the document changes, use `Grep` and `Glob` to find implementation files that:

- Implement components/services/hooks referenced in changed tasks
- Contain logic that maps to changed functional requirements
- Reference types or interfaces that need updating

**4.2. Generate code impact report:**

```markdown
## Code Impact

### Files Requiring Updates

| File               | What to Change | Priority        | Related Task |
| ------------------ | -------------- | --------------- | ------------ |
| src/components/... | ...            | High/Medium/Low | T0XX         |

### Files Already Correct

- [list files that don't need changes]

### New Files Needed

| File               | Purpose | Related Task |
| ------------------ | ------- | ------------ |
| src/components/... | ...     | T0XX         |
```

**4.3. Ask user about code updates:**

- "Should I update the implementation code now?" → apply code fixes
- "Should I run `/momorph.implement` for the updated tasks?" → hand off to implement
- "No — I'll handle it manually" → leave code impact report only

### Phase 5: Validation

**5.1. Cross-document consistency check:**
After all updates, verify:

- [ ] `spec.md` user stories and requirements are self-consistent
- [ ] `plan.md` architecture and file structure match `spec.md` requirements
- [ ] `tasks.md` covers all requirements from `spec.md` and follows `plan.md` structure
- [ ] `tasks.md` task IDs are sequential and dependencies are valid
- [ ] No orphaned references (e.g., referencing a removed user story or component)
- [ ] `design-style.md` updated if requirement implied visual/style changes; Figma update flagged in summary
- [ ] Database impact assessed: if spec references new/changed DB columns, migration task exists in `tasks.md`
- [ ] Seed data consistent with schema changes (new columns have values in seed INSERT statements)
- [ ] `spec.md` Dependencies checklist includes DB prerequisites (e.g., `- [ ] public.{table}.{column} column exists`)

**5.2. Search for stale references:**
Grep ALL documents for any remaining references to removed/renamed items. Fix any missed occurrences.

## Output

- Updated `design-style.md` (if visual changes), `spec.md`, `plan.md`, `tasks.md` with all approved changes
- Impact report (inline)
- Code impact report (inline or saved)
- Summary of all changes made

## Summary Format

```
## Requirement Update Complete

**Frame**: {frame_id}-{frame_name}
**Version**: {old_version} → {new_version} ({Cosmetic|Structural|Breaking})
**Change**: {brief description}

### Documents Updated
| Document | Sections Updated | Impact |
|----------|-----------------|--------|
| design-style.md | {list or "None"} | {High/Medium/Low/None} |
| spec.md | {list} | {High/Medium/Low} |
| plan.md | {list} | {High/Medium/Low} |
| tasks.md | {list} | {High/Medium/Low} |

### Task Summary
- Tasks added: {count}
- Tasks modified: {count}
- Tasks removed: {count}
- Tasks invalidated (need re-implementation): {count}

### ⚠️ Follow-up Required
- {Figma update needed? → then run momorph.syncdesign}
- {Code updates needed? → run momorph.implement or apply manually}
```

## Important Notes

- **User requirement is truth**: When the requirement change and existing docs disagree, the new requirement wins.
- **design-style.md can be updated when needed**: If the requirement change implies visual/style changes and Figma has not been updated yet, update `design-style.md` directly as part of this command. Always flag in the summary that Figma should be updated afterward, so `momorph.syncdesign` can verify alignment.
- **Surgical edits, never bulk rewrites**: Use the Edit tool to change individual lines/paragraphs. NEVER use the Write tool to overwrite plan.md or tasks.md in full. Unchanged content must remain byte-for-byte identical — this ensures `git diff` shows only the actual changes and preserves task completion state `[x]`.
- **Propagate completely**: A single requirement change can affect multiple docs. Always check all three documents for cascading impact.
- **No silent assumptions**: If a requirement change is ambiguous, ask the user before proceeding.
- **Minimize blast radius**: Only change what the requirement update requires. Do not "improve" or refactor unrelated content.

---

**Start by asking which frame to update and what requirement changed, or provide the frameId and change description.**

ARGUMENTS: $ARGUMENTS
