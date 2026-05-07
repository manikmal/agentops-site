---
phase: 04-trust-conversion
plan: "01"
subsystem: process-section
tags: [html, css, process, timeline, navigation]
dependency_graph:
  requires: []
  provides: [process-section-with-id, 5-step-timeline, nav-process-href]
  affects: [index.html, styles.css]
tech_stack:
  added: []
  patterns: [css-grid-5-column, semantic-html-timeline]
key_files:
  created: []
  modified:
    - index.html
    - styles.css
decisions:
  - "Process section id added as 'process' (not 'how-we-work') for predictable anchor compatibility"
  - "Eyebrow copy changed to 'How we work' to match Copywriting Contract (was 'How I work')"
  - "5-column grid replaces 4-column — existing 940px/640px breakpoints unchanged as they already collapse correctly"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-07T17:27:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 4 Plan 01: Process Section — 5-Step Timeline Summary

One-liner: Rewrote process section with 5 founder-POV timeline steps (Discovery/Scope/Build/Ship/Iterate), added `id="process"`, fixed nav href, updated CSS grid from 4 to 5 columns.

## What Was Changed

### index.html

| Change | Old Value | New Value | Line |
|--------|-----------|-----------|------|
| Nav "Process" href | `href="#contact"` | `href="#process"` | 34 |
| Process section id | (none) | `id="process"` | 243 |
| Section eyebrow | `How I work` | `How we work` | 245 |
| Section h2 | `From messy workflow to managed system.` | `From first conversation to shipped product.` | 246 |
| Timeline steps | 4 steps (Audit, Design, Build, Run) | 5 steps (Discovery, Scope, Build, Ship, Iterate) | 249–277 |

### styles.css

| Change | Old Value | New Value | Line |
|--------|-----------|-----------|------|
| `.timeline` grid columns | `repeat(4, minmax(0, 1fr))` | `repeat(5, minmax(0, 1fr))` | 779 |

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `7dab707` | feat(04-01): fix nav process href and update process section heading + id |
| Task 2 | `473860a` | feat(04-01): replace 4-step timeline with 5-step founder-POV timeline and update CSS grid |

## Deviations from Plan

### Accidental Commit to Main (Recovered)

**Found during:** Task 1 execution

**Issue:** First attempt at Task 1 edits were applied to the main repo path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/index.html`) instead of the worktree path. The commit accidentally landed on `main` branch.

**Fix:** Reverted the accidental commit on `main` via `git revert HEAD --no-edit`. Re-applied the same changes to the correct worktree path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-adab1fa7046ae7345/index.html`). All subsequent commits landed on `worktree-agent-adab1fa7046ae7345` as required.

**Files modified:** `index.html` (main repo — reverted cleanly), then same changes in worktree

**Net result:** No content deviation from the plan. Revert commit `64f544d` on main is the only side effect.

## Known Stubs

None. All 5 timeline steps use final copy from the Copywriting Contract. No placeholder text.

## Threat Flags

None. Plan 01 is pure HTML/CSS static content with no user input, no data fetch, and no external calls. No new security surface introduced.

## Self-Check

### Created files exist
- No new files created in this plan.

### Modified files exist
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-adab1fa7046ae7345/index.html` — exists, contains `id="process"`, `href="#process"`, 5 timeline steps, "weekly Loom", "Iterate"
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-adab1fa7046ae7345/styles.css` — exists, contains `repeat(5, minmax(0, 1fr))` at line 779

### Commits exist
- `7dab707` — feat(04-01): fix nav process href and update process section heading + id
- `473860a` — feat(04-01): replace 4-step timeline with 5-step founder-POV timeline and update CSS grid

## Self-Check: PASSED

All success criteria verified:
- [x] `index.html` has `id="process"` on process section element (line 243)
- [x] Nav contains `href="#process"` for Process link (line 34)
- [x] Process section h2 = "From first conversation to shipped product." (line 246)
- [x] Process section eyebrow = "How we work" (line 245)
- [x] Exactly 5 `<article class="timeline-step reveal">` elements inside `.timeline`
- [x] Step 03 (Build) `<p>` contains "weekly Loom" (line 262)
- [x] Step 05 (Iterate) `<h3>` contains "Iterate" (line 271)
- [x] `styles.css` `.timeline` rule has `repeat(5, minmax(0, 1fr))` (line 779)
- [x] No inline hex colors introduced in process section
