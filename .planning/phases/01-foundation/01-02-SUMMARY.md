---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [html, css, inter, google-fonts, header, nav, hero, copy, sme-audit]

# Dependency graph
requires: []
provides:
  - Inter variable font loading via Google Fonts (preconnect + stylesheet link)
  - iOS Safari-safe header: .header-positioner[data-header] wrapper + .site-header inner (no backdrop-filter on transform element)
  - Startup-native nav labels: Services / Work / Process / About / Contact with .nav-link class
  - "Book a call" .btn-primary.btn-book-call CTA in nav
  - Startup-native hero copy: "Build AI products that scale." / "End-to-end AI engineering for founders who need it done right."
  - Startup-native title: "AgentOps Studio | AI Engineering for Founders & Growing Teams"
  - Startup-native ops-console agent trace: Orchestrator / Data Agent / Monitoring Agent
  - Packages section removed from HTML and styles.css
  - All SME-era language removed from visible copy
  - Contact section cleaned: no direct-contact div, no phone form field
  - Footer phone link removed
affects:
  - plan-03 (script.js scroll handler targets [data-header] on .header-positioner; sectionObserver requires .nav-link class)
  - plan-04 (contact section rebuilt in Phase 4; Gmail in footer is interim state)

# Tech tracking
tech-stack:
  added:
    - Google Fonts Inter variable font (ital,opsz,wght@0,14..32,100..900)
  patterns:
    - iOS Safari header split: outer positioner (transform only) + inner visual panel (backdrop-filter only)
    - data-header attribute moves to outer .header-positioner wrapper for JS querySelector('[data-header]')
    - .nav-link class on all nav anchors required for Plan 03 IntersectionObserver active tracking

key-files:
  created: []
  modified:
    - index.html
    - styles.css

key-decisions:
  - "data-header attribute lives on .header-positioner (outer div), NOT on .site-header — JS in script.js uses querySelector('[data-header]') which must target the wrapper for scroll class toggling"
  - "Nav href values preserved (#agents, #automations, #devops, #portfolio, #contact) — only link text updated; section id rename is Phase 3 scope"
  - "packages-section removed from both HTML and styles.css (shared selectors cleaned from .package-card, .package-grid rules)"
  - "Contact section direct-contact div removed; form submit button updated from 'Request audit' to 'Send message' to remove audit language"
  - "SME-era first-person plural ('We build', 'We turn', 'How we work') updated to first-person singular throughout"

patterns-established:
  - "Header split pattern: .header-positioner gets positioning + transform; .site-header gets visual styles + backdrop-filter — never combined on one element"
  - "Nav links always carry class='nav-link' for JS IntersectionObserver active state tracking"

requirements-completed: [FOUN-03, FOUN-05, HEAD-01, HEAD-02, HEAD-03]

# Metrics
duration: 20min
completed: 2026-05-07
---

# Phase 1 Plan 02: HTML Shell & SME Language Audit Summary

**Inter font loading, iOS Safari-safe header wrapper split, startup-native nav/hero copy, and full SME language audit removing packages section, contact phone/Gmail, and hero metrics**

## Performance

- **Duration:** 20 min
- **Started:** 2026-05-07T00:00:00Z
- **Completed:** 2026-05-07T00:20:00Z
- **Tasks:** 2
- **Files modified:** 2 (index.html, styles.css)

## Accomplishments

- Restructured header from single `<header data-header>` to `<div class="header-positioner" data-header>` + `<header class="site-header">` — fixes iOS Safari backdrop-filter/transform conflict
- Added Inter variable font via Google Fonts preconnect + stylesheet link; removed obsolete Unsplash preconnect
- Updated title, meta description, nav labels, and hero copy to startup-native positioning
- Removed all SME-era structural elements: hero-contact-links div, hero-metrics div, packages-section (HTML + CSS), direct-contact div, phone form field, footer phone link
- Replaced SME-era ops-console content with startup-native Orchestrator/Data Agent/Monitoring Agent trace
- Neutralized first-person plural "we/our" voice throughout visible copy (sections, headings, eyebrows)

## Task Commits

1. **Task 1: Update head and restructure header HTML** - `80e9385` (feat)
2. **Task 2: Hero copy, SME language audit, and structural element removal** - `51de4e1` (feat)

**Plan metadata:** (to be committed with SUMMARY)

## Files Created/Modified

- `index.html` - Head updated (Inter font, title, meta), header restructured (wrapper split + nav-link classes + Book a call CTA), hero copy replaced, SME elements removed, ops-console updated, contact section cleaned, footer cleaned
- `styles.css` - Removed .packages-section, .package-card, .package-grid rules and their selector references in shared rules and both media query blocks

## Decisions Made

- Preserved existing nav `href` anchor values (`#agents`, `#automations`, `#devops`, `#portfolio`, `#contact`) — only visible text updated; section `id` rename is Phase 3 scope per plan spec
- `data-header` moved to `.header-positioner` outer wrapper to support Plan 03 scroll handler which uses `querySelector('[data-header]')`
- Contact form submit button changed from "Request audit" to "Send message" — "audit" language was SME-era per FOUN-05
- Contact section eyebrow/h2 updated from "Tell us..." to "Tell me..." to be consistent with first-person singular voice throughout

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Updated contact section eyebrow and h2 to first-person singular**
- **Found during:** Task 2 (SME language audit)
- **Issue:** Contact section had "Tell us what your team repeats every week." — first-person plural "us/our team" violating FOUN-05 language audit rule stated in 01-UI-SPEC.md (language audit: "we / our team / we've" → replace with "I" / "my")
- **Fix:** Eyebrow changed to "Start with one conversation", h2 changed to "Tell me what you're building.", body copy "We will turn..." → "I will turn..."
- **Files modified:** index.html
- **Verification:** `grep -ic 'Tell us\|We will' index.html` returns 0
- **Committed in:** 51de4e1 (Task 2 commit)

**2. [Rule 2 - Missing Critical] Updated form submit button from "Request audit" to "Send message"**
- **Found during:** Task 2 (SME language audit)
- **Issue:** Submit button read "Request audit" — "audit" is SME-era language matching the "automation audit" pattern the plan specifies removing (FOUN-05)
- **Fix:** Changed button text to "Send message"
- **Files modified:** index.html
- **Verification:** `grep -ic 'audit' index.html` returns 0
- **Committed in:** 51de4e1 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (Rule 2 — missing critical copy fixes caught during audit sweep)
**Impact on plan:** Both fixes directly within FOUN-05 scope. No scope creep.

## Issues Encountered

None — all edits applied cleanly. Package CSS removal required careful surgical edits to shared selector rules (`.agent-card, .devops-card, .package-card` shared blocks), all handled correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `[data-header]` on `.header-positioner` is ready for Plan 03 scroll handler class toggling (`.scrolled` applied to outer wrapper)
- `.nav-link` class on all five nav anchors ready for Plan 03 `sectionObserver` IntersectionObserver active tracking
- Hero copy and title are startup-native and complete
- Contact section has `#contact` anchor ready; calendar booking link (Calendly URL) remains a pre-launch blocker per STATE.md
- Gmail in footer is documented interim state (Phase 4 replaces with branded email per threat register T-02-01)

## Known Stubs

None - all copy is startup-native placeholder per plan spec. Ops-console agent trace rows are intentional placeholder content (plan-specified); they are not wired to live data and are not expected to be in Phase 1.

## Threat Flags

No new security-relevant surface introduced. Changes are copy/structure edits to a static HTML file. Google Fonts CDN link noted in plan threat register (T-02-02) as accepted risk.

## Self-Check: PASSED

- index.html exists and contains all required content (grep gates verified)
- styles.css packages rules removed (grep verified 0 occurrences)
- Commits 80e9385 and 51de4e1 exist in git log

---
*Phase: 01-foundation*
*Completed: 2026-05-07*
