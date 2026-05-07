---
phase: 04-trust-conversion
plan: "03"
subsystem: contact-section-footer
tags: [html, css, js, cta, contact, footer, calendly, form, copyright]
dependency_graph:
  requires: [04-01, 04-02]
  provides: [contact-section-calendly-cta, qualifying-form-4-fields, footer-meta-copyright-year, spotlight-credentials-card]
  affects: [index.html, styles.css, script.js]
tech_stack:
  added: []
  patterns: [calendly-external-link, form-optimistic-ui, copyright-year-js-injection, spotlight-radial-gradient]
key_files:
  created: []
  modified:
    - index.html
    - styles.css
    - script.js
decisions:
  - "cta-book-btn extends .btn.btn-primary — inherits full pill button styles, no duplication"
  - "scarcity-signal reuses existing CSS class from hero section — no new rule needed"
  - "footer-meta class supersedes old .site-footer span:last-child rule — old rule preserved per plan spec"
  - "copyright year block appended at top level after consoleEl block — not nested inside any if block"
  - "formStatus.dataset.state set on both success and error for CSS attribute selector targeting"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-07T23:10:00Z"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 3
---

# Phase 4 Plan 03: CTA/Contact Section, Footer, and JS Updates Summary

One-liner: Replaced old contact form with Calendly-primary CTA layout and 4-field qualifying form, updated footer with copyright-year injection, added credentials-card to spotlight selector, and wired form optimistic UI with data-state attributes.

## What Was Changed

### index.html

| Change | Old Value | New Value | Line |
|--------|-----------|-----------|------|
| Contact section eyebrow | `Start with one conversation` | `Work together` | 309 |
| Contact section h2 | `Tell me what you're building.` | `Ready to build something?` | 310 |
| Contact section supporting copy | Old generic copy | Client-count scarcity framing | 311 |
| Scarcity signal | (none in contact) | `.scarcity-signal` div with `Currently taking 1–2 new projects` | 308 |
| Calendar CTA | (none) | `<a href="https://calendly.com/manikmalhotra6/30min" class="btn btn-primary cta-book-btn">Book a discovery call</a>` | 313–317 |
| Contact right column | Direct `<form>` as sibling of `.contact-copy` | `<div class="contact-form-wrapper reveal">` wrapping form | 321 |
| Form bridge heading | (none) | `<p class="contact-form-bridge">Prefer to reach out first?</p>` | 322 |
| Form fields | name, email, company, workflow | name, company, project (textarea), timeline | 323–342 |
| Form `name="email"` | Present | Removed | — |
| Form `name="workflow"` | Present | Removed | — |
| Form `name="project"` | (none) | textarea "What are you building?" | 334 |
| Form `name="timeline"` | (none) | input "Your timeline" | 338 |
| Footer second span | `<span>` (no class) | `<span class="footer-meta">` | 352 |
| Footer copyright | (none) | `<span class="footer-copyright">© <span id="copyright-year"></span> AgentOps Studio</span>` | 353 |

### styles.css

| Change | Insertion Point | Rule Added |
|--------|-----------------|------------|
| `.cta-book-btn` | After `.form-status`, before `.site-footer` | `display: inline-flex; margin-top: var(--space-6); font-size: 1rem; padding: var(--space-4) var(--space-8); min-height: 52px` | Line 891 |
| `.contact-form-bridge` | Same block | `margin: 0 0 var(--space-6); color: var(--color-text-secondary); font-weight: 700; font-size: 1rem` | Line 899 |
| `.contact-form-wrapper` | Same block | Empty comment block (wraps bridge + form) | Line 906 |
| `[data-form-status][data-state="success"]` | Same block | `color: var(--color-success)` | Line 910 |
| `.footer-meta` | After `.site-footer span:last-child` | `display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3)` | Line 931 |
| `.footer-copyright` | Same block | `color: var(--color-text-muted); font-size: 0.875rem` | Line 938 |

No inline hex values in any new rules. All use token variables.

### script.js

| Change | Old Value | New Value | Line |
|--------|-----------|-----------|------|
| Spotlight selector | `.service-card, .portfolio-card` | `.service-card, .portfolio-card, .credentials-card` | 142 |
| Form success message | `"Thanks. Your request has been sent to Manik."` | `"Message sent — I'll be in touch within 24 hours."` | 76 |
| Form success data-state | (none) | `formStatus.dataset.state = "success"` | 77 |
| Form error message | `"Something went wrong. Please email ..."` | `"Something went wrong. Email ... directly."` | 80 |
| Form error data-state | (none) | `formStatus.dataset.state = "error"` | 83 |
| Copyright year block | (none) | `getElementById("copyright-year")` + `new Date().getFullYear()` at top level | 440–442 |

## Spotlight Selector Final String

```js
document.querySelectorAll(".service-card, .portfolio-card, .credentials-card")
```

## Form Fields Present and Absent

**Present:**
- `name="name"` — text input, required
- `name="company"` — text input, optional
- `name="project"` — textarea "What are you building?", required
- `name="timeline"` — text input "Your timeline", optional

**Absent (confirmed removed):**
- `name="email"` — removed (was type="email")
- `name="workflow"` — removed
- No phone field — never added

## Copyright Year Injection

Block appended at top level of script.js after the `consoleEl` MutationObserver block:

```js
const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}
```

The `id="copyright-year"` span in the footer receives the current year on page load. Confirmed working via code review.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `187633d` | feat(04-03): replace contact section with Calendly CTA + qualifying form; update footer |
| Task 2 | `ab7e791` | feat(04-03): add CTA/footer CSS — cta-book-btn, form-status success, footer-meta |
| Task 3 | `f243ea0` | feat(04-03): update spotlight selector, form messages, copyright year injection |

## Deviations from Plan

### Accidental Commit to Main (Recovered — Same Pattern as Plans 01 and 02)

**Found during:** Task 1 execution

**Issue:** Task 1 edits were applied to the main repo path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/index.html`) instead of the worktree path. The commit accidentally landed on the `main` branch.

**Fix:** Reverted the accidental commit on `main` via `git revert HEAD --no-edit` (revert commit `a689f99`). Re-applied the same Task 1 changes to the correct worktree path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-aa56a98aa0545a750/index.html`). All subsequent commits landed on `worktree-agent-aa56a98aa0545a750` as required.

**Net result:** No content deviation from the plan. Revert commit on main is the only side effect.

## Known Stubs

None. All copy, URLs, and form fields use final values from the Copywriting Contract. No placeholder text exists. The copyright year is injected dynamically. The Calendly URL is hardcoded as specified.

## Threat Flags

No new threat surface beyond what was pre-modeled in the plan's `<threat_model>`. Reviewing mitigations:

- T-04-03-01 (Calendly link): `rel="noreferrer"` present on the `<a>` element. URL hardcoded.
- T-04-03-02 (form payload): Existing Netlify function receives the new field names (`project`, `timeline`) via the generic `Object.fromEntries(formData.entries())` — no function changes needed.
- T-04-03-03 (error disclosure): `catch (error)` block does not expose `error.message` to UI — only generic text shown.
- T-04-03-04 (spam): Accepted, no rate limiting in scope.
- T-04-03-05 (footer email): Accepted, intentionally public.

## Self-Check

### Modified files exist
- `.claude/worktrees/agent-aa56a98aa0545a750/index.html` — exists, contains `calendly.com/manikmalhotra6/30min`, `cta-book-btn`, `footer-meta`, `id="copyright-year"`, `name="project"`, `name="timeline"`, no `name="email"`, no `name="workflow"`
- `.claude/worktrees/agent-aa56a98aa0545a750/styles.css` — exists, contains `.cta-book-btn`, `[data-form-status][data-state="success"]`, `.footer-meta`, `.footer-copyright`
- `.claude/worktrees/agent-aa56a98aa0545a750/script.js` — exists, contains `.credentials-card` in spotlight selector, `"Message sent — I'll be in touch within 24 hours."`, `dataset.state = "success"`, `getElementById("copyright-year")`, `getFullYear()`

### Commits exist
- `187633d` — feat(04-03): replace contact section HTML
- `ab7e791` — feat(04-03): add CTA/footer CSS
- `f243ea0` — feat(04-03): update script.js

## Self-Check: PASSED

All success criteria verified:
- [x] `index.html` #contact section contains `href="https://calendly.com/manikmalhotra6/30min"` on `.btn.btn-primary.cta-book-btn`
- [x] `index.html` #contact section has `.scarcity-signal` div with "Currently taking 1–2 new projects"
- [x] `index.html` form has `name="project"` textarea and `name="timeline"` input; `name="email"` and `name="workflow"` do NOT exist
- [x] `index.html` footer has `<span class="footer-meta">` containing `id="copyright-year"` span, Email link, LinkedIn link — no phone, no WhatsApp
- [x] `styles.css` has `.cta-book-btn` rule with `min-height: 52px`
- [x] `styles.css` has `[data-form-status][data-state="success"] { color: var(--color-success); }` rule
- [x] `styles.css` has `.footer-meta` and `.footer-copyright` rules
- [x] `script.js` spotlight selector string contains `.credentials-card`
- [x] `script.js` success message text is "Message sent — I'll be in touch within 24 hours."
- [x] `script.js` sets `formStatus.dataset.state = "success"` on successful submission
- [x] `script.js` has `document.getElementById("copyright-year")` block at top level
- [x] `script.js` calls `new Date().getFullYear()` and assigns result to copyright-year element
