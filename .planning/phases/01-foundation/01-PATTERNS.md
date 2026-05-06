# Phase 1: Foundation - Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 3 (index.html, styles.css, script.js — all modified, none created)
**Analogs found:** 3 / 3 (each file is its own analog; no new files are introduced)

---

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `styles.css` | config / utility | transform (token replacement + typography rewrite + header CSS split) | `styles.css` itself (existing `:root` block, heading rules, `.site-header` rule) | exact — same file, surgical replacement |
| `index.html` | view / markup | request-response (static HTML rendered by browser) | `index.html` itself (existing `<head>`, `<header>`, hero section) | exact — same file, surgical edits |
| `script.js` | utility / event-driven | event-driven (scroll listener, IntersectionObserver) | `script.js` itself (existing `revealObserver`, scroll handler, nav toggle) | exact — same file, two targeted updates + one new block |

> This is a vanilla no-build project with exactly three source files. There are no new files to create in Phase 1. Every change is a surgical edit to an existing file. Each file is therefore its own analog — the patterns below extract the *current* code that must be replaced or extended, and the *target* code that replaces or extends it.

---

## Pattern Assignments

### `styles.css` — Token Block (lines 1–13 replaced)

**Analog:** `styles.css` lines 1–13 (existing flat `:root` block)

**Current state — to be replaced** (lines 1–13):
```css
:root {
  --ink: #080a0a;
  --charcoal: #101414;
  --graphite: #171d1d;
  --line: #d7dfdf;
  --muted: #5f6b6b;
  --paper: #f7fbfb;
  --white: #ffffff;
  --cyan: #04d9d9;
  --lime: #a4f63f;
  --coral: #ff4f6d;
  --shadow: 0 24px 70px rgba(8, 10, 10, 0.14);
}
```

**Target state — two-layer block to write in place of lines 1–13:**
```css
/* === PRIMITIVES === */
:root {
  /* Violet scale */
  --violet-600: #7c5cfc;
  --violet-400: #9b7fff;
  --violet-dim:  rgba(124, 92, 252, 0.12);

  /* Zinc / grey scale */
  --gray-950: #0a0a0b;
  --gray-900: #111113;
  --gray-800: #18181b;
  --gray-750: #232326;

  /* Signal */
  --cyan-400:  #22d3ee;
  --green-400: #4ade80;
  --amber-400: #fbbf24;
  --red-400:   #f87171;

  /* Motion */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* === SEMANTIC === */
:root {
  /* Backgrounds */
  --color-bg:        var(--gray-950);
  --color-surface-1: var(--gray-900);
  --color-surface-2: var(--gray-800);
  --color-surface-3: var(--gray-750);

  /* Borders */
  --color-border:        rgba(255,255,255,0.08);
  --color-border-strong: rgba(255,255,255,0.14);
  --color-border-hover:  rgba(255,255,255,0.16);
  --color-border-focus:  rgba(255,255,255,0.28);

  /* Text */
  --color-text-primary:   #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted:     rgba(255,255,255,0.50);

  /* Accent */
  --color-accent:       var(--violet-600);
  --color-accent-dim:   var(--violet-dim);
  --color-accent-hover: var(--violet-400);

  /* Signal */
  --color-error:   var(--red-400);
  --color-success: var(--green-400);
  --color-cyan:    var(--cyan-400);

  /* Header glassmorphism */
  --header-bg-default:  rgba(8, 10, 10, 0.78);
  --header-bg-scrolled: rgba(8, 10, 10, 0.92);

  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, "Courier New", monospace;
  --tracking-tight:   -0.04em;
  --tracking-heading: -0.03em;
  --tracking-label:    0.08em;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 64px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 0 1px var(--color-accent), 0 0 24px var(--color-accent-dim);

  /* Layout */
  --max-width: 1120px;
  --section-padding: var(--space-24) max(var(--space-6), calc((100% - var(--max-width)) / 2));
}
```

**Old-to-new token migration map** (must be applied to every downstream reference in styles.css):

| Old Token | New Semantic Token |
|-----------|--------------------|
| `var(--ink)` | `var(--color-bg)` (backgrounds) or `var(--color-text-primary)` (text) |
| `var(--charcoal)` | `var(--color-surface-1)` |
| `var(--graphite)` | `var(--color-surface-2)` |
| `var(--paper)` | `var(--color-surface-2)` (was light card bg; now dark) |
| `var(--white)` | `#ffffff` or `var(--color-text-primary)` |
| `var(--line)` | `var(--color-border)` |
| `var(--muted)` | `var(--color-text-secondary)` |
| `var(--cyan)` | `var(--color-cyan)` (signal only — not accent) |
| `var(--lime)` | `var(--color-accent)` (where lime was the primary action color) |
| `var(--coral)` | `var(--color-error)` |
| `var(--shadow)` | `var(--shadow-card)` |

---

### `styles.css` — Body Rule (line ~23 updated)

**Analog:** `styles.css` lines 23–29 (existing `body` rule)

**Current state** (lines 23–29):
```css
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
```

**Target state:**
```css
body {
  margin: 0;
  color: var(--color-text-primary);
  background: var(--color-bg);
  font-family: var(--font-sans);
  line-height: 1.5;
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

### `styles.css` — Typography Scale (lines ~202–216 replaced)

**Analog:** `styles.css` lines 202–216 (existing heading size rules) + lines 776–782 and 809–815 (breakpoint overrides to be removed)

**Current state — fixed sizes** (lines 202–216):
```css
h1 {
  max-width: 760px;
  font-size: 4.55rem;
  letter-spacing: 0;
}

h2 {
  max-width: 740px;
  font-size: 3rem;
  letter-spacing: 0;
}

h3 {
  font-size: 1.18rem;
}
```

**Current breakpoint overrides to be removed** (styles.css lines 776–782, 809–815):
```css
/* @media (max-width: 940px) */
h1 { font-size: 3.25rem; }
h2 { font-size: 2.35rem; }

/* @media (max-width: 640px) */
h1 { font-size: 2.55rem; }
h2 { font-size: 2rem; }
```

**Target state — clamp() replaces ALL of the above:**
```css
h1 {
  max-width: 760px;
  font-size: clamp(2.5rem, 5vw + 1rem, 5rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: var(--tracking-tight);
}

h2 {
  max-width: 740px;
  font-size: clamp(1.75rem, 3vw + 0.75rem, 3rem);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: var(--tracking-heading);
}

h3 {
  font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: var(--tracking-heading);
}
```

> Remove the four breakpoint-scoped `h1`/`h2` font-size overrides at lines 776–782 and 809–815. `clamp()` makes them redundant and they would override the fluid scale incorrectly.

---

### `styles.css` — Header CSS Split (lines 47–64 replaced + new rules added)

**Analog:** `styles.css` lines 47–64 (existing `.site-header` rule — the active iOS Safari bug)

**Current state — iOS Safari bug** (lines 47–64):
```css
.site-header {
  position: fixed;
  top: 18px;
  left: 50%;
  z-index: 50;
  display: flex;
  width: min(1120px, calc(100% - 32px));
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 12px;
  color: var(--white);
  background: rgba(8, 10, 10, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  backdrop-filter: blur(18px);
  transform: translateX(-50%);
}
```

**Target state — split wrapper:**
```css
/* OUTER: positioning only — NO backdrop-filter ever */
.header-positioner {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: min(1120px, calc(100% - 32px));
}

/* INNER: all visual styles — NO transform ever */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 12px;
  color: var(--color-text-primary);
  background: var(--header-bg-default);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  transition: background var(--duration-base) var(--ease-out);
}

/* Scroll-darkened state: JS adds .scrolled to .header-positioner */
.scrolled .site-header {
  background: var(--header-bg-scrolled);
}
```

**Mobile nav dropdown** (styles.css lines 719–745 — update token refs only, keep pattern):
```css
/* @media (max-width: 940px) */
.site-nav {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  display: none;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
  background: rgba(8, 10, 10, 0.94);   /* keep as-is — no token covers this exact opacity */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.site-nav.is-open {
  display: flex;
}
```

---

### `styles.css` — Nav Link and CTA Button Rules

**Analog:** `styles.css` lines 101–116 (`.site-nav a`) and lines 275–283 (`.btn-primary`)

**Current `.site-nav a`** (lines 105–116):
```css
.site-nav a {
  padding: 9px 12px;
  color: rgba(255, 255, 255, 0.78);
  border-radius: 8px;
  font-size: 0.94rem;
}

.site-nav a:hover,
.site-nav a:focus-visible {
  color: var(--white);
  background: rgba(255, 255, 255, 0.1);
}
```

**Target `.site-nav a` and active indicator:**
```css
.site-nav a,
.nav-link {
  padding: 9px 12px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  font-size: 0.94rem;
  transition: color var(--duration-fast) var(--ease-out);
}

.site-nav a:hover,
.nav-link:hover,
.site-nav a:focus-visible,
.nav-link:focus-visible {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.07);
}

/* Active section indicator */
.nav-link.is-active {
  color: var(--color-text-primary);
  position: relative;
}

.nav-link.is-active::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}
```

**Current `.btn-primary`** (lines 275–283):
```css
.btn-primary {
  color: var(--ink);
  background: var(--lime);
  box-shadow: 0 0 0 0 rgba(164, 246, 63, 0.45);
}

.btn-primary:hover {
  animation: pulse 900ms ease;
}
```

**Target `.btn-primary` — violet pill:**
```css
.btn-primary {
  color: #ffffff;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  font-weight: 600;
  transition: background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}
```

---

### `index.html` — Head Section (lines 1–20 updated)

**Analog:** `index.html` lines 1–20 (existing `<head>` — missing font loading)

**Current state** (lines 3–19, relevant subset):
```html
<meta name="description" content="AgentOps Studio by Manik Malhotra builds AI agents, workflow automations, social media systems, and DevOps solutions for growing SMEs.">
<title>AgentOps Studio | AI Automations &amp; DevOps for SMEs</title>
<!-- ...favicon links... -->
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="styles.css">
```

**Target state — add preconnects + font link before stylesheet:**
```html
<meta name="description" content="End-to-end AI product builds, agent orchestration, and DevOps for startups and growing businesses.">
<title>AgentOps Studio | AI Engineering for Founders &amp; Growing Teams</title>
<!-- ...favicon links unchanged... -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
```

> Remove the `<link rel="preconnect" href="https://images.unsplash.com">` (no longer needed once Unsplash images are not used). Keep all favicon links unchanged.

---

### `index.html` — Header Restructure (lines 22–35 replaced)

**Analog:** `index.html` lines 22–35 (existing single-element `<header data-header>`)

**Current state** (lines 22–35):
```html
<header class="site-header" data-header>
  <a class="brand" href="#top" aria-label="AgentOps Studio home">
    <img src="favicon.svg" alt="" class="brand-icon" aria-hidden="true" width="36" height="36">
    <img src="wordmark.png" alt="AgentOps Studio" class="brand-wordmark">
  </a>
  <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="site-nav" id="site-nav" data-nav>
    <a href="#agents">AI Agents</a>
    <a href="#automations">Automations</a>
    <a href="#devops">DevOps</a>
    <a href="#portfolio">Portfolio</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```

**Target state — wrapper split + updated nav labels + CTA button:**
```html
<div class="header-positioner" data-header>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="AgentOps Studio home">
      <img src="favicon.svg" alt="" class="brand-icon" aria-hidden="true" width="36" height="36">
      <img src="wordmark.png" alt="AgentOps Studio" class="brand-wordmark">
    </a>
    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" data-nav>
      <a class="nav-link" href="#services">Services</a>
      <a class="nav-link" href="#work">Work</a>
      <a class="nav-link" href="#process">Process</a>
      <a class="nav-link" href="#about">About</a>
      <a class="nav-link" href="#contact">Contact</a>
    </nav>
    <a class="btn-primary btn-book-call" href="#contact">Book a call</a>
  </header>
</div>
```

> `data-header` moves to the outer `<div>`. The inner `<header>` has no `data-header`. The section `id` attributes on the nav `href` targets (`#services`, `#work`, `#process`, `#about`) must be set on the corresponding sections in the body — or kept as `#agents`, `#automations`, `#devops`, `#portfolio` with matching `href` values. The section rename is a Phase 3 concern; Phase 1 only relabels the visible text, so keep the existing `href="#agents"` etc. values and update only the link text.

**Corrected target nav (preserving existing section id anchors):**
```html
<nav class="site-nav" id="site-nav" data-nav>
  <a class="nav-link" href="#agents">Services</a>
  <a class="nav-link" href="#automations">Work</a>
  <a class="nav-link" href="#devops">Process</a>
  <a class="nav-link" href="#portfolio">About</a>
  <a class="nav-link" href="#contact">Contact</a>
</nav>
```

---

### `index.html` — Hero Section Language Audit (lines 43–60 replaced/removed)

**Analog:** `index.html` lines 43–60 (existing hero copy and structural elements)

**Current state** (lines 43–59):
```html
<p class="eyebrow">AI agents + automations + DevOps for SMEs</p>
<h1>Make your business run like a smarter system.</h1>
<p class="hero-lede">We build AI assistants, social media automations, internal tools, and reliable deployment pipelines for growing small and medium businesses.</p>
<div class="hero-actions">
  <a class="btn btn-primary" href="#contact">Book an automation audit</a>
  <a class="btn btn-secondary" href="#portfolio">View portfolio</a>
</div>
<div class="hero-contact-links" aria-label="Contact links">
  <a href="mailto:manikmalhotra6@gmail.com">manikmalhotra6@gmail.com</a>
  <a href="tel:+919599668843">+91 9599668843</a>
  <a href="https://www.linkedin.com/in/manik-malhotra-9478617b/" target="_blank" rel="noreferrer">LinkedIn</a>
</div>
<div class="hero-metrics" aria-label="Service highlights">
  <span>...</span>
</div>
```

**Target state:**
```html
<!-- eyebrow: remove or replace with startup-native line; remove SME text entirely -->
<h1>Build AI products that scale.</h1>
<p class="hero-lede">End-to-end AI engineering for founders who need it done right.</p>
<div class="hero-actions">
  <a class="btn btn-primary" href="#contact">Book a discovery call</a>
  <a class="btn btn-secondary" href="#portfolio">View work</a>
</div>
<!-- Remove entire .hero-contact-links div (D-14) -->
<!-- Remove entire .hero-metrics div (D-13) -->
```

---

### `index.html` — Ops Console Placeholder Copy

**Analog:** `index.html` lines 69–100 (existing `.ops-console` flow rows with SME content)

**Current state (sample flow row)**:
```html
<div class="flow-row active">
  <span class="flow-dot"></span>
  <div>
    <strong>Lead Assistant</strong>
    <p>New Instagram inquiry qualified and sent to CRM.</p>
  </div>
  <em>12s</em>
</div>
```

**Target state — startup-native placeholder agent-trace lines:**
```html
<div class="flow-row active">
  <span class="flow-dot"></span>
  <div>
    <strong>Orchestrator</strong>
    <p>Deployment pipeline triggered on merge to main.</p>
  </div>
  <em>2s</em>
</div>
<div class="flow-row">
  <span class="flow-dot"></span>
  <div>
    <strong>Data Agent</strong>
    <p>User event batch ingested and routed to analytics sink.</p>
  </div>
  <em>8s</em>
</div>
<div class="flow-row">
  <span class="flow-dot"></span>
  <div>
    <strong>Monitoring Agent</strong>
    <p>Latency spike detected — alert dispatched to on-call.</p>
  </div>
  <em>1s</em>
</div>
```

---

### `index.html` — Packages Section Removal

**Analog:** `index.html` lines 300–322 (`.packages-section` block)

**Current state** (lines 300–322):
```html
<section class="section packages-section">
  <div class="section-heading reveal">
    <p class="eyebrow">Packages</p>
    <h2>Pick the first system your business needs.</h2>
  </div>
  <div class="package-grid">
    <article class="package-card reveal">...</article>
    <article class="package-card featured reveal">...</article>
    <article class="package-card reveal">...</article>
  </div>
</section>
```

**Target state:** Remove entire section block. Also remove from `styles.css`: `.packages-section`, `.package-card`, `.package-grid`, `.package-card.featured` rules.

---

### `index.html` — Contact Section Cleanup

**Analog:** `index.html` lines 324–358 (contact section)

**Elements to remove:**
```html
<!-- Remove .direct-contact div (lines 329–333) — contains Gmail + phone -->
<div class="direct-contact" aria-label="Direct contact details">
  <a href="mailto:manikmalhotra6@gmail.com">manikmalhotra6@gmail.com</a>
  <a href="tel:+919599668843">+91 9599668843</a>
  <a href="https://www.linkedin.com/in/manik-malhotra-9478617b/" ...>Connect on LinkedIn</a>
</div>

<!-- Remove phone field (lines 345–347) -->
<label>
  Phone or WhatsApp
  <input name="phone" type="tel" placeholder="+91 90000 00000">
</label>
```

**Textarea placeholder to update** (line 354):
```html
<!-- From: -->
<textarea ... placeholder="Example: We manually follow up with every unpaid invoice on WhatsApp." required></textarea>
<!-- To: -->
<textarea ... placeholder="Example: We need an AI agent to handle onboarding flows for new signups." required></textarea>
```

---

### `index.html` — Footer Cleanup

**Analog:** `index.html` lines 362–372 (footer)

**Current state** (lines 362–372):
```html
<footer class="site-footer">
  <span class="footer-brand">
    <img src="favicon.svg" alt="" aria-hidden="true" class="footer-icon" width="22" height="22">
    AgentOps Studio by Manik Malhotra
  </span>
  <span>
    <a href="mailto:manikmalhotra6@gmail.com">Email</a>
    <a href="tel:+919599668843">Phone</a>
    <a href="https://www.linkedin.com/in/manik-malhotra-9478617b/" target="_blank" rel="noreferrer">LinkedIn</a>
  </span>
</footer>
```

**Target state — remove phone link:**
```html
<footer class="site-footer">
  <span class="footer-brand">
    <img src="favicon.svg" alt="" aria-hidden="true" class="footer-icon" width="22" height="22">
    AgentOps Studio by Manik Malhotra
  </span>
  <span>
    <a href="mailto:manikmalhotra6@gmail.com">Email</a>
    <a href="https://www.linkedin.com/in/manik-malhotra-9478617b/" target="_blank" rel="noreferrer">LinkedIn</a>
  </span>
</footer>
```

---

### `script.js` — Scroll Handler (lines 30–33 replaced)

**Analog:** `script.js` lines 30–33 (existing scroll listener)

**Current state — non-passive, inline style mutation** (lines 30–33):
```javascript
window.addEventListener("scroll", () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 24 ? "0 18px 60px rgba(0, 0, 0, 0.22)" : "none";
});
```

**Target state — passive flag, class toggle, 30px threshold:**
```javascript
window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });
```

> The `header` const on line 1 (`document.querySelector("[data-header]")`) continues to work unchanged because `data-header` moves to `.header-positioner` in HTML. No change to line 1.

---

### `script.js` — Card Spotlight Color (line 123 updated)

**Analog:** `script.js` line 123 (hardcoded cyan spotlight color)

**Current state** (line 123):
```javascript
card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(4, 217, 217, 0.12), transparent 34%)`;
```

**Target state — violet accent dim:**
```javascript
card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 92, 252, 0.12), transparent 34%)`;
```

---

### `script.js` — Active Nav IntersectionObserver (new block added after scroll handler)

**Analog:** `script.js` lines 67–79 (existing `revealObserver` — same IntersectionObserver pattern)

**Existing pattern to copy structure from** (lines 67–79):
```javascript
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

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
```

**New block to add** (after the scroll handler, before `leadForm` block):
```javascript
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});
```

---

## Shared Patterns

### data-* Attribute Convention (JS Hooks)
**Source:** `script.js` lines 1–4, `index.html` lines 22, 27–28
**Apply to:** Any new interactive element in Phase 1 or downstream phases
```javascript
// JS always selects elements by data attribute, never by class
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
```
Classes are for styling. `data-*` attributes are for JS hooks. Never use a class as a JS selector unless it is also a JS-managed class (`.is-active`, `.is-open`, `.scrolled`, `.is-visible`).

### IntersectionObserver Pattern
**Source:** `script.js` lines 67–79 (`revealObserver`)
**Apply to:** `sectionObserver` (new in Phase 1), any future scroll-triggered behavior
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // act on entry.target
      }
    }
  },
  { threshold: 0.16 }   // or rootMargin for section tracking
);
document.querySelectorAll("[selector]").forEach((el) => observer.observe(el));
```

### Semantic Token Reference (Component CSS)
**Source:** `styles.css` — pattern established by Phase 1 token block
**Apply to:** Every CSS rule in styles.css that sets color, background, border, shadow, or radius
```css
/* CORRECT: reference semantic token */
border: 1px solid var(--color-border-strong);
background: var(--color-surface-2);

/* WRONG: inline rgba (except in :root token declarations themselves) */
border: 1px solid rgba(255,255,255,0.14);
background: #18181b;
```

### Passive Scroll Listener
**Source:** `script.js` line 30 (to be fixed in Phase 1)
**Apply to:** All `scroll`, `touchstart`, `touchmove` listeners that do not call `preventDefault()`
```javascript
window.addEventListener("scroll", handler, { passive: true });
```

### Consolidated Breakpoints
**Source:** `styles.css` lines 719–837 (two `@media` blocks at bottom of file)
**Apply to:** All responsive styles in downstream phases
```css
/* Two breakpoints, both at bottom of styles.css — never inline inside component rules */
@media (max-width: 940px) { /* tablet */ }
@media (max-width: 640px) { /* mobile */ }
```

---

## No Analog Found

No files in Phase 1 lack a codebase analog. All three modified files are their own analogs.

---

## Metadata

**Analog search scope:** `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/` (root — only three source files exist)
**Files scanned:** 3 source files (`index.html`, `styles.css`, `script.js`) + 4 planning files (`01-CONTEXT.md`, `01-RESEARCH.md`, `01-UI-SPEC.md`, `01-DISCUSSION-LOG.md`)
**Pattern extraction date:** 2026-05-07
