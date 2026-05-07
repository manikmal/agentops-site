# Phase 3: Core Sections - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the entire old SME services block (4 separate sections: AI agents, automations, social, DevOps) and the 6-card SME portfolio with three rebuilt sections:

1. **Tech strip** — even-split marquee of 10 tools (5 AI/infra + 5 SME integrations) with inline SVG brand logos
2. **Services section** (#services) — one unified dual-audience section with two named capability clusters, 3 minimal text cards each, cursor spotlight glow
3. **Portfolio section** (#portfolio) — 4 NDA placeholder cards (2 startup + 2 SME), with abstract/technical Unsplash photos, cursor spotlight glow, drop-in ready for real case studies

All old SME HTML sections and their orphaned CSS are deleted entirely.

</domain>

<decisions>
## Implementation Decisions

### Tech Strip
- **D-01:** Format: brand logos + text pills. Each pill shows a small inline SVG icon beside the tool name. Source: Simple Icons (free to use, no attribution required for most brands).
- **D-02:** Even split — 5 AI/infra + 5 SME integrations. Exact tools: OpenAI, Anthropic, LangChain, Docker, GitHub Actions | WhatsApp, Meta, Google Sheets, Gmail, Zapier.
- **D-03:** SVG assets inlined directly in HTML (no CDN dependency, no extra image requests). Existing `.marquee-track` duplication pattern in `script.js` is reused as-is.
- **D-04:** Existing `.logo-strip` and `.marquee-track` CSS stays intact; only the inner pill HTML changes. `.logo-strip span` gains an icon slot (`<svg>` + text label inside the `<span>`).

### Services Section
- **D-05:** Architecture: two named capability clusters in one `<section id="services">`. Cluster 1: "For growing businesses" (SME). Cluster 2: "For startups & product teams" (Startup).
- **D-06:** Card format: minimal dark text cards, no icons. Title + 2–3 sentence outcome-focused description. Reuses existing card CSS pattern (similar to `.agent-card` structure).
- **D-07:** Card count: 3 per cluster (6 total). Claude decides exact service names and copy within these guardrails: SME cluster covers automation systems, AI assistants, social media; Startup cluster covers agent development, AI integration, DevOps & delivery. Copy is outcome-first, first-person "I" voice.
- **D-08:** Section ID: `#services`. The header nav "Services" link already points there. The old `#agents`, `#automations`, `#devops` IDs are deleted.
- **D-09:** Cursor spotlight glow on all service cards: `rgba(124, 92, 252, 0.12)` radial gradient. The `script.js` spotlight selector (`document.querySelectorAll(".agent-card, .portfolio-card, ...")`) must be updated to include the new service card class (e.g., `.service-card`) or generalized to `[data-spotlight]`.

### Portfolio Section
- **D-10:** Card count: 4 NDA placeholder cards. Reduce from 6 to 4 — cleaner at the grid breakpoints.
- **D-11:** Audience mix: 2 startup cases + 2 SME cases.
  - Card 1: AI agent compliance pipeline — Series-A fintech [Startup]
  - Card 2: DevOps + CI/CD automation — Product team [Startup]
  - Card 3: WhatsApp workflow automation — Retail chain [SME]
  - Card 4: Social media + CRM integration — Service business [SME]
- **D-12:** Photos: keep photos but replace current SME stock images with abstract/technical Unsplash imagery (code screens, terminal windows, server/infra imagery). Claude picks the Unsplash photo IDs.
- **D-13:** Card markup must accept real case study content as a drop-in (PORT-02). The `<span>` tag carries the client category label; `<h3>` is the project title; `<p>` is the outcome summary. No layout changes needed to slot in real content.
- **D-14:** Spotlight glow: already wired for `.portfolio-card` in `script.js` — no change needed.

### Section Consolidation
- **D-15:** All 4 old SME sections (`#agents`, automations split, social grid, `#devops`) are deleted entirely from `index.html`. Their CSS classes (`.agent-card`, `.agent-grid`, `.devops-card`, `.devops-grid`, `.split-section`, `.social-grid`, `.wide-card`, `.mini-card`) are deleted from `styles.css`.
- **D-16:** `script.js` spotlight selector updated from `.agent-card, .portfolio-card, .package-card, .devops-card` to include `.service-card` and remove the deleted classes.
- **D-17:** DOM order after Phase 3: hero → tech strip → services (#services) → portfolio (#portfolio) → [process, about, CTA in Phase 4].

### Claude's Discretion
- Exact copy for each of the 6 service cards (within the direction set by D-07)
- Specific Unsplash photo IDs for the 4 portfolio cards (abstract/technical imagery)
- New service card CSS class name (e.g., `.service-card`) and grid layout within the two-cluster structure
- SVG path data for each brand icon (sourced from Simple Icons)
- Exact NDA problem statements and outcome copy for each portfolio card (within D-11 audience mix)
- Whether the two service clusters use a `<h3>` cluster heading or an eyebrow label style

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements
- `.planning/REQUIREMENTS.md` — STRIP-01, SERV-01, SERV-02, SERV-03, PORT-01, PORT-02: all Phase 3 requirements with exact acceptance conditions
- `.planning/ROADMAP.md` — Phase 3 success criteria (5 conditions that must be TRUE)
- `CLAUDE.md` — Key Design Decisions table: services layout rule (narrative/capabilities format — never 3-column icon grid), portfolio NDA cards rule, tech strip even-split rule, iOS Safari backdrop-filter constraint, CSS token-only rule

### Existing codebase (read before modifying)
- `index.html` — current services block (lines ~104–275): `.logo-strip`, `#agents`, automations split, social grid, `#devops`, `#portfolio` — all to be replaced or deleted
- `styles.css` — existing `.logo-strip`, `.marquee-track`, `.portfolio-card`, `.portfolio-grid`, `.agent-card`, `.agent-grid`, `.devops-card`, `.devops-grid`, `.social-grid`, `.split-section` CSS — some deleted, some kept
- `script.js` line 138: current spotlight selector (`".agent-card, .portfolio-card, .package-card, .devops-card"`) — must be updated for new service card class

### Prior phase context
- `.planning/phases/02-hero/02-CONTEXT.md` — card spotlight implementation (D-09 reference), data-* hook pattern, CSS token names
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-05 (iOS Safari backdrop-filter rule), D-07 (btn-primary style), token names

### No external specs
No external ADRs or design docs beyond CLAUDE.md — requirements fully captured in REQUIREMENTS.md and the decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.logo-strip` / `.marquee-track` — existing marquee animation with `script.js` child-duplication for infinite scroll. Reused as-is; only inner pill HTML changes to add SVG icons.
- `.portfolio-card` / `.portfolio-grid` — existing 3-column card grid with Unsplash image + span + h3 + p structure. Phase 3 replaces card content but keeps the outer grid CSS. Card count changes from 6 to 4.
- `script.js` spotlight block (line 138) — `pointermove` / `pointerleave` radial gradient pattern. Works for any CSS class — just add `.service-card` to the selector list.
- `reveal` class — intersection-observer reveal animation. New sections apply `reveal` to cards and headings as per existing convention.

### Established Patterns
- `data-*` attributes as JS hooks — all new JS-driven elements use `data-*` selectors, not class selectors
- CSS custom properties only — use `--color-accent`, `--color-surface-2`, `--color-border`, etc.; no inline hex in new CSS
- iOS Safari: never put `backdrop-filter` and `transform` on the same element
- Marquee JS duplication: `script.js` clones `.marquee-track` children to fill the scroll width — new pill HTML must be valid inside this pattern

### Integration Points
- Old `#agents` ID is the nav anchor for "Services" header link — must be replaced with `#services` in both the section and the `<a href>` in the nav
- Old `#portfolio` ID stays — "Work" nav link already uses `#portfolio`
- `script.js` spotlight selector update is mandatory before Phase 3 HTML ships, or service cards will be missing the glow interaction

</code_context>

<specifics>
## Specific Ideas

- Approved tech strip split:
  ```
  AI / Infra: OpenAI · Anthropic · LangChain · Docker · GitHub Actions
  SME:        WhatsApp · Meta · Google Sheets · Gmail · Zapier
  ```
- Approved services structure:
  ```
  ## What I Build

  ### For Growing Businesses
  [ Automation Systems ]  [ AI Assistants ]  [ Social Media ]

  ### For Startups & Product Teams
  [ Agent Development ]  [ AI Integration ]  [ DevOps & Delivery ]
  ```
- Approved portfolio card mix:
  ```
  Card 1: AI agent pipeline — Series-A fintech [Startup]
  Card 2: DevOps + CI/CD — Product team [Startup]
  Card 3: WhatsApp automation — Retail chain [SME]
  Card 4: Social + CRM — Service business [SME]
  ```

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 3 scope.

</deferred>

---

*Phase: 3-Core Sections*
*Context gathered: 2026-05-07*
