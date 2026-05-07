# Phase 4: Trust & Conversion - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the trust layer and conversion path: rewrite the process timeline (5 founder-POV steps), create a new About section (split layout, credentials block), rebuild the CTA/contact section (calendar-primary, qualifying form secondary), and update the footer (copyright year auto-update). Everything a prospect needs to go from "impressed" to "booked."

Sections touched: `#process` (full rewrite), `#about` (new), `#contact` (full rewrite), `<footer>` (minor updates).
</domain>

<decisions>
## Implementation Decisions

### Process Section
- **D-01:** Keep the existing `.timeline-step` CSS class and `<article class="timeline-step reveal">` markup structure — only the content changes. CSS from prior phases already handles horizontal-desktop / stacked-mobile layout.
- **D-02:** Framing: engagement arc — 5 steps named from the **client's** perspective: Discovery → Scope → Build → Ship → Iterate. Not service-delivery language; not outcome-labeled steps.
- **D-03:** Async-first language (weekly Loom, no endless meetings) is woven **inline** into each step's `<p>` description — not a separate intro line or eyebrow label above the timeline.
- **D-04:** Step 5 (post-ship) = **Iterate** — Manik stays engaged after launch to monitor, improve, and extend. Positions the engagement as a product partnership, not a project handoff.
- **D-05:** Section heading rewrites from "From messy workflow to managed system." to startup-native copy aligned with the engagement arc framing (Claude writes exact copy).
- **D-06:** Expand step count from 4 to 5. The `<div class="timeline">` receives a fifth `<article class="timeline-step reveal">` child.

### About Section (New)
- **D-07:** Entirely new `<section id="about" class="section about-section">` — does not exist in current HTML. Inserted after the portfolio section and before the process section (or after process — planner to decide based on narrative flow; "how I work" → "who I am" → CTA feels natural).
- **D-08:** Layout: split — left column contains bio text, right column contains a **styled credentials block** (dark surface card, 3–4 bold credential lines).
- **D-09:** Credibility anchor framing: **years + type of work** — e.g. "5+ years building AI systems and automation pipelines for startups and growing businesses." One sentence, grounded and broad.
- **D-10:** Bio includes the "you work directly with me — not through account managers or junior devs" differentiator (ABOU-02). First-person, confident tone.
- **D-11:** GitHub and LinkedIn links are in the bio/left column (styled as small link buttons or plain text links). No phone, no email in the about section itself.
- **D-12:** Credentials block (right column) contains: years of experience, types of clients (fintech, SaaS, retail), notable toolchain (Claude picks exact credential lines within the D-09 direction). Drop-in for a professional photo when it becomes available in v2.

### CTA / Contact Section
- **D-13:** **Hard blocker resolved** — calendar link is `https://calendly.com/manikmalhotra6/30min`. Use this URL directly as the primary CTA `href`. No placeholder needed.
- **D-14:** Layout: **calendar button dominant**, qualifying form below. Copy above the form: "Prefer to reach out first?" heading that frames the form as an optional second path.
- **D-15:** Primary CTA button: `btn btn-primary` class, text "Book a discovery call", `href="https://calendly.com/manikmalhotra6/30min"` with `target="_blank" rel="noreferrer"`. Large, prominent — the first thing a prospect sees in this section.
- **D-16:** Scarcity signal ("Currently taking 1–2 new projects") reinforced near or above the primary CTA button (CTA-02 requirement).
- **D-17:** Qualifying form fields: name, company, "What are you building?" (textarea), timeline (text input or select). No phone field. Labels match the startup-native voice.
- **D-18:** Form submit feedback: **inline status message** — button disables on submit, a `data-form-status` line appears below the form (e.g., "Message sent — I'll be in touch within 24 hours"). Reuses the existing `data-form-status` / `data-lead-form` pattern already in `script.js`. No page reload, no redirect.
- **D-19:** The existing `#contact` section ID stays — the header nav "Contact" link already points there.

### Footer
- **D-20:** Keep `manikmalhotra6@gmail.com` as the footer email address for now. Replace with branded email (e.g. `manik@agentopsstudio.com`) when it's ready — a one-line swap.
- **D-21:** Copyright year auto-updates via `new Date().getFullYear()` injected into a `<span id="copyright-year">` (or equivalent) via `script.js`.
- **D-22:** Footer structure stays: brand wordmark left, email + LinkedIn right. No phone, no WhatsApp (already correct in current HTML).

### Claude's Discretion
- Exact 5 step names (within the Discovery → Scope → Build → Ship → Iterate arc) and the full `<p>` description for each step, including where to weave async-first language
- Process section heading and eyebrow rewrite
- Exact bio text for the About left column (within: 2–3 sentences, years + type of work anchor, ABOU-02 differentiator, first-person confident voice)
- Exact content of the credentials block (3–4 bold lines within: experience years, client types, toolchain)
- DOM order: whether About goes before or after Process (narrative flow judgment)
- Exact "what are you building?" textarea label text
- CTA section heading and supporting copy above the calendar button

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements
- `.planning/REQUIREMENTS.md` — PROC-01, PROC-02, PROC-03, ABOU-01, ABOU-02, ABOU-03, ABOU-04, CTA-01, CTA-02, CTA-03, CTA-04, FOOT-01, FOOT-02: all Phase 4 requirements with exact acceptance conditions
- `.planning/ROADMAP.md` — Phase 4 success criteria (4 conditions that must be TRUE)
- `CLAUDE.md` — Key Design Decisions table: iOS Safari backdrop-filter constraint, CTA calendar booking link rule, portfolio NDA cards (for DOM context), CSS token-only rule

### Existing codebase (read before modifying)
- `index.html` lines 243–270: existing process section (`.timeline-step` structure to reuse, SME copy to replace)
- `index.html` lines 272–298: existing contact section (to be fully replaced per Phase 4 spec)
- `index.html` lines 301–310: existing footer (copyright year addition needed)
- `styles.css` — existing `.timeline-step`, `.contact-section`, `.contact-form`, `.site-footer` CSS — reuse and extend; do not break existing patterns
- `script.js` — existing `data-lead-form` / `data-form-status` form submission handler; existing `reveal` IntersectionObserver; existing spotlight selector (must include `.about-card` or equivalent if About section has spotlight-eligible cards)

### Prior phase context
- `.planning/phases/03-core-sections/03-CONTEXT.md` — D-17 (DOM order after Phase 3: hero → tech strip → services → portfolio → [process, about, CTA in Phase 4])
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-05 (iOS Safari backdrop-filter rule), CSS token names

### No external specs
No external ADRs or design docs beyond CLAUDE.md — requirements fully captured in REQUIREMENTS.md and the decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.timeline-step` / `<article class="timeline-step reveal">` — horizontal-at-desktop, stacked-at-mobile timeline already exists with CSS. Reuse the class; only content changes. Step count changes from 4 to 5.
- `data-lead-form` / `data-form-status` pattern in `script.js` — existing form submission handler with optimistic UI. Reuse exactly — new form markup just needs `data-lead-form` on the `<form>` and `data-form-status` on the status `<p>`.
- `.btn.btn-primary` — violet CTA button class already styled. Use for the calendar booking button.
- `reveal` class — IntersectionObserver reveal animation. Apply to all new section headings, bio block, credentials block, timeline steps.
- `eyebrow` class — section eyebrow label pattern used throughout. Reuse for process and CTA section labels.

### Established Patterns
- CSS token variables only — `var(--color-accent)`, `var(--color-surface-2)`, `var(--color-border)` etc.; no inline hex in new CSS
- `data-*` attributes as JS hooks — any new JS-driven elements use `data-*` selectors
- iOS Safari: never put `backdrop-filter` and `transform` on the same element
- Split layout pattern: used in prior sections — left/right columns in a grid container

### Integration Points
- `#contact` ID on the CTA section must be preserved — header nav "Contact" link and "Book a call" button both point there
- Process section (`#process` or `.process-section`) — header nav "Process" link must resolve correctly; check existing `<a href>` in the nav
- Spotlight JS selector in `script.js` — if the About credentials block or any new cards should have cursor glow, add their CSS class to the spotlight selector

</code_context>

<specifics>
## Specific Ideas

- **Calendar URL (live):** `https://calendly.com/manikmalhotra6/30min` — use directly, no placeholder needed
- **Process arc:** Discovery → Scope → Build → Ship → Iterate (client-facing engagement milestone names)
- **Async-first angle:** woven into each step's description paragraph, not a separate block
- **About credentials block:** dark surface card, 3–4 bold lines (years experience + client types + toolchain)
- **Bio credibility anchor:** "5+ years building AI systems and automation pipelines for startups and growing businesses"
- **CTA hierarchy:** `Book a discovery call` button (primary, Calendly) → "Prefer to reach out first?" → qualifying form (secondary)
- **Form fields:** name, company, what you're building (textarea), timeline — no phone

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 4 scope.

</deferred>

---

*Phase: 4-Trust-Conversion*
*Context gathered: 2026-05-07*
