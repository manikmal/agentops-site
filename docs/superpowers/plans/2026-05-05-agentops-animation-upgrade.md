# AgentOps Studio Animation Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 animation effects to the AgentOps Studio site — animated counters, infinite marquee, glowing card borders, and mouse-repel hero particles.

**Architecture:** Pure CSS/JS additions to the existing 3-file site. No build tools, no dependencies, no new files. Each effect is self-contained and does not affect the others. All changes are backward-compatible and degrade gracefully.

**Tech Stack:** Vanilla JS (ES2020), CSS animations/keyframes, IntersectionObserver, requestAnimationFrame, Canvas API.

---

## File Structure

| File | What changes |
|------|-------------|
| `index.html` | Add `data-counter-*` attrs to 3 metric `<strong>` elements; wrap logo strip spans in `.marquee-track` div |
| `styles.css` | Replace logo-strip flex with marquee layout + keyframe; upgrade all card hover rules to layered glow; add transition to `.portfolio-card` |
| `script.js` | Add counter animation; add marquee item cloning; extend canvas loop with mouse-repel + damping |

---

### Task 1: Animated Counters

**Files:**
- Modify: `index.html` — hero metrics strongs
- Modify: `script.js` — append counter logic after the revealObserver block

- [ ] **Step 1: Add data attributes to metric elements in `index.html`**

Find the `.hero-metrics` block and update the three `<strong>` elements. Before:

```html
<div class="hero-metrics" aria-label="Service highlights">
  <span><strong>24/7</strong> workflow monitoring</span>
  <span><strong>3x</strong> faster follow-ups</span>
  <span><strong>0</strong> spreadsheet chaos</span>
</div>
```

After:

```html
<div class="hero-metrics" aria-label="Service highlights">
  <span><strong data-counter-start="0" data-counter-end="24" data-counter-suffix="/7">24/7</strong> workflow monitoring</span>
  <span><strong data-counter-start="0" data-counter-end="3" data-counter-suffix="x">3x</strong> faster follow-ups</span>
  <span><strong data-counter-start="50" data-counter-end="0" data-counter-suffix="">0</strong> spreadsheet chaos</span>
</div>
```

- [ ] **Step 2: Add counter logic to `script.js`**

Append after the `revealObserver` block (after the `document.querySelectorAll(".reveal").forEach(...)` line):

```js
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const start = parseInt(el.dataset.counterStart, 10);
  const end = parseInt(el.dataset.counterEnd, 10);
  const suffix = el.dataset.counterSuffix ?? '';
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + (end - start) * easeOut(progress));
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-counter-end]').forEach((el) => counterObserver.observe(el));
```

- [ ] **Step 3: Verify in browser**

Open the site (run `python3 -m http.server 8080` in the project root and visit `http://localhost:8080`, or open `index.html` directly).

Expected:
- On page load the metrics show their initial values (`0/7`, `0x`, `50`)
- As the hero scrolls into view (or on load if already visible), numbers animate: `0→24/7`, `0→3x`, `50→0`
- Animation takes ~1.2s with a smooth ease-out curve
- Animation fires only once per page load — no repeat on re-scroll

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: animated counters on hero metrics"
```

---

### Task 2: Infinite Marquee

**Files:**
- Modify: `index.html` — wrap logo strip spans in `.marquee-track`
- Modify: `styles.css` — replace logo-strip flex layout with marquee layout + keyframe
- Modify: `script.js` — clone marquee items on init (prepend near top, after initial variable declarations)

- [ ] **Step 1: Wrap logo strip items in `.marquee-track` in `index.html`**

Find the `.logo-strip` section. Before:

```html
<section class="logo-strip" aria-label="Systems we connect">
  <span>Google Sheets</span>
  <span>WhatsApp</span>
  <span>Gmail</span>
  <span>GitHub</span>
  <span>Docker</span>
  <span>Meta</span>
</section>
```

After:

```html
<section class="logo-strip" aria-label="Systems we connect">
  <div class="marquee-track">
    <span>Google Sheets</span>
    <span>WhatsApp</span>
    <span>Gmail</span>
    <span>GitHub</span>
    <span>Docker</span>
    <span>Meta</span>
  </div>
</section>
```

- [ ] **Step 2: Replace `.logo-strip` rule and add marquee styles in `styles.css`**

Find and replace the entire `.logo-strip` block. Before:

```css
.logo-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 20px 24px;
  background: var(--white);
  border-bottom: 1px solid var(--line);
}
```

After (replace the old block and add new rules below it):

```css
.logo-strip {
  overflow: hidden;
  padding: 20px 0;
  background: var(--white);
  border-bottom: 1px solid var(--line);
}

.marquee-track {
  display: inline-flex;
  gap: 10px;
  padding: 0 5px;
  animation: marquee 18s linear infinite;
  will-change: transform;
}

.logo-strip:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .logo-strip {
    overflow: visible;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 24px;
    gap: 10px;
  }
  .marquee-track {
    animation: none;
    display: contents;
  }
}
```

Note: `display: contents` in the reduced-motion rule makes `.marquee-track` layout-transparent — its `<span>` children participate directly in `.logo-strip`'s flex layout as if the wrapper div doesn't exist.

- [ ] **Step 3: Clone marquee items in `script.js`**

Append after the initial variable declarations at the top of the file (after the `const formStatus = ...` line, before the `navToggle` event listener block):

```js
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  Array.from(marqueeTrack.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.appendChild(clone);
  });
}
```

Cloning doubles the items (6 → 12). The CSS `translateX(-50%)` then scrolls exactly one full set width before looping, creating a seamless infinite ticker.

- [ ] **Step 4: Verify in browser**

Expected:
- Logo strip scrolls continuously left, looping with no visible seam or jump
- Speed feels like a calm ticker tape — full cycle in 18s
- Hovering over the strip freezes the scroll; moving off resumes it
- No layout shift on the surrounding sections
- On a device/OS with `prefers-reduced-motion: reduce` enabled, the strip shows all 6 items in a static wrapping flex row

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: infinite marquee on logo strip"
```

---

### Task 3: Glowing Card Borders

**Files:**
- Modify: `styles.css` — replace combined card hover rule; add `.package-card.featured:hover` override; add `transition` to `.portfolio-card`

- [ ] **Step 1: Replace the combined card hover rule in `styles.css`**

Find the combined hover rule. Before:

```css
.agent-card:hover,
.devops-card:hover,
.package-card:hover,
.mini-card:hover,
.timeline-step:hover,
.portfolio-card:hover {
  transform: translateY(-5px);
  border-color: rgba(4, 217, 217, 0.65);
  box-shadow: var(--shadow);
}
```

After (replace the old block and add the featured override immediately after):

```css
.agent-card:hover,
.devops-card:hover,
.package-card:hover,
.mini-card:hover,
.timeline-step:hover,
.portfolio-card:hover {
  transform: translateY(-5px);
  border-color: transparent;
  box-shadow:
    0 0 0 1px rgba(4, 217, 217, 0.7),
    0 0 20px rgba(4, 217, 217, 0.35),
    0 0 60px rgba(4, 217, 217, 0.12),
    var(--shadow);
}

.package-card.featured:hover {
  border-color: transparent;
  box-shadow:
    0 0 0 1px rgba(164, 246, 63, 0.7),
    0 0 20px rgba(164, 246, 63, 0.35),
    0 0 60px rgba(164, 246, 63, 0.12),
    var(--shadow);
}
```

Cyan glow for all light-background cards. Lime glow for the dark `.featured` package card so the glow is legible against its dark background.

- [ ] **Step 2: Add `transition` to `.portfolio-card` in `styles.css`**

Find the `.wide-card, .portfolio-card` rule. Before:

```css
.wide-card,
.portfolio-card {
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 18px 50px rgba(8, 10, 10, 0.06);
}
```

After (keep existing rule as-is, add a new focused rule for `.portfolio-card` immediately below it):

```css
.wide-card,
.portfolio-card {
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 18px 50px rgba(8, 10, 10, 0.06);
}

.portfolio-card {
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
```

Portfolio cards were previously missing a transition declaration (the hover effect happened instantly). This fixes that regression while adding glow support.

- [ ] **Step 3: Verify in browser**

Expected:
- Hovering any light-background card (agents, devops, packages, timeline, portfolio) shows a cyan glow: crisp 1px ring + mid halo + outer ambient bloom
- Hovering the dark "AI Agent Build" featured package card shows lime/green glow
- All glows transition in and out smoothly in ~180ms
- Portfolio cards (displayed on the dark portfolio section) glow cyan and animate smoothly

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: glowing box-shadow on card hover"
```

---

### Task 4: Mouse-Repel Particles

**Files:**
- Modify: `script.js` — update `createParticles` to store baseline velocities; add `mouse` object + event listeners; extend particle update loop in `drawNetwork`

- [ ] **Step 1: Update `createParticles` to store baseline velocity in `script.js`**

Find the `createParticles` function. Before:

```js
function createParticles(width, height) {
  const count = width < 720 ? 42 : 82;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    radius: Math.random() * 1.8 + 1
  }));
}
```

After:

```js
function createParticles(width, height) {
  const count = width < 720 ? 42 : 82;
  particles = Array.from({ length: count }, () => {
    const vx = (Math.random() - 0.5) * 0.42;
    const vy = (Math.random() - 0.5) * 0.42;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      baseVx: vx,
      baseVy: vy,
      radius: Math.random() * 1.8 + 1
    };
  });
}
```

`baseVx` / `baseVy` are the particle's natural drift velocity. The repel logic uses them to pull velocity back to normal after the cursor moves away.

- [ ] **Step 2: Add `mouse` object and event listeners in `script.js`**

Find the `if (canvas && context)` block near the bottom of the file. Insert the following immediately before it:

```js
const mouse = { x: -999, y: -999 };

window.addEventListener('mousemove', (event) => {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

window.addEventListener('mouseleave', () => {
  mouse.x = -999;
  mouse.y = -999;
});
```

Starting at `{ x: -999, y: -999 }` ensures particles are never repelled on page load before the cursor enters the canvas.

- [ ] **Step 3: Replace the particle update loop inside `drawNetwork` in `script.js`**

Find the particle movement loop inside `drawNetwork`. Before:

```js
for (const particle of particles) {
  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.x < 0 || particle.x > width) particle.vx *= -1;
  if (particle.y < 0 || particle.y > height) particle.vy *= -1;
}
```

After:

```js
for (const particle of particles) {
  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.x < 0 || particle.x > width) particle.vx *= -1;
  if (particle.y < 0 || particle.y > height) particle.vy *= -1;

  const mdx = particle.x - mouse.x;
  const mdy = particle.y - mouse.y;
  const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

  if (mdist < 120 && mdist > 0) {
    const force = ((120 - mdist) / 120) * 0.6;
    particle.vx += (mdx / mdist) * force;
    particle.vy += (mdy / mdist) * force;
  }

  const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
  if (speed > 3) {
    particle.vx = (particle.vx / speed) * 3;
    particle.vy = (particle.vy / speed) * 3;
  }

  particle.vx += (particle.baseVx - particle.vx) * 0.02;
  particle.vy += (particle.baseVy - particle.vy) * 0.02;
}
```

How the math works:
- Repel radius: 120px. Force scales linearly from 0 (at edge) to 0.6 (at cursor).
- Speed cap: max 3px/frame prevents particles flying off screen.
- Damping: each frame, velocity moves 2% closer to baseline — particles fully settle in ~150 frames (~2.5s at 60fps).

- [ ] **Step 4: Verify in browser**

Expected:
- Moving the cursor over the hero canvas causes nearby particles to scatter outward from the cursor
- Particles closest to the cursor are pushed harder than those at 120px range
- When the cursor is still, particles slow and resume their gentle drift over ~2–3 seconds
- Moving the cursor off the window (`mouseleave`) particles drift back to normal immediately
- No particles teleport, get stuck at edges, or produce jank — animation stays smooth at 60fps

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: mouse-repel particles on hero canvas"
```
