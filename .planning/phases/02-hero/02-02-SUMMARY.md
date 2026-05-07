---
phase: 02-hero
plan: "02"
subsystem: canvas
tags: [performance, animation, canvas, javascript]
dependency_graph:
  requires: []
  provides: [canvas-particle-network-rewrite]
  affects: [script.js]
tech_stack:
  added: []
  patterns:
    - requestIdleCallback with setTimeout Safari fallback
    - k-nearest-neighbor O(n×k) line drawing
    - visibilitychange rAF pause/resume
    - debounce utility for resize handler
    - (pointer: fine) media query gate for mouse interaction
key_files:
  created: []
  modified:
    - script.js
decisions:
  - "Fixed particle count at 35 (no mobile branch) — satisfies ≤40 cap at all viewport sizes"
  - "k=6 chosen for nearest-neighbor limit (within D-14 range of 5–8) — balances visual density and performance"
  - "Debounce at 180ms (within D-17 range of 150–200ms)"
metrics:
  duration: "1m 6s"
  completed: "2026-05-07T07:18:06Z"
  tasks_completed: 1
  tasks_total: 1
  files_modified: 1
---

# Phase 2 Plan 02: Canvas Particle Network Rewrite — Summary

## One-liner

Canvas block rewritten with violet rgba(124,92,252) colors, k-nearest-neighbor O(n×k) line drawing, requestIdleCallback deferred init, visibilitychange tab-pause, and desktop-only mouse interaction — all HERO-04 constraints satisfied.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Rewrite canvas block in script.js | 1237023 | script.js |

## What Was Built

Replaced the entire canvas block in `script.js` (lines 151–271) with a corrected, performant implementation:

**Particle count:** Fixed at 35 (removed the `width < 720 ? 42 : 82` conditional branch that violated the ≤40 hard cap).

**Colors:** All canvas colors migrated to violet. Particles: `rgba(124, 92, 252, 0.8)`. Lines: `rgba(124, 92, 252, ${opacity * 0.15})`. Old cyan `rgba(4, 217, 217, ...)` and lime `rgba(164, 246, 63, ...)` completely removed.

**Line drawing algorithm:** Replaced O(n²) all-pairs double loop with k-nearest-neighbor approach. Each particle collects neighbors within 150px threshold using squared distance (no sqrt in inner loop), sorts by distance, then draws to at most k=6 nearest. Reduces worst-case line draw calls from n²/2 to n×k.

**Deferred init:** Canvas initialization wrapped in `requestIdleCallback(initCanvas, { timeout: 2000 })` with `setTimeout(initCanvas, 200)` fallback for Safari (which lacks requestIdleCallback support).

**Tab visibility:** Added `visibilitychange` listener — `cancelAnimationFrame(animationFrame)` when `document.hidden`, restarts `drawNetwork()` when tab becomes visible again.

**Resize debounce:** Added `debounce` utility function (closure-based, no external dependency). Resize listener now calls `debounce(resizeCanvas, 180)` instead of `resizeCanvas` directly.

**Desktop-only mouse:** `mousemove` and `mouseleave` listeners wrapped in `if (window.matchMedia("(pointer: fine)").matches)` guard — prevents mousemove registration on touch-only devices.

**Preserved:** `pagehide` handler kept exactly as-is. `data-agent-canvas` selector preserved. `resizeCanvas` devicePixelRatio clamp and `setTransform` pattern preserved. Spring-back physics (`baseVx`/`baseVy`) preserved. Recursive `animationFrame = requestAnimationFrame(drawNetwork)` assignment preserved.

## Deviations from Plan

None — plan executed exactly as written. The rewritten canvas block matches the specification in the plan's `<interfaces>` section verbatim.

## Threat Surface Scan

No new network endpoints, auth paths, or file access patterns introduced. The canvas block reads only browser events (mousemove, visibilitychange, pagehide, resize) and writes only to the canvas context. All three threat mitigations from the plan's threat model are implemented:

- T-02-03 (rAF DoS): visibilitychange cancels loop when tab hidden; pagehide also cancels.
- T-02-04 (resize storm): debounce(resizeCanvas, 180) prevents rapid resize calls.
- T-02-05 (particle count): count=35, hard cap at ≤40.

## Known Stubs

None.

## Self-Check: PASSED

- script.js: FOUND
- 02-02-SUMMARY.md: FOUND
- commit 1237023: FOUND
- count=35: PASS
- requestIdleCallback: PASS
- visibilitychange: PASS
- neighbors.sort: PASS
- pointer: fine: PASS
- violet color: PASS
- no cyan: PASS
- no lime: PASS
