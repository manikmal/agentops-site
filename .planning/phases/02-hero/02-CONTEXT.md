# Phase 2: Hero - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite the hero section from scratch — it is the first viewport a visitor sees and must establish who Manik works with, what he builds, and give one clear action to take within ~5 seconds.

Deliverables:
- Rewritten hero headline and lede copy (dual-audience: SMEs + startups)
- First-person "I" voice throughout hero copy
- Wordmark image retained above the headline
- Two CTAs: "Book a discovery call" (primary, violet pill) + "View work" (secondary)
- Scarcity signal below the CTAs: pulsing green dot + "Currently taking 1–2 new projects"
- Right column: styled console terminal with dual-loop animated agent trace (startup pipeline → SME automation)
- Canvas particle system fixed: ≤40 particles, optimized line-drawing, violet accent, tab-pause, debounced resize

</domain>

<decisions>
## Implementation Decisions

### Hero Headline Copy
- **D-01:** Headline strategy is "thread the needle" — one headline that works for both audiences simultaneously. Startups read depth ("AI systems"), SMEs read utility ("run your business"). No explicit audience segmentation in the headline itself.
- **D-02:** Tone: first-person "I" voice. "I engineer..." not "We build..." Reinforces solo operator identity and direct accountability to clients.
- **D-03:** Wordmark image (`wordmark.png`) is kept above the `h1`. Existing `<img class="hero-wordmark">` structure is preserved.
- **D-04:** Hero metrics/counter strip stays removed. Phase 1 (D-13) removed it; Phase 2 does not reintroduce it. Credibility is carried by portfolio and about section instead.
- **D-05:** Working headline: "AI systems built to run your business." Working lede: "I engineer the agent pipelines, integrations, and full-stack builds your team needs to scale." Final copy is Claude's to refine within this direction — must not be a generic category label.

### Right-Column Agent Trace Visual
- **D-06:** Visual format: styled console/terminal window. Extends the existing `.ops-console` structure. Dark card with colored top dots, animated step rows that activate in sequence.
- **D-07:** Dual-loop animation. Loop A = startup DevOps/deployment pipeline (Orchestrator → Build Agent → Test Agent → Deploy Agent). Loop B = SME marketing automation (Orchestrator → Data Agent → Content Agent → Publish Agent). After Loop A completes, short pause, then Loop B begins; after Loop B completes, back to Loop A. Loops indefinitely.
- **D-08:** Animation style: sequential highlight. One row is "active" at a time — violet dot pulses, row background glows subtly, elapsed timer ticks up. Other rows are muted/pending. When all rows complete → short pause → reset and next loop.
- **D-09:** Title bar label switches per loop. Loop A shows `startup-pipeline`, Loop B shows `sme-automation`. The label transitions (fade or instant) between loops. This subtly signals dual coverage without copy explaining it.
- **D-10:** Step count: 4 rows per loop (matching the preview approved above). Timing values are Claude's discretion — each step should feel "live" (2–4s per step is a reasonable baseline).

### Scarcity Signal
- **D-11:** Position: below the two CTA buttons, as a separate small element in the hero copy block.
- **D-12:** Style: pulsing green CSS dot (keyframe animation) + text "Currently taking 1–2 new projects." Small font size (~13–14px), muted color for the text, vivid green for the dot. Signals availability without urgency pressure.

### Canvas Particle System
- **D-13:** Particle count: ≤40 at all viewport sizes (current code uses 82/42 — must be reduced). Use a single count of ~35 across breakpoints, or Claude's discretion within the 40-cap.
- **D-14:** Line-drawing: keep the connected-dot network visual (it reinforces the "agent graph / neural network" metaphor) but replace the O(n²) all-pairs loop. Implementation approach: neighbor-limited — each particle connects only to its nearest k neighbors (k ≈ 5–8), not all pairs. This reduces the line-drawing complexity from O(n²) to O(n×k).
- **D-15:** Particle color: `rgba(124, 92, 252, 0.8)` (full violet accent). Line color: `rgba(124, 92, 252, 0.15)`. Old lime-green and cyan colors removed entirely.
- **D-16:** Mouse interaction: keep the repel/spring-back behavior on desktop. Disable on mobile (no `mousemove` listener at touch breakpoints). Current behavior already matches — scope it correctly.
- **D-17:** Performance fixes (all required by HERO-04):
  - Canvas init deferred via `requestIdleCallback` (with `setTimeout` fallback for Safari)
  - `rAF` loop paused on `document.addEventListener('visibilitychange', ...)` — `cancelAnimationFrame` when hidden, restart when visible
  - Resize handler debounced (150–200ms debounce, Claude's discretion)
  - `pagehide` cancel already in place — keep it

### Claude's Discretion
- Exact headline and lede copy (within the direction set by D-01–D-05)
- Console step timing (seconds per step, pause between loops)
- Whether console label transition is a CSS fade or instant swap
- Particle size, drift speed, mouse repel force values
- Exact debounce timing for resize handler
- Mobile breakpoint threshold for disabling mouse interaction
- Whether `requestIdleCallback` is wrapped in a helper or inlined

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements
- `.planning/REQUIREMENTS.md` — HERO-01 through HERO-05: all Phase 2 requirements with exact acceptance conditions
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 conditions that must be TRUE)
- `CLAUDE.md` — Key Design Decisions table: accent color, iOS Safari backdrop-filter constraint, Canvas constraints (≤40 particles, no O(n²), requestIdleCallback), services layout rules

### Existing codebase (read before modifying)
- `index.html` — current hero section (lines 43–93): `.hero`, `.hero-grid`, `.hero-copy`, `.ops-console`, `.console-top`, `.console-body`, `.flow-row` structure to be preserved/extended
- `styles.css` — existing `.hero`, `.ops-console`, `.flow-row`, `.hero-actions`, `.hero-lede` CSS; design token block at top with `--color-accent: #7c5cfc`
- `script.js` — canvas block (lines 151–270): `resizeCanvas`, `createParticles`, `drawNetwork`, mouse handler, `pagehide` listener — all to be rewritten per HERO-04

### Phase 1 context (prior decisions that carry forward)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-05 (iOS Safari backdrop-filter split rule), D-07 (btn-primary violet pill style), token names (`--color-accent`, `--color-surface-2`, `--color-border`, etc.)

### No external specs
No external ADRs or design docs beyond CLAUDE.md — requirements fully captured in REQUIREMENTS.md and the decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.ops-console` / `.console-top` / `.console-body` / `.flow-row` — existing console component in both HTML and CSS; Phase 2 extends rather than replaces this structure. Add dual-loop JS animation on top.
- `btn btn-primary` / `btn btn-secondary` — button styles already in place from Phase 1; CTAs in hero already use them correctly
- `data-agent-canvas` attribute — existing JS hook on the `<canvas>` element; keep this pattern
- `reveal` class — existing intersection-observer reveal animation applied to `.hero-copy` and `.ops-console`; keep as-is

### Established Patterns
- `data-*` attributes as JS hooks — existing convention; any new JS-driven elements should use `data-*` selectors, not class selectors
- CSS custom properties for all color/spacing values — use `--color-accent`, `--color-surface-2`, `--duration-base`, etc. from the token block; no inline `#7c5cfc` in new CSS
- iOS Safari rule: never put `backdrop-filter` and `transform` on the same element (D-05 from Phase 1) — applies to any new `backdrop-filter` usage in the hero

### Integration Points
- Canvas `drawNetwork` is called recursively via `requestAnimationFrame` — rewrite must preserve the cancel-on-pagehide pattern and add visibilitychange cancel
- The `.ops-console` element already has a `reveal` class — the dual-loop JS animation must not conflict with the reveal timing (wait until reveal fires before starting the loop, or use a flag)
- `script.js` sequential block structure: canvas block lives between the spotlight block and the counters block — new agent-trace animation logic should be added as a new sequential block after canvas, not mixed in

</code_context>

<specifics>
## Specific Ideas

- Approved console preview (Loop A):
  ```
  ● Orchestrator   Merge detected on main     0s   ← active
  ○ Build Agent    Compiling and bundling      •
  ○ Test Agent     Running integration suite   •
  ○ Deploy Agent   Pushing to production       •
  ```
- Approved console preview (Loop B):
  ```
  ● Orchestrator   Weekly report triggered     0s   ← active
  ○ Data Agent     Pulling campaign metrics    •
  ○ Content Agent  Generating summary copy     •
  ○ Publish Agent  Sending to Notion + Slack   •
  ```
- Scarcity signal preview: `● (pulsing green)  Currently taking 1–2 new projects`
- Canvas: particles `rgba(124, 92, 252, 0.8)`, lines `rgba(124, 92, 252, 0.15)`
- Canvas: mouse interaction desktop-only, spring-back behavior kept

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 2 scope.

</deferred>

---

*Phase: 2-Hero*
*Context gathered: 2026-05-07*
