---
phase: 05-polish
plan: 04
subsystem: ui
tags: [canvas, reduced-motion, accessibility, performance, lazy-loading, CLS]

# Dependency graph
requires:
  - phase: 05-polish plan 02
    provides: index.html with wordmark.svg wired in header and hero
  - phase: 05-polish plan 03
    provides: styles.css with kill-all prefers-reduced-motion block

provides:
  - Canvas rAF animation fully gated by prefers-reduced-motion at init level (not just inside counter)
  - visibilitychange resume handler also respects prefers-reduced-motion
  - All below-fold images have loading=lazy
  - All img elements have explicit width/height attributes preventing CLS
affects: [phase-05-final-verification, lighthouse-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "window.matchMedia('(prefers-reduced-motion: reduce)').matches guard on canvas init block outer if condition"
    - "loading=lazy on all below-fold img elements; intrinsic width/height on all img elements for CLS prevention"

key-files:
  created: []
  modified:
    - script.js
    - index.html

key-decisions:
  - "Use viewBox intrinsic dimensions (180x28) as width/height on wordmark.svg img elements; CSS height override controls rendered size without CLS"
  - "footer-icon (below fold) was the only missing lazy attribute — portfolio card images were already correct from prior phases"
  - "Canvas init block guarded at the outer if level (not inside rAF callback) so requestIdleCallback itself is never queued for reduced-motion users"

patterns-established:
  - "Reduced-motion guard pattern: !window.matchMedia('(prefers-reduced-motion: reduce)').matches in canvas outer if condition"
  - "SVG img elements: use viewBox intrinsic dims for width/height attrs, let CSS height override for rendered size"

requirements-completed: [PERF-03, PERF-04, PERF-05]

# Metrics
duration: 8min
completed: 2026-05-08
---

# Phase 5 Plan 04: Reduced-motion Canvas Guard and Lazy Loading Audit Summary

**Canvas rAF loop now fully skipped when prefers-reduced-motion: reduce is set; all 8 img elements have explicit dimensions and all 5 below-fold images have loading=lazy**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-08T00:00:00Z
- **Completed:** 2026-05-08T00:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Fixed missing reduced-motion guard: canvas init block (requestIdleCallback) and visibilitychange resume handler now both check `!window.matchMedia('(prefers-reduced-motion: reduce)').matches` — the canvas stays blank for users with vestibular disorders
- Added explicit `width="180" height="28"` (SVG viewBox intrinsic dimensions) to `.brand-wordmark` and `.hero-wordmark` img elements, preventing CLS on load
- Added `loading="lazy"` to the footer icon (the one below-fold image missing the attribute); confirmed 4 portfolio card images were already correctly lazy-loaded with full dimensions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add prefers-reduced-motion guard to canvas init and visibilitychange** - `5e4133d` (fix)
2. **Task 2: Audit and add lazy loading attributes to below-fold images** - `77e4798` (perf)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `script.js` — Canvas init if-condition and visibilitychange else-if both gated by !matchMedia reduced-motion check
- `index.html` — width/height added to brand-wordmark and hero-wordmark; loading=lazy added to footer-icon

## Decisions Made

- **SVG intrinsic dimensions for width/height:** wordmark.svg viewBox is `0 0 180 28`, so `width="180" height="28"` on the img elements gives the browser the correct aspect ratio for layout reservation. CSS `height: 44px` (header) and `height: 90px` (hero) override the rendered size — this is the correct pattern for CLS prevention without specifying rendered px in HTML.
- **Canvas init level guard (not inside callback):** The guard is applied to the outer `if` condition so `requestIdleCallback` itself is never queued, avoiding any wasted scheduling overhead for reduced-motion users.
- **document.hidden cancel branch unchanged:** The `if (document.hidden)` cancel branch in visibilitychange was intentionally left without a reduced-motion check — cancelling the rAF on tab hide is correct behavior regardless of motion preference. Only the resume branch (else if) was gated.

## Deviations from Plan

None - plan executed exactly as written.

The context note (D-09 in CONTEXT.md was incorrect — guard was NOT in place) was already documented in the plan objective. This plan fixed that documented bug.

## Known Stubs

None.

## Threat Flags

None. Changes are client-side JS guards and HTML attribute additions with no new network surface.

## Issues Encountered

None.

## Next Phase Readiness

- All PERF-03, PERF-04, PERF-05 requirements satisfied
- script.js is now fully accessible for users with prefers-reduced-motion
- index.html image attributes are complete and CLS-clean
- Ready for Phase 5 final plan (05-05)

---

## Self-Check

- [x] `script.js` modified: exists ✓
- [x] `index.html` modified: exists ✓
- [x] Commit `5e4133d` exists ✓
- [x] Commit `77e4798` exists ✓
- [x] `grep -c "canvas && context && !window.matchMedia" script.js` = 2 ✓
- [x] `grep -c "else if (canvas && context && !window.matchMedia" script.js` = 1 ✓
- [x] `grep -c 'loading="lazy"' index.html` = 5 ✓

## Self-Check: PASSED

---
*Phase: 05-polish*
*Completed: 2026-05-08*
