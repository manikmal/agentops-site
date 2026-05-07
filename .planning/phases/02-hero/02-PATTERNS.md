# Phase 2: Hero - Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 3 (index.html hero section, styles.css hero/canvas/console blocks, script.js canvas block)
**Analogs found:** 3 / 3 — all files are self-referential (the existing content of each file IS the analog; Phase 2 extends/rewrites within the same files)

---

## File Classification

| Modified File | Scope | Role | Data Flow | Closest Analog (within file) | Match Quality |
|---------------|-------|------|-----------|------------------------------|---------------|
| `index.html` lines 43–89 | hero section rewrite | markup/template | static content + data-attribute hooks | existing `.ops-console` / `.flow-row` block (lines 55–88) | exact — extend, not replace |
| `styles.css` hero/console/canvas rules | token usage + new classes | style | static | existing `.ops-console`, `.flow-row`, `.flow-dot`, `.hero-actions`, `.btn-primary` rules | exact — same token vocabulary |
| `script.js` lines 151–271 | canvas block full rewrite + new agent-trace block | animation / event-driven | rAF loop + visibilitychange event | existing `drawNetwork` / `resizeCanvas` / `pagehide` block (lines 151–271) | exact — replace in place, preserve surrounding block order |

---

## Pattern Assignments

### `index.html` — Hero Section (lines 43–89)

**Analog within file:** Lines 43–89 (current hero)

**Structure to preserve — `data-agent-canvas` hook** (line 44):
```html
<canvas class="agent-canvas" data-agent-canvas aria-hidden="true"></canvas>
```
Rule: JS always hooks elements via `data-*` attributes, never class selectors. The `data-agent-canvas` attribute must stay on the canvas element unchanged.

**Structure to preserve — `.hero-grid` two-column layout** (lines 45–89):
```html
<div class="hero-grid">
  <div class="hero-copy reveal">
    <img src="wordmark.png" alt="AgentOps Studio" class="hero-wordmark">
    <h1>...</h1>
    <p class="hero-lede">...</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#contact">Book a discovery call</a>
      <a class="btn btn-secondary" href="#portfolio">View work</a>
    </div>
    <!-- NEW: scarcity signal goes here, after .hero-actions -->
  </div>
  <div class="ops-console reveal" aria-label="Live automation console preview">
    ...
  </div>
</div>
```

**Structure to preserve — `.ops-console` / `.console-top` / `.console-body` / `.flow-row`** (lines 55–88):
```html
<div class="ops-console reveal" aria-label="Live automation console preview">
  <div class="console-top">
    <span></span>   <!-- red dot -->
    <span></span>   <!-- violet dot -->
    <span></span>   <!-- cyan dot -->
    <strong>live-agent-flow</strong>   <!-- label: JS will swap to startup-pipeline / sme-automation -->
  </div>
  <div class="console-body">
    <div class="flow-row active">
      <span class="flow-dot"></span>
      <div>
        <strong>Orchestrator</strong>
        <p>...</p>
      </div>
      <em>0s</em>
    </div>
    <div class="flow-row">
      <span class="flow-dot"></span>
      <div>
        <strong>Build Agent</strong>
        <p>...</p>
      </div>
      <em>•</em>
    </div>
    <!-- repeat for 4 rows per loop -->
  </div>
</div>
```
Phase 2 changes: expand to 4 rows per loop (currently 3), add `data-console-label` hook on the `<strong>` for JS label-swap, add `data-agent-trace` on `.ops-console` for the JS animation hook.

**New element — scarcity signal** (insert after `.hero-actions`, inside `.hero-copy`):
```html
<p class="scarcity-signal" aria-live="polite">
  <span class="scarcity-dot" aria-hidden="true"></span>
  Currently taking 1–2 new projects
</p>
```
Pattern rationale: `aria-live="polite"` follows the existing `data-form-status` live region pattern (line 318). Separate `<span>` for the dot follows `.flow-dot` precedent — the dot is a presentational child element of the text element.

**reveal class** — both `.hero-copy` and `.ops-console` already carry `reveal`. Do not remove. The agent-trace JS animation must check for `.is-visible` before starting (or start unconditionally with a short lead-in delay — Claude's discretion).

---

### `styles.css` — Hero / Canvas / Console Additions

**Analog:** Existing token vocabulary and console rules (lines 1–92 for tokens, lines 255–277 for `.hero` + `.agent-canvas`, lines 446–521 for `.ops-console` / `.console-top` / `.console-body` / `.flow-row` / `.flow-dot`)

**Token usage pattern — NEVER use raw hex or rgba in new rules:**
```css
/* WRONG — inline color */
border-color: rgba(124, 92, 252, 0.62);

/* RIGHT — token reference */
border-color: var(--color-accent);           /* for solid accent */
background: var(--color-accent-dim);         /* for glow/dim accent: rgba(124,92,252,0.12) */
color: var(--color-success);                 /* for green: #4ade80 */
color: var(--color-text-muted);              /* for muted text: rgba(255,255,255,0.50) */
color: var(--color-text-secondary);          /* for secondary text: #a1a1aa */
```
Available signal tokens: `--color-error` (red), `--color-success` (green), `--color-cyan`, `--color-accent`, `--color-accent-dim`, `--color-accent-hover`.

**iOS Safari constraint — from `.header-positioner` / `.site-header` split pattern** (lines 129–153):
```css
/* OUTER element: positioning/transform only — no backdrop-filter */
.header-positioner {
  position: fixed;
  transform: translateX(-50%);
  /* NO backdrop-filter here */
}

/* INNER element: visual styles — no transform */
.site-header {
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  /* NO transform here */
}
```
Apply same split to any new element that needs both `backdrop-filter` and `transform`. The `.ops-console` currently has neither — if a glassmorphism effect is added, split it.

**Existing `.ops-console` border pattern** (lines 446–452) — currently uses cyan tint; Phase 2 migrates to violet:
```css
/* CURRENT (to be updated) */
.ops-console {
  border: 1px solid rgba(4, 217, 217, 0.32);
  box-shadow: 0 30px 100px rgba(4, 217, 217, 0.1);
}

/* NEW pattern — use accent tokens */
.ops-console {
  border: 1px solid rgba(124, 92, 252, 0.32);   /* or: color-mix / token */
  box-shadow: 0 30px 100px var(--color-accent-dim);
}
```

**Existing `.flow-row.active` pattern** (lines 501–503) — active row border is already violet:
```css
.flow-row.active {
  border-color: rgba(124, 92, 252, 0.62);
}
```
Phase 2 JS will toggle `.active` dynamically. The CSS rule is already correct.

**Existing `.flow-dot` pattern** (lines 505–512) — dot always violet:
```css
.flow-dot {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  background: var(--color-accent);
  border-radius: 999px;
  box-shadow: 0 0 0 8px var(--color-accent-dim);
}
```
For active-row pulse animation, add a `@keyframes flow-pulse` and apply via `.flow-row.active .flow-dot` — do NOT change the base `.flow-dot` rule.

**New rules needed — scarcity signal:**
```css
/* Pattern: use --color-success for the green dot, --color-text-muted for text */
/* Pattern: pulsing dot uses @keyframes — same technique as the marquee animation */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.85); }
}

.scarcity-signal {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);        /* space-4: 16px */
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.scarcity-dot {
  width: 8px;
  height: 8px;
  background: var(--color-success);  /* green-400: #4ade80 */
  border-radius: var(--radius-full);
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}
```

**New rules needed — console label transition:**
```css
/* Pattern: fade uses opacity transition, same duration tokens as .reveal */
.console-top strong {
  /* existing rule at line 477–482 */
  transition: opacity var(--duration-base) var(--ease-out);
}

/* JS adds/removes .label-fade to trigger the opacity cycle */
.console-top strong.label-fade {
  opacity: 0;
}
```

**New rules needed — active flow-dot pulse:**
```css
@keyframes flow-dot-pulse {
  0%, 100% { box-shadow: 0 0 0 8px var(--color-accent-dim); }
  50%       { box-shadow: 0 0 0 12px var(--color-accent-dim); }
}

.flow-row.active .flow-dot {
  animation: flow-dot-pulse 1.4s ease-in-out infinite;
}
```

**Placement rule in styles.css** — CSS must mirror DOM top-to-bottom order:
- Scarcity signal rules go immediately after `.hero-actions` block (currently ends line 369)
- `.flow-row.active .flow-dot` pulse rule goes immediately after the existing `.flow-dot` block (currently ends line 512)
- Console label transition rule goes inside or immediately after `.console-top strong` (currently lines 477–482)
- `@keyframes` blocks go just before the rule that uses them

**`prefers-reduced-motion` pattern** (lines 548–561) — existing marquee uses it; apply same guard to any new CSS animation:
```css
@media (prefers-reduced-motion: reduce) {
  .scarcity-dot,
  .flow-row.active .flow-dot {
    animation: none;
  }
}
```

---

### `script.js` — Canvas Block Rewrite (lines 151–271) + New Agent-Trace Block

**Analog:** Existing canvas block (lines 151–271) — the rewrite preserves the overall shape while fixing counts, colors, and performance.

**Block order contract** — from CLAUDE.md architecture comment and existing file structure:
```
DOM refs             → lines 1–5
header               → lines 30–33
marquee              → lines 7–14
nav toggle           → lines 16–28
reveal observer      → lines 87–99
counter utilities    → lines 101–136
spotlight (cards)    → lines 138–149
canvas block         → lines 151–271   ← REWRITE THIS
agent-trace block    → (NEW — insert after canvas block, before any future blocks)
form handler         → lines 55–85
nav section tracking → lines 35–53
```
New agent-trace block must be a separate sequential block after the canvas block. Do NOT mix it into the canvas block.

**`data-*` hook pattern — all DOM queries use data attributes** (lines 1–5 and 151–152):
```js
// CORRECT — data attribute selector
const canvas = document.querySelector("[data-agent-canvas]");
const leadForm = document.querySelector("[data-lead-form]");

// WRONG — class selector for JS-driven elements
const canvas = document.querySelector(".agent-canvas");
```
New agent-trace hooks must follow this pattern:
```js
const consoleEl = document.querySelector("[data-agent-trace]");
const consoleLabel = document.querySelector("[data-console-label]");
```

**`resizeCanvas` pattern** (lines 156–164) — devicePixelRatio clamping + setTransform:
```js
function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvas.width = Math.floor(bounds.width * ratio);
  canvas.height = Math.floor(bounds.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(bounds.width, bounds.height);
}
```
Keep this structure. Change: add debounce wrapper around the resize listener (150–200ms). Do NOT call `resizeCanvas` directly from the resize event.

**Debounce pattern** — no existing debounce utility; add inline before canvas block:
```js
function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}
```
Usage: `window.addEventListener("resize", debounce(resizeCanvas, 180));`

**`createParticles` pattern** (lines 166–181) — change count cap and remove mobile branch:
```js
// CURRENT (to replace)
const count = width < 720 ? 42 : 82;   // violates ≤40 cap

// NEW pattern
const count = 35;                        // fixed, ≤40 at all sizes
```
Particle object shape must keep `baseVx`/`baseVy` for spring-back (lines 172–180).

**`drawNetwork` loop pattern** (lines 183–247) — recursive rAF, self-contained:
```js
function drawNetwork() {
  if (!canvas || !context) return;
  // ... draw logic ...
  animationFrame = requestAnimationFrame(drawNetwork);   // line 246: recursive call assigns to cancelable ID
}
```
Keep this exact recursive assignment pattern. The `animationFrame` variable at module scope (line 154) is what `cancelAnimationFrame` and `pagehide` target.

**Color changes in `drawNetwork`:**
```js
// CURRENT lines (to replace)
context.strokeStyle = `rgba(4, 217, 217, ${opacity * 0.24})`;  // cyan lines — REMOVE
context.fillStyle = "rgba(164, 246, 63, 0.8)";                  // lime dots — REMOVE

// NEW values per D-15
context.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.15})`;  // violet lines
context.fillStyle = "rgba(124, 92, 252, 0.8)";                  // violet particles
```

**O(n²) line-drawing replacement — k-nearest neighbors** (lines 219–237):
```js
// CURRENT — O(n²) all-pairs (lines 219–237, to replace)
for (let i = 0; i < particles.length; i++) {
  for (let j = i + 1; j < particles.length; j++) {
    // draws lines between all pairs within 150px
  }
}

// NEW pattern — O(n×k): for each particle, sort others by distance, take k nearest
// k = 6 (Claude's discretion within 5–8 range from D-14)
// Only compare within distance threshold first to avoid full sort
for (let i = 0; i < particles.length; i++) {
  const a = particles[i];
  const neighbors = [];
  for (let j = 0; j < particles.length; j++) {
    if (i === j) continue;
    const b = particles[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = dx * dx + dy * dy;   // squared distance avoids sqrt
    if (dist < 150 * 150) neighbors.push({ b, dist });
  }
  neighbors.sort((x, y) => x.dist - y.dist);
  const k = Math.min(6, neighbors.length);
  for (let n = 0; n < k; n++) {
    const d = Math.sqrt(neighbors[n].dist);
    const opacity = 1 - d / 150;
    context.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.15})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(neighbors[n].b.x, neighbors[n].b.y);
    context.stroke();
  }
}
```

**Mouse interaction — desktop-only gate per D-16:**
```js
// CURRENT — unconditional (lines 251–261)
window.addEventListener("mousemove", (event) => { ... });

// NEW pattern — check pointer device at listener registration
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -999;
    mouse.y = -999;
  });
}
```
`(pointer: fine)` is the correct media query for "mouse present" — it's falsy on touch-only devices and truthy on desktop/trackpad.

**`requestIdleCallback` init pattern per D-17** (replaces lines 263–267):
```js
// CURRENT — immediate init
if (canvas && context) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
}

// NEW pattern — deferred via requestIdleCallback with setTimeout Safari fallback
if (canvas && context) {
  const initCanvas = () => {
    resizeCanvas();
    drawNetwork();
    window.addEventListener("resize", debounce(resizeCanvas, 180));
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);   // Safari fallback
  }
}
```

**`visibilitychange` pause pattern per D-17** (new, insert before `pagehide` listener):
```js
// Pattern mirrors the existing pagehide handler (lines 269–271)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else if (canvas && context) {
    drawNetwork();   // restart loop when tab becomes visible again
  }
});

// EXISTING — keep unchanged
window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
});
```

**`pagehide` pattern** (lines 269–271) — keep exactly as-is:
```js
window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
});
```

**Agent-trace animation block — new sequential block after canvas:**
```js
// ============================================================
// AGENT TRACE — dual-loop console animation
// ============================================================
const consoleEl = document.querySelector("[data-agent-trace]");
const consoleLabel = document.querySelector("[data-console-label]");

if (consoleEl) {
  // Data structure pattern: arrays of loop configs
  const LOOPS = [
    {
      label: "startup-pipeline",
      steps: [
        { agent: "Orchestrator", task: "Merge detected on main" },
        { agent: "Build Agent",  task: "Compiling and bundling" },
        { agent: "Test Agent",   task: "Running integration suite" },
        { agent: "Deploy Agent", task: "Pushing to production" }
      ]
    },
    {
      label: "sme-automation",
      steps: [
        { agent: "Orchestrator",  task: "Weekly report triggered" },
        { agent: "Data Agent",    task: "Pulling campaign metrics" },
        { agent: "Content Agent", task: "Generating summary copy" },
        { agent: "Publish Agent", task: "Sending to Notion + Slack" }
      ]
    }
  ];

  // Pattern: read rows from DOM at init, don't regenerate on each loop
  const rows = Array.from(consoleEl.querySelectorAll(".flow-row"));

  let traceTimeout = null;
  let currentLoop = 0;
  let currentStep = 0;
  let stepStart = null;
  let elapsedInterval = null;

  // Pattern: elapsed timer ticks per active row — mirrors animateCounter (lines 105–122)
  // using setInterval rather than rAF since 1s precision is sufficient

  function activateRow(stepIndex) {
    rows.forEach((row, i) => {
      row.classList.toggle("active", i === stepIndex);
    });
    const em = rows[stepIndex] && rows[stepIndex].querySelector("em");
    if (em) {
      em.textContent = "0s";
      stepStart = Date.now();
      clearInterval(elapsedInterval);
      elapsedInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - stepStart) / 1000);
        em.textContent = elapsed + "s";
      }, 1000);
    }
  }

  function resetRows() {
    clearInterval(elapsedInterval);
    rows.forEach((row) => {
      row.classList.remove("active");
      const em = row.querySelector("em");
      if (em) em.textContent = "•";
    });
  }

  function populateRows(loop) {
    loop.steps.forEach((step, i) => {
      if (!rows[i]) return;
      const strong = rows[i].querySelector("strong");
      const p = rows[i].querySelector("p");
      if (strong) strong.textContent = step.agent;
      if (p) p.textContent = step.task;
    });
  }

  function swapLabel(newLabel) {
    if (!consoleLabel) return;
    // Pattern: fade matches .reveal transition duration token
    consoleLabel.classList.add("label-fade");
    setTimeout(() => {
      consoleLabel.textContent = newLabel;
      consoleLabel.classList.remove("label-fade");
    }, 250);   // --duration-base value
  }

  function runStep() {
    activateRow(currentStep);
    const MS_PER_STEP = 2800;   // Claude's discretion: 2–4s range per D-10
    traceTimeout = setTimeout(() => {
      currentStep += 1;
      if (currentStep < LOOPS[currentLoop].steps.length) {
        runStep();
      } else {
        // All steps done — pause then switch loop
        clearInterval(elapsedInterval);
        traceTimeout = setTimeout(() => {
          resetRows();
          currentLoop = (currentLoop + 1) % LOOPS.length;
          currentStep = 0;
          populateRows(LOOPS[currentLoop]);
          swapLabel(LOOPS[currentLoop].label);
          traceTimeout = setTimeout(runStep, 400);
        }, 1200);   // pause between loops
      }
    }, MS_PER_STEP);
  }

  // Start: wait for reveal to fire (or use short lead-in)
  // Pattern: check is-visible at start, else wait on the same revealObserver threshold
  function startTrace() {
    populateRows(LOOPS[0]);
    swapLabel(LOOPS[0].label);
    traceTimeout = setTimeout(runStep, 600);
  }

  if (consoleEl.classList.contains("is-visible")) {
    startTrace();
  } else {
    // MutationObserver waits for revealObserver to add is-visible
    const mo = new MutationObserver(() => {
      if (consoleEl.classList.contains("is-visible")) {
        mo.disconnect();
        startTrace();
      }
    });
    mo.observe(consoleEl, { attributeFilter: ["class"] });
  }
}
```

---

## Shared Patterns

### CSS Custom Property Usage
**Source:** `styles.css` lines 1–92 (token blocks)
**Apply to:** Every new CSS rule in Phase 2

Color tokens available for Phase 2 use:
- `--color-accent` → `#7c5cfc` (violet — particles, active borders, primary CTA)
- `--color-accent-dim` → `rgba(124,92,252,0.12)` (glow halos, backgrounds)
- `--color-accent-hover` → `#9b7fff` (hover states)
- `--color-success` → `#4ade80` (scarcity dot green)
- `--color-text-muted` → `rgba(255,255,255,0.50)` (scarcity text)
- `--color-text-secondary` → `#a1a1aa` (console row secondary text)
- `--color-border` → `rgba(255,255,255,0.08)`
- `--duration-fast` → `150ms`, `--duration-base` → `250ms`, `--ease-out` → cubic-bezier
- Spacing: `--space-2` (8px), `--space-4` (16px) etc.
- Radius: `--radius-md` (8px), `--radius-full` (9999px)

### Reveal Animation Pattern
**Source:** `styles.css` lines 799–808, `script.js` lines 87–99
**Apply to:** `.hero-copy`, `.ops-console` (both already carry `reveal`)

CSS:
```css
.js .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 620ms ease, transform 620ms ease;
}
.js .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```
JS (IntersectionObserver fires once, then unobserves):
```js
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
```
Any new element that needs reveal just gets the `reveal` class — no JS changes required.

### iOS Safari backdrop-filter Split
**Source:** `styles.css` lines 129–153
**Apply to:** Any new element using both `backdrop-filter` AND `transform`

Rule: outer element takes `position`/`transform`/`z-index` only. Inner element takes `backdrop-filter`/`-webkit-backdrop-filter`/`background`/`border`. Never both on the same element.

### `requestAnimationFrame` Cancel Pattern
**Source:** `script.js` lines 154, 246, 269–271
**Apply to:** Canvas block (rewrite) and any future animation loops

```js
let animationFrame = 0;   // module-scope, cancelable ID
// ...inside loop function:
animationFrame = requestAnimationFrame(drawNetwork);
// ...cancel:
cancelAnimationFrame(animationFrame);
```

### `prefers-reduced-motion` Guard
**Source:** `styles.css` lines 548–561 (marquee), `script.js` line 106 (counter)
**Apply to:** New CSS animations (scarcity dot pulse, flow-dot pulse); canvas `drawNetwork` already skips motion implicitly

CSS:
```css
@media (prefers-reduced-motion: reduce) {
  .scarcity-dot,
  .flow-row.active .flow-dot {
    animation: none;
  }
}
```
JS (canvas) — use the same guard as `animateCounter`:
```js
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
```
Apply this before starting the canvas `drawNetwork` loop.

---

## No Analog Found

All three modified files already exist in the codebase. No net-new file requires an external analog. The only genuinely new patterns (neighbor-limited line drawing, `requestIdleCallback` deferral, dual-loop console animation, `visibilitychange` pause) are described via first-principles excerpts in the Pattern Assignments section above, derived from the project's own established conventions (rAF cancel, data-attribute hooks, token usage).

---

## Metadata

**Analog search scope:** `index.html`, `styles.css`, `script.js` (entire codebase — single-file architecture)
**Files scanned:** 3 source files + `02-CONTEXT.md` + `01-CONTEXT.md` (for Phase 1 carry-forward decisions)
**Pattern extraction date:** 2026-05-07
