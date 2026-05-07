---
status: partial
phase: 02-hero
source: [02-VERIFICATION.md]
started: 2026-05-07T16:15:00Z
updated: 2026-05-07T16:15:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Above-the-fold visual check
expected: Open index.html at 1280px viewport width. All of the following are visible without scrolling: h1 "AI systems built to run your business.", lede text, "Book a discovery call" violet button, "View work" secondary link, green pulsing scarcity signal "Currently taking 1–2 new projects", and the ops-console terminal with violet border.
result: [pending]

### 2. Agent-trace animation
expected: The ops-console animates through 4 rows sequentially (Orchestrator → Build Agent → Test Agent → Deploy Agent), with the active row showing a pulsing violet dot and an elapsed timer counting up in seconds. After all 4 rows complete, the console label fades from "startup-pipeline" to "sme-automation" and Loop B begins (Orchestrator → Data Agent → Content Agent → Publish Agent). After Loop B completes, the animation cycles back to Loop A.
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps
