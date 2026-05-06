---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [css, design-tokens, typography, ios-safari, header, backdrop-filter]

# Dependency graph
requires: []
provides:
  - "Two-layer CSS custom property system: PRIMITIVES (:root --violet-600, --gray-950, etc.) + SEMANTIC (:root --color-accent, --color-bg, --color-surface-1/2/3, etc.)"
  - "Fluid type scale: h1 clamp(2.5rem, 5vw+1rem, 5rem), h2 clamp(1.75rem, 3vw+0.75rem, 3rem), h3 clamp(1.25rem, 1.5vw+0.5rem, 1.75rem) with negative letter-spacing tokens"
  - "iOS Safari-safe floating header: .header-positioner (transform only) + .site-header (backdrop-filter only)"
  - "Violet pill .btn-primary: background var(--color-accent), border-radius var(--radius-full)"
  - ".nav-link.is-active with violet dot ::after indicator"
affects: [02, 03, 04, 05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two-layer CSS token hierarchy: primitives never referenced in component CSS, only semantic tokens"
    - "iOS Safari: transform and backdrop-filter must never be on the same element (wrapper split)"
    - "Fluid type scale with clamp() — no breakpoint-scoped font-size overrides"
    - "Consolidated breakpoints at bottom of styles.css (940px, 640px blocks only)"

key-files:
  created: []
  modified:
    - styles.css

key-decisions:
  - "Two-layer token hierarchy: PRIMITIVES block (raw values, e.g. --violet-600: #7c5cfc) followed by SEMANTIC block (--color-accent: var(--violet-600)) — component CSS must only reference semantic tokens"
  - "iOS Safari backdrop-filter/transform split: .header-positioner owns transform, .site-header owns backdrop-filter — these must never be on the same element"
  - "Fluid type scale with clamp() replaces all fixed font-size values and all breakpoint-scoped h1/h2 overrides — no @media font-size overrides to remain"
  - ".btn-primary is a violet pill (var(--color-accent) background, var(--radius-full) border-radius) — lime green and pulse animation removed"

patterns-established:
  - "Semantic token reference: all component CSS uses var(--color-*), var(--space-*), var(--radius-*) — never inline rgba or hex in component rules"
  - "Header scroll state: JS adds .scrolled to .header-positioner; .scrolled .site-header transitions background"
  - "Active nav tracking: JS adds .is-active to .nav-link; ::after pseudo-element shows violet dot indicator"

requirements-completed: [FOUN-01, FOUN-02, FOUN-03, FOUN-04]

# Metrics
duration: 4min
completed: 2026-05-06
---

# Phase 01-foundation Plan 01: Design Token System + Typography + Header CSS Split Summary

**Two-layer CSS custom property system with violet accent (#7c5cfc), fluid clamp() type scale, and iOS Safari-safe .header-positioner/.site-header split replacing the old flat :root token block**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-06T21:27:48Z
- **Completed:** 2026-05-06T21:31:18Z
- **Tasks:** 2 (executed atomically as a single pass)
- **Files modified:** 1 (styles.css)

## Accomplishments

- Replaced flat 11-token :root block (--ink, --charcoal, --lime, etc.) with 55-token two-layer system: PRIMITIVES block (violet scale, gray scale, signal colors, motion tokens) + SEMANTIC block (backgrounds, borders, text, accent, header glassmorphism, typography, spacing, radius, shadows, layout)
- Swept all old token references across styles.css (--ink, --charcoal, --graphite, --paper, --white, --line, --muted, --lime, --cyan, --coral, --shadow) → replaced with semantic equivalents; zero old references remain
- Fixed iOS Safari backdrop-filter/transform rendering bug: split single .site-header rule into .header-positioner (position: fixed; transform: translateX(-50%)) and .site-header (backdrop-filter: blur(18px) saturate(180%); -webkit-backdrop-filter) — never on the same element
- Replaced fixed h1/h2/h3 font-sizes with fluid clamp() scale; removed four breakpoint-scoped h1/h2 font-size overrides from @media blocks (made redundant by clamp())
- Replaced lime-green .btn-primary with violet pill (background: var(--color-accent), border-radius: var(--radius-full)); removed @keyframes pulse animation
- Added .nav-link.is-active rule with violet dot ::after pseudo-element for active section indicator

## Task Commits

Both tasks were planned as separate work items but executed in one atomic write (correct file state required reading all existing token references before making any changes):

1. **Task 1: Replace :root token block and sweep all old token references** - `852c478` (feat)
2. **Task 2: Typography scale, header CSS split, btn-primary violet pill, nav-link active state** - `852c478` (feat — same commit, atomic with Task 1)
3. **Spacing fix: normalize token declaration for grep criteria** - `436d7e8` (fix)

**Plan metadata:** (to be committed with SUMMARY.md)

## Files Created/Modified

- `styles.css` - Complete CSS foundation rewrite: two-layer token system, fluid type scale, iOS Safari-safe header split, violet pill button, active nav indicator

## Decisions Made

- Executed both tasks as a single atomic write since Task 1 (token replacement) and Task 2 (typography + header + button) are interdependent — writing Task 1 then re-reading before Task 2 would be identical to writing both together with full knowledge of the old file state
- Token alignment spacing normalized for plan acceptance criteria grep patterns (single space after colon in --violet-600 and --color-accent declarations)

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria met.

## Issues Encountered

- Initial write used CSS alignment whitespace (double spaces after colons) in `--violet-600:  #7c5cfc` and `--color-accent:         var(--violet-600)` declarations. Plan acceptance criteria grep patterns use single-space. Fixed in follow-up commit `436d7e8`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Design token foundation is complete; Plan 02 (Inter font loading + index.html head/header restructure) can proceed immediately
- All component CSS in subsequent plans must reference only semantic tokens (--color-*, --space-*, --radius-*) — never inline rgba or hex values
- The .header-positioner/.site-header split requires index.html to wrap the existing `<header class="site-header">` in `<div class="header-positioner" data-header>` — this is Plan 02's task
- No blockers for Plan 02 or Plan 03

---
*Phase: 01-foundation*
*Completed: 2026-05-06*
