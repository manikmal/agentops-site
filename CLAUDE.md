# AgentOps Studio — Project Guide

## Project
A ground-up redesign of the AgentOps Studio website. Primary audience: SMEs needing social media automation and digital marketing workflows. Secondary/aspirational audience: startup founders wanting full AI product builds. Design: dark, technical, Linear.app-inspired. Stack: vanilla HTML/CSS/JS, deployed on Netlify.

See `.planning/PROJECT.md` for full context and decisions.

## Workflow

This project uses GSD (Get Shit Done) structured workflow.

**Current state:** `.planning/STATE.md`
**Roadmap:** `.planning/ROADMAP.md`
**Requirements:** `.planning/REQUIREMENTS.md`
**Research:** `.planning/research/`

### Phase commands
- `/gsd-discuss-phase N` — gather context and clarify approach before planning
- `/gsd-plan-phase N` — create an execution plan for a phase
- `/gsd-execute-phase N` — execute a planned phase
- `/gsd-verify-work` — verify phase deliverables against success criteria

### Execution rules
- Always read `.planning/STATE.md` and the current phase in `.planning/ROADMAP.md` before starting work
- Commit after each meaningful unit of work — not at the end of a phase
- Mark requirements complete in `REQUIREMENTS.md` as they ship
- Never skip the Phase 5 polish gate — iOS Safari and Lighthouse are mandatory

## Key Design Decisions

| Decision | Choice |
|----------|--------|
| Primary accent | Violet `#7c5cfc` — not cyan, not lime |
| Base background | `#0a0a0b` — not pure black |
| Typography | Inter variable font, negative letter-spacing on headings |
| Canvas | ≤40 particles, no O(n²) line-drawing, `requestIdleCallback` init |
| Services layout | Narrative/capabilities format — never a 3-column icon grid |
| Tech strip | Even split: AI/infra tools + SME integration tools |
| Portfolio | Styled NDA placeholder cards — no "coming soon" text |
| CTA | Calendar booking link as primary — form is secondary |
| `backdrop-filter` | Never on the same element as `transform` (iOS Safari bug) |

## Architecture

- `index.html` — single entry point, all sections inline
- `styles.css` — strict top-to-bottom order mirroring DOM; design tokens block first
- `script.js` — sequential blocks: DOM refs → header → marquee → reveal → canvas → spotlight → counters → form → nav tracking
- `netlify.toml` — existing config, no changes needed
- No build step, no framework, no asset subdirectories

## Pre-Launch Blockers

- [ ] Calendar booking link (Calendly/Cal.com URL) — needed for Phase 4 CTA
- [ ] Branded email address (e.g. `manik@agentopsstudio.com`) — Gmail should only appear in footer
