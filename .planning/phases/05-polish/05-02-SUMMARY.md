---
phase: 05-polish
plan: 02
subsystem: ui
tags: [html, seo, meta-tags, opengraph, twitter-card, preload, wordmark, svg]

# Dependency graph
requires:
  - phase: 05-polish-01
    provides: wordmark.svg asset created and committed to repo root
provides:
  - "Full og:/twitter: social meta block in index.html head"
  - "LCP preload hints for wordmark.svg and Inter font stylesheet"
  - "wordmark.png references replaced with wordmark.svg in header and hero"
  - "Book a call button repositioned before nav-toggle in header DOM for mobile visibility"
affects: [05-03-css-polish, lighthouse, social-sharing, mobile-layout]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "og: meta block pattern: og:type, og:url, og:title, og:description, og:image with absolute URL"
    - "twitter:card summary_large_image pattern with title, description, image"
    - "LCP preload: rel=preload as=image for wordmark, rel=preload as=style for Google Fonts"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "05-02: og:image and twitter:image use absolute URL https://agentopsstudio.com/og-image.png"
  - "05-02: wordmark.svg preload count is 3 (preload link + brand-wordmark + hero-wordmark) — acceptance criteria of 2 was written before preload hint was added; all 3 references are correct"
  - "05-02: btn-book-call href kept as #contact per plan — Calendly URL wiring is pre-existing Phase 4 work"

patterns-established:
  - "Header DOM order: .brand -> .btn-book-call -> .nav-toggle -> .site-nav (enables mobile always-visible CTA outside hamburger)"

requirements-completed:
  - PERF-06
  - PERF-07

# Metrics
duration: 1min
completed: 2026-05-08
---

# Phase 5 Plan 02: HTML Meta, Preloads, and Header DOM Summary

**og:/twitter: social meta block with absolute og-image URL, LCP preload hints for wordmark.svg and Inter font, wordmark.png replaced with SVG in both header and hero, and Book a call button moved before hamburger toggle for always-visible mobile CTA**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-05-08T06:48:58Z
- **Completed:** 2026-05-08T06:50:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added complete og:/twitter: social meta block (9 tags) with absolute agentopsstudio.com URLs
- Added LCP preload hints for wordmark.svg (image) and Inter font stylesheet
- Replaced both wordmark.png references (header brand-wordmark, hero hero-wordmark) with wordmark.svg
- Repositioned .btn-book-call in header DOM: .brand -> .btn-book-call -> .nav-toggle -> .site-nav

## Task Commits

Each task was committed atomically:

1. **Task 1: Add og: meta block and preload hints to head** - `a4026c8` (feat)
2. **Task 2: Swap wordmark.png to wordmark.svg and reposition mobile CTA** - `4ba8517` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `index.html` - og: meta block in head, preload hints, wordmark.svg references, btn-book-call repositioned

## Decisions Made
- og:image and twitter:image use absolute URL `https://agentopsstudio.com/og-image.png` per D-04/D-05
- Preload hint for wordmark.svg added (D-03) — this means wordmark.svg appears 3 times in the file (preload + 2 img tags), not 2 as the acceptance criteria expected; all 3 are correct
- btn-book-call href left as `#contact` per plan note — Calendly URL wiring is pre-existing Phase 4 work

## Deviations from Plan

None - plan executed exactly as written.

The wordmark.svg reference count of 3 (vs. the acceptance criterion comment of 2) is not a deviation — the preload link added in Task 1 is required per D-03, and both img tags also use wordmark.svg. The critical check (wordmark.png = 0) passes.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Social meta tags are in place; og-image.png asset must exist at repo root before deployment for sharing previews to work
- Header DOM order is correct for Plan 03's CSS mobile CTA pin (btn-book-call outside nav, before nav-toggle)
- wordmark.svg is preloaded and referenced in both img tags — Plan 01's asset is wired correctly

---
*Phase: 05-polish*
*Completed: 2026-05-08*
