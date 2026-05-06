# Phase 1: Foundation - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the design token system, typography scale, and floating pill header so every subsequent phase builds on a consistent baseline. Also executes a full SME-era language audit across the codebase.

Deliverables:
- Complete `:root` token block (primitives → semantic, two-layer)
- Inter variable font loading (non-blocking, `opsz,wght` axes)
- Fluid type scale (`clamp()` on all headings, negative `letter-spacing`)
- Floating pill header with iOS Safari-safe backdrop-filter implementation
- Nav relabeled: Services / Work / Process / About / Contact
- "Book a call" violet pill CTA button in header
- SME-era language removed everywhere; placeholder startup-native copy in hero

</domain>

<decisions>
## Implementation Decisions

### Token Architecture
- **D-01:** Two-layer token hierarchy. Primitives block first (`--violet-600: #7c5cfc`, `--gray-950: #0a0a0b`, etc.), semantic block second (`--color-accent: var(--violet-600)`, `--color-bg: var(--gray-950)`). Both blocks live at the top of `styles.css` before any section CSS.
- **D-02:** Three dark surface levels: `--color-surface-1: #111113` (section backgrounds), `--color-surface-2: #18181b` (card backgrounds), `--color-surface-3: #232326` (elevated cards / hover states).
- **D-03:** Motion tokens included in the primitives block: `--duration-fast: 150ms`, `--duration-base: 250ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
- **D-04:** Border tokens: `--color-border: rgba(255,255,255,0.08)`, `--color-border-strong: rgba(255,255,255,0.14)`. Applied consistently to header, cards, and dividers — no inline rgba for borders.

### iOS Safari Header Fix
- **D-05:** Wrapper approach. An outer `.header-positioner` element handles `position: fixed; top: 18px; left: 50%; transform: translateX(-50%); z-index: 50; width: min(1120px, calc(100% - 32px))` — positioning only, no `backdrop-filter`. The inner `.site-header` holds all visual styles: `backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); background: rgba(8,10,10,0.78); border-radius: 8px; border: 1px solid var(--color-border-strong)`. Never put `transform` and `backdrop-filter` on the same element.
- **D-06:** Header darkens on scroll. JS adds a `.scrolled` class to `.header-positioner` when scroll offset exceeds ~30px. The inner `.site-header` transitions to `background: rgba(8,10,10,0.92)` on `.scrolled`. Smooth `transition: background var(--duration-base) var(--ease-out)`.
- **D-07:** "Book a call" button style: solid violet pill. `background: var(--color-accent)` (`#7c5cfc`), `border-radius: 9999px`, white text, `padding: 8px 16px`. Sits at the right end of the nav inside `.header-positioner`. Links to `#contact` (placeholder until Calendly URL is available — a known pre-launch blocker).

### Inter Font Loading
- **D-08:** Google Fonts with preconnect. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `<head>` before the stylesheet, then load Inter variable font: `https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap`. `font-optical-sizing: auto` and `-webkit-font-smoothing: antialiased` on `body`.
- **D-09:** Letter-spacing tokens: `--tracking-tight: -0.04em` (used on `h1`), `--tracking-heading: -0.03em` (used on `h2`, `h3`). Applied as `letter-spacing: var(--tracking-tight)` in heading selectors.
- **D-10:** Fluid type scale uses a consistent ratio — exact values: `h1: clamp(2.5rem, 5vw + 1rem, 5rem)`, `h2: clamp(1.75rem, 3vw + 0.75rem, 3rem)`, `h3: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)`. No breakpoint-scoped `font-size` overrides anywhere.

### Language Audit (FOUN-05)
- **D-11:** Hero section gets placeholder startup-native copy. `h1` → "Build AI products that scale." Lede → "End-to-end AI engineering for founders who need it done right." CTA → "Book a discovery call" (primary) + "View work" (secondary). The ops-console right column is left structurally intact but its SME content is replaced with placeholder agent-trace lines — Phase 2 rewrites the full hero visual.
- **D-12:** `<title>` updated to "AgentOps Studio | AI Engineering for Founders & Growing Teams". `<meta name="description">` updated to "End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses." Phase 5 will fine-tune for SEO.
- **D-13:** Hero metrics/counter section (`<div class="hero-metrics">`) removed entirely from HTML. Phase 2 decides whether counters return in the new hero design.
- **D-14:** Gmail address (`manikmalhotra6@gmail.com`) and phone number (`+91 9599668843`) removed silently from hero. Footer contact block also removed for now — Phase 4 handles footer with branded email.

### Claude's Discretion
- Exact primitive color names (e.g., `--violet-600`, `--gray-950`) — use sensible naming that maps to the values above
- `border-radius` token if wanted (e.g., `--radius-md: 8px`, `--radius-lg: 12px`)
- Whether to add a `--color-text-muted` semantic token for secondary text color (`rgba(255,255,255,0.6)`)
- Nav toggle / mobile menu animation (collapse/expand behavior) — specs not locked, use tasteful CSS transition

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements and decisions
- `.planning/REQUIREMENTS.md` — FOUN-01–FOUN-05, HEAD-01–HEAD-03: all Phase 1 requirements with exact values
- `.planning/ROADMAP.md` — Phase 1 success criteria (4 conditions that must be TRUE)
- `CLAUDE.md` — Key Design Decisions table: accent color, background, iOS Safari `backdrop-filter` constraint, Canvas constraints, etc.

### Existing codebase (read before modifying)
- `styles.css` — existing token block (`:root { --ink, --charcoal, etc. }`) to be replaced; existing `.site-header` with the iOS Safari bug; full section CSS that downstream phases will write into
- `index.html` — full page structure; SME-era copy locations; data attributes used by `script.js`
- `script.js` — header scroll handler (`data-header`), nav toggle (`data-nav-toggle`, `data-nav`); any scroll-class logic here must be updated for the new wrapper structure

### No external specs
No external ADRs or specs beyond CLAUDE.md design decisions — all requirements are fully captured in REQUIREMENTS.md and the decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `favicon.svg` / `wordmark.png` — brand assets already in place; keep as-is
- `.nav-toggle` / `data-nav-toggle` / `data-nav` — mobile nav toggle already in HTML and handled in `script.js`; keep the JS logic, just restyle
- `scroll-behavior: smooth` on `html` — keep

### Established Patterns
- `data-*` attributes as JS hooks (e.g., `data-header`, `data-agent-canvas`, `data-nav`) — existing convention, maintain for new elements
- CSS custom properties for theming — already the pattern; this phase extends it correctly
- iOS Safari bug: `.site-header` currently has both `transform: translateX(-50%)` and `backdrop-filter: blur(18px)` on the same element — this must be split per D-05

### Integration Points
- `script.js` header scroll logic references `.site-header` element via `data-header` — the JS selector must be updated to target the new outer `.header-positioner` wrapper (or `data-header` moved to the wrapper)
- `<body>` font-family stack references Inter — works once the Google Fonts load tag is added to `<head>`
- All section CSS below the tokens block in `styles.css` references the old `:root` variables (`--ink`, `--charcoal`, `--paper`, etc.) — these will be replaced; downstream phases will reference the new semantic tokens

</code_context>

<specifics>
## Specific Ideas

- Primary accent: violet `#7c5cfc` — non-negotiable per CLAUDE.md
- Base background: `#0a0a0b` — not pure black, not #111
- Header: floating pill, `border-radius: 8px` minimum
- "Book a call" button: solid violet fill, pill shape (`border-radius: 9999px`)
- Scroll darkening threshold: ~30px offset

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-05-06*
