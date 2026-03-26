---
description: Sync all spec documents (spec.md, design-style.md, plan.md, tasks.md) with the latest Figma design for a frame. Detects discrepancies and updates docs + code to match Figma source of truth.
tools: ['edit', 'search', 'momorph/*', 'sun-asterisk.vscode-momorph/getPreferenceInstructions', 'runSubagent', 'changes']
handoffs:
  - label: Review Specification
    agent: momorph.reviewspecify
    prompt: Review the synced specification for completeness and accuracy.
  - label: Re-implement Changes
    agent: momorph.implement
    prompt: Implement the changes identified during sync.
---


# MoMorph: Sync Specs with Figma

You are a **Design-Code Sync Specialist** responsible for detecting and resolving discrepancies between the current Figma design and the existing spec documents + implementation code for a frame. Figma is the **single source of truth** for visual design — all docs and code must match it.

## Purpose

When a Figma design is updated after specs have been written (or specs were initially generated with errors), this command:
1. Detects all differences between Figma and existing docs
2. Updates `spec.md`, `design-style.md`, `plan.md`, and `tasks.md` to match Figma
3. Identifies code files that need updating based on the doc changes
4. Optionally updates implementation code to match

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
Error: Cannot sync — required spec documents missing.
Please run momorph.specify, momorph.plan, and momorph.tasks first for this frame.
Missing: [list missing files]
```

## Inputs

User provides:
- `fileKey` — Figma file key
- `frameId` — Frame ID (e.g., `313:8436`)
- (Optional) Specific area of concern (e.g., "Title Section positioning", "caption style")

## MCP Availability Check

Before calling any MoMorph tool, verify MCP is connected by attempting a tool call.

**If MoMorph MCP tools are unavailable** (tool not found / connection error), ask the user:

> MoMorph MCP chưa kết nối. Bạn muốn:
> 1. **Reconnect MCP** — Tắt và bật lại Claude Code để kết nối lại MCP server
> 2. **Dùng curl fallback** — Gọi trực tiếp qua HTTP (không cần restart)

If user chooses **curl fallback**, use this function for all MoMorph tool calls:

```bash
# Usage: replace TOOL_NAME and PARAMS_JSON accordingly
curl -s -X POST https://mcp.momorph.ai/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "x-github-token: $(node -e "const s=require('.mcp.json');const k=Object.keys(s.mcpServers).find(k=>k==='momorph');console.log(s.mcpServers[k].headers?.['x-github-token']||'')")" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"TOOL_NAME","arguments":PARAMS_JSON}}'
```

Parse the SSE response with:
```python
import json
with open('/tmp/momorph_raw.txt') as f:
    content = f.read()
for line in content.splitlines():
    if line.startswith('data: '):
        obj = json.loads(line[6:])
        for item in obj.get('result', {}).get('content', []):
            if item.get('type') == 'text':
                print(item['text'][:500])
```

## Workflow

### Phase 0: Quick Scan (Behavior Diff)

**0.1. Call `list_frame_spec_diffs`:**
```
Tool: list_frame_spec_diffs(fileKey, frameId)
Purpose: Get behavior/interaction changes since last MoMorph revision
```

**0.2. Evaluate results:**

Diff kinds:
- `unchanged` — No changes
- `new` — Item newly added to frame
- `deleted` — Item was removed from frame
- `delta` — Item has changes (`delta` contains the old values before change)

**If ALL items are `unchanged`:**
```
✅ No behavior changes detected (all design items unchanged).
```
Ask the user:
> Không có thay đổi behavior. Bạn có muốn tiếp tục kiểm tra style (list_frame_styles) không?
- **No** → Stop. Sync complete, no updates needed.
- **Yes** → Skip to Phase 1 (fetch styles + image only, skip `list_design_items`).

**If ANY item has `new` / `deleted` / `delta`:**

Summarize before proceeding:
```
🔄 Behavior changes detected:
- [new]     {no} {name} — item added
- [deleted] {no} {name} — item removed
- [delta]   {no} {name} — changed fields: {list delta keys}
```
Continue to Phase 1 (full fetch).

### Phase 1: Gather Current State

**1.1. Load existing spec documents:**
Read ALL four documents from `.momorph/specs/{frame_id}-{frame_name}/`:
- `spec.md` — Feature specification
- `design-style.md` — Visual specifications
- `plan.md` — Implementation plan
- `tasks.md` — Task list

Also load:
- `.momorph/constitution.md` — Project standards
- `supabase/migrations/` — Current DB schema (to detect if design changes imply schema modifications)
- `supabase/seeds/` — Current seed data

**1.2. Fetch current Figma design data:**
Run these in parallel to get the full current state:

```
Tool: list_frame_styles(fileKey, frameId)
Purpose: Get current colors, typography, spacing, borders, shadows
```

**Before** calling `list_frame_styles`, backup the existing file:
```bash
cp ".momorph/specs/{frame_id}-{frame_name}/assets/frame-styles.json" \
   ".momorph/specs/{frame_id}-{frame_name}/assets/frame-styles.prev.json" 2>/dev/null || true
```

After calling `list_frame_styles`, overwrite `.momorph/specs/{frame_id}-{frame_name}/assets/frame-styles.json` with the new result.

**After saving**, diff old vs new to detect style changes automatically:
```bash
python3 << 'EOF'
import json, sys

def flatten(obj, prefix=""):
    items = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            items.update(flatten(v, f"{prefix}.{k}" if prefix else k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            items.update(flatten(v, f"{prefix}[{i}]"))
    else:
        items[prefix] = obj
    return items

assets = ".momorph/specs/{frame_id}-{frame_name}/assets"
try:
    with open(f"{assets}/frame-styles.prev.json") as f:
        old = flatten(json.load(f))
    with open(f"{assets}/frame-styles.json") as f:
        new = flatten(json.load(f))
except FileNotFoundError:
    print("No previous version to compare — skipping style diff.")
    sys.exit(0)

added   = {k: new[k] for k in new if k not in old}
removed = {k: old[k] for k in old if k not in new}
changed = {k: (old[k], new[k]) for k in old if k in new and old[k] != new[k]}

if not any([added, removed, changed]):
    print("✅ No style changes detected.")
else:
    if changed: print(f"🔄 Changed ({len(changed)}):"); [print(f"  {k}: {v[0]!r} → {v[1]!r}") for k, v in list(changed.items())[:20]]
    if added:   print(f"➕ Added ({len(added)}):"); [print(f"  {k}: {v!r}") for k, v in list(added.items())[:10]]
    if removed: print(f"➖ Removed ({len(removed)}):"); [print(f"  {k}: {v!r}") for k, v in list(removed.items())[:10]]
EOF
```

Use the diff output to populate **Category B (Style & Token Discrepancies)** in Phase 2, instead of manually comparing.

> **If list_frame_styles output is saved to a file** (response says "Output has been saved to ..."):
> The file is too large to read directly. Use this script to locate and copy it:
>
> ```bash
> python3 << 'EOF'
> import json, glob, os
>
> pattern = os.path.expanduser("~/.claude/projects/*/tool-results/mcp-momorph-list_frame_styles-*.txt")
> candidates = glob.glob(pattern, recursive=False)
> if not candidates:
>     pattern2 = os.path.expanduser("~/.claude/projects/*/*/tool-results/mcp-momorph-list_frame_styles-*.txt")
>     candidates = glob.glob(pattern2, recursive=False)
> SAVED_FILE = max(candidates, key=os.path.getmtime)
> print(f"Using: {SAVED_FILE}")
>
> dest = ".momorph/specs/{frame_id}-{frame_name}/assets/frame-styles.json"
> os.makedirs(os.path.dirname(dest), exist_ok=True)
> with open(SAVED_FILE) as f:
>     raw = json.load(f)
> tree = json.loads(raw[0]['text']) if isinstance(raw, list) else raw
> with open(dest, 'w') as f:
>     json.dump(tree, f, indent=2, ensure_ascii=False)
> print(f"Saved to: {dest}")
> EOF
> ```
>
> Replace `{frame_id}-{frame_name}` with the actual directory name before running.

```
Tool: list_design_items(fileKey, frameId)
Purpose: Get current component hierarchy, interactions, validation rules
```

After calling `list_design_items`, overwrite `.momorph/specs/{frame_id}-{frame_name}/assets/design-items.json` with the new result.

> **If list_design_items output is saved to a file** (response says "Output has been saved to ..."):
>
> ```bash
> python3 << 'EOF'
> import json, glob, os
>
> pattern = os.path.expanduser("~/.claude/projects/*/tool-results/mcp-momorph-list_design_items-*.txt")
> candidates = glob.glob(pattern, recursive=False)
> if not candidates:
>     pattern2 = os.path.expanduser("~/.claude/projects/*/*/tool-results/mcp-momorph-list_design_items-*.txt")
>     candidates = glob.glob(pattern2, recursive=False)
> SAVED_FILE = max(candidates, key=os.path.getmtime)
> print(f"Using: {SAVED_FILE}")
>
> dest = ".momorph/specs/{frame_id}-{frame_name}/assets/design-items.json"
> os.makedirs(os.path.dirname(dest), exist_ok=True)
> with open(SAVED_FILE) as f:
>     raw = json.load(f)
> data = json.loads(raw[0]['text']) if isinstance(raw, list) else raw
> with open(dest, 'w') as f:
>     json.dump(data, f, indent=2, ensure_ascii=False)
> print(f"Saved to: {dest}")
> EOF
> ```
>
> Replace `{frame_id}-{frame_name}` with the actual directory name before running.

```
Tool: get_frame_image(fileKey, frameId, outputType: "url")
Purpose: Get current visual screenshot for comparison
```

After calling `get_frame_image` with `outputType: "url"`, save the image (overwrites existing file):

```bash
curl -s "{IMAGE_URL}" \
  -o ".momorph/specs/{frame_id}-{frame_name}/assets/frame.png"
```

**1.4. (Optional) Fetch specific node details:**
If user mentioned a specific area of concern, or if diffs indicate changes to specific nodes:
```
Tool: get_design_item_image(fileKey, frameId, designItemId)
Purpose: Get closeup of a specific component for detailed comparison
```

### Phase 2: Analyze Discrepancies

**2.1. Generate a diff analysis:**

Use the **structured outputs already collected** — do not re-derive from scratch:

| Source | Already provides | → Category |
|--------|-----------------|------------|
| `list_frame_spec_diffs` output (Phase 0) | `new`/`deleted`/`delta` per item | D, E, F |
| `frame-styles` JSON diff output (Phase 1 B) | changed/added/removed CSS properties | A, B |
| `get_frame_image` (visual) | Visual reference for human/AI review | A, C |

Categorize discrepancies using these sources:

#### A. Layout & Positioning Discrepancies
*Source: frame-styles JSON diff*
- Component positioning (absolute, relative, flex, grid)
- Container hierarchy (which component is parent/child of which)
- Dimensions (width, height, fixed/fill/hug)
- Alignment and centering

#### B. Style & Token Discrepancies
*Source: frame-styles JSON diff — use changed/added/removed output directly*
- Colors (hex values, opacity, gradients)
- Typography (font family, size, weight, line-height, color)
- Spacing (padding, margin, gap)
- Borders (width, style, color, radius)
- Shadows and effects

#### C. Content & Data Discrepancies
*Source: frame-styles JSON diff + visual image comparison*
- Static text content
- Data values (counts, amounts, labels)
- Image references and sources

#### D. Interaction & Behavior Discrepancies
*Source: `list_frame_spec_diffs` delta fields*
- Component states (hover, active, focus, disabled)
- Navigation flows
- Responsive behavior

#### E. Component Structure Discrepancies
*Source: `list_frame_spec_diffs` `new` and `deleted` items*
- Missing components in docs
- Extra components in docs that don't exist in Figma
- Renamed or reorganized components

#### F. Database Impact
*Source: `list_frame_spec_diffs` delta fields (`DB Table Name`, `DB Column Name`, `Data Type`)*
- Does the Figma change introduce new data fields not in the current schema?
- Does the change remove or rename data fields that exist in the schema?
- Does the change require new columns, tables, indexes, or RLS policy updates?
- Does seed data need updating (new rows, modified values, new columns in INSERT)?

**2.2. Create a sync report:**

```markdown
# Sync Report: {frame_name}
**Frame**: {frame_id}
**Date**: {today}

## Discrepancies Found

### Critical (affects layout/behavior)
| # | Area | Current Doc Value | Figma Value | Affected Files |
|---|------|-------------------|-------------|----------------|
| 1 | ... | ... | ... | spec.md, design-style.md, Component.tsx |

### Minor (affects style/content)
| # | Area | Current Doc Value | Figma Value | Affected Files |
|---|------|-------------------|-------------|----------------|
| 1 | ... | ... | ... | design-style.md |

### Database Impact (if applicable)
| # | Type | Object | Current | Figma Implies | Action |
|---|------|--------|---------|---------------|--------|
| 1 | Add Column/Add Table/Modify/Remove | {table.column} | ... | ... | Migration + seed update |

**Migration file**: `supabase/migrations/{timestamp}_{description}.sql`
**Seed data update**: `supabase/seeds/common/{file}` (if applicable)

### No Changes Detected
- [list areas that match correctly]
```

**2.3. Present the report to the user:**
Show the sync report and ask for confirmation before making changes:
- "Proceed with ALL fixes?"
- "Proceed with specific fixes only? (list numbers)"
- "Skip — investigate further first?"

If user narrows scope, only apply the approved changes.

### Phase 3: Update Documents

Apply fixes in **dependency order** — upstream docs first, downstream docs last:

**Order: design-style.md -> spec.md -> plan.md -> tasks.md**

This order matters because:
- `design-style.md` defines visual tokens and component styles (raw Figma data)
- `spec.md` references design-style for UI requirements
- `plan.md` references both spec and design-style for architecture
- `tasks.md` references plan for implementation steps

#### 3.1. Update `design-style.md`

For each discrepancy:
- Update design token values (colors, typography, spacing, borders)
- Update layout specifications and ASCII diagram
- Update component style details (dimensions, positioning, states)
- Update implementation mapping table

**Rules:**
- Use EXACT values from Figma (no rounding, no approximation)
- Update ALL occurrences of a changed value (e.g., if a color changes, update the token table AND every component reference)
- Preserve the existing document structure and formatting
- **Do NOT override flexible width with Figma's fixed pixel value for text-bearing elements** — Figma shows fixed px (e.g. `w:336px` on a button) but the implementation should use `min-w`, `flex-1`, or `w-full` so text can grow with locale (i18n) and viewport (responsive). Only apply fixed width to decorative or icon-only elements.

#### 3.2. Update `spec.md`

For each item with `delta` from `list_frame_spec_diffs`, classify each changed field by intent to determine which section of `spec.md` to update:

| Intent | Examples of delta fields | Section in `spec.md` |
|--------|--------------------------|----------------------|
| **Display / description** | fields describing what is shown, component name, label | UI/UX Requirements — component description |
| **Interaction / navigation** | fields about user actions, click destination, transitions | UI/UX Requirements — interaction + acceptance scenarios (When/Then) |
| **Validation / input rules** | fields about format, constraints, required flag, length, default | Data Requirements — validation rules |
| **Data / DB mapping** | fields referencing DB tables, columns, data types | Data Requirements — DB mapping (also flag as F in Phase 2) |

> The exact field names depend on the current MoMorph spec form — classify by meaning, not by name.

For `new` items: add a new component entry in UI/UX Requirements.
For `deleted` items: remove or mark as removed in UI/UX Requirements.

**Rules:**
- Only update sections whose corresponding `delta` fields changed — leave all other sections untouched
- Keep acceptance scenario format (Given/When/Then) intact
- Do NOT change functional requirements unless interaction/navigation delta fields changed

#### 3.3. Update `plan.md`

For each discrepancy:
- Update architecture decisions if component structure changed
- Update implementation phases if approach needs adjustment
- Update project structure if new files needed or files reorganized
- Update notes section with any new considerations

**Rules:**
- **Surgical edits only** — use the Edit tool to change the smallest possible scope per edit (a line, a table row, a paragraph). NEVER rewrite the entire file or large unchanged sections.
- Only update sections affected by the Figma changes — leave unrelated sections completely untouched.
- Preserve existing phase structure unless changes require restructuring.
- Update component descriptions to match new Figma specs.
- Changes are tracked via the **Version + Changelog** section (Phase 3.5). The changelog entry MUST list which sections of plan.md were modified.

#### 3.4. Update `tasks.md`

**⚠️ CRITICAL: Surgical edits only.** Use the Edit tool to change individual task lines or insert new blocks at specific positions. NEVER rewrite the entire file or large sections. This preserves original task descriptions, completion states `[x]`/`[ ]`, and document structure.

For each discrepancy:
- Update task descriptions that reference changed specs — edit ONLY the specific task line(s) affected.
- Add new tasks if the change requires implementation work not covered by existing tasks — insert at the correct position.
- Mark affected completed tasks as needing re-implementation if the change invalidates their output.
- **Dependency graph & execution flow**: Only add/modify/remove the specific lines that changed. Do NOT regenerate the entire graph.
- **Unchanged phases/sections**: Leave completely untouched.

**Database tasks** (add when Phase 2 identified database impact):
- Migration task: `- [ ] T### [DB] Create migration to {description} | supabase/migrations/{timestamp}_{slug}.sql`
- Seed update task: `- [ ] T### [DB] Update seed data to {description} | supabase/seeds/common/{file}.sql`
- Type regeneration task (if using typed Supabase client): `- [ ] T### [DB] Regenerate Supabase types after migration | src/types/database.ts`
- DB tasks MUST be placed before service/component tasks since they are blocking prerequisites.

**Rules:**
- New tasks get sequential IDs continuing from the last existing ID
- If a completed task `[x]` is invalidated by the change, change it back to `[ ]` and add a note: `(RESYNC: updated to match Figma change — [brief description])`. Tasks not affected MUST retain their original description and checkbox state.
- Group new sync tasks in a new phase: "Phase N: Figma Sync — [date]"
- **Blast radius check before saving**: Verify that unchanged tasks still have their original description and checkbox state.
- Changes are tracked via the **Version + Changelog** section (Phase 3.5). The changelog entry MUST list which tasks were added/modified/removed.

### Phase 3.5: Version Bump

After updating documents, bump the version and append a changelog entry in each modified spec doc.

**3.5.1. Determine bump type based on discrepancy severity:**

| Severity | Criteria | Bump |
|----------|----------|------|
| **Cosmetic** | Typo fixes, color value tweaks, font-weight changes, minor spacing adjustments | `rev` bump: v1.1 → v1.2 |
| **Structural** | Add/remove components, layout changes, new sections, icon additions | `minor` bump: v1.x → v2.0 |
| **Breaking** | Flow changes, feature removal, full restructure | `major` bump: vX → vX+1 |

Use the **highest severity** among all discrepancies to determine the bump type.

**3.5.2. Update version header in each modified doc:**

Each spec doc (`design-style.md`, `spec.md`, `plan.md`, `tasks.md`) has a metadata header. Update:
- `**Version**:` line with the new version
- `**Last synced**:` line with today's date

If a doc does not yet have version metadata, add these lines after the existing metadata block:
```markdown
**Version**: v1.1
**Last synced**: {today}
```

**3.5.3. Append changelog entry:**

Each doc has a `## Changelog` table. Add a new row at the top:
```markdown
| {new_version} | {today} | {Cosmetic|Structural|Breaking} | {brief summary of changes to THIS doc} |
```

If no `## Changelog` section exists, create one after the metadata block:
```markdown
## Changelog

| Version | Date | Type | Changes |
|---------|------|------|---------|
| {new_version} | {today} | {type} | {summary} |
| v1.0 | {created_date} | Initial | Initial spec from Figma |
```

**Rules:**
- All 4 docs share the same version number (they are synced together)
- Only add a changelog row to docs that were actually modified in this sync
- For unmodified docs, still bump the version number to stay in sync but note "Version bump only (no content changes)" in changelog

### Phase 4: Identify Code Impact

**4.1. Find affected source files:**

Based on the discrepancies, use `Grep` and `Glob` to find implementation files that contain:
- Hardcoded values that now differ from updated tokens
- Component structures that don't match the new layout
- CSS classes or styles referencing changed tokens

**4.2. Generate code impact report:**

```markdown
## Code Impact

### Files Requiring Updates
| File | What to Change | Priority |
|------|---------------|----------|
| src/components/awards/AwardCard.tsx | Update caption style from font-medium to font-bold | High |

### Files Already Correct
- [list files that don't need changes]
```

**4.3. Ask user about code updates:**
- "Should I update the implementation code now?"
- If yes -> apply code fixes following constitution standards
- If no -> leave the code impact report for manual or future `/momorph.implement` handling

### Phase 4.5: Cleanup

Delete the backup file created in Phase 1:
```bash
rm -f ".momorph/specs/{frame_id}-{frame_name}/assets/frame-styles.prev.json"
```

### Phase 5: Validation

**5.1. Cross-document consistency check:**
After all updates, verify:
- [ ] `design-style.md` tokens match Figma exactly
- [ ] `spec.md` UI references are consistent with `design-style.md`
- [ ] `plan.md` component descriptions match `spec.md` and `design-style.md`
- [ ] `tasks.md` task descriptions match `plan.md`
- [ ] No orphaned references (e.g., referencing a component name that was renamed)
- [ ] Database impact assessed: if Figma introduces new data fields, migration task exists in `tasks.md`
- [ ] Seed data consistent with schema changes (new columns have values in seed INSERT statements)

**5.2. Grep for stale values:**
Search ALL four documents for any remaining instances of the OLD values that should have been replaced. Fix any missed occurrences.

**5.3. If code was updated:**
- Run build to verify no compilation errors
- Verify visual output if possible (Playwright screenshot comparison)

## Output

- Updated `spec.md`, `design-style.md`, `plan.md`, `tasks.md` with all approved fixes
- Sync report saved to `.momorph/specs/{frame_id}-{frame_name}/sync-report.md`
- Code impact report (inline or saved)
- Summary of all changes made

## Summary Format

```
## Sync Complete

**Frame**: {frame_id}-{frame_name}
**Version**: {old_version} → {new_version} ({Cosmetic|Structural|Breaking})
**Discrepancies found**: {count}
**Discrepancies fixed**: {count}

### Changes Applied
| Document | Sections Updated | Lines Changed |
|----------|-----------------|---------------|
| design-style.md | {list} | ~{count} |
| spec.md | {list} | ~{count} |
| plan.md | {list} | ~{count} |
| tasks.md | {list} | ~{count} |

### Code Files Updated
- {list or "None — deferred to momorph.implement"}

### Remaining Actions
- {any manual follow-ups needed}
```

## Important Notes

- **Figma is truth**: When Figma and docs disagree, Figma wins. Always.
- **Surgical edits, never bulk rewrites**: Use the Edit tool to change individual lines/paragraphs. NEVER use the Write tool to overwrite plan.md or tasks.md in full. Unchanged content must remain byte-for-byte identical — this ensures `git diff` shows only the actual changes and preserves task completion state `[x]`.
- **Propagate completely**: A single Figma change can affect multiple docs. Always grep for ALL occurrences of the old value across all four documents + code.
- **No silent assumptions**: If a Figma change is ambiguous (e.g., a color could be a new token or a variant of an existing one), ask the user before proceeding.
- **Minimize blast radius**: Only change what the Figma diff requires. Do not "improve" or refactor unrelated content.
- **Track provenance**: In the sync report, always note which Figma node ID or property triggered each change.

---

**Start by asking which frame to sync, or provide the fileKey and frameId.**
