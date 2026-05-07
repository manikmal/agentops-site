# Phase 2: Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 2-Hero
**Areas discussed:** Hero headline copy direction, Right-column visual style, Scarcity signal placement, Canvas character

---

## Hero Headline Copy Direction

### Q1 — Headline strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Thread the needle | One headline works for both audiences simultaneously — startups read depth, SMEs read utility | ✓ |
| Split-audience tagline | Short headline + lede that explicitly names both audiences | |
| Outcome-first, audience-neutral | Lead with the outcome, audience infers themselves | |

**User's choice:** Thread the needle
**Notes:** Approved preview: "AI systems built to run your business. / I engineer the agent pipelines, integrations, and full-stack builds your team needs to scale."

### Q2 — Voice

| Option | Description | Selected |
|--------|-------------|----------|
| First-person 'I' | Solo operator identity, direct accountability | ✓ |
| Studio voice 'We' | Sounds more established, slightly more distance | |
| You decide | Leave to Claude | |

**User's choice:** First-person "I"

### Q3 — Wordmark in hero

| Option | Description | Selected |
|--------|-------------|----------|
| Keep wordmark in hero | Reinforces brand identity, existing structure preserved | ✓ |
| Drop wordmark, headline only | Cleaner, more minimal | |
| You decide | Leave to Claude | |

**User's choice:** Keep wordmark above h1

### Q4 — Hero metrics/counters

| Option | Description | Selected |
|--------|-------------|----------|
| Stay removed | Phase 1 removed as SME-era; portfolio/about carry credibility | ✓ |
| Bring it back with new numbers | Minimal metric strip below CTAs | |
| You decide | Leave to Claude | |

**User's choice:** Stay removed

---

## Right-Column Visual Style

### Q1 — Visual format

| Option | Description | Selected |
|--------|-------------|----------|
| Styled console/terminal window | Dark card, colored dots, animated agent step rows | ✓ |
| Node-graph / flow diagram | SVG/CSS nodes connected by animated lines | |
| Streaming LLM output | Typewriter-style text generation | |

**User's choice:** Styled console/terminal window

### Q2 — Scenario content

| Option | Description | Selected |
|--------|-------------|----------|
| Dual scenario — loops between both | Loop A = startup pipeline, Loop B = SME automation | ✓ |
| Single scenario, startup focus | Fixed startup AI product pipeline | |
| Single scenario, SME focus | Fixed business automation/marketing workflow | |

**User's choice:** Dual loop (startup → SME → repeat)

### Q3 — Animation style

| Option | Description | Selected |
|--------|-------------|----------|
| Sequential highlight with timing | One active row at a time, violet pulse, timer ticks up | ✓ |
| Typewriter per row | Description text types in character-by-character | |
| All rows visible, progress bar | Vertical progress bar runs through rows | |

**User's choice:** Sequential highlight

### Q4 — Title bar label

| Option | Description | Selected |
|--------|-------------|----------|
| Switch labels as it loops | `startup-pipeline` / `sme-automation` | ✓ |
| Fixed label 'agent-flow' | One permanent label | |
| You decide | Leave to Claude | |

**User's choice:** Switch labels per loop

---

## Scarcity Signal Placement

### Q1 — Position

| Option | Description | Selected |
|--------|-------------|----------|
| Below the CTA buttons | Small line below both CTAs: dot + text | ✓ |
| Badge above the headline | Pill/badge at top of hero copy block | |
| Inline with primary CTA | Tucked next to the button area | |

**User's choice:** Below CTA buttons

### Q2 — Dot style

| Option | Description | Selected |
|--------|-------------|----------|
| Pulsing green dot | CSS keyframe animation, "live" status indicator feel | ✓ |
| Violet dot, no animation | Matches site accent, static | |
| You decide | Leave to Claude | |

**User's choice:** Pulsing green dot

---

## Canvas Character

### Q1 — Lines vs dots-only

| Option | Description | Selected |
|--------|-------------|----------|
| Keep lines, optimized | Neighbor-limited O(n×k) instead of O(n²) all-pairs | ✓ |
| Dots only, no lines | Remove line-drawing entirely, O(n) | |

**User's choice:** Keep connected-dot network with optimized algorithm

### Q2 — Mouse interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Keep mouse interaction | Repel/spring-back on desktop, disabled on mobile | ✓ |
| Remove mouse interaction | Pure drift animation | |
| You decide | Leave to Claude | |

**User's choice:** Keep, desktop-only

### Q3 — Color values

| Option | Description | Selected |
|--------|-------------|----------|
| Full accent violet | Particles `rgba(124,92,252,0.8)`, lines `rgba(124,92,252,0.15)` | ✓ |
| Softer muted violet | Particles `rgba(124,92,252,0.5)`, lines `rgba(124,92,252,0.08)` | |
| You decide | Leave to Claude | |

**User's choice:** Full accent violet

---

## Claude's Discretion

- Exact headline and lede wording (direction locked, final copy to Claude)
- Console step timing values (seconds per step, pause between loops)
- Console label transition style (fade vs instant)
- Particle size, drift speed, mouse repel force values
- Debounce timing for resize handler
- Mobile breakpoint threshold for disabling mouse interaction
- Whether `requestIdleCallback` is wrapped in a helper or inlined

## Deferred Ideas

None — discussion stayed within Phase 2 scope.
