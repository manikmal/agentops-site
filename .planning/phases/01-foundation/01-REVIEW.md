---
phase: 01-foundation
reviewed: 2026-05-07T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - index.html
  - script.js
  - styles.css
findings:
  critical: 4
  warning: 7
  info: 4
  total: 15
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-07
**Depth:** standard
**Files Reviewed:** 3 (+ `netlify/functions/lead-to-slack.js` examined as cross-referenced dependency)
**Status:** issues_found

## Summary

The foundation layer is structurally sound — HTML semantics are clean, the iOS Safari `backdrop-filter`/`transform` split is correctly implemented, and the Netlify function handles the happy path safely. However four blockers were found: particle counts and the O(n²) line-drawing loop both violate explicit CLAUDE.md constraints; the canvas animation runs unconditionally despite `prefers-reduced-motion`; and a `formStatus.innerHTML` assignment directly injects a hardcoded URL string, creating an XSS surface. Seven warnings cover a range of robustness issues from a resize handler that rebuilds particles on every resize event to missing `noopener` on the LinkedIn link, a broken header CTA that is sized incorrectly, and unreferenced dead code. Four info items cover design-token drift and dead CSS selectors.

---

## Critical Issues

### CR-01: Canvas particle counts violate CLAUDE.md constraint (both mobile and desktop)

**File:** `script.js:167`
**Issue:** CLAUDE.md explicitly states "≤40 particles." The implementation creates 42 particles on mobile (`width < 720`) and 82 on desktop. Both values exceed the documented limit.
**Fix:**
```js
const count = width < 720 ? 20 : 40;
```

---

### CR-02: O(n²) line-drawing loop violates CLAUDE.md constraint

**File:** `script.js:219–237`
**Issue:** CLAUDE.md explicitly states "no O(n²) line-drawing." The nested `for (let i …) for (let j = i+1 …)` loop runs every animation frame, producing 861 pair-checks at 42 particles and 3,321 at 82. At 60 fps on desktop this is ~200,000 distance calculations per second, running in the main thread.
**Fix:** Use a spatial grid or simply draw lines only from each particle to its nearest fixed number of neighbours (e.g. 3), or remove the connector lines entirely as the design spec does not mention them. Minimum acceptable fix to satisfy the constraint is reducing particles to ≤40 (see CR-01) and capping the inner loop range (e.g. compare only adjacent 10 particles, not all pairs).

---

### CR-03: Canvas `drawNetwork` runs unconditionally — ignores `prefers-reduced-motion`

**File:** `script.js:263–267`
**Issue:** `drawNetwork()` is called unconditionally whenever `canvas && context` is truthy. The marquee and counter animations both guard against `prefers-reduced-motion: reduce`, but the canvas animation — the most visually intense effect on the page — does not. Users with vestibular disorders will see a continuously animating particle field regardless of their OS accessibility setting.
**Fix:**
```js
if (canvas && context) {
  resizeCanvas();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawNetwork();
  }
  window.addEventListener("resize", resizeCanvas);
}
```

---

### CR-04: `formStatus.innerHTML` with a user-controlled email string — XSS surface

**File:** `script.js:79`
**Issue:** On fetch failure the error handler sets `formStatus.innerHTML` using a template literal that embeds the hardcoded string `"manikmalhotra6@gmail.com"`. The email value is currently a string literal, so there is no runtime injection risk today. However, the pattern establishes `innerHTML` as the output mechanism for the status element. If the email constant is ever driven from a server response, environment variable, or config object — which is the natural refactoring path — the XSS protection disappears with no visible change at the call site. The adjacent success path correctly uses `textContent`.

Additionally, the error path hard-codes the personal Gmail address. CLAUDE.md lists "branded email address — Gmail should only appear in footer" as a pre-launch blocker; this codepath puts it front-and-center during form errors.

**Fix:** Use `textContent` and construct the link separately via DOM APIs, or use a template with a safe anchor creation:
```js
// Replace lines 78-81
if (formStatus) {
  formStatus.textContent = "Something went wrong. Please email us directly.";
  const link = document.createElement("a");
  link.href = `mailto:${email}`;
  link.textContent = email;
  formStatus.append(" ", link, ".");
}
```

---

## Warnings

### WR-01: `resizeCanvas()` rebuilds entire particle array on every resize event — no debounce

**File:** `script.js:156–164, 266`
**Issue:** `resizeCanvas` calls `createParticles(bounds.width, bounds.height)` which discards and recreates all particles. The handler is attached with `window.addEventListener("resize", resizeCanvas)` — no debounce. Rapidly firing resize events (window drag, virtual keyboard open/close on mobile) will thrash garbage collection on every frame. The canvas `width`/`height` reassignment also resets the transform, causing a single-frame flash.
**Fix:** Debounce the resize handler and separate `resizeCanvas` (geometry only) from `createParticles` (only call when size class changes):
```js
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 150);
});
```

---

### WR-02: `drawNetwork` reads canvas logical size via `clientWidth`/`clientHeight` each frame instead of cached values

**File:** `script.js:185–186`
**Issue:** `canvas.clientWidth` and `canvas.clientHeight` are layout-querying properties. Reading them inside a `requestAnimationFrame` loop forces a layout read on every frame. These values should be cached on resize and read from variables.
**Fix:**
```js
let canvasW = 0, canvasH = 0;
// inside resizeCanvas():
canvasW = bounds.width;
canvasH = bounds.height;
// inside drawNetwork(), replace canvas.clientWidth / canvas.clientHeight:
context.clearRect(0, 0, canvasW, canvasH);
// ... use canvasW / canvasH throughout
```

---

### WR-03: Header "Book a call" CTA is missing the `.btn` base class — renders at wrong size

**File:** `index.html:38`
**Issue:** `<a class="btn-primary btn-book-call" href="#contact">Book a call</a>` has only `.btn-primary` and not the `.btn` base class. `.btn` sets `display: inline-flex`, `min-height: 48px`, `align-items: center`, and `padding: 12px 18px`. `.btn-primary` overrides `padding` to `var(--space-2) var(--space-4)` (8px 16px) and does not set `display` or `min-height`, so the header CTA renders as an inline element with smaller padding than the hero buttons. All other CTAs (`hero`, `form submit`) correctly use `class="btn btn-primary"`.
**Fix:**
```html
<a class="btn btn-primary btn-book-call" href="#contact">Book a call</a>
```

---

### WR-04: LinkedIn external link missing `rel="noopener"`

**File:** `index.html:330`
**Issue:** `<a href="https://..." target="_blank" rel="noreferrer">` uses only `noreferrer`. While `noreferrer` implies `noopener` in modern browsers, the explicit `noopener` is the defence-in-depth form and is required by standard security guidance. The two attributes serve different purposes: `noreferrer` suppresses the `Referer` header; `noopener` prevents the opened page from accessing `window.opener`. Using only `noreferrer` is fragile against older browser implementations.
**Fix:**
```html
<a href="https://www.linkedin.com/in/manik-malhotra-9478617b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
```

---

### WR-05: `smooth scroll-behavior` not suppressed under `prefers-reduced-motion`

**File:** `styles.css:99`
**Issue:** `html { scroll-behavior: smooth; }` applies unconditionally. WCAG 2.1 SC 2.3.3 (AAA) and the broader reduced-motion best practice require this to be disabled when the user has requested reduced motion. The `prefers-reduced-motion` block at line 548 handles marquee and reveal animations but omits scroll behaviour.
**Fix:** Add to the existing `@media (prefers-reduced-motion: reduce)` block:
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  /* existing rules… */
}
```

---

### WR-06: `animateCounter` silently does nothing when `data-counter-start` is missing or NaN

**File:** `script.js:107–108`
**Issue:** `parseInt(el.dataset.counterStart, 10)` returns `NaN` if the attribute is absent. `NaN` propagates silently through the arithmetic — `start + (end - start) * easeOut(progress)` yields `NaN`, `Math.round(NaN)` returns `NaN`, and the element's `textContent` is set to `"NaN"` (plus suffix). No `data-counter-end` elements exist in the current HTML, so this is dormant today, but the observer is wired and ready.
**Fix:**
```js
const start = parseInt(el.dataset.counterStart ?? "0", 10);
const end = parseInt(el.dataset.counterEnd, 10);
if (isNaN(start) || isNaN(end)) return;
```

---

### WR-07: Particle colours use raw `rgba` literals that contradict the design-token system

**File:** `script.js:229, 240`
**Issue:** The canvas draws connector lines in `rgba(4, 217, 217, …)` (a cyan approximation) and particles in `rgba(164, 246, 63, 0.8)` (lime green). The design specification in CLAUDE.md uses violet (`#7c5cfc`) as the primary accent and defines `--cyan-400: #22d3ee` as the signal cyan. Neither of the canvas colours matches any declared design token, and lime green contradicts the Linear.app-inspired dark-technical aesthetic entirely. This makes the canvas visually jarring against the rest of the page.
**Fix:** Replace with values consistent with the token system:
```js
// Line 229 — connector lines
context.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.28})`;
// Line 240 — particle fill
context.fillStyle = "rgba(124, 92, 252, 0.7)";
```

---

## Info

### IN-01: `.package-card` is referenced in `script.js` spotlight handler but does not exist anywhere

**File:** `script.js:138`
**Issue:** `document.querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card")` includes `.package-card`. This class is defined neither in `styles.css` nor in `index.html`. The `querySelectorAll` call silently returns zero matching nodes for that selector fragment. This is dead code indicating a removed feature or forward-reference.
**Fix:** Remove `.package-card` from the selector string, or add the class when the "packages" section is built.

---

### IN-02: `portfolio-card span` uses a hardcoded hex colour outside the design token system

**File:** `styles.css:724`
**Issue:** `.portfolio-card span { color: #007d80; }` is a dark teal value not defined in any CSS custom property. Every other colour on the page uses `var(--…)` references. This value is also different from the declared `--cyan-400: #22d3ee` and may not pass WCAG contrast against the card background (`--color-surface-2: #18181b`).
**Fix:** Map to the nearest token or define a new one:
```css
.portfolio-card span {
  color: var(--color-cyan); /* or define --color-teal: #007d80 in :root */
}
```

---

### IN-03: Gmail address is hardcoded as fallback in `script.js` — conflicts with CLAUDE.md pre-launch blocker

**File:** `script.js:77`
**Issue:** `const email = "manikmalhotra6@gmail.com"` is used in the form error fallback. CLAUDE.md explicitly lists "Gmail should only appear in footer" as a pre-launch blocker. This constant will need updating before launch; having it hard-coded in a JS file rather than derived from the footer's `mailto:` link means there are two places to update.
**Fix:** Either read the email from the footer's existing `mailto:` anchor at runtime, or extract it to a single constant at the top of `script.js` shared with any other references.

---

### IN-04: `.btn-primary` redefines `padding` and `border-radius` from the `.btn` base class — creates two divergent button appearances

**File:** `styles.css:388–425`
**Issue:** `.btn` sets `border-radius: var(--radius-md)` (8px) and `padding: 12px 18px`. `.btn-primary` then overrides both: `border-radius: var(--radius-full)` (pill) and `padding: var(--space-2) var(--space-4)` (8px 16px). The result is that any element with both classes (every hero/form button) gets pill shape and smaller padding than intended by `.btn`, making the base class definition misleading. This creates silent coupling — changing `.btn` padding has no effect on primary buttons.
**Fix:** Either move the base sizing into `.btn-primary` and remove it from `.btn`, or restructure `.btn` to be a pure layout class (display, align, justify) without opinionated size/shape values that `.btn-primary` must undo.

---

_Reviewed: 2026-05-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
