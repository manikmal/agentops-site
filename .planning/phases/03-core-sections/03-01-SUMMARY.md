---
phase: 03-core-sections
plan: "01"
subsystem: html-structure
tags: [cleanup, nav, spotlight, sections]
dependency_graph:
  requires: []
  provides: [clean-html-gap-for-services, correct-nav-hrefs, spotlight-selector-ready]
  affects: [index.html, script.js]
tech_stack:
  added: []
  patterns: []
key_files:
  created: []
  modified:
    - index.html
    - script.js
decisions:
  - "Deleted four old SME sections (#agents, #automations, social-section, #devops) as a single atomic commit paired with nav href and spotlight selector fixes"
  - "Nav Work link changed to #portfolio; Process and About both point to #contact per plan spec"
  - "Hero 'View work' button (href=#portfolio) left untouched — outside plan scope"
metrics:
  duration: ~3min
  completed: 2026-05-07
---

# Phase 3 Plan 01: Delete Old Sections and Fix Nav Summary

**One-liner:** Deleted 104 lines of stale SME-section HTML, fixed all four nav hrefs, and updated the spotlight querySelectorAll selector to target `.service-card, .portfolio-card` only.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Delete four old SME sections, fix nav hrefs | 4c9bebc | index.html |
| 2 | Update spotlight querySelectorAll selector | 4c9bebc | script.js |

Both tasks landed in a single atomic commit per the plan's objective (nav hrefs, section deletion, and spotlight selector must be consistent the moment old IDs disappear).

## What Was Done

**index.html:**
- Removed `<section id="agents">` (6 agent-card articles)
- Removed `<section id="automations">` (split-section with image panel)
- Removed `<section class="social-section">` (wide-card + 2 mini-cards)
- Removed `<section id="devops">` (3 devops-cards)
- Fixed nav hrefs: Services → `#services`, Work → `#portfolio`, Process → `#contact`, About → `#contact`
- Portfolio section (`id="portfolio"`) immediately follows logo-strip — no gap

**script.js:**
- Changed `querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card")` to `querySelectorAll(".service-card, .portfolio-card")`
- Event listener body (pointermove, pointerleave, radial-gradient) unchanged

## Deviations from Plan

None — plan executed exactly as written.

**Note on acceptance criteria:** The plan specified `href="#portfolio"` should return exactly 1 match. The actual count is 2 because the hero "View work" button (`<a class="btn btn-secondary" href="#portfolio">`) was pre-existing and not in scope. Both uses are correct. The nav "Work" link correctly points to `#portfolio`.

**Note on class grep:** The plan criterion `grep 'class="portfolio-section'` returns 0 because the actual class attribute is `class="section portfolio-section"` (multi-class). The section is present at line 115. This is a pre-existing attribute format, not an issue.

## Self-Check

- `grep -c 'id="agents"' index.html` → 0 (PASS)
- `grep 'href="#services"' index.html` → line 32 match (PASS)
- `grep 'service-card' script.js` → line 138 match (PASS)
- Portfolio section present at line 115 (PASS)
- Process section, contact section intact (PASS)
- Commit 4c9bebc exists (PASS)

## Self-Check: PASSED
