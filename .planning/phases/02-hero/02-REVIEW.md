---
phase: 02-hero
reviewed: 2026-05-07T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - index.html
  - script.js
  - styles.css
findings:
  critical: 2
  warning: 6
  info: 4
  total: 12
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-05-07
**Depth:** standard
**Files Reviewed:** 3 (index.html, script.js, styles.css)
**Status:** issues_found

## Summary

Phase 2 delivers a hero copy rewrite, scarcity signal, a redesigned ops console with dual-loop agent-trace animation, and a canvas particle network with k-nearest line drawing. The core HTML structure and CSS design tokens are solid. Two blockers were found: a double animation loop that leaks a `requestAnimationFrame` handle under a specific tab-switch sequence, and a canvas particle network that ignores `prefers-reduced-motion`, breaking WCAG 2.3.3 for vestibular disorder users. Six warnings cover a leaked `swapLabel` timeout, an elapsed timer that accumulates unrealistically when the tab is backgrounded, raw color values bypassing the token system, a misleading O-notation comment, `aria-label` without a backing role, and `aria-live` on a static element. Four info items flag a raw hex teal outside any token, magic numbers, bidirectional line-drawing waste, and a pre-existing touch-target gap on the nav CTA.

---

## Critical Issues

### CR-01: Double `requestAnimationFrame` loop on early tab-switch

**File:** `script.js:302-308`

**Issue:** The `visibilitychange` handler calls `drawNetwork()` unconditionally when the tab becomes visible. If the user switches away and back *before* `requestIdleCallback` fires (up to 2 s after page load), the sequence is:

1. Page loads; `animationFrame = 0`; rIC is pending.
2. Tab hides: `cancelAnimationFrame(0)` — no-op (0 is not a live handle).
3. Tab shows: `drawNetwork()` starts loop A; `animationFrame = id_A`.
4. rIC fires: `initCanvas()` → `resizeCanvas()` → `drawNetwork()` starts loop B; `animationFrame = id_B`.

`animationFrame` now holds `id_B`. All future `cancelAnimationFrame(animationFrame)` calls (visibilitychange, pagehide) cancel loop B only. Loop A runs forever at 60 fps with no way to stop it.

**Fix:** Cancel any existing frame before starting a new one in both the `visibilitychange` handler and at the start of `initCanvas`:

```js
// visibilitychange handler
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else if (canvas && context) {
    cancelAnimationFrame(animationFrame); // guard against double-start
    drawNetwork();
  }
});

// initCanvas
const initCanvas = () => {
  resizeCanvas();
  cancelAnimationFrame(animationFrame); // prevent double-loop if rIC fires late
  drawNetwork();
  window.addEventListener("resize", debounce(resizeCanvas, 180));
};
```

---

### CR-02: Canvas animation ignores `prefers-reduced-motion`

**File:** `script.js:288-298`, `styles.css:586-603`

**Issue:** The particle canvas starts unconditionally via `requestIdleCallback`/`setTimeout` with no `prefers-reduced-motion` guard. The CSS `@media (prefers-reduced-motion: reduce)` block stops the CSS keyframe animations (`.scarcity-dot`, `.flow-dot-pulse`) but cannot stop a `requestAnimationFrame` loop. Users who have enabled "Reduce Motion" on their OS will still see the continuously-moving particle network. This violates WCAG 2.3.3 (Animation from Interactions, AAA) and the spirit of WCAG 2.2 SC 2.3.3, and directly contradicts the marquee guard on line 8 which already shows the correct pattern.

**Fix:** Wrap the entire canvas init block with a reduced-motion check, and also hide the canvas element via CSS for good measure:

```js
// script.js — wrap canvas init
if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const initCanvas = () => { ... };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);
  }
}
```

```css
/* styles.css — inside existing @media (prefers-reduced-motion: reduce) block */
@media (prefers-reduced-motion: reduce) {
  .agent-canvas {
    display: none;
  }
  /* existing rules... */
}
```

---

## Warnings

### WR-01: `swapLabel` timeout is untracked — cannot be cancelled on teardown

**File:** `script.js:386-393`

**Issue:** `swapLabel()` creates a `setTimeout` (250 ms) whose ID is never stored. The `traceTimeout` variable tracks the main animation chain but not this fade timeout. If the page or component is torn down while a label-swap is in-flight, the timeout fires into a potentially detached context. More critically, if `swapLabel` is called rapidly (e.g., during a quick loop cycle), the 250 ms timeout from a prior call can fire after a newer label has already been set, briefly flashing stale text then removing `label-fade` at the wrong moment, causing a visible glitch.

**Fix:**

```js
let labelTimeout = null; // add alongside other let declarations at top of if(consoleEl) block

function swapLabel(newLabel) {
  if (!consoleLabel) return;
  clearTimeout(labelTimeout);
  consoleLabel.classList.add("label-fade");
  labelTimeout = setTimeout(() => {
    consoleLabel.textContent = newLabel;
    consoleLabel.classList.remove("label-fade");
  }, 250);
}
```

Also add `clearTimeout(labelTimeout)` to any cleanup path (e.g., a future `stopTrace()` function).

---

### WR-02: Elapsed timer accumulates unrealistically when tab is backgrounded

**File:** `script.js:358-363`

**Issue:** `elapsedInterval` uses `Date.now()` relative to `stepStart`. When the tab is hidden, browsers throttle `setInterval` to ~1 Hz but the wall clock continues. After a user tabs away for 30 seconds and returns, the active step's elapsed counter reads "32s" (or higher), which breaks the illusion of a real pipeline — steps that should complete in 2–3 seconds display impossibly large elapsed values.

**Fix:** Pause the elapsed counter on tab hide and resume it on tab show, offsetting `stepStart` to account for the hidden time:

```js
let hiddenAt = null;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    cancelAnimationFrame(animationFrame);
  } else {
    if (hiddenAt !== null && stepStart !== null) {
      stepStart += Date.now() - hiddenAt; // shift origin forward
      hiddenAt = null;
    }
    if (canvas && context) {
      cancelAnimationFrame(animationFrame);
      drawNetwork();
    }
  }
});
```

---

### WR-03: Raw violet RGBA values bypass design token system (CSS)

**File:** `styles.css:472, 531, 649-650`

**Issue:** Three rules use raw `rgba(124, 92, 252, …)` instead of referencing design tokens. If the accent color changes, these will be missed:

- Line 472: `.ops-console` border — `rgba(124, 92, 252, 0.32)`
- Line 531: `.flow-row.active` border-color — `rgba(124, 92, 252, 0.62)`
- Lines 649–650: card hover `box-shadow` — two violet rgba values

The token system already has `--violet-600: #7c5cfc` and `--violet-dim: rgba(124, 92, 252, 0.12)`, but no tokens for the 0.32 and 0.62 opacity variants used here. The canvas `script.js` lines 250 and 261 have the same issue.

**Fix:** Add border tokens and use them:

```css
/* In :root tokens block */
--color-border-accent:        rgba(124, 92, 252, 0.32);
--color-border-accent-strong: rgba(124, 92, 252, 0.62);

/* Then replace: */
.ops-console        { border: 1px solid var(--color-border-accent); }
.flow-row.active    { border-color: var(--color-border-accent-strong); }
```

For the canvas in script.js, read the token value from a CSS custom property at init time or use a named constant:

```js
const VIOLET = "124, 92, 252";
context.strokeStyle = `rgba(${VIOLET}, ${opacity * 0.15})`;
context.fillStyle   = `rgba(${VIOLET}, 0.8)`;
```

---

### WR-04: `aria-label` on `<div>` without a backing `role` — label will be ignored by screen readers

**File:** `index.html:59`

**Issue:** `<div class="ops-console reveal" aria-label="Live automation console preview" data-agent-trace>` has an `aria-label` but no `role`. The ARIA specification requires that `aria-label` be applied to elements with a semantic role for the label to be exposed to assistive technology. A plain `<div>` has no implicit ARIA role in the accessibility tree, so the label is silently discarded by most screen readers (VoiceOver, NVDA).

**Fix:** Add `role="region"` to make this a labelled landmark region:

```html
<div class="ops-console reveal"
     role="region"
     aria-label="Live automation console preview"
     data-agent-trace>
```

Alternatively, use `role="log"` if the intent is that the content represents a live log (appropriate for a simulated pipeline console), which would also enable implicit `aria-live="polite"` behaviour.

---

### WR-05: Agent-trace animation does not respect `prefers-reduced-motion`

**File:** `script.js:395-432`

**Issue:** The JS `setTimeout` chain (`runStep`, `activateRow`, `swapLabel`) runs unconditionally regardless of `prefers-reduced-motion`. While the CSS correctly stops the CSS keyframe animations (`.flow-dot-pulse`, `.pulse-dot`), the JavaScript content-cycling — changing `.active` class, swapping text, and fading the console label — still executes. Marquee duplication (line 8) and `animateCounter` (line 106) both check `prefers-reduced-motion` before running; agent-trace is inconsistent with this established pattern.

**Fix:** Add a guard before starting the trace:

```js
function startTrace() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Show first loop in a static completed state
    populateRows(LOOPS[0]);
    if (consoleLabel) consoleLabel.textContent = LOOPS[0].label;
    return;
  }
  populateRows(LOOPS[0]);
  swapLabel(LOOPS[0].label);
  traceTimeout = setTimeout(runStep, 600);
}
```

---

### WR-06: `aria-live="polite"` applied to a static element

**File:** `index.html:54`

**Issue:** `<p class="scarcity-signal" aria-live="polite">` has static content ("Currently taking 1–2 new projects") that is never updated by JavaScript. `aria-live` only announces changes to content after page load; it has no effect on content present in the DOM at load time. Screen readers will read the paragraph as part of normal document flow regardless, so the attribute does nothing. However, leaving an `aria-live` region on static content creates confusion for future developers and could cause unexpected announcements if the text is ever dynamically changed without considering the announcement implications.

**Fix:** Remove `aria-live="polite"` from the static element. If the scarcity text is ever made dynamic (e.g., fetched from an API), restore `aria-live` at that point:

```html
<p class="scarcity-signal">
  <span class="scarcity-dot" aria-hidden="true"></span>
  Currently taking 1–2 new projects
</p>
```

---

## Info

### IN-01: `#007d80` is a raw hex value with no design token and is not on the defined palette

**File:** `styles.css:766`

**Issue:** `.portfolio-card span { color: #007d80; }` uses a hard-coded teal value that does not correspond to any CSS custom property in the design system (`--cyan-400`, `--color-cyan` are `#22d3ee`, not `#007d80`). This is a separate colour not accounted for in the token file, and it will be unaffected by any future palette refactor.

**Fix:** Either map it to `--color-cyan` (if the intent is cyan) or define a named token:

```css
/* In :root */
--teal-700: #007d80;

/* Usage */
.portfolio-card span { color: var(--teal-700); }
```

---

### IN-02: O(n²) comment on k-nearest algorithm is misleading

**File:** `script.js:233-257`

**Issue:** The comment at line 233 claims `O(n×k)` complexity, but the inner loop (lines 237–244) still iterates all `n` particles for each of the `n` outer particles, making the distance-filtering pass `O(n²)`. The `k` bound only limits the drawing calls (the inner `for (let n = 0; n < k; n++)` loop), not the candidate-gathering loop. With `n=35` this is 1,190 iterations per frame — negligible — but the comment will mislead future developers who may increase `n` trusting the O(n×k) claim.

**Fix:** Correct the comment:

```js
// k-nearest neighbor line drawing — candidate scan is O(n²); drawing is O(n×k).
// With n=35 this is 1,190 distance checks per frame — acceptable at this scale.
// If n ever exceeds ~150, replace with a spatial grid to keep it fast.
```

---

### IN-03: Bidirectional line-drawing doubles canvas stroke calls

**File:** `script.js:247-257`

**Issue:** The line-drawing loop has no `i < j` guard, so every edge between particles A and B is stroked twice per frame (once when A is the outer particle, once when B is). With 35 particles, k=6, this means up to 35×6=210 `context.stroke()` calls instead of a possible ~105. At 60 fps this is benign, but it is wasted work. The opacity is identical in both directions so the visual result is also unchanged.

**Fix:** This is low priority given n=35, but the canonical fix is to skip duplicate edges:

```js
// Option A: only draw from lower-index to higher-index particles
for (let n = 0; n < k; n++) {
  const neighborIndex = particles.indexOf(neighbors[n].b);
  if (neighborIndex < i) continue; // already drawn from the other side
  ...
}

// Option B (simpler): accept the redundancy, document it
// Lines are drawn in both directions; opacity compounds slightly but is imperceptible.
```

---

### IN-04: `rgba(8, 10, 10, 0.5)` canvas fill bypasses `--color-bg` token; no token for console background

**File:** `script.js:201`, `styles.css:471`

**Issue:** Two values duplicate the background colour outside the token system:
- `script.js:201` — `context.fillStyle = "rgba(8, 10, 10, 0.5)"` hardcodes the base background colour.
- `styles.css:471` — `.ops-console { background: rgba(12, 18, 18, 0.86) }` uses an undeclared off-black value (`#0c1212`) that is neither `--gray-950 (#0a0a0b)` nor `--gray-900 (#111113)`.

Neither is part of the token system, so a background colour change would require finding these raw values manually.

**Fix:**

For the canvas JS fill, read the colour from a constant or the CSS variable at init time:

```js
const BG_FILL = "rgba(10, 10, 11, 0.5)"; // aligned to --gray-950
context.fillStyle = BG_FILL;
```

For the console background, define a token:

```css
/* :root */
--color-console-bg: rgba(12, 18, 18, 0.86);

/* .ops-console */
background: var(--color-console-bg);
```

---

_Reviewed: 2026-05-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
