# AgentOps Studio — Website Redesign

## What This Is

A complete ground-up redesign of the AgentOps Studio website — a solo AI engineering practice run by Manik Malhotra. The new site targets startup founders and product teams who want to hire a single engineer capable of building their full AI product stack: custom AI agents, AI-powered features, infrastructure, and DevOps. The design language is dark, technical, and precise — inspired by Linear.app.

## Core Value

A startup founder landing on the site should immediately feel they've found a serious technical partner who builds AI products end-to-end — not a freelancer running automations for small businesses.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section that positions AgentOps Studio as a premium AI engineering partner for startups
- [ ] Services section communicating full-stack AI build capability (AI agents, features, infra, DevOps)
- [ ] Portfolio section with placeholder project cards (structure ready for real case studies)
- [ ] Process section showing how Manik works with clients
- [ ] About section establishing Manik's credibility as a solo AI engineer
- [ ] Primary CTA throughout site driving to "Book a discovery call"
- [ ] Linear.app-inspired dark/technical aesthetic (deep blacks, refined typography, subtle technical motifs)
- [ ] Fully responsive design
- [ ] Deployed on Netlify via existing pipeline
- [ ] Single HTML/CSS/JS file architecture (no build step, same as current)

### Out of Scope

- Blog / articles — content publishing not needed in v1
- Authentication / user accounts — static marketing site only
- CMS integration — content will be hardcoded initially
- Multi-page routing — single-page site
- Framework migration (React/Next.js) — HTML/CSS/JS is sufficient for a marketing site of this scope

## Context

- **Existing site**: A single `index.html` + `styles.css` + `script.js` deployed on Netlify. Previously targeted SMEs with AI agents and workflow automations.
- **Repositioning**: Moving from "freelancer for SMEs" to "AI engineering partner for startups." The visual and copy change must reflect this shift clearly.
- **Brand assets available**: `wordmark.png`, `favicon.svg`, `logo.png` — to be used in the new design.
- **Current nav links**: AI Agents, Automations, DevOps, Portfolio, Contact — will be redesigned to match new positioning.
- **Booking link**: No calendar link provided yet — CTA will use a contact/email placeholder until a Calendly or similar is set up.
- **Portfolio content**: Placeholder cards only for v1 — real case studies to be added later.

## Constraints

- **Tech**: HTML + CSS + JS only — no build tooling, no framework dependencies
- **Deploy**: Netlify (existing `netlify.toml` and config in place)
- **Single file**: `index.html` as the single entry point
- **Brand name**: AgentOps Studio (unchanged)
- **Solo operator**: Copy and positioning must feel like a premium solo studio, not a faceless agency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep HTML/CSS/JS over framework | Single-page marketing site with no dynamic data needs — framework adds build complexity with no benefit | — Pending |
| Linear.app aesthetic direction | Target audience (startup founders) recognizes and respects this visual language; signals technical credibility | — Pending |
| Portfolio as placeholder in v1 | Real case study content not ready; better to ship clean placeholder structure than delay launch | — Pending |
| Primary CTA = book a call | Highest-value conversion for a solo practice — a call closes deals | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-06 after initialization*
