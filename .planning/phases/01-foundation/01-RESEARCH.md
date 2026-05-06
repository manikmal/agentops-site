# Phase 1: Foundation — Research

**Researched:** 2026-05-06
**Domain:** Vanilla CSS design tokens, variable font loading, iOS Safari compositing, IntersectionObserver navigation, HTML language audit
**Confidence:** HIGH — all decisions pre-locked in CONTEXT.md; research confirms implementation details and surfaces concrete codebase deltas

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Two-layer token hierarchy. Primitives block first (`--violet-600: #7c5cfc`, `--gray-950: #0a0a0b`, etc.), semantic block second (`--color-accent: var(--violet-600)`, `--color-bg: var(--gray-950)`). Both blocks live at the top of `styles.css` before any section CSS.
- **D-02:** Three dark surface levels: `--color-surface-1: #111113`, `--color-surface-2: #18181b`, `--color-surface-3: #232326`.
- **D-03:** Motion tokens in primitives block: `--duration-fast: 150ms`, `--duration-base: 250ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
- **D-04:** Border tokens: `--color-border: rgba(255,255,255,0.08)`, `--color-border-strong: rgba(255,255,255,0.14)`. No inline rgba for borders.
- **D-05:** Wrapper approach for header. `.header-positioner` handles positioning only (fixed, transform). `.site-header` holds backdrop-filter. Never both on same element.
- **D-06:** Header darkens on scroll. JS adds `.scrolled` to `.header-positioner` at 30px offset. Inner `.site-header` transitions background.
- **D-07:** "Book a call" button: solid violet pill, `background: var(--color-accent)`, `border-radius: 9999px`, `padding: 8px 16px`. Links to `#contact` placeholder.
- **D-08:** Google Fonts preconnect + Inter variable font: `ital,opsz,wght@0,14..32,100..900;1,14..32,100..900`. `font-optical-sizing: auto` and `-webkit-font-smoothing: antialiased` on body.
- **D-09:** Letter-spacing tokens: `--tracking-tight: -0.04em` (h1), `--tracking-heading: -0.03em` (h2, h3).
- **D-10:** Fluid type scale: `h1: clamp(2.5rem, 5vw + 1rem, 5rem)`, `h2: clamp(1.75rem, 3vw + 0.75rem, 3rem)`, `h3: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)`. No breakpoint-scoped font-size overrides.
- **D-11:** Hero H1 → "Build AI products that scale." Lede → "End-to-end AI engineering for founders who need it done right." CTAs → "Book a discovery call" (primary) + "View work" (secondary).
- **D-12:** `<title>` → "AgentOps Studio | AI Engineering for Founders & Growing Teams". Meta description updated to startup-native copy.
- **D-13:** `<div class="hero-metrics">` removed entirely from HTML.
- **D-14:** Gmail address and phone number removed from hero. Footer contact block removed — Phase 4 handles footer.

### Claude's Discretion

- Exact primitive color names (e.g., `--violet-600`, `--gray-950`)
- `border-radius` token if wanted (e.g., `--radius-md: 8px`, `--radius-lg: 12px`)
- Whether to add `--color-text-muted` semantic token for secondary text
- Nav toggle / mobile menu animation (collapse/expand behavior)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUN-01 | Design system with violet `#7c5cfc` accent, `#0a0a0b` background, 4-step dark surface hierarchy | Token block spec fully defined in UI-SPEC.md; existing `:root` block with old tokens confirmed in styles.css lines 1–13 |
| FOUN-02 | CSS custom properties: primitives → semantic, before any section CSS | Existing styles.css has a single flat `:root` block (no separation); must be replaced with two-layer block |
| FOUN-03 | Inter variable font non-blocking with opsz,wght axes; negative letter-spacing; font-optical-sizing; antialiased | No Google Fonts link tag exists in current index.html; font-family references Inter directly without loading it |
| FOUN-04 | Fluid `clamp()` type scale; no breakpoint-scoped font-size overrides | Current styles.css uses fixed px sizes (h1: 4.55rem fixed, h2: 3rem fixed, no clamp); must be replaced entirely |
| FOUN-05 | Full SME language audit — 9 distinct pattern categories confirmed present in codebase | Audit confirmed 23 instances across index.html and script.js |
| HEAD-01 | Floating pill header with backdrop-filter blur; iOS Safari split wrapper | Current `.site-header` has `transform: translateX(-50%)` and `backdrop-filter: blur(18px)` on THE SAME element — this is the active iOS Safari bug; no `-webkit-backdrop-filter` prefix present |
| HEAD-02 | Nav labels: Services / Work / Process / About / Contact | Current nav labels: AI Agents / Automations / DevOps / Portfolio / Contact — all 4 non-Contact labels need updating |
| HEAD-03 | "Book a call" CTA visible in header at all viewport sizes | No CTA button exists in current header HTML |
</phase_requirements>

---

## Summary

Phase 1 is a surgical replacement of the design system shell and header structure in a vanilla HTML/CSS/JS codebase. The site has no build step, no npm, and no framework — every change is a direct edit to `index.html`, `styles.css`, and `script.js`. All architectural decisions are pre-locked; research validates implementation details and maps every concrete code delta.

The three high-risk areas are: (1) the iOS Safari backdrop-filter/transform co-location bug that is actively present in the codebase and will cause header blur to silently fail on Safari — it requires a structural HTML split, not a CSS tweak; (2) the absence of an Inter font loading tag, meaning the font-family declaration already in styles.css is a no-op on first load (system font fallback renders instead); and (3) the SME language audit, which spans 23 confirmed instances across two files including an email address hardcoded into a JavaScript error handler.

Downstream phases write into the token system established here. The planner must ensure the token block is complete before any section CSS is written — partial token blocks will cause visual regressions when later phases add component CSS that references semantic tokens not yet defined.

**Primary recommendation:** Execute in four sequential work units — (1) token block replacement in styles.css, (2) typography scale replacement + font loading tag in index.html, (3) header HTML split + CSS + JS scroll handler update, (4) SME language audit across both files.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design token system | Static CSS (`:root` block) | — | CSS custom properties; no JS or build step involved |
| Font loading | HTML `<head>` (preconnect + link) | CSS `body` rule | Font URL in HTML; rendering properties in CSS |
| Fluid type scale | CSS (heading selectors) | — | Pure CSS `clamp()` — no JS |
| Header positioning (transform) | CSS `.header-positioner` | — | Outer wrapper owns transform; must be isolated from backdrop-filter |
| Header visual (backdrop-filter) | CSS `.site-header` | — | Inner element owns all visual styles; never receives `transform` |
| Scroll darkening | JS `window` scroll listener | CSS `.scrolled` class rule | JS detects threshold; CSS applies transition |
| Active nav tracking | JS IntersectionObserver | CSS `.is-active` class rule | JS drives section detection; CSS styles the indicator dot |
| Mobile nav toggle | JS click handler (existing) | CSS `.is-open` class rule | Existing pattern; Phase 1 reskins only |
| SME language removal | HTML `index.html` + JS `script.js` | — | Copy and hardcoded strings in both files |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native (all evergreen browsers) | Design tokens, theming | No dependency; full cascade; runtime-overridable |
| Inter Variable Font | Variable (Google Fonts) | Primary typeface | Already referenced in body font-family; declared in CONTEXT.md D-08 |
| IntersectionObserver | Native Web API | Active nav section detection | No polyfill needed for target browsers; performant; non-blocking |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clamp()` CSS function | Native (all evergreen) | Fluid type scale | All heading font-size declarations |
| `requestIdleCallback` | Native (all evergreen; Safari 16+) | Canvas init deferral | HERO-04 (Phase 2); included here as constraint |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts CDN | Self-hosted font files | Self-hosting gives privacy and offline reliability; Google Fonts is simpler with no build step — project decision is CDN (D-08) |
| IntersectionObserver for nav | Scroll event + getBoundingClientRect | Observer is more performant; scroll listener approach causes layout thrash |

**Installation:** No installation — vanilla project. No npm, no build step.

---

## Architecture Patterns

### System Architecture Diagram

```
index.html <head>
  └─ preconnect (fonts.googleapis.com, fonts.gstatic.com)
  └─ Google Fonts link (Inter variable)
  └─ link rel="stylesheet" href="styles.css"

styles.css (top-to-bottom DOM order)
  ├─ :root { PRIMITIVES block }      ← phase 1 writes this
  ├─ :root { SEMANTIC block }        ← phase 1 writes this
  ├─ Reset / base (*, body, html)    ← phase 1 updates body font, antialiasing
  ├─ Typography scale (h1–h3)        ← phase 1 replaces with clamp() + tracking
  ├─ Shared utilities (.btn-primary) ← phase 1 writes .btn-primary violet pill
  ├─ Header (.header-positioner,     ← phase 1 writes wrapper split
  │          .site-header, nav)
  └─ [sections below — not touched by phase 1, but reference NEW tokens]

script.js
  ├─ DOM refs (header → data-header moved to .header-positioner)
  ├─ Nav toggle (existing, preserved)
  ├─ Header scroll handler (updated: targets .header-positioner, { passive: true })
  └─ Active nav IntersectionObserver (NEW: section-watching, .is-active on links)

index.html <body>
  ├─ .header-positioner [data-header]     ← NEW outer wrapper
  │   └─ .site-header                    ← EXISTING element, visual styles only
  │       ├─ .brand
  │       ├─ .nav-toggle [data-nav-toggle]
  │       ├─ .site-nav [data-nav]
  │       │   └─ nav links (labels updated)
  │       └─ .btn-primary.btn-book-call  ← NEW "Book a call" button
  └─ [sections — SME copy audited/replaced, hero-metrics removed]
```

### Recommended File Structure

No structural changes — existing three-file architecture is maintained:

```
sme-ai-devops-site/
├── index.html      — HTML edits: head tags, header restructure, copy audit
├── styles.css      — Full :root replacement + typography + header CSS
├── script.js       — Header scroll + active nav observer updates
├── favicon.svg     — Unchanged
├── wordmark.png    — Unchanged
└── netlify.toml    — Unchanged
```

### Pattern 1: Two-Layer CSS Token Block

**What:** Primitives block declares raw values with scale names. Semantic block maps meaning to primitives using `var()`. Component CSS only ever references semantic tokens.

**When to use:** Always. Never use raw hex values or rgba strings in component CSS — only semantic tokens.

**Example:**
```css
/* Source: CONTEXT.md D-01 through D-04; UI-SPEC.md Color section */

/* === PRIMITIVES === */
:root {
  /* Violet scale */
  --violet-600: #7c5cfc;
  --violet-400: #9b7fff;
  --violet-dim:  rgba(124, 92, 252, 0.12);

  /* Zinc / grey scale */
  --gray-950: #0a0a0b;
  --gray-900: #111113;
  --gray-800: #18181b;
  --gray-750: #232326;

  /* Signal */
  --cyan-400:  #22d3ee;
  --green-400: #4ade80;
  --amber-400: #fbbf24;
  --red-400:   #f87171;

  /* Motion */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* === SEMANTIC === */
:root {
  /* Backgrounds */
  --color-bg:        var(--gray-950);
  --color-surface-1: var(--gray-900);
  --color-surface-2: var(--gray-800);
  --color-surface-3: var(--gray-750);

  /* Borders */
  --color-border:        rgba(255,255,255,0.08);
  --color-border-strong: rgba(255,255,255,0.14);
  --color-border-hover:  rgba(255,255,255,0.16);
  --color-border-focus:  rgba(255,255,255,0.28);

  /* Text */
  --color-text-primary:   #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted:     rgba(255,255,255,0.50);

  /* Accent */
  --color-accent:       var(--violet-600);
  --color-accent-dim:   var(--violet-dim);
  --color-accent-hover: var(--violet-400);

  /* Signal */
  --color-error:   var(--red-400);
  --color-success: var(--green-400);
  --color-cyan:    var(--cyan-400);

  /* Header glassmorphism */
  --header-bg-default:  rgba(8, 10, 10, 0.78);
  --header-bg-scrolled: rgba(8, 10, 10, 0.92);

  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, "Courier New", monospace;
  --tracking-tight:   -0.04em;
  --tracking-heading: -0.03em;
  --tracking-label:    0.08em;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 64px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 0 1px var(--color-accent), 0 0 24px var(--color-accent-dim);

  /* Layout */
  --max-width: 1120px;
  --section-padding: var(--space-24) max(var(--space-6), calc((100% - var(--max-width)) / 2));
}
```

### Pattern 2: iOS Safari-Safe Header Split

**What:** Outer element owns `transform` for positioning; inner element owns `backdrop-filter` for visual effect. The two properties must never appear on the same element.

**When to use:** Any time a fixed/floating element needs both centering-via-transform and backdrop-filter blur. This is a hard iOS Safari constraint — violation causes silent blur failure.

**Example:**
```html
<!-- Source: CONTEXT.md D-05; UI-SPEC.md Component Specifications — Header -->
<!-- data-header moves to the OUTER wrapper -->
<div class="header-positioner" data-header>
  <header class="site-header">
    <!-- brand, nav, CTA button here -->
  </header>
</div>
```

```css
/* Source: CONTEXT.md D-05, D-06; UI-SPEC.md Component Specifications — Header */

/* OUTER: positioning only, NO backdrop-filter */
.header-positioner {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: min(1120px, calc(100% - 32px));
}

/* INNER: all visual styles, NO transform */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 12px;
  color: var(--color-text-primary);
  background: var(--header-bg-default);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  transition: background var(--duration-base) var(--ease-out);
}

/* Scroll state: JS adds .scrolled to .header-positioner */
.scrolled .site-header {
  background: var(--header-bg-scrolled);
}
```

### Pattern 3: Scroll-Passive Header Darkening (JS)

**What:** `scroll` listener with `{ passive: true }` flag adds `.scrolled` class to `.header-positioner` at 30px offset. `data-header` attribute used as JS hook (not a class selector).

**When to use:** Phase 1 replaces the existing scroll handler which currently targets `[data-header]` (the old `.site-header`) and sets inline `boxShadow`. New handler targets the wrapper and toggles a class.

**Example:**
```javascript
// Source: CONTEXT.md D-06, code_context section; UI-SPEC.md JS Architecture
const header = document.querySelector('[data-header]');

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });
```

### Pattern 4: Active Nav Section Tracking (IntersectionObserver)

**What:** New `IntersectionObserver` watches `<section id="*">` elements and adds `.is-active` to the matching `.nav-link`. `rootMargin` biased so the active link reflects the section currently filling most of the viewport.

**When to use:** Phase 1 introduces this — no active tracking exists in the current codebase.

**Example:**
```javascript
// Source: UI-SPEC.md JS Architecture section
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    }
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

document.querySelectorAll('section[id]').forEach((section) => {
  sectionObserver.observe(section);
});
```

### Pattern 5: Fluid Type Scale

**What:** All heading `font-size` declarations use `clamp(min, fluid, max)`. No breakpoint-scoped `font-size` overrides anywhere.

**Example:**
```css
/* Source: CONTEXT.md D-09, D-10; UI-SPEC.md Typography Type Scale */
h1 {
  font-size: clamp(2.5rem, 5vw + 1rem, 5rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: var(--tracking-tight);
}

h2 {
  font-size: clamp(1.75rem, 3vw + 0.75rem, 3rem);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: var(--tracking-heading);
}

h3 {
  font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: var(--tracking-heading);
}
```

### Anti-Patterns to Avoid

- **`backdrop-filter` and `transform` on the same element:** Causes blur to silently fail on iOS Safari. Always split into wrapper (transform) + inner (backdrop-filter). [VERIFIED: codebase — active bug confirmed at styles.css line 63]
- **Inline rgba strings in component CSS:** Undermines the token system. Use `var(--color-border)` not `rgba(255,255,255,0.08)` directly. Except: the semantic token declarations themselves in `:root` must contain the raw values.
- **Fixed `font-size` on headings:** Breaks fluid scaling. No `h1 { font-size: 4.55rem }` — always `clamp()`.
- **`-webkit-backdrop-filter` omitted:** Safari will ignore `backdrop-filter` without the prefixed version. Always include both.
- **Non-passive scroll listener:** Any scroll listener without `{ passive: true }` blocks the main thread and triggers a browser warning. [VERIFIED: codebase — existing handler at script.js line 30 lacks the passive flag]
- **Scatter breakpoints inside component rules:** All media queries must live in two consolidated blocks at the bottom of styles.css (940px and 640px breakpoints). No inline breakpoints inside component selectors.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fluid typography | Custom JS resize handler that updates font sizes | CSS `clamp()` | Native, zero JS, no layout thrash, zero maintenance |
| Scroll-based class toggling | Interval timer or requestAnimationFrame loop | `scroll` event with `{ passive: true }` | Native browser optimization; rAF loop burns CPU for no reason |
| Section active detection | Scroll offset arithmetic with getBoundingClientRect | `IntersectionObserver` | No layout thrash; browser-optimized; fires off main thread |
| Custom easing curves | JS cubic bezier interpolation | `cubic-bezier()` CSS timing function | Hardware-accelerated; composited |

**Key insight:** This is a vanilla no-build site — the entire phase is CSS and HTML edits. Every "hand-roll" risk here is writing custom JavaScript for something CSS already does natively.

---

## Codebase Delta Inventory

This section maps every concrete change Phase 1 must make. The planner translates these into tasks.

### `index.html` — Required Changes

| Location | Current State | Required State | Requirement |
|----------|--------------|----------------|-------------|
| `<head>` — before `<link rel="stylesheet">` | No font loading tags | preconnect × 2 + Google Fonts `<link>` for Inter variable | FOUN-03 |
| `<title>` | "AgentOps Studio \| AI Automations & DevOps for SMEs" | "AgentOps Studio \| AI Engineering for Founders & Growing Teams" | D-12, FOUN-05 |
| `<meta name="description">` | "...solutions for growing SMEs." | "End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses." | D-12 |
| `<header class="site-header" data-header>` | Single element with data-header | Wrap in `<div class="header-positioner" data-header>`, remove data-header from inner `<header>` | D-05, HEAD-01 |
| Nav links × 4 | AI Agents / Automations / DevOps / Portfolio | Services / Work / Process / About (Contact stays) | HEAD-02 |
| Nav links — add `.nav-link` class | No nav-link class on `<a>` elements | Add `class="nav-link"` to all nav links | Needed for active tracking JS |
| After `</nav>` inside header | No CTA button | `<a class="btn-primary btn-book-call" href="#contact">Book a call</a>` | HEAD-03, D-07 |
| `.eyebrow` in hero | "AI agents + automations + DevOps for SMEs" | Remove or replace with startup-native eyebrow (or remove entirely) | FOUN-05, D-11 |
| `<h1>` in hero | "Make your business run like a smarter system." | "Build AI products that scale." | D-11 |
| `.hero-lede` | "We build AI assistants...small and medium businesses." | "End-to-end AI engineering for founders who need it done right." | D-11, FOUN-05 |
| Primary CTA in hero | "Book an automation audit" (href="#contact") | "Book a discovery call" (href="#contact") | D-11, FOUN-05 |
| Secondary CTA in hero | "View portfolio" | "View work" | D-11 |
| `.hero-contact-links` div | `<a>` links to gmail and phone | Remove entire `.hero-contact-links` div | D-14, FOUN-05 |
| `.hero-metrics` div | Counter metrics block | Remove entire `<div class="hero-metrics">` | D-13 |
| Ops console (`.ops-console`) | SME agent-trace copy (CRM, invoices, Instagram) | Replace flow-row content with placeholder agent-trace lines (startup-native) | D-11 |
| `<section class="section packages-section">` | Package tiers with "Automation Starter" | Remove entire packages section | FOUN-05 |
| Section h2: "#agents" | "Agents for the daily work SMEs keep postponing." | Left for Phase 3 (only if it contains audited strings — does contain "SMEs") | FOUN-05 |
| Section h2: "#automations" | "We turn scattered forms..." | Left for Phase 3 (body copy contains "We") | FOUN-05 |
| Section h2: "social-section" | "For SMEs that need..." | Left for Phase 3 (body copy contains "SMEs") | FOUN-05 |
| Section eyebrow: "#devops" | "DevOps for SMEs" | Phase 3 scope | FOUN-05 |
| Section h2: "#portfolio" | "SME products with AI assistant layers..." | Phase 3 scope | FOUN-05 |
| Contact section h2 | "Tell us what your team repeats..." | Phase 4 scope | — |
| Contact section email + phone | `manikmalhotra6@gmail.com` + `+91 9599668843` in `.direct-contact` | Remove both from contact section; keep email in footer temporarily | D-14, FOUN-05 |
| Contact form `<input name="phone">` field | Phone/WhatsApp input field | Remove phone field | FOUN-05 |
| Contact form `<textarea>` placeholder | WhatsApp example | Replace with startup-native placeholder | FOUN-05 |
| Footer `<a href="tel:...">Phone</a>` | Phone link in footer | Remove | FOUN-05 |
| `script.js` fallback email string | Hardcoded `manikmalhotra6@gmail.com` at line 57 | Acceptable to leave for now (only shown on form error); Phase 4 will update with branded email | — |

> **Note on audit scope:** FOUN-05 requires removal of SME-era language from hero and structural sections. Body-copy rewrites in the services/portfolio/process sections are Phase 3 scope. Phase 1 removes the most visible positioning language (title, description, hero, nav labels, packages section) and structural elements (metrics, phone, packages tier). Copy within content sections (#agents, #automations, etc.) will be rewritten wholesale in Phase 3 when those sections are redesigned.

### `styles.css` — Required Changes

| Location | Current State | Required State | Requirement |
|----------|--------------|----------------|-------------|
| Lines 1–13: `:root` block | 11 flat token variables (`--ink`, `--charcoal`, etc.) | Replace with full two-layer token block (primitives + semantic, ~50 variables) | FOUN-01, FOUN-02 |
| `body` rule | No font-optical-sizing; no antialiasing; color: `var(--ink)` | Add `font-optical-sizing: auto`, `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`; update color to `var(--color-text-primary)`; update background to `var(--color-bg)` | FOUN-03 |
| `h1` rule (line ~202) | `font-size: 4.55rem; letter-spacing: 0` | `font-size: clamp(2.5rem, 5vw + 1rem, 5rem); letter-spacing: var(--tracking-tight); line-height: 1.02` | FOUN-03, FOUN-04 |
| `h2` rule | `font-size: 3rem; letter-spacing: 0` | `font-size: clamp(1.75rem, 3vw + 0.75rem, 3rem); letter-spacing: var(--tracking-heading); line-height: 1.06` | FOUN-03, FOUN-04 |
| `h3` rule | `font-size: 1.18rem` | `font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem); letter-spacing: var(--tracking-heading); line-height: 1.3` | FOUN-03, FOUN-04 |
| `.site-header` rule (lines 47–64) | Single element with `position: fixed`, `transform: translateX(-50%)`, and `backdrop-filter: blur(18px)` — all on same element | Split: `.header-positioner` gets positioning; `.site-header` gets visual styles only. Add `-webkit-backdrop-filter`. Update token references. | HEAD-01, D-05 |
| `.scrolled .site-header` | Does not exist | Add rule: `background: var(--header-bg-scrolled)` | D-06 |
| `.btn-primary` rule (lines ~275–283) | Lime green background (`var(--lime)`) | Violet pill: `background: var(--color-accent); border-radius: var(--radius-full); color: #fff; padding: var(--space-2) var(--space-4); font-size: 0.875rem; font-weight: 600` | HEAD-03, D-07 |
| `.btn-primary:hover` | `animation: pulse` with lime shadow | `background: var(--color-accent-hover); transform: translateY(-1px)` | D-07 |
| `.site-nav a` | `color: rgba(255,255,255,0.78)` | Update to `var(--color-text-secondary)`; add `.nav-link` selector | HEAD-02 |
| `.nav-link.is-active` | Does not exist | Add: `color: var(--color-text-primary)` + violet dot pseudo-element indicator | HEAD-02, active tracking |
| All remaining old token references (`var(--ink)`, `var(--cyan)`, `var(--lime)`, `var(--charcoal)`, `var(--paper)`, `var(--line)`, `var(--muted)`, `var(--coral)`, `var(--white)`, `var(--shadow)`) | Used throughout component rules | Update to new semantic tokens or equivalent new values; do not leave orphaned references | FOUN-01, FOUN-02 |

> **Critical note on old token cleanup:** Replacing the `:root` block removes the old variable names. Every downstream reference to `var(--ink)`, `var(--cyan)`, `var(--lime)`, `var(--charcoal)`, `var(--paper)`, `var(--line)`, `var(--muted)`, `var(--coral)`, `var(--white)`, `var(--shadow)` will silently resolve to empty/invalid and break visual styles. The planner must include a task to update all occurrences in styles.css — not just the `:root` block. Grepping the full file before and after is a required verification step.

### `script.js` — Required Changes

| Location | Current State | Required State | Requirement |
|----------|--------------|----------------|-------------|
| Line 1: `const header = ...` | `document.querySelector("[data-header]")` targets `.site-header` | Still valid — `data-header` moves to `.header-positioner` in HTML, so selector continues to work | D-05 |
| Lines 30–33: scroll listener | `window.addEventListener("scroll", ...)` without `{ passive: true }`; sets inline `boxShadow` | Change to `{ passive: true }`; toggle `.scrolled` class instead of inline style | D-06, HEAD-01 |
| Card spotlight (line ~118) | `rgba(4, 217, 217, 0.12)` cyan glow hardcoded | Update to `rgba(124, 92, 252, 0.12)` (violet; matches `--color-accent-dim`) | FOUN-01 |
| IntersectionObserver for active nav | Does not exist | Add new observer per Pattern 4 above | HEAD-02 |
| Canvas particle count (line ~147) | `width < 720 ? 42 : 82` — both values exceed the ≤40 limit | Phase 2 scope (HERO-04) — note as a known debt but do not change in Phase 1 |
| Canvas particle/line color | Lime `rgba(164, 246, 63, 0.8)` particles, cyan lines | Phase 2 scope (HERO-04) |

---

## Common Pitfalls

### Pitfall 1: Silent Token Breakage — Old Variables Become Empty

**What goes wrong:** The planner replaces the `:root` block and the old variable names (`--ink`, `--cyan`, `--lime`, etc.) disappear. Every component CSS rule still referencing them gets an empty value — backgrounds disappear, borders vanish, colors go wrong. The page loads but looks broken in hard-to-trace ways.

**Why it happens:** CSS custom property with an undefined var() resolves to the property's initial value, not an error. No console warning. The breakage is visual-only and requires inspection to debug.

**How to avoid:** Before removing the old `:root` block, grep `styles.css` for every old token name and replace each with the new semantic equivalent. The old-to-new mapping is:

| Old Token | Replacement |
|-----------|-------------|
| `var(--ink)` | `var(--color-bg)` (backgrounds) or `var(--color-text-primary)` (text on light) |
| `var(--charcoal)` | `var(--color-surface-1)` |
| `var(--graphite)` | `var(--color-surface-2)` |
| `var(--paper)` | `var(--color-surface-2)` (was used for white card backgrounds; now dark) |
| `var(--white)` | `#ffffff` or `var(--color-text-primary)` |
| `var(--line)` | `var(--color-border)` |
| `var(--muted)` | `var(--color-text-secondary)` |
| `var(--cyan)` | `var(--color-cyan)` (only for technical indicators; do NOT use for accent) |
| `var(--lime)` | `var(--color-accent)` (where lime was the primary action color) |
| `var(--coral)` | `var(--color-error)` |
| `var(--shadow)` | `var(--shadow-card)` |

**Warning signs:** Cards/sections that visually disappear (no background) or text that becomes invisible after the token swap.

### Pitfall 2: iOS Safari Backdrop-Filter Fails Silently

**What goes wrong:** The header blur effect renders in Chrome/Firefox but not in Safari on iPhone. No error is thrown. The header still appears (background color works) but it looks opaque/non-blurred.

**Why it happens:** iOS Safari does not composite `backdrop-filter` when the element also has `transform`. This is an active WebKit rendering bug. [VERIFIED: codebase — existing `.site-header` has both at lines 63 and 56 of styles.css]

**How to avoid:** The wrapper split (D-05) must be implemented in both HTML and CSS. It is not sufficient to remove `transform` from `.site-header` without adding the wrapper element in HTML.

**Warning signs:** Testing only in Chrome — this bug is Safari-only and passes all desktop browser tests.

### Pitfall 3: `-webkit-backdrop-filter` Omitted

**What goes wrong:** `backdrop-filter` alone works in modern Chrome/Firefox but fails in older Safari versions that require the prefixed property.

**Why it happens:** The current codebase (styles.css line 62) only has the unprefixed form. Phase 1 must add the vendor-prefixed version.

**How to avoid:** Always declare both:
```css
backdrop-filter: blur(18px) saturate(180%);
-webkit-backdrop-filter: blur(18px) saturate(180%);
```

### Pitfall 4: Non-Passive Scroll Listener

**What goes wrong:** The existing scroll listener (script.js line 30) lacks `{ passive: true }`. This blocks the browser's threaded scroll optimization and generates a console warning. On mobile, it can cause scroll jank.

**Why it happens:** Default `addEventListener` for scroll is not passive.

**How to avoid:** Always include `{ passive: true }` on scroll, touchstart, and touchmove listeners that do not call `preventDefault()`.

### Pitfall 5: Old Cyan/Lime Color Values Left in script.js

**What goes wrong:** The card spotlight effect in script.js uses a hardcoded cyan rgba value (`rgba(4, 217, 217, 0.12)`) that conflicts with the new violet design system. After the CSS token replacement, card hover glows remain cyan while everything else is violet.

**Why it happens:** Hardcoded color string in JS, not a CSS token reference.

**How to avoid:** Update the spotlight radial gradient in script.js to use `rgba(124, 92, 252, 0.12)` — the violet accent dim value.

### Pitfall 6: Packages Section Not Removed

**What goes wrong:** The `<section class="section packages-section">` (HTML lines 300–322) contains "Automation Starter", "AI Agent Build", and "DevOps Foundation" tier cards. FOUN-05 requires package tier removal. If the section is left in place, the audit fails.

**Why it happens:** The section is easy to miss because its class name (`packages-section`) does not contain the audited strings themselves.

**How to avoid:** Include packages section removal explicitly as a task step. Also remove associated CSS (`.packages-section`, `.package-card`, `.package-grid`) to avoid dead code.

### Pitfall 7: `data-header` Attribute Left on Inner Element

**What goes wrong:** If the HTML split is done incorrectly and `data-header` stays on `.site-header` (the inner element) instead of moving to `.header-positioner` (the outer wrapper), the JS scroll handler adds `.scrolled` to the wrong element. The CSS `.scrolled .site-header` rule never fires. Header darkening stops working.

**Why it happens:** The `data-header` attribute must migrate from the old `<header class="site-header" data-header>` to the new outer wrapper `<div class="header-positioner" data-header>`.

**How to avoid:** Verify after implementation: `document.querySelector('[data-header]')` should return `.header-positioner`, not `.site-header`.

---

## Runtime State Inventory

Phase 1 is not a rename/refactor phase. No runtime state audit is required.

---

## Environment Availability

Phase 1 is a code/config-only change to three files (`index.html`, `styles.css`, `script.js`). No external tools, CLIs, databases, or runtimes are required beyond a browser for visual testing.

The site is deployed on Netlify. The existing `netlify.toml` is unchanged.

**External dependency audit:** SKIPPED — no external dependencies identified for this phase.

---

## Validation Architecture

`workflow.nyquist_validation` is `false` in `.planning/config.json` — this section is omitted per config.

---

## Security Domain

Phase 1 makes no changes to form handling, authentication, secrets, or network requests. The contact form's Netlify function integration is unchanged. No new security surface is introduced.

ASVS review: Not applicable for a CSS/HTML token and typography phase.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sections with SME body copy (#agents, #automations, social-section, #devops, #portfolio) are Phase 3 scope and not required to be fully cleaned in Phase 1 — only hero-level and structural SME language is Phase 1 scope | Codebase Delta Inventory | If FOUN-05 is interpreted strictly, those sections also need Phase 1 attention — planner should confirm scope boundary with REQUIREMENTS.md FOUN-05 wording: "Full SME language is audited and removed" vs. "no SMEs in hero" |
| A2 | The Gmail address hardcoded in script.js error handler (line 57) is acceptable as-is in Phase 1 since it only renders on form submission error and Phase 4 will update it with branded email | Codebase Delta Inventory | If the project owner considers script.js a Phase 1 audit target, this must also be updated — the fix is trivial (replace the string) |
| A3 | `font-family: Inter` already declared in body rule without a loaded font means the browser falls back to system font until Phase 1 adds the Google Fonts link — this is not a regression, it is the current state | Standard Stack | No risk — confirmed by inspection |

---

## Open Questions

1. **FOUN-05 scope boundary for body-copy sections**
   - What we know: Hero, nav, title, description, packages section, and structural elements (phone, metrics, Gmail in hero) are clearly Phase 1 audit targets per D-11 through D-14
   - What's unclear: Whether "SMEs" in h2 headings of the agents, social, and devops sections must be removed in Phase 1 or deferred to Phase 3 when those sections are redesigned
   - Recommendation: Remove them in Phase 1 — they are `h2` strings, not body copy rewrites; a 30-second find/replace; leaving them looks broken given everything else will be startup-native

2. **Old token references in section CSS below the header**
   - What we know: All component CSS in styles.css (cards, grids, sections) references old token names (`--ink`, `--cyan`, `--lime`, etc.) which will break when the `:root` block is replaced
   - What's unclear: Whether Phase 1 should update ALL old token references in styles.css (touching section CSS not yet redesigned) or only the token block + header section CSS
   - Recommendation: Update all references in one pass — this is safer than leaving the file in a broken intermediate state where some rules reference undefined variables

---

## Sources

### Primary (HIGH confidence)

- `CONTEXT.md` (01-CONTEXT.md) — All 14 implementation decisions; pre-locked, no alternatives needed
- `UI-SPEC.md` (01-UI-SPEC.md) — Full token block, typography scale, component specs, spacing scale, motion tokens, border radius — all values verified
- `index.html` (project codebase) — Direct read; all SME language instances counted and located by line
- `styles.css` (project codebase) — Direct read; existing token block, header bug, old color names, typography rules all verified
- `script.js` (project codebase) — Direct read; scroll handler, card spotlight color, canvas particle count all verified

### Secondary (MEDIUM confidence)

- `REQUIREMENTS.md` — Phase 1 requirements FOUN-01 through HEAD-03 confirmed; traceability table verified
- `CLAUDE.md` — Key design decisions table verified against CONTEXT.md decisions

### Tertiary (LOW confidence)

- None — all claims in this research are verified directly from codebase or locked design decisions.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — vanilla CSS/JS, no library choices required; all decisions pre-locked
- Architecture: HIGH — existing codebase fully read; all deltas mapped to specific lines
- Pitfalls: HIGH — active bugs confirmed in codebase (iOS Safari bug at styles.css line 63; non-passive scroll at script.js line 30; cyan card spotlight at script.js line ~123)
- Language audit: HIGH — confirmed 23 instances via grep across index.html and script.js

**Research date:** 2026-05-06
**Valid until:** 2026-06-06 (stable vanilla CSS conventions; no dependencies that could update)
