---
phase: 04-trust-conversion
reviewed: 2026-05-07T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - index.html
  - styles.css
  - script.js
findings:
  critical: 4
  warning: 6
  info: 4
  total: 14
status: fixed
fixed: 2026-05-08T00:00:00Z
---

# Phase 4: Code Review Report

**Reviewed:** 2026-05-07
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed `index.html`, `styles.css`, and `script.js` — the single-page site delivered in Phase 4. The core layout, canvas, and console animation are well-structured. However, four blockers need attention before this ships: a field mismatch between the HTML form and the Netlify function that will silently drop leads, an `innerHTML` injection using a hardcoded string that is one refactor away from becoming an XSS vector, missing `focus-visible` styles on the primary CTA buttons, and the active-nav indicator placing a `transform` on the `::after` pseudo-element of `.nav-link.is-active` which is a child of `.site-header` (the backdrop-filter element) — a pattern that is explicitly prohibited by the project's iOS Safari rule.

Six warnings cover: the form permanently losing email/phone data, a canvas sizing inconsistency that causes blurry rendering on high-DPI screens after resize, the agent-trace animation not being paused on `visibilitychange`, the error state CSS selector missing for the form status element, an `outline: none` without a visible replacement, and the Gmail address appearing in production despite being a pre-launch blocker.

---

## Critical Issues

### CR-01: Form fields do not match what the Netlify function validates — leads are silently dropped

**File:** `index.html:325-339`, `netlify/functions/lead-to-slack.js:30-41`

**Issue:** The contact form collects `name`, `company`, `project`, and `timeline`. The Netlify function reads `name`, `email`, `phone`, `company`, and `workflow`, and **rejects requests where `email` or `workflow` are absent** (line 36: `if (!name || !email || !workflow)`). The form never sends `email` or `workflow`. Every form submission will return HTTP 400, the catch block will fire, and every lead will silently fail — the user sees the error fallback and the lead is lost.

**Fix:** Either (a) add the missing fields to the form and remove the server-side `required` check for fields not collected, or (b) align the function to the actual form fields. The minimal correct fix matching the current form shape:

```html
<!-- index.html — add email field, rename textarea -->
<label>
  Your email
  <input name="email" type="email" placeholder="you@company.com" required autocomplete="email">
</label>
<label>
  What are you building?
  <textarea name="workflow" rows="4" placeholder="Describe what you're working on — even rough ideas are fine." required></textarea>
</label>
```

```js
// netlify/functions/lead-to-slack.js — read the renamed field
const workflow = clean(body.workflow ?? body.project);
```

---

### CR-02: `innerHTML` assigned from a string that embeds a variable — latent XSS risk

**File:** `script.js:82`

```js
formStatus.innerHTML = `Something went wrong. Email <a href="mailto:${email}">${email}</a> directly.`;
```

**Issue:** `email` is assigned the string literal `"manikmalhotra6@gmail.com"` two lines above (line 80), so the value is safe today. But `innerHTML` with template-literal interpolation is a dangerous pattern: a future editor who changes `email` to pull from user input, a server response, or an environment variable will introduce a stored XSS. The project contains no sanitisation utility and no linting rule to catch this. Per the adversarial review standard, a pattern that is one refactor away from being a security hole is a blocker.

**Fix:** Use `textContent` + `createElement` to build the link safely, or use `insertAdjacentHTML` with a DOMPurify-sanitised string. Since this is vanilla JS with no build step, the safest zero-dependency fix:

```js
// script.js — replace the innerHTML line
formStatus.textContent = "Something went wrong. Email ";
const link = document.createElement("a");
link.href = `mailto:${email}`;
link.textContent = email;
formStatus.appendChild(link);
const tail = document.createTextNode(" directly.");
formStatus.appendChild(tail);
```

---

### CR-03: Primary CTA buttons have no `focus-visible` style — keyboard navigation is broken

**File:** `styles.css:421-440`

**Issue:** `.btn-primary` has `transition` for `background` and `transform` on hover/active, but there is no `:focus-visible` rule anywhere in `styles.css` for `.btn-primary`, `.btn`, or `button`. The browser default outline is explicitly removed via `outline: none` on `.contact-form input` (line 876), and there is no compensating `outline` or `box-shadow` rule for any button. Nav links have `:focus-visible` (line 211) but the two primary CTAs — "Book a discovery call" (hero) and "Send message" (form submit) — do not. This is a WCAG 2.1 SC 2.4.7 failure.

**Fix:**

```css
/* styles.css — add after .btn-primary:active */
.btn-primary:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.btn-secondary:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 3px;
}
```

---

### CR-04: Active nav indicator `::after` uses `transform` on a descendant of the `backdrop-filter` container — violates the project's iOS Safari rule

**File:** `styles.css:223-232`

```css
.nav-link.is-active::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);   /* <— VIOLATION */
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}
```

**Issue:** `CLAUDE.md` states: "`backdrop-filter` — Never on the same element as `transform` (iOS Safari bug)." `.nav-link.is-active` is a child of `.site-header`, which has `backdrop-filter: blur(18px) saturate(180%)`. The `::after` pseudo-element uses `transform: translateX(-50%)`. On iOS Safari, descendant `transform` on children of a `backdrop-filter` ancestor can suppress or corrupt the blur. The `.header-positioner` / `.site-header` split was created specifically to isolate `transform` from `backdrop-filter`; adding it back in a descendant re-introduces the bug.

**Fix:** Center the dot without `transform`:

```css
.nav-link.is-active::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: calc(50% - 2px);   /* half of width: 4px, no transform needed */
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}
```

---

## Warnings

### WR-01: Form permanently loses user's email address — no recovery path when function call fails

**File:** `index.html:323-344`, `script.js:73-87`

**Issue:** The form has no `email` field (separate from CR-01's server-side rejection). When the Netlify function call fails, the catch block displays a fallback email address so the user can contact directly — but the user's typed name, company, and project description have already been lost (the form is not reset in the catch path, but also not preserved in any way visible to the user). If the user did not copy their message, they have to retype everything. For a lead capture form where submissions may represent high-value clients, this is a meaningful UX and business loss.

**Fix:** Do not reset the form on network failure. Move `leadForm.reset()` to only execute inside the success branch (it already is on line 74), but also ensure the submit button's re-enabling happens regardless — it does (line 86 `finally`). The main fix is: do not call `leadForm.reset()` anywhere in the error path (currently it is not called there, so the form data is preserved — but add a comment and verify this is intentional). The deeper fix is CR-01: add an email field so the data is useful.

---

### WR-02: Canvas `drawNetwork` reads `clientWidth`/`clientHeight` but the canvas was sized using `getBoundingClientRect` — mismatch causes blurry particles on resize at fractional DPR

**File:** `script.js:175-178`, `script.js:201-202`

**Issue:** `resizeCanvas` uses `canvas.getBoundingClientRect()` (line 175) to set `canvas.width` and `canvas.height` at device-pixel-ratio. `drawNetwork` then reads `canvas.clientWidth` and `canvas.clientHeight` (lines 201-202) for its coordinate system. `clientWidth`/`clientHeight` return CSS pixels rounded to the nearest integer; `getBoundingClientRect()` can return sub-pixel values. On a fractional DPR device (e.g. DPR 1.5) after a window resize, the two measurements can differ by 1px, causing particle positions and wall-bounce logic to operate in a slightly wrong coordinate space, producing visible drift and a blurry canvas edge.

**Fix:** Store the logical dimensions from `resizeCanvas` and reuse them in `drawNetwork`:

```js
let canvasW = 0;
let canvasH = 0;

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvasW = bounds.width;
  canvasH = bounds.height;
  canvas.width = Math.floor(canvasW * ratio);
  canvas.height = Math.floor(canvasH * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(canvasW, canvasH);
}

function drawNetwork() {
  if (!canvas || !context) return;
  const width = canvasW;
  const height = canvasH;
  // ... rest unchanged
```

---

### WR-03: Agent-trace `setTimeout` chain is not cleaned up on `visibilitychange` or `pagehide`

**File:** `script.js:307-319`, `script.js:401-419`

**Issue:** The canvas animation correctly cancels `animationFrame` on `visibilitychange` (line 308) and `pagehide` (line 318). The agent-trace animation uses a chain of `setTimeout` calls stored in `traceTimeout` and an `elapsedInterval`, but neither handler cleans them up. When the tab is hidden, the trace chain continues firing (at least `setTimeout` callbacks that were already queued), and `elapsedInterval` continues incrementing the elapsed counter. On `pagehide` this is a minor resource leak; in long-open tabs it can accumulate drift in the elapsed display.

**Fix:**

```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    clearTimeout(traceTimeout);      // add
    clearInterval(elapsedInterval);  // add
  } else if (canvas && context) {
    cancelAnimationFrame(animationFrame);
    drawNetwork();
  }
});

window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
  clearTimeout(traceTimeout);      // add
  clearInterval(elapsedInterval);  // add
});
```

Note: `traceTimeout` and `elapsedInterval` are scoped inside the `if (consoleEl)` block, so they need to be extracted to module scope or the cleanup handlers need to be co-located inside that block.

---

### WR-04: Error state for `.form-status` has no CSS rule — error text is unstyled

**File:** `styles.css:910-912`, `script.js:83`

**Issue:** `styles.css` defines `[data-form-status][data-state="success"]` with a green color. There is no corresponding `[data-form-status][data-state="error"]` rule. When the form submission fails, `formStatus.dataset.state = "error"` is set (line 83), but the text renders in the default `rgba(255,255,255,0.74)` from `.form-status` (line 887) — it looks identical to the neutral pending state. Users cannot visually distinguish an error from an in-progress message.

**Fix:**

```css
/* styles.css — add after the success rule */
[data-form-status][data-state="error"] {
  color: var(--color-error);
}
```

---

### WR-05: `outline: none` on form inputs removes the browser focus ring with no CSS replacement

**File:** `styles.css:876`

```css
.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--color-border-focus);
  /* outline is removed by: outline: none; on line 876 */
}
```

**Issue:** Line 876 sets `outline: none` on focused inputs. The replacement visual is the `border-color` change to `--color-border-focus` (rgba(255,255,255,0.28)). That is a very subtle contrast change — from 0.18 alpha to 0.28 alpha white on a dark background. On some monitors and for low-vision users this is not perceivable. WCAG 2.1 SC 1.4.11 (Non-text Contrast) requires a 3:1 contrast ratio for UI component focus indicators.

**Fix:** Replace `outline: none` with `outline: 2px solid var(--color-accent)` or supplement the border-color change with a visible glow:

```css
.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}
```

---

### WR-06: Gmail address is exposed as the primary email in production — pre-launch blocker not resolved

**File:** `index.html:354`, `script.js:80`

**Issue:** `CLAUDE.md` explicitly lists this as a pre-launch blocker: "Branded email address (e.g. `manik@agentopsstudio.com`) — Gmail should only appear in footer." The Gmail address (`manikmalhotra6@gmail.com`) appears in two places: the footer `mailto:` link (line 354) and as the fallback contact in the form error handler (line 80). On a live site with agency/startup clients, a Gmail address signals a non-professional setup and may suppress inquiry conversion.

**Fix:** Replace both instances with the branded address once it is provisioned:

```html
<!-- index.html:354 -->
<a href="mailto:manik@agentopsstudio.com">Email</a>
```

```js
// script.js:80
const email = "manik@agentopsstudio.com";
```

---

## Info

### IN-01: `animateCounter` is registered but no `data-counter-end` elements exist in the HTML

**File:** `script.js:128-140`, `index.html` (all)

**Issue:** The counter observer queries `[data-counter-end]` and registers an `animateCounter` listener. There are no elements with that attribute anywhere in `index.html`. The observer setup runs on every page load and watches for elements that will never appear. This is dead code until counter elements are added.

**Fix:** Either add counter elements (hero metrics / about section stats) to the HTML to activate this feature, or remove the counter observer until it is needed to avoid confusion.

---

### IN-02: `portfolio-card span` color override uses a hardcoded hex, not a design token

**File:** `styles.css:773-775`

```css
.portfolio-card span {
  margin-bottom: 12px;
  color: #007d80;
}
```

**Issue:** `#007d80` is a teal/cyan variant that is not defined as a design token in the `:root` block. The design system uses `--cyan-400: #22d3ee` and `--color-cyan: var(--cyan-400)`. This creates an inconsistency — the portfolio tag color diverges from all other cyan usages and cannot be updated via the token system.

**Fix:**

```css
.portfolio-card span {
  margin-bottom: 12px;
  color: var(--color-cyan);
}
```

---

### IN-03: Duplicate `transition` declaration on `.portfolio-card`

**File:** `styles.css:641-677`

**Issue:** `.portfolio-card` has the `transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease` rule declared twice — once at line 641 (inside the combined `.timeline-step, .portfolio-card:hover` selector block, which is actually the `.portfolio-card` rule block) and again at line 677 in a standalone `.portfolio-card` block. The second declaration overrides the first, making the first dead code.

**Fix:** Remove the duplicate at line 641 (or consolidate the two `.portfolio-card` rule blocks).

---

### IN-04: Hero `<p class="scarcity-signal">` has `aria-live="polite"` but the text never changes dynamically

**File:** `index.html:54-57`

**Issue:** The hero scarcity signal uses `aria-live="polite"` (line 54), which tells screen readers to announce changes to the element's content. The text "Currently taking 1–2 new projects" is static — it is never updated by JavaScript. `aria-live` on static content is harmless but misleading to developers and introduces unnecessary screen reader overhead.

**Fix:** Remove `aria-live="polite"` from the static hero scarcity signal. Retain it on the contact section scarcity signal only if its text will be updated dynamically. The form status element at line 341 already correctly uses `role="status" aria-live="polite"`.

```html
<!-- index.html:54 — remove aria-live -->
<p class="scarcity-signal">
  <span class="scarcity-dot" aria-hidden="true"></span>
  Currently taking 1–2 new projects
</p>
```

---

_Reviewed: 2026-05-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
