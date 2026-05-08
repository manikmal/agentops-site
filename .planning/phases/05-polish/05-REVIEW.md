---
phase: 05-polish
reviewed: 2026-05-08T00:00:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - favicon.svg
  - index.html
  - script.js
  - styles.css
  - wordmark.svg
findings:
  critical: 1
  warning: 4
  info: 2
  total: 7
status: issues_found
---

# Phase 5: Code Review Report

**Reviewed:** 2026-05-08
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Five Phase 5 polish files were reviewed: the new triple-chevron `favicon.svg`, the two-color `wordmark.svg`, OG/Twitter meta additions and preload hints in `index.html`, the `prefers-reduced-motion` kill-all block and mobile CTA styles in `styles.css`, and the reduced-motion guard on canvas init in `script.js`.

The favicon SVG is clean. The wordmark SVG is structurally correct with appropriate accessibility markup; a known font-rendering caveat is documented in the file itself. The OG/Twitter meta block is complete and consistent. The canvas reduced-motion guard is correctly applied in both the init path and the `visibilitychange` resume path.

One WCAG-level accessibility blocker was found: `scroll-behavior: smooth` on `html` is not reset inside the `prefers-reduced-motion` block, meaning users who prefer reduced motion still get smooth-scroll on every anchor navigation. Four warnings were found covering: an unresolved CSS specificity conflict in the footer (the prior fix addressed `flex-wrap` but the `gap` value is still wrong), a redundant accessible name on the brand link, an unguarded `fetch` with no timeout, and dead counter-animation code. Two informational items cover minor redundancy.

---

## Critical Issues

### CR-01: `scroll-behavior: smooth` not suppressed under `prefers-reduced-motion`

**File:** `styles.css:99`

**Issue:** `html { scroll-behavior: smooth; }` is declared unconditionally. The `@media (prefers-reduced-motion: reduce)` block at line 592 applies `transition: none !important; animation: none !important` to `*, *::before, *::after` — but `html` is not `*`, and `scroll-behavior` is neither a transition nor an animation, so it is unaffected. Every in-page anchor click (nav links, "Book a call", "View work") triggers a smooth scroll for users with vestibular or motion sensitivity disorders. This violates WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions, Level AAA) and the general spirit of SC 1.4.3/2.3.1 at AA.

**Fix:**

```css
@media (prefers-reduced-motion: reduce) {
  /* existing kill-all block */
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }

  /* ADD: kill smooth scroll */
  html {
    scroll-behavior: auto;
  }

  /* existing logo-strip / marquee overrides ... */
}
```

---

## Warnings

### WR-01: Specificity conflict in footer — `gap` value still wrong after prior fix

**File:** `styles.css:942-952`

**Issue:** Two rules target `.footer-meta` (the last `<span>` in `.site-footer`):

- `.site-footer span:last-child` — specificity **(0, 2, 1)** — sets `gap: 14px`
- `.footer-meta` — specificity **(0, 1, 0)** — sets `gap: var(--space-3)` (12px)

The prior fix (commit 3780030) added `.footer-meta` to restore `align-items: center` and `flex-wrap: nowrap`, but because `.site-footer span:last-child` has higher specificity, its `gap: 14px` still overrides the intended `gap: 12px`. The fix resolved the `nowrap` symptom but left the `gap` conflict in place.

**Fix:** Either remove the now-redundant `.site-footer span:last-child` block entirely (since `.footer-meta` covers all its properties plus more), or raise `.footer-meta`'s specificity:

```css
/* Option A — preferred: remove the broad selector */
/* Delete lines 942-946 entirely */

/* Option B — raise specificity on .footer-meta */
.site-footer .footer-meta {          /* (0, 2, 0) > (0, 2, 1)? No — still loses */
  /* doesn't work cleanly */
}

/* Option A is correct: the span:last-child rule is fully superseded by .footer-meta */
```

### WR-02: Redundant accessible name on brand link — screen readers may double-announce

**File:** `index.html:37-39`

**Issue:** The `<a class="brand">` element carries `aria-label="AgentOps Studio home"`, and the child `<img class="brand-wordmark">` carries `alt="AgentOps Studio"`. The `aria-label` on the link overrides the accessible name computation for the link itself, but the wordmark `<img>` with a non-empty `alt` attribute is still an accessible child element. Depending on the screen reader and its verbosity setting, users may hear: *"AgentOps Studio home, link, image: AgentOps Studio"*. The icon is already `aria-hidden="true"`, but the wordmark is not.

**Fix:** Since the parent `<a>` already carries the full accessible name via `aria-label`, mark the wordmark image as decorative:

```html
<img src="wordmark.svg" alt="" class="brand-wordmark" width="180" height="28">
```

The brand name "AgentOps Studio" is conveyed by the link's `aria-label`; the `<img>` need not repeat it.

### WR-03: `fetch` call has no timeout — submit button can be disabled indefinitely

**File:** `script.js:66-70`

**Issue:** The form submit handler disables the submit button at line 63, then awaits `fetch("/.netlify/functions/lead-to-slack", ...)` with no `AbortController` and no signal timeout. Browser `fetch` has no built-in timeout; if the Netlify function is cold-starting, rate-limited, or unresponsive, the button remains disabled until the browser's own TCP/HTTP timeout fires (typically 2–5 minutes, sometimes never on stalled connections). Users have no feedback and cannot retry.

**Fix:**

```js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

try {
  const response = await fetch("/.netlify/functions/lead-to-slack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  // ... rest of success path
} catch (error) {
  clearTimeout(timeoutId);
  // ... existing error path
}
```

### WR-04: Dead counter animation code — `animateCounter` and `counterObserver` have no HTML consumers

**File:** `script.js:115-146`

**Issue:** `animateCounter()`, `easeOut()`, and `counterObserver` (lines 111–146) watch for elements matching `[data-counter-end]`. No such element exists anywhere in `index.html`. The observer is registered and held in memory for the lifetime of the page, scanning every intersection event for elements that will never appear. This is dead code that adds cognitive overhead to future maintainers and wastes a small amount of browser memory.

**Fix:** Remove lines 111–146 (`easeOut`, `animateCounter`, `counterObserver`), or move them to a comment-blocked "reserved for future use" section if counter stats are planned for Phase 6.

---

## Info

### IN-01: Redundant `animation: none` rules inside `prefers-reduced-motion` block

**File:** `styles.css:609-612`

**Issue:** The `@media (prefers-reduced-motion: reduce)` block explicitly nullifies `.scarcity-dot` and `.flow-row.active .flow-dot` animations at lines 609-612. These are fully covered by the `*, *::before, *::after { animation: none !important }` rule that opens the same block at line 593. The explicit rules are dead.

**Fix:** Remove lines 609-612. If targeted suppression is needed in future for only those elements, add them back at that time.

### IN-02: `wordmark.svg` uses `<text>` with `system-ui` — rendering varies across platforms

**File:** `wordmark.svg:4-6`

**Issue:** The SVG wordmark renders the brand name using a `<text>` element with `font-family="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"`. When loaded as an external `<img>`, the browser uses the system font stack, which differs across macOS (San Francisco), Windows (Segoe UI), and Android (Roboto). The letter-spacing and advance widths vary enough that the text may overflow the 168px-wide `viewBox` on some platforms, clipping "Studio" on the right edge. The file comment acknowledges this and defers a path-conversion fix to v2.

**Fix (deferred):** Before v2 brand launch, convert the `<text>` to `<path>` data using a tool like Inkscape or Figma export, or serve the wordmark as an inline SVG where the page's already-loaded Inter font applies directly.

---

_Reviewed: 2026-05-08_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
