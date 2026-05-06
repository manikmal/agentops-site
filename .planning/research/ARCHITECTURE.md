# Architecture Research: AgentOps Studio Website

**Domain:** Premium single-page marketing site (vanilla HTML/CSS/JS, Netlify)
**Researched:** 2026-05-06
**Confidence:** HIGH — based on direct analysis of existing codebase plus established frontend architecture patterns

---

## File Structure

The constraint is a no-build-step deployment: root directory serves directly. The existing three-file structure is correct and should be preserved exactly.

```
/
├── index.html          # Single entry point — all sections inline
├── styles.css          # All styles — organized by section, not component
├── script.js           # All behaviour — modular functions, no framework
├── favicon.svg         # Vector mark (already present)
├── wordmark.png        # Brand wordmark (already present)
├── logo.png            # Raster logo fallback (already present)
├── netlify.toml        # Build config (do not touch)
└── netlify/
    └── functions/
        └── lead-to-slack.js   # Serverless function (already present)
```

**Do not introduce:** `assets/` subdirectory, `src/` folder, `dist/`, or any inline `<script type="module">` blocks. The Netlify `publish = "."` config means the root is the static server — keep everything flat.

**What changes in the redesign:** Content inside `index.html`, all declarations inside `styles.css`, and the JS behaviour blocks inside `script.js`. The file names and deployment topology stay identical.

---

## CSS Architecture

### Organization Principle

Use a strict **top-to-bottom section order** in `styles.css` that mirrors the visual reading order of `index.html`. This is the correct pattern for a single-file site with no build tooling — specificity problems arise from out-of-order rules, not from file count.

**Section order in the CSS file:**

```
1.  Design tokens (custom properties)
2.  Reset / base
3.  Typography scale
4.  Shared utilities (buttons, eyebrow, grid helpers, reveal)
5.  Header
6.  Hero
7.  Logo / tech strip
8.  Services / capabilities section
9.  Portfolio section
10. Process section
11. About section
12. CTA / contact section
13. Footer
14. Animation keyframes
15. Media queries — 940px breakpoint
16. Media queries — 640px breakpoint
17. prefers-reduced-motion overrides
```

Media queries live at the bottom in two consolidated blocks. Never scatter breakpoints inline inside component rules — on a 700+ line stylesheet, scattered queries cause unmaintainable specificity collisions.

### Custom Properties Strategy

The current token set is good but needs expansion for the new dark-premium palette. All tokens live in `:root`. No scoped tokens — unnecessary complexity for this scope.

**Mandatory tokens for the new design:**

```css
:root {
  /* Background layers — dark site needs multiple blacks */
  --bg-base: #080a0c;         /* deepest background */
  --bg-surface: #0e1117;      /* card / section surface */
  --bg-elevated: #161b22;     /* hover / focused card */
  --bg-overlay: #1c2128;      /* modals, nav dropdown */

  /* Border / line */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.14);
  --border-strong: rgba(255, 255, 255, 0.24);

  /* Text */
  --text-primary: #e6edf3;
  --text-secondary: rgba(230, 237, 243, 0.7);
  --text-muted: rgba(230, 237, 243, 0.42);

  /* Brand accent — single primary accent, used sparingly */
  --accent: #7c3aed;           /* purple — technical, premium, not "AI gimmick" */
  --accent-glow: rgba(124, 58, 237, 0.28);

  /* Semantic surface for code / terminal elements */
  --terminal-bg: #0d1117;
  --terminal-border: rgba(124, 58, 237, 0.32);

  /* Type scale — all heading sizes as tokens */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.75rem;
  --text-5xl: 3.75rem;

  /* Spacing rhythm — 4px base */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Layout */
  --max-width: 1120px;
  --section-padding: var(--space-24) max(var(--space-6), calc((100% - var(--max-width)) / 2));

  /* Motion */
  --duration-fast: 150ms;
  --duration-base: 220ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadow */
  --shadow-card: 0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 24px 64px rgba(0, 0, 0, 0.4);
  --shadow-glow-accent: 0 0 0 1px var(--accent), 0 0 24px var(--accent-glow);
}
```

**Why purple accent instead of cyan:** The existing cyan is strongly associated with SaaS-tool branding. Purple (Vercel, Prisma, Linear's subtle purple tones) signals technical premium without being overused in the AI automation space.

### Naming Convention

Use **flat semantic class names**, not BEM. BEM is designed for component isolation across multiple files — overkill for a single flat stylesheet. The rule: class names describe the section + element role.

```css
/* Correct */
.hero-headline { }
.services-card { }
.nav-link { }

/* Not needed */
.services__card--featured { }   /* BEM double-underscore/modifier — unnecessary here */
```

Shared patterns (`.reveal`, `.eyebrow`, `.btn`, `.section-heading`) stay as utility classes across sections.

### Section Background Rhythm

The linear alternation between section backgrounds creates visual cadence — critical for keeping the user scrolling. The redesign must establish a dark-site rhythm:

```
Header:     --bg-base (black, floating pill)
Hero:       --bg-base (full-bleed dark, canvas animation)
Tech strip: --bg-surface (slightly lifted)
Services:   --bg-base
Portfolio:  --bg-surface (lifted, card grid)
Process:    --bg-base (with timeline line graphic)
About:      --bg-surface or split: dark left / image right
CTA:        accent-tinted dark (the conversion moment gets the accent color)
Footer:     --bg-base
```

---

## JavaScript Architecture

### Module Organization Inside script.js

No ES modules (`import`/`export`) — they require a bundler or `type="module"` which breaks older Netlify CDN caching patterns and adds CORS complexity for local file:// development. Keep everything in a single IIFE (Immediately Invoked Function Expression) or just scoped sequential blocks.

**Recommended internal structure:**

```javascript
// ============================================================
// 1. CONSTANTS & DOM REFS
// ============================================================
// All querySelector calls at top — fail fast if DOM is wrong

// ============================================================
// 2. HEADER BEHAVIOUR
// ============================================================
// scroll shadow, nav toggle, active link highlighting

// ============================================================
// 3. TECH STRIP / MARQUEE
// ============================================================
// clone for seamless loop, reduced-motion guard

// ============================================================
// 4. REVEAL ON SCROLL (IntersectionObserver)
// ============================================================
// single observer, shared across all .reveal elements

// ============================================================
// 5. CANVAS / PARTICLE SYSTEM (hero background)
// ============================================================
// resize, create, draw, mouse interaction, pagehide cleanup

// ============================================================
// 6. CARD INTERACTIONS
// ============================================================
// pointermove radial gradient spotlight on cards

// ============================================================
// 7. COUNTER ANIMATIONS
// ============================================================
// easeOut, animateCounter, counterObserver

// ============================================================
// 8. FORM HANDLING
// ============================================================
// submit handler, Netlify function call, status messages

// ============================================================
// 9. ACTIVE NAV HIGHLIGHT (new for redesign)
// ============================================================
// IntersectionObserver watches sections, updates nav link states
```

### What JS Handles (explicit boundaries)

| Concern | Owner | Notes |
|---|---|---|
| Scroll-linked header shadow | JS | `scroll` event, toggles box-shadow |
| Mobile nav open/close | JS | `aria-expanded`, `.is-open` class |
| Active nav section highlight | JS | New: IO watches `<section id=*>`, highlights matching nav link |
| Hero canvas particle network | JS | Canvas API, rAF loop, mouse repulsion |
| Scroll reveal | JS | Single `IntersectionObserver`, `.reveal` → `.is-visible` |
| Counter animation | JS | IO + rAF, only fires once per element |
| Card spotlight on hover | JS | `pointermove` → `radial-gradient` inline style |
| Tech strip marquee | JS | DOM clone for seamless CSS animation |
| Form submit | JS | `fetch` to Netlify function, status text |
| All layout | CSS | JS never touches layout properties |
| All colour / theming | CSS | JS never sets colour tokens |
| Animation timing | CSS | `transition` / `@keyframes` — JS only adds/removes classes |

### Key JS Pattern: Feature Detection Guard

Every JS block must guard against missing DOM nodes. The existing code does this (`if (canvas && context)`). Maintain this pattern rigorously — the redesign will remove some sections and add others, and stale selectors must not throw.

```javascript
// Pattern to enforce everywhere
const el = document.querySelector('[data-thing]');
if (!el) return; // guard before any listeners
```

### New JS Requirement: Active Section Tracking

The redesigned nav has fewer, heavier anchor links. Active link highlighting via `IntersectionObserver` (not scroll position math) is the correct approach:

```javascript
const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    }
  },
  { rootMargin: '-40% 0px -55% 0px' } // triggers in middle third of viewport
);
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));
```

---

## Section Component Map

Each section is a self-contained `<section>` in `index.html`. Think of each as having: HTML structure + CSS block + JS hook (optional). Dependencies flow top-to-bottom.

### 1. Header (persistent, fixed)
- **HTML:** `<header data-header>` with brand + nav
- **CSS:** `.site-header` — floating pill, backdrop-filter blur
- **JS:** scroll shadow, mobile nav toggle, active nav highlight (reads from section IO)
- **Dependencies:** None (renders before main)
- **New work:** Redesign nav links from SME categories to startup-positioning anchors (Services, Portfolio, Process, About, Contact)

### 2. Hero
- **HTML:** `<section class="hero section-dark">` — canvas background, copy column, terminal/console visual column
- **CSS:** `.hero` — full viewport height, grid layout, canvas absolute positioning
- **JS:** Canvas particle network, mouse repulsion, resize handler
- **Dependencies:** None — renders first
- **New work:** Rewrite headline/copy for startup audience. Replace SME console UI with a more sophisticated terminal or code artifact that signals AI engineering (think: a streaming LLM call, an agent trace log, or a deployment pipeline readout)
- **Critical:** The canvas `drawNetwork` rAF loop is already correct architecture. Keep it but consider reducing particle count on mobile further (currently 42; 28 is better for low-end Android)

### 3. Tech / Tool Strip (logo marquee)
- **HTML:** `<section class="logo-strip">` — marquee of technology names
- **CSS:** `.marquee-track` with CSS `animation: marquee`
- **JS:** DOM clone for seamless loop, reduced-motion bypass
- **Dependencies:** None
- **New work:** Replace SME tool names (WhatsApp, Google Sheets) with startup/AI-stack tools: OpenAI, Anthropic, LangChain, Supabase, Vercel, AWS, Docker, GitHub Actions, Kubernetes, Terraform

### 4. Services / Capabilities
- **HTML:** `<section id="services">` — section heading + card grid
- **CSS:** `.services-grid` — 3-column card grid
- **JS:** Card spotlight (pointermove radial gradient — already exists, extend to new cards)
- **Dependencies:** Reveal observer initialized before page scroll
- **New work:** Replace 6 SME agent cards with 4 capability cards: AI Agents & Products, AI-Powered Features, Infrastructure & Cloud, DevOps & Delivery. Each card gets a brief description + a "what you get" bullet list. This is the most content-dense section.

### 5. Portfolio
- **HTML:** `<section id="portfolio">` — heading + card grid
- **CSS:** `.portfolio-grid` — mixed-size grid (1 featured card + smaller cards)
- **JS:** Card spotlight
- **Dependencies:** None
- **New work:** Replace Unsplash images with abstract technical screenshots or generated visuals. Cards are placeholder in v1 — include project name, type tag, and 1-line outcome stub. Keep `<img>` slots present so real screenshots can drop in without HTML changes.

### 6. Process
- **HTML:** `<section id="process">` — 4-step horizontal timeline
- **CSS:** `.timeline` — 4-column grid with connecting line
- **JS:** Reveal only
- **Dependencies:** None
- **New work:** Rebrand steps from SME workflow ("Audit / Design / Build / Run") to startup engagement model: Discovery → Architecture → Delivery → Operations. Add a connecting horizontal line between steps using a CSS `::before` pseudo-element on the `.timeline` container.

### 7. About (new section — not in current site)
- **HTML:** `<section id="about">` — split layout: text left, image/visual right
- **CSS:** `.about-section` — same split grid pattern as `.split-section`
- **JS:** Reveal only
- **Dependencies:** None
- **Purpose:** Establish Manik's credibility as a solo AI engineer. Include: background sentence, technology focus areas, a "what I don't do" statement (no no-code tools, no prompt-only solutions — this differentiates from freelancers). This section is critical for the repositioning.

### 8. CTA / Contact
- **HTML:** `<section id="contact" class="section-dark">` — copy left, form right
- **CSS:** `.contact-section` — 2-column grid
- **JS:** Form submit → Netlify function (existing `lead-to-slack` function is reusable)
- **Dependencies:** Netlify function must exist at `/.netlify/functions/lead-to-slack`
- **New work:** Replace "Tell us what your team repeats" copy with "Book a discovery call" framing. Form fields should change: remove Phone/WhatsApp (SME channel), add "Tell us about your product" and "What AI problem are you solving?" — fields that qualify a startup founder, not a small business owner. Add a Calendly embed link once available (placeholder link for v1).

### 9. Footer
- **HTML:** `<footer class="site-footer">` — brand left, links right
- **CSS:** `.site-footer`
- **JS:** None
- **Dependencies:** None
- **New work:** Minimal changes — ensure copyright year auto-updates (replace hardcoded year with `<span data-year></span>` and one line of JS)

---

## Performance Strategy

### Critical Rendering Path

The site has no build step, so "critical CSS" means: put the header, hero, and font declarations at the top of `styles.css` in the order they're needed. The browser parses CSS top-to-bottom — rules for off-screen sections don't block render.

**Font loading — single most impactful performance lever:**

```html
<!-- In <head>, before styles.css link -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
  media="print"
  onload="this.media='all'">
<noscript>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap">
</noscript>
```

`media="print"` + `onload="this.media='all'"` is the non-blocking font load pattern. It loads the font off-critical-path then swaps in. `display=swap` is already a Google Fonts URL parameter so Flash of Unstyled Text is handled by the font itself.

The site currently has no Google Fonts link — Inter falls back to `system-ui`. For the premium aesthetic, Inter should be explicitly loaded.

### Image Loading

All `<img>` tags below the fold get `loading="lazy"`:

```html
<!-- Hero image (if any) — NO lazy load, it is above fold -->
<img src="hero-visual.png" alt="..." width="600" height="480">

<!-- All portfolio card images — lazy load -->
<img src="project-thumb.jpg" alt="..." loading="lazy" width="900" height="600">
```

Always include explicit `width` and `height` attributes — they prevent layout shift (CLS) by reserving space before the image loads. This is the single easiest Core Web Vitals win.

### Canvas / Animation Performance

The existing canvas particle system is already correct in its approach:
- Uses `devicePixelRatio` clamped to 2 (prevents over-rendering on high-DPI)
- Cancels rAF on `pagehide`
- Respects `prefers-reduced-motion` implicitly (the motion is canvas, not CSS — add an explicit guard)

**Add this guard:**

```javascript
if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener('resize', resizeCanvas);
}
```

### Scroll Reveal Performance

The existing `IntersectionObserver` pattern is correct. Do not use scroll event listeners for reveal — IO is off-main-thread and does not cause jank.

One optimization to add: use `content-visibility: auto` on off-screen heavy sections (portfolio grid, services grid) to skip paint for sections not in viewport:

```css
.portfolio-section,
.services-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 800px; /* estimated height */
}
```

This is a browser-native optimization, no JS required, and is safe to use with progressive enhancement (ignored by older browsers).

### Netlify Edge / Caching

The `netlify.toml` publishes `.` (root). No changes needed. Netlify automatically sets aggressive cache headers on static assets. The single redirect rule `/* → /index.html` handles any future deep links correctly.

---

## Build Order

Sections have dependencies (JS behaviour that references DOM elements must come after HTML exists). The build order also reflects risk: build the highest-visibility, highest-effort sections first to surface design issues early.

### Phase Sequence

**Phase 1 — Foundation (build first, everything depends on this)**
1. Design token layer in `styles.css` — all `--custom-properties` defined before any section CSS
2. Reset + base styles — `*, body, html, img, a, button`
3. Typography scale — `h1`-`h3`, `p`, `.eyebrow`, line-height, font stack
4. Shared utilities — `.btn`, `.reveal`, `.section-heading`, `.section-padding` helper

**Phase 2 — Header + Nav**
5. Header HTML + CSS (floating pill, backdrop-filter, logo)
6. Nav toggle JS (mobile menu)
7. Active nav tracking JS (IO on sections — can be added after sections exist)

**Phase 3 — Hero (highest visual impact, longest build time)**
8. Hero HTML structure (grid: copy column + visual column)
9. Hero CSS (dark background, grid layout, responsive collapse)
10. Canvas particle system JS (existing code, update particle colours + density)
11. Hero visual column (terminal/agent trace component — the new "console" replacement)

**Phase 4 — Supporting sections (can be built in parallel once foundation is done)**
12. Tech strip HTML + CSS + marquee JS (quick — mostly copy from existing)
13. Services section HTML + CSS + card spotlight JS
14. Portfolio section HTML + CSS (placeholder images, card grid)
15. Process section HTML + CSS (timeline with connecting line)
16. About section HTML + CSS (split layout — new section)

**Phase 5 — Conversion layer**
17. CTA / Contact section HTML + CSS
18. Form JS (reuse existing Netlify function call — field names will change, update payload keys)
19. Footer HTML + CSS

**Phase 6 — Polish**
20. Animation keyframes audit (pulse, marquee, reveal transitions)
21. Media queries — 940px breakpoint (tablet)
22. Media queries — 640px breakpoint (mobile)
23. `prefers-reduced-motion` overrides
24. `loading="lazy"` on all below-fold images
25. `content-visibility: auto` on heavy sections
26. Font loading performance (non-blocking Inter load)
27. Meta tags: title, description, og:image, og:title for social sharing

### Dependency Graph

```
Design tokens
    └── All section CSS (tokens must exist before they can be consumed)

Header
    └── Active nav JS (reads section IDs, must be added after sections exist in DOM)

Hero canvas
    └── No dependencies (standalone rAF loop)

Form JS
    └── Netlify function (existing — just update field names in payload)

Reveal observer
    └── All .reveal elements must exist in DOM before observer.observe() runs
    └── Place script.js at end of <body> (already correct in existing code)
```

---

## Key Insights

- **The three-file architecture is correct and should not change.** index.html + styles.css + script.js is the right shape for this project. Introducing a build step, asset subdirectories, or ES modules adds zero capability and real maintenance cost.

- **The existing JS is well-structured and reusable at ~80%.** The canvas particle system, IntersectionObserver reveal, card spotlight, marquee clone, and Netlify form handler all carry forward unchanged or with minor updates. The rebuild is primarily a design and copy rewrite, not an architecture rewrite.

- **Section order in CSS must mirror HTML order.** The #1 maintenance problem in single-file stylesheets is rules scattered out of DOM order. Enforcing top-to-bottom correspondence eliminates "why is this overriding that" debugging.

- **The About section is architecturally new and load-bearing for the repositioning.** It does not exist in the current site. It requires the same split-layout pattern as the existing automations split section — the CSS pattern is already available as a reference. This is where the "solo AI engineer, not a freelancer" message lives.

- **Font loading is the single unaddressed performance gap.** The current site relies on system font fallback for Inter. For a premium dark aesthetic, the actual Inter webfont is needed (particularly the 800 weight used for headings). The non-blocking load pattern adds 3 lines of HTML and zero runtime cost — it must be in Phase 1 or the hero headline will flash on first load.
