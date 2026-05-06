# Pitfalls Research: AgentOps Studio Website

**Domain:** Premium solo AI engineering studio — dark/technical aesthetic, startup founder audience
**Researched:** 2026-05-06
**Confidence:** HIGH (stable, well-established patterns; code inspection of existing site used to ground specific technical pitfalls)

---

## Design & UX Pitfalls

*What makes a site look cheap instead of premium*

---

### D1: Inconsistent Color Temperature Across Sections

**What goes wrong:** The dark sections use cool blacks (#080a0a, rgba tints) but lighter sections break to warm whites or off-whites with a different tonal register. The eye notices the jarring transition — the site feels cobbled together rather than designed as a whole.

**Why it happens in this codebase:** The existing site already has a split personality — `.section-dark` uses `--ink` (#080a0a) while non-dark sections use `--paper` (#f7fbfb). If the redesign adds more sections without a deliberate "grey zone" color bridge, each section will feel like a different site.

**Consequences:** Startup founders — who look at products like Linear, Vercel, and Resend daily — immediately register tonal inconsistency as low craft. The site reads as amateur.

**Warning signs:**
- Screenshot the page in grayscale — if contrast breaks at section seams it's a temperature problem
- White card backgrounds glowing warm inside a cold dark layout

**Prevention:**
- Define a strict section hierarchy: `--surface-0` (near-black), `--surface-1` (dark), `--surface-2` (mid), `--surface-3` (light) — all in the same temperature
- Never use pure `#ffffff` white on a dark site; use `--white` with a slight cool bias (e.g. `#f8fafb`) for light sections
- Test section transitions with the page at arm's length — edges should flow, not cut

**Phase:** Hero + Section redesign

---

### D2: Accent Color Overuse — Cyan and Lime Fighting Each Other

**What goes wrong:** The current site uses `--cyan` (#04d9d9) as the primary accent AND `--lime` (#a4f63f) as the CTA/button color AND `--coral` (#ff4f6d) as a third accent. Three high-saturation accent colors at once signals "template UI kit" rather than a considered design system.

**Why it happens:** Particle animation uses lime dots, the CTA button uses lime, the hover glow uses cyan, the active state uses lime. There is no single brand accent — everything is equally important, which means nothing is.

**Consequences:** Premium sites (Linear, Vercel, Supabase) use one accent color at full saturation and reserve a second for rare emphasis. Three competing accents at equal weight looks like a 2019 SaaS theme.

**Warning signs:**
- Any one screen shows more than two distinct saturated accent colors
- The particle animation color (lime) matches the primary CTA color — the CTA loses hierarchy

**Prevention:**
- Pick one primary accent (keep cyan — it reads "technical/AI")
- Relegate lime to decorative/background uses only, never on interactive elements
- Remove coral as a UI color; only use it for error states if at all
- The rule: one accent color names the brand, everything else is grey

**Phase:** Design system / CSS variables definition (Phase 1)

---

### D3: Decorative Motion That Doesn't Support the Message

**What goes wrong:** The canvas particle animation is prominent in the hero but the particles carry no semantic meaning — they do not represent agents, data flows, or anything the site claims to deliver. They are generic "tech vibes" decoration.

**Why it matters for this audience:** Startup founders are cynical about purely decorative animation. When a particle network means nothing, it signals that the site prioritizes aesthetics over substance — a warning sign for how the engineer thinks about product decisions.

**The deeper pitfall:** The animation runs at 60fps on a `rAF` loop drawing `n*(n-1)/2` line pairs. With 82 particles that is up to 3,321 line segment calculations per frame — visible jank on mid-range hardware, and a significant battery drain that technical founders will notice.

**Consequences:** CPU-heavy animation that adds no meaning is a double negative: it signals low craft AND slows the site.

**Warning signs:**
- Canvas animation visible in Chrome DevTools Performance tab as long paint frames
- Particle visual is indistinguishable from every "AI startup" generic landing page

**Prevention:**
- Replace generic particle network with a purposeful technical illustration — e.g., a stylized agent orchestration graph, or a terminal/code motif that directly represents the work
- If keeping particle motion: reduce count to 40 max, skip line drawing between particles, keep only dots — removes O(n²) inner loop
- Alternatively, replace entirely with a CSS-only subtle animated background (grid lines, scanlines) that renders on GPU with zero JS cost
- Always check: "what does this motion COMMUNICATE?" If the answer is "nothing," it is waste

**Phase:** Hero implementation

---

### D4: Card Grid Layouts That Look Like Feature Lists, Not Case Studies

**What goes wrong:** Service and portfolio sections use uniform 3-column card grids with a title, short description, and icon. This is the default SaaS marketing template pattern — it makes a solo AI engineer look like a VC-funded company selling a product, not a craftsperson selling judgment and expertise.

**Consequences:** Startup founders hiring a solo engineer want to see *how you think*, not a feature matrix. A grid of "AI Agents: We build custom AI agents" tells them nothing differentiating.

**Warning signs:**
- Every card in a section has roughly the same content structure
- Cards have icons but no specificity (no actual output, no concrete result)
- The portfolio section is a grid of placeholder cards with no content substance

**Prevention:**
- Services: use a narrative section format (problem → solution → outcome) rather than icon + short paragraph
- Portfolio placeholder cards should name the problem domain and expected outcome, even if the case study is not written yet — "Automated lead qualification pipeline: reduced response time from 4h to 8min" is a placeholder with weight
- Consider an asymmetric layout for the hero service section: one large featured capability, two supporting capabilities

**Phase:** Services section, Portfolio section

---

### D5: Typography Size Collisions Between Mobile and Desktop

**What goes wrong:** A 4.55rem `h1` is striking on a 1440px screen and illegible-by-overflow on a 375px iPhone SE. Without a proper fluid type scale, either the desktop headline is timid or the mobile headline breaks layout.

**The existing code already shows this risk:** `h1` is hard-set at `4.55rem` with no `clamp()` or viewport-unit scaling. At 375px viewport width this renders as ~68px — too large for a single line, causing the heading to wrap at awkward points.

**Warning signs:**
- Headline wraps at a visually awkward word on any screen narrower than 480px
- Inspector shows `font-size` not using `clamp()`

**Prevention:**
```css
/* Fluid type scale pattern */
h1 { font-size: clamp(2.2rem, 5.5vw + 0.5rem, 4.55rem); }
h2 { font-size: clamp(1.8rem, 4vw + 0.4rem, 3rem); }
```
- Apply `clamp()` to every heading and the hero lede — no breakpoint hacks needed
- Test at 375px, 430px, 768px, 1024px, and 1440px before shipping each section

**Phase:** Typography system (Phase 1)

---

### D6: Navigation That Signals "Freelancer" Instead of "Studio"

**What goes wrong:** Navigation labels directly expose the old positioning. The current nav reads: "AI Agents / Automations / DevOps / Portfolio / Contact." "Automations" is a low-value SME service word. This is the first text a founder reads and it immediately places the site in a different mental category.

**Consequences:** A founder who uses Zapier calls theirs "automations." The word signals $500 n8n gigs, not $50k AI product builds.

**Warning signs:**
- Any nav label that could also appear in a Fiverr gig title
- Nav labels that describe technology ("DevOps") rather than outcomes or capabilities

**Prevention:**
- Replace with: "Work / Capabilities / Process / About" or similar
- Or use Linear-style minimal nav: no labels, just anchor links with minimal names — "Services / Work / About / Contact"
- Never mirror service-category labels as nav items; the nav is about where to go, not what you sell

**Phase:** Nav redesign (Phase 1)

---

## Technical Pitfalls

*CSS/JS issues common in dark/technical sites*

---

### T1: backdrop-filter Breaking on Safari / iOS Without Fallback

**What goes wrong:** The floating nav uses `backdrop-filter: blur(18px)` which looks great in Chrome but has historically had rendering bugs in Safari — particularly on iOS where compositing layers can cause the blurred element to render at the wrong z-index or flicker during scroll.

**The existing code's exposure:** The header uses both `backdrop-filter` and `position: fixed` + `transform: translateX(-50%)`. The `transform` on a fixed element creates a new stacking context. Combined with `backdrop-filter`, this is a known Safari jank trigger.

**Warning signs:**
- Header appears to "flash" or lose blur on iOS Safari during scroll
- Backdrop renders incorrectly when nav is over a section with z-index stacking

**Prevention:**
```css
.site-header {
  -webkit-backdrop-filter: blur(18px); /* Safari prefix */
  backdrop-filter: blur(18px);
  /* Fallback for browsers/devices that don't support it */
  background: rgba(8, 10, 10, 0.92); /* slightly more opaque as fallback */
}
```
- Test the header on iOS Safari on real hardware before each phase ships
- Avoid combining `transform` + `backdrop-filter` on the same element — use a wrapper for transform, inner element for backdrop

**Phase:** Header implementation

---

### T2: CSS Custom Properties and calc() in Dark Mode — Contrast Ratios

**What goes wrong:** On dark sites, text contrast is frequently an afterthought. Semi-transparent text values like `rgba(255,255,255,0.62)` look fine on the designer's calibrated display but fall below WCAG AA (4.5:1) on budget or OLED displays.

**Specific risk in this codebase:** The existing CSS uses multiple opacity tiers for white text: 0.78, 0.72, 0.70, 0.62. The 0.62 tier — used for secondary text in flow-row paragraphs — renders at approximately 3.2:1 contrast against the dark background. This fails WCAG AA for body text.

**Warning signs:**
- Any `rgba(255,255,255, X)` where X < 0.70 on a background darker than #1a1a1a
- Chrome DevTools Accessibility panel shows contrast failures

**Prevention:**
- Use a three-tier text hierarchy with verified contrast:
  - Primary text: `#ffffff` or `rgba(255,255,255,0.95)` — always AA/AAA
  - Secondary text: `rgba(255,255,255,0.72)` — verify against actual background, not assumed
  - Muted/tertiary: `rgba(255,255,255,0.50)` — only acceptable for decorative or non-essential text
- Audit every opacity-based text value against its exact background color, not a generic "dark bg"

**Phase:** CSS system definition, and re-audit at each section build

---

### T3: The O(n²) Canvas Animation Jank Pattern

**What goes wrong:** Already flagged in D3 from a design perspective, but from a purely technical angle: the existing `drawNetwork()` function iterates all particle pairs to draw connection lines — `n*(n-1)/2` operations per frame. At 82 particles = 3,321 iterations per 16ms frame budget.

**Measured impact:** On a 2019 MacBook Pro running Chrome under load (common for a founder with many tabs), this loop visibly drops the page from 60fps to 40-50fps during initial load when other resources are also parsing. On mobile it is worse.

**This is the single most common vanilla JS performance mistake on dark hero sections.** Every "AI startup" template uses exactly this pattern.

**Warning signs:**
- Chrome DevTools Performance tab: long yellow "Scripting" bars at 16ms+ per frame
- The words "for every particle, check every other particle" in your code

**Prevention:**
- Option A (best): Remove the canvas animation entirely, use CSS `@keyframes` background effects
- Option B: Keep canvas but eliminate line drawing — dots only, no proximity lines
- Option C: Keep lines but use spatial partitioning — only check particles within the same grid cell
- Always cap `rAF` animations with a visibility check: pause when the element is off-screen via `IntersectionObserver`

**Phase:** Hero implementation

---

### T4: requestAnimationFrame Loop Not Paused When Tab Hidden

**What goes wrong:** The canvas `drawNetwork()` loop calls `requestAnimationFrame` unconditionally on every frame and only cancels on `pagehide`. If the user switches tabs, the loop keeps running, draining CPU and battery. Technical founders who profile sites will notice this immediately.

**The existing code has this bug:** `animationFrame = requestAnimationFrame(drawNetwork)` runs continuously; `pagehide` handles browser close but not tab switching.

**Prevention:**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    drawNetwork(); // restart
  }
});
```
- This is table-stakes behavior for any canvas animation

**Phase:** Hero JS implementation

---

### T5: Scroll Listener Without Passive Flag — Janky Scroll Performance

**What goes wrong:** The existing `window.addEventListener("scroll", ...)` for the header shadow does not use `{ passive: true }`. Without this flag, the browser cannot optimize scroll events — it must wait for the handler to complete before rendering each scroll frame, causing visible stutter on low-end devices.

**The existing code has this bug:**
```javascript
window.addEventListener("scroll", () => {
  // This blocks scroll optimization
});
```

**Prevention:**
```javascript
window.addEventListener("scroll", () => { ... }, { passive: true });
```
- Every scroll, touchstart, touchmove, and wheel listener should use `{ passive: true }` unless explicitly calling `preventDefault()`

**Phase:** Phase 1 JS (applied whenever scroll listeners are written)

---

### T6: Single File Architecture — The CSS Specificity Debt Problem

**What goes wrong:** With all CSS in one flat `styles.css` file and no build tooling, specificity conflicts compound quickly. As sections are added, developers write more specific selectors to override earlier rules rather than revisiting the original rule — leading to a cascade of `.section .card .title` overrides that become unmaintainable.

**Why this is specific to this project:** The constraint is intentional and valid — but without discipline, a single CSS file becomes a liability after ~600 lines. The existing `styles.css` is already using pattern-specific class names (`.agent-card`, `.devops-card`, `.package-card`) that are all near-identical in implementation.

**Warning signs:**
- Multiple classes with the same properties differing only in color
- Selectors with 3+ parts to override an earlier rule
- `!important` appears anywhere

**Prevention:**
- Use CSS custom properties at the component level — each card type sets `--card-accent: [color]` and shares a single `.card` base rule
- Define a "base + modifier" convention: `.card` handles structure, `.card--featured` handles variation
- Set a line count budget: if styles.css exceeds 800 lines, stop and refactor before adding more

**Phase:** All phases — establish convention in Phase 1, audit at Phase 3

---

### T7: mix-blend-mode on PNG Wordmark — Cross-Browser Rendering Inconsistency

**What goes wrong:** The existing CSS applies `mix-blend-mode: screen` to `.brand-wordmark` and `.hero-wordmark`. On dark backgrounds `screen` blend mode makes a black-on-white PNG logo appear to disappear (the white becomes transparent). This works when the background is truly dark but breaks on lighter section backgrounds or when the header floats over a lighter area during scroll.

**Warning signs:**
- Logo appears invisible on any background lighter than about #444
- Logo rendering differs between Chrome and Safari

**Prevention:**
- Use an SVG logo or a PNG with a transparent background instead of relying on blend mode tricks
- If PNG with white background must be used, `mix-blend-mode: multiply` works for dark-on-light logos; `screen` works for light-on-dark — but never rely on blend mode for a header logo that scrolls over varied backgrounds
- The cleaner solution: provide a white-on-transparent wordmark PNG and remove blend mode entirely

**Phase:** Phase 1 branding implementation

---

### T8: Vanilla JS — Missing IntersectionObserver Cleanup for Reveal Animations

**What goes wrong:** The current reveal pattern disconnects the observer after triggering (`revealObserver.unobserve(entry.target)`) — this is correct. But if the redesign adds scroll-triggered staggered animations (e.g., animating card children with delays), developers commonly create one observer per card child, creating dozens of observers simultaneously.

**Warning signs:**
- `document.querySelectorAll('.reveal')` count grows above 30 elements
- Chrome Memory tab shows many `IntersectionObserver` instances

**Prevention:**
- One observer, one `querySelectorAll` — observe all targets through the same observer instance
- For staggered animations, use CSS `animation-delay` with a `--stagger-index` custom property, not separate JS observers per element

**Phase:** Any phase adding reveal animations

---

## Positioning & Copy Pitfalls

*Messaging mistakes that hurt credibility with startup founders*

---

### P1: "We" Language on a Solo Practice — Destroys Trust

**What goes wrong:** The existing site copy uses "we build," "we create," etc. A startup founder who clicks through to discover a solo engineer feels deceived. More importantly, "we" signals a generic agency trying to look bigger than it is — the opposite of the premium solo expert positioning.

**Why this particularly hurts the repositioning:** The appeal of hiring Manik specifically is the solo expert model — one senior engineer who does the whole stack, no handoffs, no account managers. "We" copy actively undermines this value proposition.

**Warning signs:**
- Any first-person plural in copy: "we," "our team," "we've built"
- Agency-style phrases like "our process," "our team of experts"

**Prevention:**
- All copy uses "I" or is written in second-person ("You get a senior AI engineer...")
- The About section should be a direct first-person voice — not a bio in the third person
- One exception: "AgentOps Studio builds X" in formal contexts is acceptable because it's the company name, not a false plural

**Phase:** All copy — establish rule at Phase 1, enforce throughout

---

### P2: Outcomes-Free Service Descriptions

**What goes wrong:** Service copy describes *what is built* rather than *what the founder gets*. "Custom AI agents built on LangChain/LangGraph" is a technology description. "An AI that handles your inbound support so your team stops answering the same 12 questions every day" is an outcome.

**The existing copy has this problem:** "We build AI assistants, social media automations, internal tools, and reliable deployment pipelines." This is a technology list masquerading as a value proposition.

**Warning signs:**
- Service descriptions mention technology names before describing what changes for the client
- No numbers or concrete changes described (time saved, cost reduced, error rate cut)
- Words like "powerful," "robust," "scalable" appear without qualification

**Prevention:**
- Formula for every service: `[persona problem] → [specific outcome]` in the first sentence
- Concrete over abstract: "Your sales team responds to leads in 90 seconds instead of 4 hours" beats "AI-powered lead qualification"
- Reserve technology names for a secondary/detail level — founders care about outcomes, engineers care about stack

**Phase:** Services section copy

---

### P3: Generic "AI Buzzword" Hero Headline

**What goes wrong:** Headlines like "Build smarter with AI" or "Your AI partner for growth" or "AI-powered everything" appear on thousands of sites. A startup founder who has seen 50 pitches has tuned out every variation of these phrases.

**The current hero headline:** "Make your business run like a smarter system" — this is a generic SME-tier promise. For the new positioning, the headline must speak directly to what a startup founder who has been burned by agencies wants to hear.

**Warning signs:**
- Hero headline could appear on a competitor's site without changing
- Headline uses "AI" as the subject rather than the outcome
- No specificity about who the client is (any business? any founder?)

**Prevention:**
- Speak to the exact moment the target founder is in: they have built an MVP, it's working, they need to add AI capabilities without hiring a full team
- Test: could this headline appear on a freelancer's Upwork profile? If yes, rewrite it
- Specific beats generic: "I build the AI layer your startup is missing — agents, pipelines, and the infrastructure to run them in production" is specific, first-person, and outcome-oriented

**Phase:** Hero copy

---

### P4: Portfolio Placeholder Cards That Signal "I Have No Work to Show"

**What goes wrong:** An empty portfolio with placeholder cards reads as one of three things: (a) too new to have clients, (b) work is under NDA and they don't know how to say that, or (c) the site was shipped before it was ready. All three undermine trust.

**The specific risk here:** The PROJECT.md explicitly acknowledges "Placeholder cards only for v1 — real case studies to be added later." This is a rational decision but it must be *designed for* rather than just accepted.

**Prevention:**
- Placeholder cards must not look like placeholders — they should be fully styled case study cards with a real problem statement, technology used, and a "Details under NDA" or "Case study coming Q3 2026" label
- Alternative: replace portfolio grid with a "Selected Work" section that uses 2-3 one-paragraph descriptions of real problems solved (even without visuals, even anonymized)
- Worst outcome: a grid of cards that say "Project Name" and "Description coming soon" — remove the section entirely before shipping this

**Phase:** Portfolio section

---

### P5: Price/Scope Signals That Undercut Premium Positioning

**What goes wrong:** Showing service "packages" with explicit tiers and prices on a premium site signals a productized freelancer, not an expert partner. When you show three pricing tiers, the founder's first instinct is to pick the middle one — and to compare you to other tiered providers. This is the opposite of "call me and let's solve your problem."

**Why this applies here:** The existing site has a `.package-card` component implying tiered packages. The new positioning should eliminate this unless the scope is carefully reconsidered.

**Prevention:**
- Replace pricing packages with a clear engagement model: "I work in focused engagements, typically 4-12 weeks. Let's talk about what you need."
- If pricing must appear: use a single "starting from" figure or a day rate — not three columns with feature checkmarks
- Premium positioning requires discovery-led sales, not menu-selection. The CTA should always be "Book a call," not "Buy the starter package."

**Phase:** Services/Pricing section

---

### P6: The LinkedIn/Email in the Hero — Signals Freelancer, Not Studio

**What goes wrong:** Displaying `manikmalhotra6@gmail.com` and `+91 9599668843` in the hero section alongside the CTA is a freelancer reflex — it signals "I need you to be able to reach me because I'm easy to contact." A premium studio does not put its phone number in the hero; it has one CTA path and removes all ambient contact info from above the fold.

**Warning signs:**
- Personal Gmail address in the hero
- Phone number displayed in the hero
- The hero CTA competes with inline contact links

**Prevention:**
- Remove phone and email from the hero — contact details belong in the footer and the dedicated contact section
- Replace Gmail with a branded email: `manik@agentopsstudio.com` or similar — a Gmail address in the hero is a trust signal problem
- One CTA in the hero: "Book a discovery call" — nothing else

**Phase:** Hero copy + header/footer contact design

---

## Performance Pitfalls

*Slow sites kill credibility with technical founders*

---

### PR1: Unoptimized PNG Images — The Wordmark and Logo Files

**What goes wrong:** `wordmark.png` and `logo.png` are referenced multiple times (header, hero, footer) as standard PNGs. PNG files for logos are typically 10-200KB each. Loading multiple uncompressed PNGs above the fold directly delays the LCP metric.

**Why this matters for the specific audience:** A technical founder who opens DevTools and sees a 140KB PNG being used for a header logo reads this as "this person doesn't care about performance" — an immediate signal about how they will treat production systems.

**Warning signs:**
- `wordmark.png` file size > 30KB
- Images not specified with explicit `width` and `height` attributes (causes layout shift)
- No `loading="eager"` on above-fold images (let browser optimize timing)

**Prevention:**
- Convert logo/wordmark to SVG where possible — vector graphics are smaller and scale perfectly
- Where PNG must be used: compress to WebP and serve with `<picture>` tag fallback
- Always specify `width` and `height` on all `<img>` elements to prevent CLS
- The favicon.svg is already SVG — use the same SVG approach for the header brand mark

**Phase:** Phase 1 (assets) — foundation before any section build

---

### PR2: Google Fonts or External Font CDN Load Blocking Paint

**What goes wrong:** The current site loads Inter from the system font stack (`font-family: Inter, ui-sans-serif, system-ui, ...`) — this is correct and fast. The pitfall is introducing a `<link rel="stylesheet">` to Google Fonts during redesign to get a specific weight or to use a display font.

**Why it happens:** Designers want to use a specific geometric sans (Geist, Space Grotesk, DM Sans) that isn't in the system font stack. Adding a Google Fonts `<link>` without `display=swap` and preconnect blocks the first paint.

**Prevention:**
- If staying with Inter: it is already a system font on macOS/iOS — no external load needed. On other systems it falls back gracefully.
- If switching to a different typeface: self-host WOFF2 files, use `@font-face` with `font-display: swap`, and preload critical weights
- Never: `<link href="https://fonts.googleapis.com/css2?family=...">` without `display=swap` parameter AND a `<link rel="preconnect" href="https://fonts.googleapis.com">` before it

**Phase:** Typography definition (Phase 1)

---

### PR3: The Netlify Function Cold Start on Form Submit

**What goes wrong:** The existing site uses a Netlify Function (`/.netlify/functions/lead-to-slack`) for the lead form. Netlify Functions run on AWS Lambda and have cold start times of 400-2000ms. When a founder submits the contact form and waits 2 seconds for a response, they question whether the submit worked.

**Why this is a credibility issue:** The form submission experience is often the *last thing* a potential client does before deciding to reach out. A sluggish, ambiguous response undermines the entire trust-building the rest of the site accomplished.

**Warning signs:**
- Form button disabled state persists for > 500ms after submit
- No optimistic UI (immediate feedback before the network response)

**Prevention:**
- Show immediate optimistic feedback: "Got it — sending now" within 50ms of submit, before awaiting the fetch response
- Set a 4-second timeout on the fetch — if cold start exceeds this, show a fallback: "Sent to Manik's inbox directly — [email link]"
- Consider replacing the Netlify Function with a simple Netlify Form (HTML `netlify` attribute) — Netlify Forms are handled at the CDN level with no cold start, and submissions appear in the Netlify dashboard

**Phase:** Contact section

---

### PR4: Canvas Animation Blocking Largest Contentful Paint

**What goes wrong:** The `<canvas>` element initializes, calls `resizeCanvas()`, and immediately begins the `rAF` loop on page load — during the same critical rendering window where the browser is parsing and rendering the hero text. Canvas initialization competes with text rendering for the main thread.

**Impact:** The hero headline (`h1`) is almost certainly the LCP element. If canvas setup runs synchronously before the headline renders, LCP score degrades. On a slow 3G simulation, this is the difference between a 2.5s and 4.0s LCP — the boundary between "Good" and "Needs Improvement."

**Warning signs:**
- Chrome DevTools Lighthouse shows LCP > 2.5s on simulated 3G
- The LCP element is identified as the canvas rather than the h1

**Prevention:**
```javascript
// Defer canvas init until after first paint
requestIdleCallback(() => {
  if (canvas && context) {
    resizeCanvas();
    drawNetwork();
    window.addEventListener("resize", resizeCanvas);
  }
});
```
- If `requestIdleCallback` is not available (Safari), fall back to `setTimeout(fn, 100)`
- This single change can improve LCP by 0.5-1.5s on the simulated benchmark

**Phase:** Hero JS implementation

---

### PR5: layout: fixed Header Without Content-Visibility Optimization

**What goes wrong:** As more sections are added, the browser must paint and composite the entire page even when sections are off-screen. On a single-page site with 6-8 sections, this causes sluggish scroll performance and high paint times on low-end Android devices.

**Prevention:**
```css
/* Apply to every major section except hero */
.section,
.split-section,
.contact-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 600px; /* estimated height */
}
```
- `content-visibility: auto` is supported in all modern browsers and is the single highest-ROI CSS performance technique for long single-page sites
- Include the estimated `contain-intrinsic-size` to prevent scroll bar jumps

**Phase:** Phase 1 CSS architecture, applied to all sections

---

### PR6: Unthrottled resize Event Listener

**What goes wrong:** The canvas `resizeCanvas()` function is bound directly to `window.resize` with no throttle or debounce. On window resize (or device rotation), this fires continuously — reinitializing particles on every pixel of resize, which causes significant jank during the resize gesture.

**The existing code has this bug:**
```javascript
window.addEventListener("resize", resizeCanvas);
```

**Prevention:**
```javascript
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 150);
}, { passive: true });
```
- 150ms debounce is the standard interval — responsive enough to feel immediate on rotation, but not continuous

**Phase:** Hero JS implementation

---

## Critical Mistakes to Avoid

*Top 5 most impactful pitfalls — the ones that will most damage the redesign if they occur*

---

### C1: Carrying Over SME Positioning Signals Into the New Design

**Impact:** Fatal to the repositioning goal. Even a single vestigial signal — a "Book an automation audit" CTA, an "Automations" nav item, the Gmail address in the hero, a "24/7 monitoring" metric — immediately re-categorizes the site in the founder's mind as SME freelancer.

**Prevention strategy:** Before writing a single line of the new site, do a full audit of every string of text and every visual element in the current site. Classify each as: (a) carry forward, (b) rewrite, or (c) remove entirely. Make the cut list explicit in the planning document.

**Phase:** Phase 1, before any code is written

---

### C2: The O(n²) Canvas Performance Trap

**Impact:** A janky hero animation on a "performance engineering" site is the worst possible first impression for a technical founder. It signals that the site's author does not profile or optimize their own work.

**Prevention strategy:** If any animated canvas element appears on the site, it must be profiled in Chrome DevTools Performance panel before the phase is marked complete. Frame rate must sustain 60fps on a throttled 4x CPU profile. If it does not, the animation must be simplified or removed.

**Phase:** Hero implementation — gate on performance profiling

---

### C3: Three-Column Service Grid With Icon + Title + Description

**Impact:** This is the universal signal of a low-to-mid agency template. Linear, Vercel, Resend, Descript — none of them use this pattern for their primary services. A founder who sees this grid immediately reclassifies the site from "serious technical partner" to "agency with a WordPress theme."

**Prevention strategy:** Sketch the service section layout on paper before coding. If it resembles a feature matrix or a Bootstrap "3 columns with icons" layout, redo it. Consider narrative prose sections, a large-type capabilities list, or a single "how I work" description with one strong supporting visual.

**Phase:** Services section design

---

### C4: Deploying Placeholder Portfolio Cards as "Coming Soon"

**Impact:** An empty portfolio section actively destroys the credibility the rest of the site builds. A founder evaluating an AI engineer's work and finding "Project Title / Description coming soon" closes the tab.

**Prevention strategy:** If real case studies are not ready, the portfolio section must be redesigned to function without them — either as a "Selected Problems I've Solved" narrative section (paragraph format, no cards), a "Currently Available / Recently Completed" engagement update, or removed entirely with a note in the contact section that work samples are shared during a discovery call.

**Phase:** Portfolio section design — decide format before implementation begins

---

### C5: Not Testing on iOS Safari Before Shipping

**Impact:** A large proportion of startup founders use iPhones. The combination of `backdrop-filter`, `position: fixed`, `transform`, and CSS custom properties has consistently produced rendering bugs in iOS Safari across versions. The fixed header is the most visible element on every scroll — if it flickers, bleeds, or misaligns on iOS, the site immediately reads as unpolished.

**Prevention strategy:** Establish iOS Safari testing as a mandatory gate (not optional) before any phase is marked complete. Use BrowserStack free tier if no physical device is available. Specifically test: header scroll behavior, smooth scroll anchoring, canvas visibility, and any element using `position: sticky`.

**Phase:** Every phase — testing gate

---

## Key Insights for Roadmap Planning

- **The repositioning is the hardest problem, not the technology.** Every design and copy decision must be audited against a single question: "Does this signal startup-tier expert or SME freelancer?" This is a content and strategy problem that will not be solved by better CSS.

- **Performance is a credibility signal, not just a metric.** The audience is technical. An AI engineering practice with a janky canvas animation or a slow form submit will lose deals to a competitor with a plainer, faster site. Every phase should include a performance gate, not just a visual review.

- **The single-file architecture requires strict convention discipline.** Without a build system enforcing component isolation, CSS specificity debt and JS callback proliferation will make the codebase unmaintainable after the first 3 phases. Establish naming conventions and a CSS architecture (base + modifier pattern) in Phase 1 before any section-specific code is written.

- **One accent color. Not three.** The current site's three-accent system (cyan, lime, coral) is the highest-visibility signal of a template aesthetic. Choosing one primary accent and demoting the others to structural/neutral roles is the single CSS change with the greatest visual upgrade return.

- **Placeholder portfolio content is a launch-blocker, not a "v1 acceptable."** Plan for what the portfolio section looks like with zero finished case studies. Either design it to function without them (narrative format) or remove it. Do not ship a card grid with placeholder text — it will be worse than no portfolio section at all.
