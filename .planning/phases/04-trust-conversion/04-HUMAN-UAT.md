---
status: partial
phase: 04-trust-conversion
source: [04-VERIFICATION.md]
started: 2026-05-07T00:00:00Z
updated: 2026-05-07T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Process timeline renders in a single 5-column row at desktop widths
expected: At ≥1024px viewport, all 5 timeline steps (Discovery, Scope, Build, Ship, Iterate) appear side by side in one row
result: [pending]

### 2. About section responsive collapse at 940px breakpoint
expected: At ≤940px viewport, the two-column about-grid collapses to a single column (bio above, credentials below)
result: [pending]

### 3. credentials-card spotlight glow on hover
expected: Hovering the credentials-card shows the violet spotlight glow (same effect as service-cards and portfolio-cards)
result: [pending]

### 4. Form optimistic UI timing
expected: On form submit — button disables immediately, "Sending your request..." text appears, then on completion success/error message shown with correct color
result: [pending]

### 5. Calendly link opens in new tab
expected: Clicking "Book a discovery call" opens https://calendly.com/manikmalhotra6/30min in a new browser tab (not same tab)
result: [pending]

### 6. Copyright year rendered in footer span on page load
expected: Footer shows "© 2026 AgentOps Studio" (or current year) — the copyright-year span is populated by JS
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
