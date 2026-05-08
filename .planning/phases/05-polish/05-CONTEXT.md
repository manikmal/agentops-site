# Phase 5: Polish - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

The site is ship-ready — fully responsive at all target viewports, passing iOS Safari checks, hitting Lighthouse performance targets, correctly meta-tagged for social sharing, and equipped with a on-brand SVG wordmark replacing the current off-brand raster.

</domain>

<decisions>
## Implementation Decisions

### Brand Asset — Wordmark
- **D-01:** Generate a new `wordmark.svg` to replace `wordmark.png` in the site header. The current wordmark has wrong colors, wrong typography, poor resolution, and wrong proportions. New SVG: "AgentOps" in violet `#7c5cfc`, "Studio" in white `#f4f4f5`, Inter font (same as body), clean proportions suitable for the 36–40px header height.
- **D-02:** Update all references to `wordmark.png` in `index.html` and any CSS to point to `wordmark.svg`.
- **D-03:** Add `<link rel="preload" as="image" href="wordmark.svg">` in `<head>` — the header wordmark is the likely LCP candidate, preloading it directly improves score.

### OG / Social Meta
- **D-04:** Create `og-image.png` (1200×630) — a branded social card using the site theme: dark `#0a0a0b` background, violet `#7c5cfc` accent, "AgentOps Studio" in Inter at prominent size, subtitle/tagline below. This is used for og:image and twitter:image.
- **D-05:** Add the full social meta block to `<head>` in `index.html`: `og:title`, `og:description`, `og:image` (absolute URL), `og:type`, `og:url`, `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`.

### Mobile "Book a Call" CTA
- **D-06:** At mobile widths (≤940px), the "Book a call" button must be always visible in the header bar — outside the collapsed hamburger nav. Currently the button is inside `<nav>`, hidden when the menu is closed.
- **D-07:** Implementation: move the "Book a call" `<a>` outside `<nav>` into the `.site-header` flex row, between the brand and the `.nav-toggle`. Apply compact violet btn-primary styling at mobile: padding `8px 12px`, font-size slightly smaller than desktop. It must remain visible at all times on mobile without opening the hamburger menu.

### prefers-reduced-motion
- **D-08:** The `@media (prefers-reduced-motion: reduce)` block in `styles.css` must be expanded to kill ALL motion — not just the marquee/dots. Add `*, *::before, *::after { transition: none !important; animation: none !important; }` at the top of the block. This fully satisfies PERF-04 and is the maximalist approach the user chose.
- **D-09:** In `script.js`, the canvas animation is already gated by `window.matchMedia('(prefers-reduced-motion: reduce)')` at line 116. Confirm this check is in place and the rAF loop is not started when the preference is active.

### Font Loading / LCP
- **D-10:** Keep Google Fonts CDN (no self-hosting). Add a `<link rel="preload" as="style">` hint for the Inter stylesheet and/or a `<link rel="preload" as="font" crossorigin>` for the critical woff2 subset to reduce font-induced layout shifts.
- **D-11:** `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` are already present in `index.html` — preserve them.

### Responsive Layout
- **D-12:** Existing breakpoints cover 940px (hamburger, single-col hero) and 640px (tighter padding, single-col grids). The success criteria requires 375px, 430px, 768px, and 940px. Add targeted fixes only if layout breaks at those viewports — do not add blanket new breakpoints speculatively.
- **D-13:** 768px falls within the 940px breakpoint zone (2-col grids active). Verify the timeline and service grid look acceptable at 768px without an explicit breakpoint; add one only if needed.

### iOS Safari
- **D-14:** The `backdrop-filter` / `transform` separation rule is already established and implemented (from Phase 1 CLAUDE.md). Verify in iOS Safari simulator that no regressions exist after the Phase 5 changes.
- **D-15:** No new `backdrop-filter` elements should be added in Phase 5.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/ROADMAP.md` § Phase 5: Polish — goal, success criteria (5 items), requirements list (PERF-01 through PERF-06)
- `.planning/REQUIREMENTS.md` § Performance & Technical — PERF-01 through PERF-06 full requirement text

### Design Constraints
- `CLAUDE.md` § Key Design Decisions — backdrop-filter rule, iOS Safari constraint, canvas particle limits, design tokens
- `CLAUDE.md` § Architecture — CSS top-to-bottom order, JS sequential block order

### Existing Code
- `styles.css` lines 594–612 — existing `@media (prefers-reduced-motion: reduce)` block (to be extended, not replaced)
- `styles.css` lines 970–1080 — existing 940px and 640px responsive breakpoints
- `script.js` lines 116 and 301–302 — prefers-reduced-motion JS check + requestIdleCallback canvas init

### Assets
- `index.html` lines 1–24 — current `<head>` with existing meta tags, preconnect, font link (add og: block here)
- `wordmark.png` — current raster wordmark to be replaced by `wordmark.svg`
- `logo.png` — existing logo asset; reference only, not the LCP element

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.btn-primary` — existing violet CTA button class; reuse for mobile pinned "Book a call" with overridden padding at mobile breakpoint
- `.nav-toggle` — existing hamburger button; flex row sibling in `.site-header`
- `.site-header` — flex row with `align-items: center`; "Book a call" CTA slots in between brand and toggle

### Established Patterns
- CSS token-only values — no inline hex; use `var(--color-accent)` for violet, `var(--color-text-primary)` for white
- `reveal` class on new visible elements for intersection-based fade-in
- JS canvas: `requestIdleCallback` init with `setTimeout` fallback (Safari) — pattern at script.js line 301
- Media query structure: add new overrides at the BOTTOM of `styles.css`, after existing 640px block, in descending order

### Integration Points
- `<head>` in `index.html` — add og: meta block after `<meta name="description">`, add preload hints after preconnect links
- `.site-header` HTML — relocate "Book a call" `<a>` to sit between `.brand` and `.nav-toggle`
- `@media (prefers-reduced-motion: reduce)` in `styles.css` line 594 — insert `*` rule at top of existing block
- New files to add to repo root: `wordmark.svg`, `og-image.png`

</code_context>

<specifics>
## Specific Ideas

- **SVG wordmark design:** "AgentOps" in violet `#7c5cfc` + "Studio" in `#f4f4f5` white, Inter font, single-line or two-part layout fitting the header height. Must look sharp at 1x and 2x (retina) — SVG is vector so inherently sharp.
- **og-image.png design:** 1200×630px, `#0a0a0b` dark background, centered "AgentOps Studio" in large Inter, violet accent element (could be the logo mark or a violet rule), subtitle line: "AI Engineering for Founders & Growing Teams."
- **Mobile CTA compact size:** `padding: 8px 12px` at ≤940px (reduced from desktop `padding: 10px 20px`). Font-size `13px` or `14px` to keep it compact.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Polish*
*Context gathered: 2026-05-08*
