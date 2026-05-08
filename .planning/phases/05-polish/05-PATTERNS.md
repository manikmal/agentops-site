# Phase 5: Polish - Pattern Map

**Mapped:** 2026-05-08
**Files analyzed:** 5 (3 existing modifications + 2 new assets)
**Analogs found:** 3 / 3 modifiable files (new asset files have no code analog)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `index.html` | config/markup | request-response | `index.html` itself (existing `<head>`) | self-reference |
| `styles.css` | config/style | transform | `styles.css` existing `@media` blocks | self-reference |
| `script.js` | utility | event-driven | `script.js` existing `matchMedia` checks | self-reference |
| `wordmark.svg` | asset | — | `favicon.svg` (existing inline SVG asset) | role-match |
| `og-image.png` | asset | — | No code analog — design spec only | no analog |

---

## Pattern Assignments

### `index.html` — `<head>` block (og: meta + preload hints)

**Analog:** `index.html` lines 1–21 (existing head)

**Existing head pattern** (lines 1–21):
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses.">
<title>AgentOps Studio | AI Engineering for Founders &amp; Growing Teams</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
```

**Insert og: block immediately after `<meta name="description">` (after line 6). Pattern to add:**
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://agentopsstudio.com/">
<meta property="og:title" content="AgentOps Studio | AI Engineering for Founders &amp; Growing Teams">
<meta property="og:description" content="End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses.">
<meta property="og:image" content="https://agentopsstudio.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AgentOps Studio | AI Engineering for Founders &amp; Growing Teams">
<meta name="twitter:description" content="End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses.">
<meta name="twitter:image" content="https://agentopsstudio.com/og-image.png">
```

**Insert preload hints immediately after the preconnect links (after line 19). Pattern to add:**
```html
<link rel="preload" as="image" href="wordmark.svg">
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" as="style">
```

**wordmark reference change — two locations:**
- Line 28: `<img src="wordmark.png" ...>` → `<img src="wordmark.svg" ...>` (header `.brand-wordmark`)
- Line 47: `<img src="wordmark.png" ...>` → `<img src="wordmark.svg" ...>` (hero `.hero-wordmark`)

Note: `mix-blend-mode: screen` on `.brand-wordmark` (styles.css line 181) is already set — SVG will render cleanly through it. Remove or keep; SVG does not need blend mode correction the way the raster did.

---

### `index.html` — header HTML structure (mobile CTA relocation)

**Analog:** `index.html` lines 24–40 (existing `.site-header`)

**Current structure** (lines 24–40):
```html
<div class="header-positioner" data-header>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="AgentOps Studio home">
      <img src="favicon.svg" alt="" class="brand-icon" aria-hidden="true" width="36" height="36">
      <img src="wordmark.png" alt="AgentOps Studio" class="brand-wordmark">
    </a>
    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" data-nav>
      <a class="nav-link" href="#services">Services</a>
      <a class="nav-link" href="#portfolio">Work</a>
      <a class="nav-link" href="#process">Process</a>
      <a class="nav-link" href="#about">About</a>
      <a class="nav-link" href="#contact">Contact</a>
    </nav>
    <a class="btn-primary btn-book-call" href="#contact">Book a call</a>
  </header>
</div>
```

**Target structure** — move `.btn-book-call` between `.brand` and `.nav-toggle`:
```html
<div class="header-positioner" data-header>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="AgentOps Studio home">
      <img src="favicon.svg" alt="" class="brand-icon" aria-hidden="true" width="36" height="36">
      <img src="wordmark.svg" alt="AgentOps Studio" class="brand-wordmark">
    </a>
    <a class="btn-primary btn-book-call" href="#contact">Book a call</a>
    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" data-nav>
      <a class="nav-link" href="#services">Services</a>
      <a class="nav-link" href="#portfolio">Work</a>
      <a class="nav-link" href="#process">Process</a>
      <a class="nav-link" href="#about">About</a>
      <a class="nav-link" href="#contact">Contact</a>
    </nav>
  </header>
</div>
```

The `.site-header` is already `display: flex; align-items: center; justify-content: space-between` — inserting `.btn-book-call` between `.brand` and `.nav-toggle` places it in the correct DOM order. CSS needs a corresponding rule to keep it visible at ≤940px and hide the desktop-only nav copy (see styles.css section below).

---

### `styles.css` — `@media (prefers-reduced-motion: reduce)` (lines 594–611)

**Analog:** existing block, styles.css lines 594–611

**Current block:**
```css
@media (prefers-reduced-motion: reduce) {
  .logo-strip {
    overflow: visible;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 24px;
    gap: 10px;
  }
  .marquee-track {
    animation: none;
    display: contents;
  }
  .scarcity-dot,
  .flow-row.active .flow-dot {
    animation: none;
  }
}
```

**Pattern to extend** — insert `*` kill-all rule at the TOP of the block (before `.logo-strip`):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
  /* existing rules follow unchanged — they become redundant but are harmless */
  .logo-strip {
    overflow: visible;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 24px;
    gap: 10px;
  }
  .marquee-track {
    animation: none;
    display: contents;
  }
  .scarcity-dot,
  .flow-row.active .flow-dot {
    animation: none;
  }
}
```

---

### `styles.css` — mobile CTA override at ≤940px

**Analog:** existing `@media (max-width: 940px)` block, styles.css lines 970–1021

**Existing 940px pattern to follow:**
```css
@media (max-width: 940px) {
  .site-header {
    align-items: stretch;
  }
  .nav-toggle {
    display: inline-flex;
    align-items: center;
  }
  .site-nav {
    position: absolute;
    top: calc(100% + 8px);
    /* ... dropdown positioning */
    display: none;
  }
  .site-nav.is-open {
    display: flex;
  }
}
```

**Pattern to ADD inside existing 940px block** — compact mobile CTA:
```css
@media (max-width: 940px) {
  /* ... existing rules ... */

  /* Mobile CTA: always visible, compact — D-06/D-07 */
  .btn-book-call {
    padding: 8px 12px;
    font-size: 0.8125rem; /* 13px */
    margin-left: auto;    /* push to right edge before .nav-toggle */
  }
}
```

Note: the `margin-left: auto` only applies if `.btn-book-call` is between `.brand` and `.nav-toggle` in the DOM. At desktop widths `.site-header` uses `justify-content: space-between` which naturally distributes items; the auto margin is the mobile-only override. If layout spacing needs tuning, adjust `.site-header` gap at ≤940px.

**Desktop state** — `.btn-book-call` is currently not hidden at any breakpoint in the existing CSS. After the DOM move (brand → btn-book-call → toggle → nav), the button will be visible at all widths. No `display:none` toggle needed.

---

### `styles.css` — `.brand-wordmark` SVG adjustment

**Analog:** styles.css lines 177–182 (existing `.brand-wordmark`)

**Current rule:**
```css
.brand-wordmark {
  display: block;
  height: 44px;
  width: auto;
  mix-blend-mode: screen;
}
```

**Pattern note:** `mix-blend-mode: screen` was needed for the PNG to knock out its white background. SVG has a transparent background by default — `mix-blend-mode: screen` should be removed or changed to `normal` once `wordmark.svg` is in place. This is a 1-line change within the existing rule.

---

### `script.js` — canvas prefers-reduced-motion gate (lines 302–314)

**Current init block** (lines 301–314):
```js
// Deferred init via requestIdleCallback per D-17; setTimeout fallback for Safari
if (canvas && context) {
  const initCanvas = () => {
    resizeCanvas();
    cancelAnimationFrame(animationFrame);
    drawNetwork();
    window.addEventListener("resize", debounce(resizeCanvas, 180));
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);
  }
}
```

**Finding:** There is NO `prefers-reduced-motion` guard on this block. `drawNetwork()` starts the rAF loop unconditionally whenever `canvas && context` is truthy. The counter guard at line 116 uses the correct pattern but is not applied here.

**Analog pattern** — counter guard at line 116:
```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

**Existing marquee guard at line 8:**
```js
if (marqueeTrack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
```

**Fix pattern** — wrap canvas init block:
```js
if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const initCanvas = () => {
    resizeCanvas();
    cancelAnimationFrame(animationFrame);
    drawNetwork();
    window.addEventListener("resize", debounce(resizeCanvas, 180));
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);
  }
}
```

Also check the `visibilitychange` resume handler at lines 326–329 — it re-calls `drawNetwork()` without a reduced-motion check:
```js
} else if (canvas && context) {
  cancelAnimationFrame(animationFrame);
  drawNetwork();
}
```
This should also be guarded:
```js
} else if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  cancelAnimationFrame(animationFrame);
  drawNetwork();
}
```

---

### `wordmark.svg` — NEW file

**Analog:** `favicon.svg` (existing SVG asset in repo root — same role: brand mark asset, vector format)

**Design spec (from D-01, Specifics):**
- "AgentOps" in `#7c5cfc` (var(--color-accent) value), "Studio" in `#f4f4f5` (var(--color-text-primary) value)
- Inter font, same as body
- Single-line layout, proportioned to fit 36–40px header height
- SVG must be self-contained (embed or reference font) so it renders correctly as an `<img>` tag (not inline SVG)
- Since Inter is a Google Font (not embedded), use `font-family: 'Inter', sans-serif` with a web-safe fallback — renders correctly when page has already loaded Inter; for the SVG-as-img case the SVG text must convert to paths or use a system-safe fallback

**Implementation note:** SVGs loaded via `<img src>` do NOT inherit page fonts. Two options:
1. Convert text to paths (zero font dependency, always sharp)
2. Embed font-face data URI inside the SVG (larger file, guaranteed render)

Option 1 (paths) is the correct pattern for a production wordmark SVG. The planner should note that the SVG must be path-converted, not rendered as live text.

**Structural pattern (SVG shell):**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 [W] [H]" role="img" aria-label="AgentOps Studio">
  <title>AgentOps Studio</title>
  <!-- path data for "AgentOps" in #7c5cfc -->
  <!-- path data for "Studio" in #f4f4f5 -->
</svg>
```

---

### `og-image.png` — NEW file

**No code analog.** This is a static raster asset, not a code file.

**Design spec (from D-04, Specifics):**
- Dimensions: 1200×630px
- Background: `#0a0a0b`
- Primary text: "AgentOps Studio" in Inter, large size, centered
- "AgentOps" portion in `#7c5cfc`, "Studio" in `#f4f4f5`
- Subtitle: "AI Engineering for Founders & Growing Teams." in `#a1a1aa`
- Violet accent element (logo mark or horizontal rule) for visual interest
- Export as PNG (not JPEG) to avoid compression artifacts on text

---

## Shared Patterns

### CSS Token Usage
**Source:** `styles.css` lines 1–70 (design tokens block)
**Apply to:** All new CSS rules in this phase
```css
/* Use tokens, never bare hex */
var(--color-accent)          /* #7c5cfc — violet */
var(--color-text-primary)    /* #f4f4f5 — white */
var(--color-text-secondary)  /* #a1a1aa */
var(--color-bg)              /* #0a0a0b */
var(--duration-fast)         /* 150ms */
var(--duration-base)         /* 250ms */
var(--ease-out)              /* cubic-bezier(0.16, 1, 0.3, 1) */
var(--radius-md)
var(--radius-full)
```

### iOS Safari — backdrop-filter / transform separation
**Source:** `CLAUDE.md` Key Design Decisions + `styles.css` lines 139–153
**Apply to:** Any new element with glassmorphism or animation
```css
/* OUTER: only transform/positioning — NO visual properties */
.header-positioner { ... }

/* INNER: all visual styles — NO transform ever */
.site-header {
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  /* transition is ok; transform is forbidden on this element */
}
```
**Rule:** Never add `transform` to `.site-header` or any element that also has `backdrop-filter`.

### CSS Media Query Order
**Source:** `styles.css` lines 970–1059
**Apply to:** Any new breakpoint rules in Phase 5
```css
/* Order: desktop-first, descending breakpoints, at BOTTOM of file */
@media (max-width: 940px) { ... }
@media (max-width: 640px) { ... }
/* New rules added INSIDE existing blocks or after 640px block */
```

### matchMedia Pattern (JS)
**Source:** `script.js` lines 8 and 116
**Apply to:** All new JS checks for reduced-motion
```js
// Inline negated guard (for block-level init):
if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }

// Early-return guard (for function bodies):
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `og-image.png` | asset | — | Static raster; no code pattern applicable |

---

## Key Finding — Canvas Animation Bug

The canvas `requestIdleCallback` init block at `script.js` lines 302–314 **lacks a `prefers-reduced-motion` guard**. `drawNetwork()` starts the rAF loop unconditionally. This contradicts CONTEXT.md D-09 which states "the canvas animation is already gated" — it is NOT currently gated at the init level (only the counter function at line 116 is gated). The planner must include a fix for this as part of the script.js task.

The `visibilitychange` resume handler at lines 326–329 has the same issue.

---

## Metadata

**Analog search scope:** repo root (`index.html`, `styles.css`, `script.js`, `favicon.svg`)
**Files scanned:** 4 source files
**Pattern extraction date:** 2026-05-08
