# Phase 3: Core Sections - Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 3 (index.html, styles.css, script.js)
**Analogs found:** 3 / 3

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `index.html` (tech strip pills) | template | transform | Existing `.marquee-track` span children (lines 105–112) | exact |
| `index.html` (services section) | template | request-response | Existing `#agents` section with `.agent-card` pattern (lines 115–153) | exact |
| `index.html` (portfolio cards) | template | transform | Existing `.portfolio-card` articles (lines 226–274) | exact |
| `index.html` (nav links) | template | request-response | Existing nav `<a class="nav-link">` (lines 32–36) | exact |
| `styles.css` (new `.service-card`) | config | transform | Existing `.agent-card` rule block (lines 627–652) | exact |
| `styles.css` (shared rule edits) | config | transform | Compound selectors at lines 619, 627, 641, 654, 663 | exact |
| `styles.css` (responsive edits) | config | transform | Media query blocks at lines 852–907, 909–948 | exact |
| `script.js` (spotlight selector) | utility | event-driven | Existing `querySelectorAll` at line 138 | exact |

---

## Pattern Assignments

### `index.html` — Nav Links (lines 32–35)

**Analog:** Current nav block, `index.html` lines 32–35

**Current pattern (lines 32–35):**
```html
<a class="nav-link" href="#agents">Services</a>
<a class="nav-link" href="#automations">Work</a>
<a class="nav-link" href="#devops">Process</a>
<a class="nav-link" href="#portfolio">About</a>
```

**Required replacement:**
```html
<a class="nav-link" href="#services">Services</a>
<a class="nav-link" href="#portfolio">Work</a>
<a class="nav-link" href="#contact">Process</a>
<a class="nav-link" href="#contact">About</a>
```

**Gotcha:** The `sectionObserver` in `script.js` (lines 37–53) keys on `link.getAttribute("href") === '#' + section.id`. The `#services` nav href MUST be updated in the same commit that adds `id="services"` to the new section. A split commit leaves the nav active state broken. The fifth link (`href="#contact"`) is already correct and stays untouched.

---

### `index.html` — Tech Strip Pills (lines 106–112)

**Analog:** Current `<span>` children of `.marquee-track`, `index.html` lines 106–112

**Current pill pattern (plain text, lines 106–112):**
```html
<div class="marquee-track">
  <span>Google Sheets</span>
  <span>WhatsApp</span>
  <span>Gmail</span>
  <span>GitHub</span>
  <span>Docker</span>
  <span>Meta</span>
</div>
```

**Required pill pattern (SVG + text):**
```html
<span>
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="[PATH_DATA]"/>
  </svg>
  Tool Name
</span>
```

The outer `<section class="logo-strip">` wrapper only needs one attribute change: `aria-label="Systems we connect"` becomes `aria-label="Tools and platforms I work with"`. The `<div class="marquee-track">` wrapper stays. Only the inner `<span>` elements are replaced.

**How marquee JS interacts with new pills (`script.js` lines 7–13):**
```javascript
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  Array.from(marqueeTrack.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}
```
`cloneNode(true)` deep-copies the entire `<span>` including nested SVG. The inline SVGs already carry `aria-hidden="true"`, so cloned pills are doubly hidden from screen readers. No JS change needed.

**Gotcha — marquee speed:** The current `.marquee-track` animation duration is `18s` (styles.css line 572). Going from 6 to 10 pills makes the track ~67% wider; the `translateX(-50%)` keyframe still works correctly but each pill passes the viewport faster. Change the duration to `28s` in the CSS rule at line 572 to maintain a comfortable reading pace.

---

### `index.html` — Services Section (insert between line 113 and line 219)

**Analog:** `#agents` section structure, `index.html` lines 115–153

**Analog: section + heading + grid + cards (lines 115–153):**
```html
<section class="section" id="agents">
  <div class="section-heading reveal">
    <p class="eyebrow">AI assistants people can actually use</p>
    <h2>Agents for the daily work that slows you down.</h2>
    <p>Each assistant is built around a business outcome...</p>
  </div>
  <div class="agent-grid">
    <article class="agent-card reveal">
      <span>01</span>
      <h3>Sales Assistant</h3>
      <p>Captures leads...</p>
    </article>
    ...
  </div>
</section>
```

**Required services section pattern:**
```html
<section class="section services-section" id="services">
  <div class="section-heading reveal">
    <p class="eyebrow">What I Build</p>
    <h2>Built for how you actually work.</h2>
  </div>
  <div class="services-clusters">

    <div class="services-cluster">
      <p class="cluster-heading">For Growing Businesses</p>
      <div class="service-grid">
        <article class="service-card reveal">
          <h3>[Service Title]</h3>
          <p>[Outcome copy]</p>
        </article>
        <article class="service-card reveal">...</article>
        <article class="service-card reveal">...</article>
      </div>
    </div>

    <div class="services-cluster">
      <p class="cluster-heading">For Startups &amp; Product Teams</p>
      <div class="service-grid">
        <article class="service-card reveal">...</article>
        <article class="service-card reveal">...</article>
        <article class="service-card reveal">...</article>
      </div>
    </div>

  </div>
</section>
```

**Key structural differences from `.agent-card` pattern:**
- No `<span>` number badge — service cards are label-free (no numbered eyebrow inside the card)
- Cards use `<article class="service-card reveal">` — new class, not `.agent-card`
- Section background: `var(--color-surface-1)` via `.services-section` class (matches `.devops-section` pattern at line 742)
- `reveal` class is placed directly on each `<article>` — same pattern as all other card grids in the codebase

**Gotcha — spotlight:** `.service-card` must be added to the spotlight selector in `script.js` line 138 **in the same commit** as this HTML. Service cards added before the selector update will silently have no glow interaction.

---

### `index.html` — Portfolio Cards (lines 226–273 replaced with 4 cards)

**Analog:** Current `<article class="portfolio-card">` markup, `index.html` lines 226–273

**Drop-in contract (D-13) — exact structure to replicate per card:**
```html
<article class="portfolio-card reveal">
  <img src="https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=900&q=80" alt="[descriptive alt text]">
  <div>
    <span>[Category Label]</span>
    <h3>[Project Title]</h3>
    <p>[Outcome Description]</p>
  </div>
</article>
```

The outer `<section class="section portfolio-section" id="portfolio">` wrapper and `.section-heading` block (lines 219–224) stay intact. Only the 6 `<article>` elements inside `.portfolio-grid` are replaced with 4.

**Gotcha — portfolio grid columns:** The existing `.portfolio-grid` uses `repeat(3, 1fr)`. With 4 cards this produces a 3+1 orphaned layout. Change to `repeat(2, 1fr)` in the existing rule at styles.css line 623 (keeping `.portfolio-grid` in the selector) for a clean 2+2 layout.

---

### `styles.css` — Delete Stale Classes from Shared Rules

These are surgical edits to compound selectors. Each deletion is an independent operation.

**Rule 1 — Grid rule (line 619):**
```css
/* BEFORE */
.agent-grid,
.portfolio-grid,
.devops-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

/* AFTER (delete .agent-grid and .devops-grid; keep .portfolio-grid) */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* change from 3 to 2 for 4-card balance */
  gap: 16px;
}
```

**Rule 2 — Base card rule (lines 627–638):**
```css
/* BEFORE */
.agent-card,
.devops-card,
.mini-card,
.timeline-step { ... }

/* AFTER */
.timeline-step { ... }
```

**Rule 3 — Hover rule (lines 640–652):**
```css
/* BEFORE */
.agent-card:hover,
.devops-card:hover,
.mini-card:hover,
.timeline-step:hover,
.portfolio-card:hover { ... }

/* AFTER */
.timeline-step:hover,
.portfolio-card:hover { ... }
```

**Rule 4 — Span/label rule (lines 654–661):**
```css
/* BEFORE */
.agent-card span,
.portfolio-card span,
.timeline-step span { ... }

/* AFTER */
.portfolio-card span,
.timeline-step span { ... }
```

**Rule 5 — Paragraph rule (lines 663–669):**
```css
/* BEFORE */
.agent-card p,
.devops-card p,
.mini-card p,
.timeline-step p,
.portfolio-card p { ... }

/* AFTER */
.timeline-step p,
.portfolio-card p { ... }
```

**Gotcha — `.timeline-step` must be preserved in ALL five rules above.** It is used by the Phase 4 process section (lines 277–304 of `index.html`), which is not touched in Phase 3.

---

### `styles.css` — Delete Standalone Stale Class Blocks

These blocks are used only by sections being deleted. Remove entirely:

| Class | Approx. Lines | Safe to Delete |
|-------|---------------|----------------|
| `.split-section` (main rule) | 671–676 | Yes — section deleted |
| `.image-panel` + `.image-panel img` | 678–689 | Yes — only used in `.split-section` |
| `.check-list` + `.check-list span` | 691–703 | Yes — only used in `.split-section` |
| `.social-grid` | 705–709 | Yes — section deleted |
| `.wide-card` (grid rule) | 711–727 | Yes — section deleted |
| `.wide-card img` (shared with `.portfolio-card img`) | 729–735 | Partial — remove `.wide-card` selector, keep `.portfolio-card img` |
| `.wide-card div` (shared with `.portfolio-card div`) | 737–740 | Partial — remove `.wide-card` selector, keep `.portfolio-card div` |
| `.devops-section` | 742–744 | Yes — section deleted |

**Shared rule at lines 711–718:**
```css
/* BEFORE */
.wide-card,
.portfolio-card {
  overflow: hidden;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

/* AFTER */
.portfolio-card {
  overflow: hidden;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
```

---

### `styles.css` — Responsive Rule Edits

**At `@media (max-width: 940px)` block (lines 885–907):**

Rule to edit (lines 885–889):
```css
/* BEFORE */
.hero-grid,
.split-section,
.contact-section,
.wide-card {
  grid-template-columns: 1fr;
}

/* AFTER */
.hero-grid,
.contact-section {
  grid-template-columns: 1fr;
}
```

Rule to edit (lines 896–902):
```css
/* BEFORE */
.agent-grid,
.portfolio-grid,
.devops-grid,
.timeline,
.social-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* AFTER (add .service-grid, remove deleted classes) */
.portfolio-grid,
.service-grid,
.timeline {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

Delete standalone rule (line 904):
```css
/* DELETE ENTIRELY */
.wide-card {
  grid-column: 1 / -1;
}
```

**At `@media (max-width: 640px)` block (lines 933–939):**
```css
/* BEFORE */
.agent-grid,
.portfolio-grid,
.devops-grid,
.timeline,
.social-grid {
  grid-template-columns: 1fr;
}

/* AFTER */
.portfolio-grid,
.service-grid,
.timeline {
  grid-template-columns: 1fr;
}
```

Also at 640px, remove `.split-section` from (line 910–914):
```css
/* BEFORE */
.section,
.split-section,
.contact-section {
  padding: 72px 18px;
}

/* AFTER */
.section,
.contact-section {
  padding: 72px 18px;
}
```

---

### `styles.css` — New CSS to Add

**Placement:** Add the block below immediately after the cleaned-up `.portfolio-card` CSS block (after line ~768).

**Logo strip pill extension (modify existing `.logo-strip span` rule at line 605):**
```css
/* BEFORE (line 605) */
.logo-strip span {
  padding: 10px 14px;
  color: var(--color-text-secondary);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 700;
}

/* AFTER */
.logo-strip span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 14px;
  color: var(--color-text-secondary);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 700;
}

.logo-strip svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  flex-shrink: 0;
}
```

**New services section CSS block:**
```css
/* === SERVICES === */

.services-section {
  background: var(--color-surface-1);
}

.services-clusters {
  display: grid;
  gap: 56px;
}

.cluster-heading {
  margin-bottom: var(--space-6);
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.service-card {
  min-height: 220px;
  padding: 28px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: transparent;
  box-shadow:
    0 0 0 1px var(--color-accent),
    0 0 20px rgba(124, 92, 252, 0.35),
    0 0 60px rgba(124, 92, 252, 0.12),
    var(--shadow-card);
}

.service-card h3 {
  margin-bottom: var(--space-3);
}

.service-card p {
  color: var(--color-text-secondary);
}
```

**Analog for `.service-card` hover:** The hover box-shadow is identical to the existing `.agent-card:hover` / `.portfolio-card:hover` pattern (lines 640–652). Values are `0 0 0 1px var(--color-accent)`, `0 0 20px rgba(124, 92, 252, 0.35)`, `0 0 60px rgba(124, 92, 252, 0.12)`, `var(--shadow-card)`.

**Analog for `.services-section` background:** Matches the existing `.devops-section { background: var(--color-surface-1); }` pattern at line 742.

---

### `script.js` — Spotlight Selector (line 138)

**Analog:** Existing `pointermove`/`pointerleave` block, `script.js` lines 138–149

**Full block for reference (lines 138–149):**
```javascript
document.querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 92, 252, 0.12), transparent 34%)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.backgroundImage = "";
  });
});
```

**Only line 138 changes:**
```javascript
/* BEFORE */
document.querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card").forEach((card) => {

/* AFTER */
document.querySelectorAll(".service-card, .portfolio-card").forEach((card) => {
```

- `.agent-card` removed (section deleted)
- `.package-card` removed (was orphaned — never appeared in HTML)
- `.devops-card` removed (section deleted)
- `.service-card` added (new services section)
- `.portfolio-card` kept (still present)

**Gotcha:** This runs once on page load. The HTML for `.service-card` and this selector update MUST ship in the same commit, or service cards will silently have no spotlight interaction.

---

## Shared Patterns

### `reveal` Class — Intersection Observer Fade-In
**Source:** `script.js` lines 87–99, `styles.css` lines 841–850
**Apply to:** Every new `<article class="service-card">`, the new `<div class="section-heading">`, and every `<article class="portfolio-card">` replacement card.

Pattern: add `class="... reveal"` to the element. The observer adds `.is-visible` when 16% of the element is in the viewport, triggering the CSS fade+lift. No JS change required — the observer queries `.reveal` on page load and will pick up all new elements automatically.

```css
/* styles.css lines 841–850 */
.js .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 620ms ease, transform 620ms ease;
}
.js .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### CSS Custom Properties — Tokens Only
**Source:** `styles.css` lines 1–92
**Apply to:** All new CSS rules.

Never use inline hex values in new CSS. Use the semantic token layer:
- Backgrounds: `var(--color-bg)`, `var(--color-surface-1)`, `var(--color-surface-2)`
- Borders: `var(--color-border)`, `var(--color-border-strong)`
- Text: `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
- Accent: `var(--color-accent)` (= `#7c5cfc`), `var(--color-accent-dim)` (= `rgba(124,92,252,0.12)`)
- Spacing: `var(--space-2)` through `var(--space-24)`
- Radius: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`
- Shadows: `var(--shadow-card)`, `var(--shadow-glow)`

Exception: The spotlight glow values in `pointermove` use `rgba(124, 92, 252, 0.12)` directly in the JS template literal — this is pre-existing pattern, not a new violation.

### Eyebrow Label Pattern
**Source:** `styles.css` lines 296–303
**Apply to:** Section heading eyebrow in new services section, and cluster headings.

```css
.eyebrow {
  margin: 0 0 14px;
  color: var(--color-cyan);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

The `.cluster-heading` (for "For Growing Businesses", "For Startups & Product Teams") uses `var(--color-text-secondary)` instead of `var(--color-cyan)` to visually de-emphasize it relative to the section `<h2>`. The `.eyebrow` on the `<div class="section-heading">` keeps `var(--color-cyan)`.

### iOS Safari backdrop-filter Constraint
**Source:** `CLAUDE.md` — Key Design Decisions
**Apply to:** All new CSS rules.

Never put `backdrop-filter` and `transform` on the same element. The new `.service-card` uses `transform: translateY(-5px)` on hover — confirm it has no `backdrop-filter`. The existing `.service-card` definition (confirmed above) uses only `box-shadow` and `border` — safe.

---

## No Analog Found

No files are without a codebase analog. All three source files have direct existing patterns that new code replicates or surgically edits.

---

## Metadata

**Analog search scope:** `index.html`, `styles.css`, `script.js` (complete files read)
**Files scanned:** 3 source files + CONTEXT.md + RESEARCH.md
**Pattern extraction date:** 2026-05-07
