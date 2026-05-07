---
phase: 02-hero
plan: "01"
subsystem: hero
tags: [html, css, copy, scarcity-signal, console, animation]
dependency_graph:
  requires: []
  provides: [hero-copy-structure, scarcity-signal-element, ops-console-data-hooks, scarcity-signal-styles, flow-dot-pulse-animation, console-label-fade]
  affects: [index.html, styles.css]
tech_stack:
  added: []
  patterns: [keyframes-animation, css-custom-properties, data-attribute-hooks, prefers-reduced-motion-guard]
key_files:
  created: []
  modified:
    - path: index.html
      role: Hero section rewritten — new h1, lede, scarcity signal, console data hooks, 4-row console body
    - path: styles.css
      role: Scarcity signal rules, flow-dot-pulse keyframe, console label fade, violet console border, reduced-motion guard
decisions:
  - "Scarcity signal placed inside .hero-copy after .hero-actions per D-11; uses aria-live=polite for accessibility"
  - "Console border uses rgba(124, 92, 252, 0.32) literal (no exact token for 0.32 alpha) per plan exception rule"
  - "flow-dot-pulse keyframe positioned immediately after .flow-dot base rule, before .flow-row p rule, per DOM-order CSS rule"
  - "pulse-dot keyframe positioned immediately before .scarcity-signal rule, after .hero-actions block"
metrics:
  duration: "~8 minutes"
  completed: "2026-05-07"
  tasks_completed: 2
  files_modified: 2
requirements_satisfied: [HERO-01, HERO-02, HERO-05]
---

# Phase 2 Plan 01: Hero Copy + Styles Summary

**One-liner:** Hero rewritten with dual-audience h1 ("AI systems built to run your business."), first-person lede, scarcity signal with pulsing green dot, violet ops-console border, flow-dot-pulse keyframe, and console label fade — all connected to JS animation data hooks for Plan 02-03.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite hero HTML — copy, scarcity signal, console structure | c5737d1 | index.html |
| 2 | Add scarcity signal styles, console violet border, flow-dot pulse, label fade | fd4f1d9 | styles.css |

## What Was Built

### Task 1 — index.html hero section
- Replaced `h1` "Build AI products that scale." with "AI systems built to run your business." — threads the needle between startup and SME audiences per D-01/D-05
- Replaced lede "End-to-end AI engineering for founders who need it done right." with "I engineer the agent pipelines, integrations, and full-stack builds your team needs to scale." — first-person voice per D-02
- Both CTA buttons kept unchanged: "Book a discovery call" (primary, violet pill) and "View work" (secondary outlined)
- Added `<p class="scarcity-signal" aria-live="polite">` with `<span class="scarcity-dot" aria-hidden="true">` and "Currently taking 1–2 new projects" text — positioned after .hero-actions per D-11
- Added `data-agent-trace` attribute to `.ops-console` div — JS hook for Plan 02-03 animation
- Added `data-console-label` attribute to `<strong>` in `.console-top` — JS hook for label swap per D-09
- Expanded console-body from 3 rows to 4 rows with Loop A static content (Orchestrator, Build Agent, Test Agent, Deploy Agent per D-07)
- Changed initial label value from "live-agent-flow" to "startup-pipeline" per D-09

### Task 2 — styles.css
- Updated `.ops-console` border from `rgba(4, 217, 217, 0.32)` to `rgba(124, 92, 252, 0.32)` and box-shadow from cyan literal to `var(--color-accent-dim)` — cyan → violet per CLAUDE.md design decision
- Added `transition: opacity var(--duration-base) var(--ease-out)` to `.console-top strong` for smooth label swap
- Added `.console-top strong.label-fade { opacity: 0 }` — JS toggles this class to fade during label change per D-09
- Added `@keyframes flow-dot-pulse` (8px → 12px box-shadow pulse) and `.flow-row.active .flow-dot { animation: flow-dot-pulse 1.4s ease-in-out infinite }` rule per D-08
- Added `@keyframes pulse-dot` (opacity + scale pulse), `.scarcity-signal` (flex, gap, muted color, 0.82rem), and `.scarcity-dot` (8px green dot with `var(--color-success)`, pulse animation) per D-12
- Extended `@media (prefers-reduced-motion: reduce)` block with `animation: none` for `.scarcity-dot` and `.flow-row.active .flow-dot` — threat T-02-02 mitigation

## Deviations from Plan

None — plan executed exactly as written. All 5 CSS changes and 7 HTML changes delivered per specification.

## Known Stubs

The console body contains static Loop A content (Orchestrator, Build Agent, Test Agent, Deploy Agent) as the initial HTML state. Loop B content (Orchestrator, Data Agent, Content Agent, Publish Agent) and the dual-loop animation are intentional stubs — Plan 02-03 will wire the JavaScript animation that dynamically populates and cycles both loops. The `data-agent-trace` and `data-console-label` hooks added in this plan are specifically for that integration.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes. All content is hardcoded static HTML/CSS.

T-02-02 mitigation confirmed present: `.scarcity-dot` and `.flow-row.active .flow-dot` are both covered by the `prefers-reduced-motion: reduce` guard with `animation: none`.

## Self-Check: PASSED

- index.html contains "AI systems built to run your business." — confirmed
- index.html contains class="scarcity-signal" — confirmed  
- index.html contains data-agent-trace — confirmed
- index.html contains data-console-label — confirmed
- index.html contains exactly 4 flow-row elements — confirmed (count = 4)
- styles.css contains rgba(124, 92, 252, 0.32) in .ops-console border — confirmed
- styles.css contains .scarcity-signal, .scarcity-dot, @keyframes pulse-dot — confirmed
- styles.css contains @keyframes flow-dot-pulse and .flow-row.active .flow-dot — confirmed
- styles.css reduced-motion block covers both new animations — confirmed
- Commits c5737d1 and fd4f1d9 exist in git log — confirmed
