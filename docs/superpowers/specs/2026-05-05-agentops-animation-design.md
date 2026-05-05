# AgentOps Studio — Animation & Interactivity Upgrade

**Date:** 2026-05-05
**Scope:** Energetic startup feel via 4 targeted effects. No layout changes, no new sections.

---

## Effects

### 1. Animated Counters (metrics in hero)

**What:** The three `<strong>` elements inside `.hero-metrics` count up/down when scrolled into view.

**Values:**
- `24/7` → counts 0→24, appends `/7`
- `3x` → counts 0→3, appends `x`
- `0` → counts 50→0

**Implementation:**
- Add `data-counter-end`, `data-counter-start`, `data-counter-suffix` attributes to each `<strong>`
- IntersectionObserver on `.hero-metrics` (threshold 0.5) triggers a `requestAnimationFrame` loop
- Duration: 1200ms, ease-out easing (`t => 1 - Math.pow(1 - t, 3)`)
- Fires once — observer disconnects after trigger

**Files changed:** `index.html` (data attrs), `script.js` (counter logic)

---

### 2. Infinite Marquee (logo strip)

**What:** The `.logo-strip` scrolls continuously left like a ticker tape.

**Implementation:**
- Wrap existing `<span>` items in an inner `.marquee-track` div
- Duplicate the track items (clone set appended via JS on init, or duplicated in HTML)
- CSS `@keyframes marquee`: `transform: translateX(0)` → `translateX(-50%)`, 18s linear infinite
- `.logo-strip` gets `overflow: hidden`, `white-space: nowrap`, `display: block`
- `.marquee-track` gets `display: inline-flex`, `animation: marquee`
- Pauses on `.logo-strip:hover .marquee-track { animation-play-state: paused }`
- `prefers-reduced-motion` media query disables animation, falls back to static flex layout

**Files changed:** `index.html` (wrap in track div), `styles.css` (marquee keyframe + track styles)

---

### 3. Glowing Card Borders (hover state)

**What:** Cards glow with a layered cyan box-shadow on hover instead of just a border color change.

**Glow layers (cyan — default cards):**
```
box-shadow:
  0 0 0 1px rgba(4, 217, 217, 0.7),
  0 0 20px rgba(4, 217, 217, 0.35),
  0 0 60px rgba(4, 217, 217, 0.12),
  var(--shadow);
```

**Glow layers (lime — `.package-card.featured` only, dark card background):**
```
box-shadow:
  0 0 0 1px rgba(164, 246, 63, 0.7),
  0 0 20px rgba(164, 246, 63, 0.35),
  0 0 60px rgba(164, 246, 63, 0.12),
  var(--shadow);
```

**Applies to:** `.agent-card`, `.devops-card`, `.package-card`, `.mini-card`, `.timeline-step`, `.portfolio-card`

**Transition:** existing `180ms ease` covers `box-shadow` — no change needed.

**Files changed:** `styles.css` (hover rules only)

---

### 4. Mouse-Repel Particles (hero canvas)

**What:** Hero background particles flee the cursor, drifting back when it moves away.

**Implementation:**
- Add `mouse = { x: -999, y: -999 }` object in canvas scope
- `mousemove` on `window`: map `clientX/clientY` to canvas coordinate space, update `mouse`
- `mouseleave` on `window`: reset `mouse` to `{ x: -999, y: -999 }`
- In `drawNetwork()`, after updating each particle position:
  - Compute `dx = particle.x - mouse.x`, `dy = particle.y - mouse.y`
  - If `distance < 120`: apply force `force = (120 - distance) / 120 * 0.6`
  - Push `vx += (dx / distance) * force`, `vy += (dy / distance) * force`
  - Cap total speed: if `speed > 3`, scale `vx`/`vy` back to 3
- Damping: each frame, nudge `vx`/`vy` 2% toward original baseline velocity (stored on particle creation as `particle.baseVx`, `particle.baseVy`)

**Files changed:** `script.js` (canvas section only)

---

## Files Changed Summary

| File | Changes |
|------|---------|
| `index.html` | data attrs on metrics `<strong>`, wrap logo items in `.marquee-track` |
| `styles.css` | marquee keyframe + track styles, upgraded hover glow on all card types |
| `script.js` | counter logic, marquee item duplication, mouse-repel canvas extension |

## Out of Scope

- No new sections or layout changes
- No staggered card entrances
- No scroll progress bar
- No text scramble/typewriter on headline
- No section background gradients or blobs
