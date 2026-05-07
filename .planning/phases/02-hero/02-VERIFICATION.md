---
phase: 02-hero
verified: 2026-05-07T00:00:00Z
status: gaps_found
score: 4/5 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Canvas particle system pauses when the tab is hidden (SC-4 partial)"
    status: partial
    reason: "CR-01: The visibilitychange handler calls drawNetwork() on tab-visible without first cancelling any existing rAF handle. initCanvas() (called by requestIdleCallback, up to 2s after load) also calls drawNetwork() without a prior cancelAnimationFrame. If a user hides the tab before rIC fires, the visible-branch starts loop A (animationFrame = id_A), then rIC fires and starts loop B (animationFrame = id_B). Loop A runs forever — cancelAnimationFrame(animationFrame) only cancels id_B. The basic pause path (cancel on hidden) is wired correctly; the race condition on re-show leaves an orphaned rAF loop. Documented as critical finding CR-01 in 02-REVIEW.md."
    artifacts:
      - path: "script.js"
        issue: "visibilitychange visible branch (line 305-307) calls drawNetwork() without cancelAnimationFrame(animationFrame) guard. initCanvas (line 289-293) calls drawNetwork() without cancelAnimationFrame(animationFrame) guard."
    missing:
      - "Add cancelAnimationFrame(animationFrame) immediately before drawNetwork() in the visibilitychange visible branch"
      - "Add cancelAnimationFrame(animationFrame) immediately before drawNetwork() in initCanvas"
deferred:
  - truth: "Canvas and agent-trace animation respect prefers-reduced-motion in JavaScript (CR-02, WR-05)"
    addressed_in: "Phase 5"
    evidence: "PERF-04 (Phase 5 success criterion 3): 'enabling prefers-reduced-motion disables all CSS transitions and the canvas animation entirely'. WR-05 agent-trace guard is also a reduced-motion concern within the same scope."
human_verification:
  - test: "Above-the-fold visual check at 1280px viewport"
    expected: "Hero section is the first thing visible. h1 'AI systems built to run your business.' is readable. Green pulsing dot with 'Currently taking 1-2 new projects' is visible below the two CTA buttons. The right column shows the ops-console with a violet border and an active first row (Orchestrator). Canvas particles are violet, not lime or cyan."
    why_human: "Visual rendering and above-the-fold layout cannot be verified programmatically without a browser."
  - test: "Agent-trace animation live behavior"
    expected: "After the ops-console enters the viewport, the Orchestrator row activates with a pulsing dot and a counting elapsed timer. After ~2.8s Build Agent activates. After all 4 rows complete, the label fades to 'sme-automation' and Loop B begins. The animation cycles back to Loop A after Loop B completes."
    why_human: "Animation timing and DOM state transitions require a live browser to observe."
---

# Phase 2: Hero Verification Report

**Phase Goal:** A visitor landing on the site immediately understands who Manik works with, what he builds, and has a single clear action to take — in the first 5 seconds.
**Verified:** 2026-05-07
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero headline speaks to both audiences in first-person voice; no phone/Gmail in hero | VERIFIED | `index.html:48` — `<h1>AI systems built to run your business.</h1>`. Gmail at line 341 is footer-only. No form, phone, or Gmail tag anywhere in the hero section (lines 43-102). |
| 2 | Single "Book a discovery call" CTA + "View work" secondary link visible above fold; no form in hero | VERIFIED | `index.html:51-52` — both buttons present with correct text and href. Contact form at line 312 is in `#contact` section, not in hero. |
| 3 | Right column shows animated agent orchestration trace — not old SME console copy | VERIFIED (with open WR-05) | `script.js:315-432` — full agent-trace block with LOOPS config (startup-pipeline + sme-automation), MutationObserver reveal-wait, sequential row activation, elapsed timer, and label fades. Old 3-row SME content (Monitoring Agent, Data Agent) confirmed absent from console-body. WR-05: startTrace() has no prefers-reduced-motion guard — deferred to Phase 5 (PERF-04). |
| 4 | Canvas runs at ≤40 particles with O(n²) loop removed, violet color, pauses when tab hidden | PARTIAL | Particle count fixed at 35 (VERIFIED). Old conditional `width < 720 ? 42 : 82` absent. k-nearest loop replaces O(n²) (VERIFIED). Violet rgba(124,92,252) colors throughout (VERIFIED). visibilitychange cancel-on-hidden WIRED (line 304). CR-01 BUG: visibilitychange visible-branch (line 306) and initCanvas (line 291) both call drawNetwork() without prior cancelAnimationFrame — double-rAF race under early tab-switch. |
| 5 | "Currently taking 1-2 new projects" scarcity signal visible near hero CTA | VERIFIED | `index.html:54-57` — scarcity-signal paragraph with scarcity-dot span and exact copy, positioned after .hero-actions. `styles.css:371-392` — pulse-dot keyframe, .scarcity-signal flex layout, .scarcity-dot green animation. Reduced-motion guard at `styles.css:599-601`. |

**Score:** 4/5 truths verified (SC-4 PARTIAL due to CR-01)

---

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Canvas animation ignores prefers-reduced-motion in JS (CR-02) | Phase 5 | PERF-04 (Phase 5 SC-3): "enabling prefers-reduced-motion disables all CSS transitions and the canvas animation entirely" |
| 2 | Agent-trace startTrace() ignores prefers-reduced-motion (WR-05) | Phase 5 | PERF-04 (Phase 5 SC-3): covers all animation; WR-05 is within the same scope as CR-02 |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Rewritten hero copy block with scarcity signal and correct CTA structure | VERIFIED | h1, lede, scarcity-signal element, data-agent-trace hook, data-console-label hook, 4 flow-rows all present |
| `styles.css` | Scarcity signal styles, flow-dot pulse keyframe, console label fade, violet console border | VERIFIED | .scarcity-signal, .scarcity-dot, @keyframes pulse-dot, @keyframes flow-dot-pulse, .console-top strong.label-fade, rgba(124,92,252,0.32) border — all present |
| `script.js` | Rewritten canvas block with HERO-04 fixes | PARTIAL | All structural requirements met; CR-01 double-rAF race condition not fixed |
| `script.js` | Agent-trace animation block after canvas block | VERIFIED | Full dual-loop animation block at lines 315-432 with correct LOOPS config and MutationObserver |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| index.html .hero-copy | .scarcity-signal | element after .hero-actions | WIRED | `index.html:54` — scarcity-signal inside .hero-copy, directly after .hero-actions div |
| styles.css .ops-console | violet accent tokens | border rgba(124,92,252,0.32) and box-shadow var(--color-accent-dim) | WIRED | `styles.css:472-474` confirmed |
| script.js requestIdleCallback | initCanvas function | requestIdleCallback(initCanvas, {timeout:2000}) | WIRED | `script.js:295` confirmed |
| script.js visibilitychange | cancelAnimationFrame(animationFrame) | document.hidden check | WIRED (hidden branch only) | `script.js:303-304` — cancel on hidden WIRED. Visible branch (line 306) MISSING guard — CR-01. |
| script.js debounce wrapper | resizeCanvas | window.addEventListener("resize", debounce(resizeCanvas, 180)) | WIRED | `script.js:292` confirmed |
| script.js consoleEl | index.html [data-agent-trace] | document.querySelector("[data-agent-trace]") | WIRED | `script.js:318`, `index.html:59` |
| script.js consoleLabel | index.html [data-console-label] | document.querySelector("[data-console-label]") | WIRED | `script.js:319`, `index.html:64` |
| script.js MutationObserver | revealObserver is-visible class | attributeFilter: ["class"] on consoleEl | WIRED | `script.js:424-431` confirmed |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| script.js agent-trace | LOOPS config array | Hardcoded constant in script.js | Yes — static content, not fetched | FLOWING (intentional — static marketing content) |
| script.js canvas | particles array | createParticles() called from resizeCanvas() | Yes — Math.random() positions | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED (vanilla HTML/CSS/JS with no build step or runnable CLI entry point — all verification requires a browser render)

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HERO-01 | 02-01-PLAN.md | Hero headline serves both audiences in first-person voice | SATISFIED | h1 "AI systems built to run your business." at index.html:48; lede at line 49 — dual-audience, first-person |
| HERO-02 | 02-01-PLAN.md | Single primary CTA + secondary link; no form/phone/Gmail in hero | SATISFIED | Buttons at index.html:51-52; form is in #contact section only |
| HERO-03 | 02-03-PLAN.md | Animated agent orchestration trace in right column | SATISFIED | Full dual-loop animation block in script.js:315-432; old SME content absent |
| HERO-04 | 02-02-PLAN.md | Canvas: ≤40 particles, no O(n²), requestIdleCallback, visibilitychange pause, debounced resize, violet | PARTIALLY BLOCKED | All sub-requirements structurally present; CR-01 double-rAF race means pause guarantee is unreliable under early tab-switch sequence |
| HERO-05 | 02-01-PLAN.md | Scarcity signal visible in hero CTA area | SATISFIED | scarcity-signal element at index.html:54-57 |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| script.js | 306 | drawNetwork() called without cancelAnimationFrame(animationFrame) guard in visibilitychange visible branch | BLOCKER | Double-rAF race: early tab-switch creates orphaned animation loop; contradicts SC-4 "pauses when tab is hidden" guarantee |
| script.js | 291 | drawNetwork() called without cancelAnimationFrame(animationFrame) guard inside initCanvas | BLOCKER | Same root cause as above — part of the CR-01 double-rAF sequence |
| styles.css | 401 | `rgba(4, 217, 217, 0.45)` — old cyan color on .hero-contact-links border-bottom | WARNING | Residual cyan value from pre-Phase-2 CSS not in the hero section but in the same stylesheet; does not affect hero section visually; .hero-contact-links is not rendered in current hero markup |
| script.js | — | No prefers-reduced-motion guard in canvas initCanvas block (CR-02) | INFO/DEFERRED | Deferred to Phase 5 (PERF-04) |
| script.js | 415-418 | startTrace() has no prefers-reduced-motion guard (WR-05) | INFO/DEFERRED | Deferred to Phase 5 (PERF-04) |

---

### Human Verification Required

#### 1. Above-the-Fold Visual Check

**Test:** Open index.html in a browser at 1280px viewport width. Without scrolling, observe the hero section.
**Expected:** h1 "AI systems built to run your business." is readable above the fold. A violet "Book a discovery call" pill button and an outlined "View work" button are both visible. A small green pulsing dot followed by "Currently taking 1-2 new projects" text appears below the buttons. The right column shows the ops-console with a violet border and the Orchestrator row highlighted with a violet active border.
**Why human:** Above-the-fold layout and visual rendering require a browser — cannot verify programmatically.

#### 2. Agent-Trace Animation Live Behavior

**Test:** Open index.html in a browser and observe the ops-console terminal in the hero right column.
**Expected:** Console label reads "startup-pipeline". Orchestrator row becomes active with pulsing dot and a timer counting up ("0s", "1s", "2s"...). After ~2.8s, Build Agent row activates. After all 4 rows complete, a short pause, then the label fades out and back in as "sme-automation". Loop B begins (Orchestrator, Data Agent, Content Agent, Publish Agent). After Loop B, the sequence returns to Loop A.
**Why human:** Animation timing, DOM state transitions, and CSS transition rendering require a live browser.

---

### Gaps Summary

**1 gap blocking full SC-4 confidence:**

**CR-01 — Double rAF race on early tab-switch (script.js lines 291, 306)**

The canvas visibilitychange handler and initCanvas function both call `drawNetwork()` without first cancelling any existing rAF handle. Under the specific sequence — tab hidden before requestIdleCallback fires (within the first 2 seconds of page load) — two independent rAF loops start. The `animationFrame` variable only tracks the most recent loop. Any call to `cancelAnimationFrame(animationFrame)` orphans the first loop, which runs indefinitely at 60fps with no way to cancel it.

Root cause: two lines need a single-line fix each.

**Fix (both lines):**
```js
// visibilitychange visible branch (line 305-307):
} else if (canvas && context) {
  cancelAnimationFrame(animationFrame);  // ADD THIS
  drawNetwork();
}

// initCanvas (line 289-293):
const initCanvas = () => {
  resizeCanvas();
  cancelAnimationFrame(animationFrame);  // ADD THIS
  drawNetwork();
  window.addEventListener("resize", debounce(resizeCanvas, 180));
};
```

This is a 2-line fix. It is the only change needed to close the gap. All other SC-4 sub-requirements (particle count, algorithm, colors, deferred init, debounced resize) are fully satisfied.

---

_Verified: 2026-05-07_
_Verifier: Claude (gsd-verifier)_
