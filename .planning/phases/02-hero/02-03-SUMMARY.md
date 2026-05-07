---
phase: 02-hero
plan: "03"
subsystem: hero
tags: [javascript, animation, console, dual-loop, mutation-observer, setinterval]
dependency_graph:
  requires: [02-01]
  provides: [agent-trace-animation, dual-loop-console, reveal-wait-mechanism]
  affects: [script.js]
tech_stack:
  added: []
  patterns: [mutation-observer, setinterval-elapsed-timer, data-attribute-hooks, textcontent-only-dom-writes]
key_files:
  created: []
  modified:
    - path: script.js
      role: Agent-trace animation block appended after canvas block — dual-loop console animation with MutationObserver reveal-wait
decisions:
  - "All DOM text writes use textContent exclusively — innerHTML absent from agent-trace block per T-02-06 mitigation"
  - "MutationObserver uses attributeFilter: ['class'] (minimal scope) — not { attributes: true } per plan spec"
  - "rows array populated once at init from consoleEl.querySelectorAll('.flow-row') — not regenerated inside animation functions"
  - "traceTimeout kept at module scope within if(consoleEl) block for potential future cancellation on pagehide"
metrics:
  duration: "~5 minutes"
  completed: "2026-05-07"
  tasks_completed: 1
  files_modified: 1
requirements_satisfied: [HERO-03]
---

# Phase 2 Plan 03: Agent-Trace Animation Summary

**One-liner:** Dual-loop agent-trace animation appended to script.js — startup-pipeline and sme-automation loops cycle through 4 sequential rows with elapsed timers, label fades, and MutationObserver reveal-wait before starting.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Append agent-trace animation block to script.js | 17558d4 | script.js |

## What Was Built

### Task 1 — script.js agent-trace block

New sequential block appended after the canvas block (after the `pagehide` listener at line 313). The block:

- Declares `consoleEl` and `consoleLabel` via `data-agent-trace` and `data-console-label` selectors — consistent with the project's data-attribute hook convention
- Defines `LOOPS` config array with two entries:
  - Loop A (`startup-pipeline`): Orchestrator/"Merge detected on main", Build Agent/"Compiling and bundling", Test Agent/"Running integration suite", Deploy Agent/"Pushing to production"
  - Loop B (`sme-automation`): Orchestrator/"Weekly report triggered", Data Agent/"Pulling campaign metrics", Content Agent/"Generating summary copy", Publish Agent/"Sending to Notion + Slack"
- Queries `.flow-row` elements once at init into the `rows` array — no re-query inside animation functions
- `activateRow(stepIndex)` — toggles `.active` class on exactly one row, resets elapsed timer to "0s", starts `setInterval` ticking the timer up in seconds
- `resetRows()` — clears `elapsedInterval`, removes `.active` from all rows, resets all `<em>` to "•"
- `populateRows(loop)` — writes `step.agent` to `<strong>` and `step.task` to `<p>` via `textContent` only
- `swapLabel(newLabel)` — adds `.label-fade` class to trigger CSS opacity-0 transition, waits 250ms (matching `--duration-base` token), writes new label via `textContent`, removes `.label-fade` to fade back in
- `runStep()` — activates current row, sets 2800ms `setTimeout` to advance step; on final step, clears elapsed interval, waits 1200ms, calls `resetRows`, increments loop, populates next loop, swaps label, then waits 400ms before next `runStep`
- `startTrace()` — populates Loop A, calls `swapLabel` for initial label, starts animation with 600ms lead-in
- Reveal-wait: checks if `consoleEl.classList.contains("is-visible")` at init; if not, sets up `MutationObserver` with `{ attributeFilter: ["class"] }` to call `startTrace()` when `revealObserver` adds the `is-visible` class

## Deviations from Plan

None — plan executed exactly as written. The agent-trace block matches the specification in the interfaces section of 02-03-PLAN.md exactly.

## Known Stubs

None. The animation is fully wired — both loops populate from the `LOOPS` config, the MutationObserver correctly waits for the reveal, and all CSS hooks (`active`, `label-fade`) were implemented in Plan 02-01.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes. All content is hardcoded in the `LOOPS` config array — no user input reaches any DOM write function.

T-02-06 mitigation confirmed: `populateRows`, `activateRow`, `swapLabel`, and `resetRows` all use `textContent` exclusively. No `innerHTML` appears in the agent-trace block. The only `innerHTML` in script.js (line 79) is the pre-existing form error handler, unchanged by this plan.

T-02-07 accepted: `setInterval` fires at 1s intervals for a single active row — negligible CPU cost; cleared in both `resetRows` and `activateRow` (before each new interval is set).

## Self-Check: PASSED

- script.js contains `document.querySelector("[data-agent-trace]")` — confirmed (grep returns match)
- script.js contains `document.querySelector("[data-console-label]")` — confirmed
- script.js contains `"startup-pipeline"` — confirmed
- script.js contains `"sme-automation"` — confirmed
- script.js contains all 8 exact step strings from CONTEXT.md specifics section — confirmed
- script.js contains `row.classList.toggle("active", i === stepIndex)` — confirmed
- script.js contains `consoleLabel.classList.add("label-fade")` and `.remove("label-fade")` — confirmed
- script.js contains `mo.observe(consoleEl, { attributeFilter: ["class"] })` — confirmed
- script.js contains `strong.textContent = step.agent` and `p.textContent = step.task` — confirmed
- script.js contains `consoleLabel.textContent = newLabel` — confirmed
- script.js contains `em.textContent = "0s"`, `em.textContent = elapsed + "s"`, `em.textContent = "•"` — confirmed
- script.js contains `elapsedInterval = setInterval` and `clearInterval(elapsedInterval)` — confirmed
- script.js contains `new MutationObserver` — confirmed
- No `innerHTML` in agent-trace block (only pre-existing form handler line 79) — confirmed
- Commit 17558d4 exists in git log — confirmed
