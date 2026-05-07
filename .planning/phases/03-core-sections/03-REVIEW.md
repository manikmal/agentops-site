---
phase: 03-core-sections
reviewed: 2026-05-07T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - index.html
  - script.js
  - styles.css
findings:
  critical: 4
  warning: 6
  info: 4
  total: 14
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-07
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three files were reviewed: the single-page HTML entry point, the vanilla JS module, and the CSS stylesheet. The implementation is largely coherent and respects the project's key constraints (backdrop-filter isolation, particle cap, violet accent, no framework). However, four blockers were found — two of which cause visible rendering failures (broken Unsplash images, double rAF loop on tab restore), one is a security concern (XSS vector in form error path), and one is a nav dead-link that silently misdirects users. Six warnings cover correctness edge cases (NaN counter animation, canvas off-by-one rendering, agent trace leak, unreachable CSS rules, etc.). Four info items cover dead CSS, a hardcoded out-of-system color, and an external link missing `noopener`.

---

## Critical Issues

### CR-01: All four portfolio images are broken — malformed Unsplash URLs

**File:** `index.html:203-227`
**Issue:** All four `<img>` `src` values use the pattern `https://images.unsplash.com/photo-<slug>?...` where the slug is a truncated, non-standard Unsplash photo ID. Unsplash direct image URLs follow the format `https://images.unsplash.com/photo-<19-char-id>?...`. The slugs used here (`iar-afB0QQw`, `M5tzZtFCOfs`, `IgUR1iX0mqM`, `hpjSkU2UYSU`) are either malformed or missing the required leading `1` prefix (Unsplash IDs begin with a timestamp-derived number). Every image will return a 404, leaving four prominent portfolio cards with broken image placeholders in the hero area of the page.

**Fix:** Replace with correct Unsplash source URLs, or use the Unsplash API endpoint format:
```html
<!-- Pattern: https://images.unsplash.com/photo-{VALID_19_CHAR_ID}?auto=format&fit=crop&w=900&q=80 -->
<!-- Example real IDs from Unsplash: -->
<img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
     alt="Abstract data visualization on a dark screen" loading="lazy" width="900" height="190">
```
Verify each ID returns a 200 before shipping. Alternatively, serve locally-hosted images to remove the Unsplash dependency entirely.

---

### CR-02: XSS injection vector in form error handler via `innerHTML`

**File:** `script.js:79`
**Issue:** On fetch failure, the error branch writes to `formStatus.innerHTML` using a template literal that interpolates the `email` variable:
```js
formStatus.innerHTML = `Something went wrong. Please email <a href="mailto:${email}">${email}</a>.`;
```
The `email` constant is hardcoded on line 77 (`const email = "manikmalhotra6@gmail.com"`), so in this specific code path it is not attacker-controlled. However, using `innerHTML` with any interpolated value is an established bad pattern that invites future regression the moment `email` is ever sourced from user input, a config object, or an environment variable. The `data-form-status` element already carries `role="status"` and `aria-live="polite"` — its content should be set via safe DOM methods.

**Fix:**
```js
// Replace the innerHTML line with:
formStatus.textContent = "Something went wrong. Please email ";
const link = document.createElement("a");
link.href = `mailto:${email}`;
link.textContent = email;
formStatus.appendChild(link);
formStatus.appendChild(document.createTextNode("."));
```

---

### CR-03: `drawNetwork` fires twice on tab restore, creating a runaway double rAF loop

**File:** `script.js:303-309`
**Issue:** The `visibilitychange` handler on document restore calls `cancelAnimationFrame(animationFrame)` and then immediately calls `drawNetwork()` (line 308). `drawNetwork()` itself schedules `requestAnimationFrame(drawNetwork)` at its last line (line 267), storing the frame ID in `animationFrame`. But the `cancelAnimationFrame` call on the line before `drawNetwork()` cancels the *already-cancelled-or-stale* frame, not the new one about to be scheduled. More critically: if the canvas animation was never paused correctly (e.g., `animationFrame` was `0` or stale), two concurrent rAF loops can run — one from the resume path and one from any prior incomplete cancel. On low-end devices this causes a visible flicker doubling of the particle animation.

The correct pattern is to cancel, null-out the ID, then restart via the same guarded entry point used in `initCanvas`.

**Fix:**
```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  } else if (canvas && context && animationFrame === 0) {
    drawNetwork();
  }
});
```

---

### CR-04: "Process" and "About" nav links point to `#contact` — silent dead navigation

**File:** `index.html:34-35`
**Issue:** Two nav items labelled "Process" and "About" both use `href="#contact"`:
```html
<a class="nav-link" href="#contact">Process</a>
<a class="nav-link" href="#contact">About</a>
```
There is no `id="process"` or `id="about"` in the document (the process section is `<section class="section process-section">` with no ID, and there is no About section at all). Clicking either link scrolls to the contact form — incorrect behavior that misleads users who expect to navigate to a process or about section. Additionally, the `sectionObserver` that drives active-link highlighting only observes `section[id]` elements (script.js:51), so neither link will ever receive `is-active` styling even when the process section is in view.

**Fix — immediate:** Either add IDs to the sections and point the nav links correctly, or remove the placeholder links until the sections exist:
```html
<!-- Option A: wire to real section -->
<a class="nav-link" href="#process">Process</a>

<!-- In index.html, add id to the process section: -->
<section class="section process-section" id="process">

<!-- Option B: remove until section exists -->
<!-- Delete the "About" nav link entirely for now -->
```

---

## Warnings

### WR-01: `mouse` object declared after `drawNetwork` — temporal coupling risk

**File:** `script.js:195-270`
**Issue:** `drawNetwork()` (line 195) references the `const mouse` variable declared on line 270. This works at runtime only because `drawNetwork` is called asynchronously (via `requestAnimationFrame` and `requestIdleCallback`), not at parse time. If the call order is ever changed — for example, if `drawNetwork` is called synchronously during testing or module evaluation order changes — a `ReferenceError` will be thrown because `const` is not hoisted. This is a fragile temporal dependency with no syntactic enforcement.

**Fix:** Move the `const mouse = { x: -999, y: -999 }` declaration to line 163, immediately after the `let animationFrame = 0` declaration and before `resizeCanvas` / `drawNetwork`.

---

### WR-02: Counter animation fires with `NaN` if `data-counter-start` attribute is absent

**File:** `script.js:107-108`
**Issue:** `animateCounter` reads `el.dataset.counterStart` and parses it with `parseInt`. If any element in the DOM matched by `[data-counter-end]` lacks a `data-counter-start` attribute, `parseInt(undefined, 10)` returns `NaN`. The computed `value` in the `tick` function becomes `NaN`, and `el.textContent` is set to `"NaN<suffix>"` — a visible regression. No HTML elements in the current `index.html` use `data-counter-end`, so the bug is dormant but will surface when counters are added in a future phase.

**Fix:**
```js
const start = parseInt(el.dataset.counterStart ?? "0", 10);
const end   = parseInt(el.dataset.counterEnd,          10);
if (isNaN(end)) return;   // guard: nothing to animate
```

---

### WR-03: Canvas `drawNetwork` clears with `clientWidth/clientHeight` but was sized with `getBoundingClientRect` — off-by-one on non-integer DPR displays

**File:** `script.js:197-202`
**Issue:** `resizeCanvas` sizes the canvas backing store using `canvas.getBoundingClientRect()` (which returns fractional CSS pixels on high-DPI displays) multiplied by `devicePixelRatio`, then calls `context.setTransform` to scale back to CSS coordinates. However, `drawNetwork` reads `canvas.clientWidth` and `canvas.clientHeight` (integer CSS pixels, possibly rounded down by 1px on fractional-width displays) for `clearRect` and the fill. On a device where the canvas CSS width is 799.5px, `clientWidth` reports 799 but the backing store was sized to `ceil(799.5 * dpr)`. This leaves a 1-pixel strip on the right/bottom edge that is never cleared each frame, producing a faint artifact column.

**Fix:** Store layout dimensions at resize time and use them in `drawNetwork` instead of re-querying `clientWidth`:
```js
let canvasWidth = 0, canvasHeight = 0;

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  canvasWidth  = bounds.width;
  canvasHeight = bounds.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = Math.floor(bounds.width  * ratio);
  canvas.height = Math.floor(bounds.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(canvasWidth, canvasHeight);
}

// In drawNetwork, replace:
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
// with:
//   const width = canvasWidth;
//   const height = canvasHeight;
```

---

### WR-04: Agent trace `traceTimeout` is never cleared on tab hide or page unload

**File:** `script.js:347, 303-315`
**Issue:** The canvas animation correctly cancels its rAF loop on `visibilitychange` (hidden) and `pagehide`. The agent trace animation uses `setTimeout`-chained calls stored in `traceTimeout`, but these are never cancelled on document hide or page unload. When the user switches tabs, `setTimeout` callbacks continue firing in the background (browsers throttle them to ~1s minimum, but do not stop them). On return the trace may be mid-cycle with stale state. On `pagehide`, the dangling timers are a minor resource concern.

**Fix:** Add cleanup alongside the existing canvas cleanup:
```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    clearTimeout(traceTimeout);   // add this
    clearInterval(elapsedInterval); // add this
  } else if (canvas && context && animationFrame === 0) {
    drawNetwork();
    // optionally restart trace here
  }
});
```
Note: `traceTimeout` and `elapsedInterval` are scoped inside the `if (consoleEl)` block. Either hoist them to module scope or move the cleanup logic inside that block.

---

### WR-05: `.btn-primary` overrides `.btn` sizing — nav "Book a call" button renders smaller than the hero CTA

**File:** `styles.css:410-431`
**Issue:** `.btn` sets `min-height: 48px` and `padding: 12px 18px` (lines 412, 417). `.btn-primary` then overrides with `padding: var(--space-2) var(--space-4)` which is `8px 16px` (line 425) — significantly less tall. Elements using both classes (e.g., the hero buttons `<a class="btn btn-primary">`) get the `.btn-primary` padding, defeating the 48px touch-target minimum set by `.btn`. The header "Book a call" uses only `.btn-primary` (no `.btn`), resulting in an even smaller target.

The 48px minimum is a WCAG 2.5.5 (AAA) / 2.5.8 (AA, WCAG 2.2) touch target requirement. On mobile this makes the primary CTA under-tappable.

**Fix:** Reconcile the two classes. Either merge the base styles into `.btn-primary`, or remove the padding/min-height override in `.btn-primary` and rely on `.btn` for sizing:
```css
.btn-primary {
  color: #ffffff;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  /* Remove the padding override; inherit from .btn */
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}
```

---

### WR-06: `outline: none` on form inputs with no `focus-visible` replacement fails keyboard users

**File:** `styles.css:808`
**Issue:** `.contact-form input, .contact-form textarea` has `outline: none` (line 808). The only focus indicator provided is a `border-color` change on `:focus` (lines 811-813). However, the border uses `rgba(255,255,255,0.28)` on a dark surface — the contrast ratio between this border and the `rgba(255,255,255,0.18)` default border is negligible (both are near-white at low opacity on dark). Keyboard users navigating the form have no clearly visible focus ring, which is a WCAG 2.4.7 (Level AA) failure.

**Fix:** Replace with `focus-visible` and provide a higher-contrast indicator:
```css
.contact-form input,
.contact-form textarea {
  /* remove: outline: none; */
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.contact-form input:focus-visible,
.contact-form textarea:focus-visible {
  outline-color: var(--color-accent);
  border-color: var(--color-border-focus);
}
```

---

## Info

### IN-01: Hardcoded `#007d80` color on `.portfolio-card span` bypasses the design token system

**File:** `styles.css:765`
**Issue:** `.portfolio-card span` uses `color: #007d80` — a dark teal that appears nowhere in the design token definitions. The project's accent for contextual labels (eyebrows, category tags) consistently uses `var(--color-cyan)` (`#22d3ee`). This hardcoded value is darker and will render at lower contrast against the `var(--color-surface-2)` card background than the established token. It also creates a maintenance hazard — a future theme change won't reach this value.

**Fix:**
```css
.portfolio-card span {
  margin-bottom: 12px;
  color: var(--color-cyan); /* was: #007d80 */
}
```

---

### IN-02: Dead CSS rules for classes absent from the HTML (`.split-copy`, `.direct-contact`, `.hero-contact-links`, `.hero-metrics`)

**File:** `styles.css:342-344, 393-408, 449-466, 786-791`
**Issue:** The following CSS selectors have no matching elements in `index.html`:
- `.split-copy p` (line 343)
- `.hero-contact-links` (lines 393-396)
- `.hero-contact-links a`, `.direct-contact a` (lines 397-401)
- `.hero-metrics` (lines 449-466), `.hero-metrics span`, `.hero-metrics strong`
- `.direct-contact` (lines 786-791)

These appear to be residue from a prior design iteration. They add dead weight and create confusion when reading the stylesheet.

**Fix:** Remove all rules for selectors that have no current HTML counterparts. Retain in a comment or separate branch if they are planned for a future phase.

---

### IN-03: LinkedIn `target="_blank"` link uses `rel="noreferrer"` but not `rel="noopener"`

**File:** `index.html:302`
**Issue:** `rel="noreferrer"` implies `noopener` in all modern browsers, so this is not a security gap today. However, in older browsers (pre-2021 Safari, some Android WebViews) `noreferrer` did not guarantee `noopener` behavior. Best practice is to include both explicitly for clarity and maximum compatibility.

**Fix:**
```html
<a href="https://www.linkedin.com/in/manik-malhotra-9478617b/"
   target="_blank"
   rel="noopener noreferrer">LinkedIn</a>
```

---

### IN-04: First `.portfolio-card img` rule sets `min-height: 280px` then the second rule overrides to `min-height: 190px` — duplicate selector block

**File:** `styles.css:680-685, 758-761`
**Issue:** There are two separate `.portfolio-card img` rule blocks. The first (line 680) sets `height: 100%` and `min-height: 280px`. The second (line 758) sets `height: 190px` and `min-height: 190px`. The second block wins due to cascade order, making the first block's `min-height: 280px` unreachable dead code. This is confusing when tracing image sizing and suggests an incomplete merge of design iterations.

**Fix:** Consolidate into a single `.portfolio-card img` rule:
```css
.portfolio-card img {
  width: 100%;
  height: 190px;
  min-height: 190px;
  object-fit: cover;
}
```

---

_Reviewed: 2026-05-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
