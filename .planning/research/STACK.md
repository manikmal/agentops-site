# Stack Research: AgentOps Studio Website

**Project:** AgentOps Studio — premium AI engineering studio website  
**Researched:** 2026-05-06  
**Constraint:** Vanilla HTML/CSS/JS only — no build step, no framework, single `index.html`  
**Reference aesthetic:** Linear.app  

---

## Recommended Stack

| Layer | Choice | Rationale | Confidence |
|-------|--------|-----------|------------|
| HTML structure | Semantic HTML5, single `index.html` | Already in place; marketing site has no routing or state requirements that justify added complexity | HIGH |
| CSS architecture | Native CSS custom properties + utility-free BEM-lite | Design tokens via `:root` vars, component classes, no utility framework needed at this scale | HIGH |
| CSS layout | CSS Grid + Flexbox (no library) | Grid handles the two-column hero and card grids natively; browser support is universal | HIGH |
| Animation — entrance | `IntersectionObserver` + CSS `@keyframes` / `transition` | Already implemented in the codebase; zero runtime cost, respects `prefers-reduced-motion` | HIGH |
| Animation — scroll | Native `scroll-driven animations` (CSS) or lightweight JS scroll handler | CSS scroll-driven animations (spec shipped in Chrome 115+/Safari 18+) are the 2025 standard for parallax/progress effects; fall back to JS for older browsers | HIGH |
| Animation — complex/hero | GSAP 3 (CDN, free tier) | The only library justified for timeline animations, stagger sequences, or the hero particle system. Free tier covers all marketing site use cases. Load from `cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` | HIGH |
| Scroll-triggered GSAP | GSAP ScrollTrigger plugin | Pairs with GSAP; handles pinning, scrub animations, section reveals at a level CSS scroll-driven animations can't match for complex sequences | HIGH |
| Particles / hero canvas | Custom `<canvas>` (already implemented) | The existing particle/network canvas is already built and well-tuned. Retain and refine rather than replace with a library | HIGH |
| Icons | Lucide Icons (CDN, tree-shaken SVG sprite or inline SVG) or inline SVG | Lucide is the standard icon set used by Linear, Vercel, and modern tooling UIs. 1,500+ icons, MIT license, consistent 24px grid. Use inline SVG snippets — no JS icon library needed | HIGH |
| Font loading | Google Fonts via `<link rel="preconnect">` + `display=swap` | Already partially implemented; extend with correct preconnect pattern | HIGH |
| Netlify deploy | Existing `netlify.toml` pipeline | No change required | HIGH |

---

## Typography

### Primary Recommendation: Inter (Variable Font)

Inter is the correct choice and is already loaded in the project. The key upgrade for the redesign is loading the **variable** version rather than individual weights.

```html
<!-- Replace current font loading with this exact pattern -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
```

**Why Inter over alternatives:**

- Linear.app uses Inter. Vercel uses Inter. GitHub's interface uses Inter. It is the canonical "serious technical product" typeface of this era.
- The variable font (`opsz,wght` axes) covers every weight from 100–900 in a single network request (~80 KB vs. 4–5 separate weight files).
- The `opsz` (optical size) axis — range 14–32 — adjusts letter spacing and stroke width automatically at display sizes vs. body sizes. This is what makes Inter feel "designed" at large headings rather than just scaled up.

**CSS font stack:**

```css
:root {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  font-family: var(--font-sans);
  font-optical-sizing: auto; /* activates the opsz axis */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Anti-aliasing matters enormously on dark backgrounds.** Light text on dark without `-webkit-font-smoothing: antialiased` renders heavier and less refined. This is one of the most visible differences between amateur and premium dark UIs.

### Secondary / Monospace: JetBrains Mono or Fira Code

For code snippets, terminal UI elements, and any metric/data display that should feel technical:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
```

```css
:root {
  --font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code",
    ui-monospace, "Courier New", monospace;
}
```

JetBrains Mono over Fira Code because: it has a variable weight axis (one request), slightly wider x-height improves readability in small console UI elements, and it reads as "engineering tool" rather than "developer blog."

### Type Scale (Linear-inspired)

The existing scale is close but the headings need tighter `letter-spacing` at display sizes — a hallmark of Linear's refined feel:

```css
/* Display */
h1 { font-size: clamp(2.8rem, 6vw, 5.2rem); letter-spacing: -0.04em; line-height: 1.02; font-weight: 700; }
h2 { font-size: clamp(2rem, 4vw, 3.4rem); letter-spacing: -0.03em; line-height: 1.06; font-weight: 700; }
h3 { font-size: clamp(1.1rem, 2vw, 1.25rem); letter-spacing: -0.01em; line-height: 1.3; font-weight: 600; }

/* Body */
.body-lg  { font-size: 1.125rem; line-height: 1.65; font-weight: 400; }
.body-md  { font-size: 1rem;     line-height: 1.6;  font-weight: 400; }
.body-sm  { font-size: 0.875rem; line-height: 1.55; font-weight: 400; }

/* Label */
.label    { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
```

Use `clamp()` for fluid type — no breakpoint-based font-size overrides needed. **Negative letter-spacing on headings is the single biggest visual upgrade from "developer project" to "premium product."**

---

## Color System

### Philosophy: True Black Foundation, Precise Layering

Linear uses near-black (not pure `#000000`) as its base. Pure black creates a harsh "LCD bleed" effect on OLED screens. The correct approach is a dark grey hierarchy with exactly 4–5 surface levels, each distinguished by ~5% lightness steps.

### Palette

```css
:root {
  /* === SURFACES (dark theme foundation) === */
  --color-bg:          #0a0a0b;  /* Page background — near-black with slight warm undertone */
  --color-surface-1:   #111113;  /* Cards, panels — 1 step above bg */
  --color-surface-2:   #18181b;  /* Elevated cards, modals — 2 steps */
  --color-surface-3:   #232326;  /* Hover states, code blocks */

  /* === BORDERS === */
  --color-border:      rgba(255, 255, 255, 0.08);  /* Default border — extremely subtle */
  --color-border-hover:rgba(255, 255, 255, 0.16);  /* Hovered border */
  --color-border-focus:rgba(255, 255, 255, 0.28);  /* Focus/active border */

  /* === TEXT === */
  --color-text-primary:  #f4f4f5;  /* Headlines — near-white, not pure white */
  --color-text-secondary:#a1a1aa;  /* Body copy, descriptions */
  --color-text-tertiary: #71717a;  /* Captions, metadata, labels */
  --color-text-disabled:  #3f3f46;  /* Disabled states */

  /* === ACCENT: violet-indigo (Linear's signature) === */
  --color-accent:      #7c5cfc;  /* Primary CTA, active states — violet */
  --color-accent-dim:  rgba(124, 92, 252, 0.12);  /* Accent glow/tint backgrounds */
  --color-accent-hover:#9b7fff;  /* Hover on accent */

  /* === SIGNAL COLORS === */
  --color-cyan:   #22d3ee;  /* Data, success indicators, graph highlights */
  --color-green:  #4ade80;  /* Positive metrics, "live" states */
  --color-amber:  #fbbf24;  /* Warnings */
  --color-red:    #f87171;  /* Errors */

  /* === GRADIENTS === */
  --gradient-hero: linear-gradient(
    135deg,
    rgba(124, 92, 252, 0.15) 0%,
    rgba(34, 211, 238, 0.08) 50%,
    transparent 100%
  );
  --gradient-card-highlight: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(124, 92, 252, 0.1),
    transparent 60%
  );
}
```

### Why Violet over Cyan as Primary Accent

The current codebase uses `--cyan: #04d9d9` as the primary accent and `--lime: #a4f63f` as the CTA color. These are energetic choices suited to the SME/automation brand.

For a premium AI engineering studio targeting startup founders and VCs:

- **Violet/indigo** (`#7c5cfc`) reads as "serious technical product" — it is the accent color of Linear, Raycast, Notion's recent redesigns, and most SOTA developer tools.
- Cyan works excellently as a **secondary** data-visualization color — keep it for console UI elements, status indicators, and technical diagrams.
- Lime/green works as a **success/live-state** signal — keep it for active indicators in the process/ops UI mock.

This shift alone moves the perception from "automation tool" to "engineering platform."

### Glassmorphism Pattern (for nav, modals)

The existing nav already uses this correctly. The formula:

```css
.glass-panel {
  background: rgba(17, 17, 19, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

Key: `saturate(180%)` on backdrop makes the content behind appear slightly more vivid, which reinforces the "frosted glass" illusion. Keep blur at 16–24px; below 12px it looks cheap, above 28px it obscures too much.

---

## Animation and Interaction

### Tier 1: CSS-only (zero cost, always-on)

These should be implemented natively without any library:

**Entrance reveals:**
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```
The easing `cubic-bezier(0.16, 1, 0.3, 1)` is Linear's spring easing — fast start, smooth settle. It feels alive without looking bouncy.

**Hover state on cards (cursor glow):**
Already implemented via `pointermove` + radial-gradient. Refine the gradient center color to `rgba(124, 92, 252, 0.12)` for the accent color. This pattern is used on Linear, Vercel, and Resend — it is the canonical 2024–2025 premium card interaction.

**Border shimmer on CTA:**
```css
@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
@keyframes border-spin {
  to { --angle: 360deg; }
}
.btn-primary {
  background: conic-gradient(from var(--angle), #7c5cfc, #22d3ee, #7c5cfc);
  animation: border-spin 3s linear infinite;
}
```
Use `@property` to animate a CSS custom property — this creates the rotating gradient border seen on Linear's CTA. **Confidence: HIGH** (CSS Houdini `@property` is supported in all modern browsers as of 2024).

### Tier 2: GSAP (CDN, for complex sequences only)

Load GSAP from CDN — **do not bundle**:

```html
<!-- Load in <head> with defer or at end of <body> -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
```

**Version:** GSAP 3.12.5 is the current stable release as of late 2024. Use the pinned version — not `@latest` — to prevent unexpected breaking changes.

**Where to use GSAP:**

1. **Hero stagger** — Animate headline words/lines into view with a stagger of 60–80ms. CSS transitions can't do this with a single class toggle.
2. **Stats counter animation** — The current JS counter is fine but GSAP's `gsap.to(obj, { value: end, duration: 1.2, ease: "power2.out" })` approach is cleaner and easier to extend.
3. **Section timeline animations** — For the "how it works" process section, where steps should animate in sequence tied to scroll position.
4. **Pinned scroll sections** — If a "product demo" or process walkthrough section needs step-by-step scroll pin (Linear uses this heavily).

**What NOT to use GSAP for:** Simple fade-ins, hover states, CSS transitions. Using GSAP for these adds cognitive overhead for no visual gain.

### Tier 3: Canvas (existing, keep)

The particle/network canvas is already excellent. For the redesign:

- Change particle color from the current teal to `rgba(124, 92, 252, 0.6)` (accent violet) for connection lines.
- Reduce particle count by ~20% — denser = busier; the goal is "ambient technical texture," not "screensaver."
- Ensure the canvas is wrapped in a `prefers-reduced-motion` check (already done correctly).

### Motion Principles

These are the principles that separate Linear-quality motion from typical marketing site motion:

1. **Fast in, slow out.** Use easing curves like `cubic-bezier(0.16, 1, 0.3, 1)` or `power3.out` in GSAP. Never use `ease-in-out` for entrance animations — they feel sluggish.
2. **Short durations.** 250–450ms for UI interactions. 500–700ms for section reveals. Never animate for longer than 900ms in response to user input.
3. **Stagger reveals, not simultaneous.** Cards appearing simultaneously feel mechanical. 60–100ms stagger per item feels organic.
4. **Translate Y, not scale.** Sliding up from `translateY(20–32px)` feels more grounded than scaling from 0.95. Scale is for modals/overlays.
5. **Always gate on `prefers-reduced-motion`.** This is already implemented — maintain it.

---

## What NOT to Use

| Rejected Option | Why Not |
|----------------|---------|
| Tailwind CSS | Requires a build step (PostCSS/Vite/npm). The constraint is no build tooling. CDN version of Tailwind is 5MB+ and not tree-shaken — catastrophic for performance. |
| React / Next.js | Explicitly out of scope. A marketing site with static content has zero need for a component runtime. |
| Bootstrap | Visual signature is instantly recognizable and cheap. Dark mode requires significant CSS override work. Not worth it when custom CSS is already written. |
| AOS (Animate on Scroll) | Outdated pattern. Adds a JS dependency for something CSS IntersectionObserver + transitions handles natively. The current codebase already does this better. |
| anime.js | Less capable than GSAP for marketing site use cases, smaller community, less maintained. If you're loading an animation library, load GSAP — it's the standard. |
| Three.js | Massive payload (~600KB min). A particle canvas does not need a full 3D engine. Overkill for the visual effect targeted. |
| Particles.js / tsParticles | These libraries create generic "startup website circa 2018" visuals. The custom canvas implementation is more distinctive and much lighter. |
| ScrollReveal.js | Redundant with IntersectionObserver + CSS. Adds ~6KB with no capability advantage over what's already built. |
| CSS Grid frameworks (e.g., Susy) | Native CSS Grid is fully capable. No helper library needed. |
| Google Fonts via `@import` in CSS | Blocks rendering. Always use `<link>` with `preconnect` in `<head>`. |
| Pure black `#000000` background | Harsh contrast on OLED/AMOLED; slight warm-tinted near-black (`#0a0a0b`) is what Linear and all premium dark UIs use. |
| `ease-in-out` on entrance animations | Feels slow and corporate. Use fast-in-slow-out (`power3.out`, `cubic-bezier(0.16, 1, 0.3, 1)`) exclusively. |

---

## Design Token Architecture

The existing `:root` CSS custom property approach is correct. For the redesign, expand it into a structured token hierarchy:

```css
:root {
  /* ─── Primitives (raw values, never used directly) ─── */
  --primitive-violet-500: #7c5cfc;
  --primitive-violet-400: #9b7fff;
  --primitive-cyan-400:   #22d3ee;
  --primitive-zinc-950:   #0a0a0b;
  --primitive-zinc-900:   #111113;
  --primitive-zinc-800:   #18181b;
  /* ... */

  /* ─── Semantic tokens (used in component CSS) ─── */
  --color-bg:         var(--primitive-zinc-950);
  --color-accent:     var(--primitive-violet-500);
  --color-accent-dim: rgba(124, 92, 252, 0.12);
  /* ... */

  /* ─── Spacing scale ─── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ─── Border radius ─── */
  --radius-sm:   6px;   /* labels, badges */
  --radius-md:   10px;  /* cards, inputs */
  --radius-lg:   16px;  /* panels, modals */
  --radius-full: 999px; /* pills, avatars */

  /* ─── Motion ─── */
  --ease-spring:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-base: 350ms;
  --duration-slow: 550ms;
}
```

Primitive → Semantic token separation means: if the brand accent changes from violet to indigo, update one primitive value, every semantic usage updates automatically.

---

## Key Insights for Roadmap Planning

1. **The color system migration is the highest-leverage change.** Shifting from cyan+lime as primary to violet+cyan as primary+secondary — combined with the deeper surface hierarchy (`#0a0a0b` vs `#080a0a`) — moves the site from "AI automation tool" to "premium engineering studio" in a single visual pass. This is foundational and should happen in Phase 1.

2. **No new library dependencies are needed for 80% of the visual upgrade.** The current IntersectionObserver + CSS transitions pattern is the right architecture. GSAP (CDN only) is justified for the hero entrance sequence and any pinned scroll section. Everything else is pure CSS.

3. **Typography tightening (negative letter-spacing on headings, `font-optical-sizing: auto`, anti-aliasing) has outsized visual impact for zero performance cost.** This is the "free upgrade" that most vanilla CSS sites miss.

4. **The cursor-glow card interaction (`pointermove` + `radial-gradient`) is already implemented and is exactly the right pattern.** Retain it and migrate the gradient color to the new violet accent. This single interaction does more to signal "premium interactive UI" than any other pattern on the page.

5. **Netlify's existing pipeline is complete — no deploy work needed.** The CDN-loaded GSAP and Google Fonts are the only external dependencies being added. Both load asynchronously and do not affect the Netlify build pipeline. Netlify headers config should add `Cache-Control` for font and script assets, but this is a polish task, not a blocker.

---

## Sources and Confidence Notes

| Claim | Confidence | Basis |
|-------|------------|-------|
| Inter is Linear's typeface | HIGH | Directly inspectable from linear.app CSS; widely documented in design community |
| GSAP 3.12.5 stable version | MEDIUM | Based on training data through Aug 2025; verify exact patch version at cdn.jsdelivr.net before implementation |
| CSS scroll-driven animations browser support | HIGH | Chrome 115+ (2023), Safari 18 (2024), Firefox 110+ — universal in modern browsers |
| `@property` / CSS Houdini support | HIGH | Chrome 85+ (2020), Safari 15.4+ (2022), Firefox 128+ (2024) — safe to use with progressive enhancement |
| Violet as "premium technical product" accent | MEDIUM | Pattern-matched from Linear, Raycast, Vercel, Resend — industry convention, not an official specification |
| `-webkit-font-smoothing: antialiased` impact | HIGH | Well-established CSS behavior; widely documented |
| JetBrains Mono variable font availability | HIGH | Google Fonts hosts the variable version; confirmed in font specimen |
