# Research Summary: AgentOps Studio Website Redesign

**Synthesized:** 2026-05-06
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md, PROJECT.md

---

## Recommended Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Structure | Single `index.html` — no build step, no framework | Netlify publishes from root; keep flat file structure |
| CSS | Native custom properties (design tokens) + flat semantic class names | Primitives → Semantic token separation; section order in CSS mirrors DOM order |
| Layout | CSS Grid + Flexbox | No library needed; handles all hero and card grids natively |
| Animation — entrance | `IntersectionObserver` + CSS `transition` with `cubic-bezier(0.16, 1, 0.3, 1)` | Already implemented; fast-in-slow-out spring easing only — never `ease-in-out` |
| Animation — complex | GSAP 3.12.5 + ScrollTrigger (CDN only) | Only justified for hero stagger, scroll-pinned sequences, and counter animations — nothing else |
| Hero background | Existing `<canvas>` particle network — retained, refined | Reduce to ≤40 particles; eliminate O(n²) line-drawing loop; defer init via `requestIdleCallback` |
| Icons | Lucide Icons — inline SVG snippets | No JS icon library; MIT license; consistent 24px grid |
| Fonts | Inter variable font via Google Fonts with `preconnect` + `display=swap` | Variable font (opsz,wght axes) in one request; JetBrains Mono for code/terminal elements |
| Deploy | Existing Netlify pipeline — no changes | `netlify.toml` is complete; CDN cache headers are the only optional polish item |

**Typography rules that matter most:**
- `font-optical-sizing: auto` and `-webkit-font-smoothing: antialiased` on `body` — mandatory for premium dark UI
- Negative `letter-spacing` on all headings (`-0.04em` for h1, `-0.03em` for h2) — the single biggest "designer vs. developer" signal
- All heading sizes use `clamp()` — no breakpoint font-size overrides

**Color system — definitive choices:**
- Background: `#0a0a0b` (near-black, slight warm undertone — not pure `#000`)
- Surfaces: `#111113` / `#18181b` / `#232326` — 4-step dark hierarchy
- Primary accent: `#7c5cfc` (violet/indigo) — replaces the current cyan+lime dual-accent system
- Cyan (`#22d3ee`) demoted to secondary: data viz, terminal elements, status indicators only
- One accent at full saturation. Everything else is grey. This is the rule.

---

## Table Stakes Features

These must be present for the site to be credible to startup founders. Absence signals amateur.

1. **One-line value proposition in hero** — above the fold, specific to who you work with ("seed-to-Series-A startups") not generic ("businesses")
2. **"Book a discovery call" CTA** — visible in hero AND sticky nav; must be a direct calendar link (Calendly/Cal.com), not a form
3. **Services described as outcomes** — what the founder gets, not what tools are used
4. **About section** — does not currently exist; solo operator sites require a named person with credibility signals (not a resume — 2-3 sentences with one strong anchor)
5. **Working contact mechanism** — the calendar booking link IS the contact mechanism; no form required for primary CTA path
6. **Responsive mobile layout** — >50% of first visits are mobile; founders click Slack links on their phones
7. **Fast load, no layout shift** — technical credibility is undermined by a slow or janky site; explicit `width`/`height` on all `<img>` elements
8. **Consistent dark aesthetic** — header, hero, cards, sections all in the same color temperature; no warm-white sections breaking the palette
9. **Technology stack signals** — real AI/infra tools in the logo strip (OpenAI, Anthropic, LangChain, Kubernetes, Terraform) — not WhatsApp and Google Sheets
10. **Footer with email and LinkedIn** — no phone number; contact = email + calendar only

---

## Differentiators

What will make this site stand out from generic freelancer and agency sites.

1. **Live technical hero visual** — a refined canvas animation representing actual AI engineering work (agent orchestration, model call trace, deployment readout) — not a generic particle network
2. **Opinionated, first-person positioning** — "I build the AI layer of your product" is a claim, not a description; headline is a confident statement, not a category label
3. **"Who I work with" filter** — explicitly naming the client type (seed-to-Series-A, building AI-native products) signals scarcity and raises perceived value with the right buyers
4. **Process transparency with client POV** — each step names what the founder experiences; async-first cadence (weekly Loom, no endless meetings) is a genuine differentiator vs. agencies
5. **Capacity/availability signal** — "Currently taking 1-2 new projects" creates urgency without discounting; dramatically increases perceived value
6. **Solo operator framed as strength** — "You work directly with me, not through account managers or junior devs" — converts the perceived risk of a solo practice into a competitive advantage
7. **Technical vocabulary as trust filter** — copy uses "LangGraph," "RAG pipeline," "eval framework," "production observability" — passing the vocabulary test for technical founders
8. **Card spotlight / cursor-glow interaction** — already implemented; update gradient color to violet accent (`rgba(124, 92, 252, 0.12)`); this is the canonical 2024-2025 premium card interaction

---

## Critical Pitfalls to Avoid

**P1: Any surviving SME language or visual signals**
The entire site must be audited before writing a single line of new code. Specific offenders: "Book an automation audit" CTA, "Automations" nav label, Gmail address in hero, phone number in hero/footer, WhatsApp as contact option, service package tiers, "SMEs" anywhere in copy. A single vestigial SME signal re-categorizes the whole site for a founder who scans for these.

**P2: O(n²) canvas animation jank**
The existing `drawNetwork()` iterates all particle pairs — up to 3,321 calculations per 16ms frame at 82 particles. This drops to 40-50fps on a loaded MacBook. Fix required: reduce to ≤40 particles, eliminate line-drawing (dots only), defer canvas init via `requestIdleCallback`, add `visibilitychange` pause, add `{ passive: true }` to resize listener. An AI engineering site with a janky hero animation is the worst possible first impression for a technical founder.

**P3: Three-column service grid with icon + title + description**
This is the universal agency template signal. No premium technical studio uses this pattern. Services must be narrative or capabilities statements with outcome-first framing — never a feature matrix. Sketch the layout before coding; if it looks like Bootstrap "3 columns with icons," redo it.

**P4: Placeholder portfolio cards that look like placeholders**
"Project Title / Description coming soon" actively destroys trust. Before implementing the portfolio section, decide the format: (a) fully styled NDA cards with real problem statements, (b) a narrative "Selected Problems Solved" section, or (c) remove the section and note that work samples are shared during discovery calls. Do not ship an empty card grid.

**P5: No calendar booking link at launch**
The primary CTA is "Book a discovery call" throughout the entire site. If that CTA points to a form or a placeholder, the conversion path is broken. Calendly/Cal.com link is a hard pre-launch dependency.

**P6: Three competing accent colors**
Current site uses cyan + lime + coral at equal weight. Violet is the new primary. Cyan is secondary only (terminal/data elements). Lime is demoted to decorative background — never on interactive elements. Define this in Phase 1 CSS tokens and never deviate.

**P7: Not testing on iOS Safari**
The `backdrop-filter` + `position: fixed` + `transform: translateX(-50%)` combination on the header triggers known Safari rendering bugs. iOS Safari testing is a mandatory gate before each phase ships. Always include `-webkit-backdrop-filter`. Never put `transform` on the same element as `backdrop-filter`.

---

## Architecture Overview

**File structure stays identical:** `index.html` + `styles.css` + `script.js` + Netlify config. No build step, no asset subdirectories, no ES modules. Netlify `publish = "."` means root is the static server — keep everything flat.

**CSS organization — strict top-to-bottom order mirroring DOM:**
Design tokens → Reset/base → Typography → Shared utilities → Header → Hero → Tech strip → Services → Portfolio → Process → About → CTA/Contact → Footer → Keyframes → Media queries (940px, 640px) → `prefers-reduced-motion`

Media queries live in two consolidated blocks at the bottom — never scattered inline.

**CSS naming convention:** Flat semantic class names (`.hero-headline`, `.services-card`) — not BEM double-underscore syntax. Base + modifier pattern for variants: `.card` handles structure, `.card--featured` handles variation. 800-line budget on `styles.css` before refactor is required.

**JS organization — single file, sequential blocks:**
DOM refs → Header behavior → Tech strip marquee → Scroll reveal (one shared `IntersectionObserver`) → Canvas/particle system → Card spotlight → Counter animations → Form handling → Active nav section tracking

**New section required:** About section (does not exist in current site). Split layout using the same CSS grid pattern as the existing `.split-section`. Load-bearing for the "solo AI engineer, not a freelancer" message.

**Existing JS that carries forward (~80% unchanged):** canvas particle system, `IntersectionObserver` reveal, card spotlight (`pointermove`), marquee DOM clone, Netlify form handler. This is primarily a design and copy rebuild, not an architecture rebuild.

**Performance non-negotiables for a technical audience:**
- `requestIdleCallback` wrapping canvas init
- `visibilitychange` listener pausing canvas rAF when tab is hidden
- `{ passive: true }` on all scroll, resize, touch listeners
- `loading="lazy"` on all below-fold images with explicit `width`/`height`
- `content-visibility: auto` on heavy off-screen sections
- Non-blocking font load: `media="print"` + `onload="this.media='all'"` pattern

---

## Pre-Launch Dependencies

| Dependency | Blocker Level | Notes |
|-----------|---------------|-------|
| **Calendar booking link** (Calendly or Cal.com) | HARD BLOCKER | Primary CTA throughout site. Do not launch without a live URL. |
| **Branded email address** | STRONG — launch with | Gmail in hero/footer directly undermines premium positioning |
| **Portfolio content decision** | Must decide before Phase 3 implementation | Choose format before coding: styled NDA cards, narrative, or omit |
| **About section copy** | Required for launch | Section does not exist yet; needs bio, credibility anchor, GitHub/LinkedIn |
| **Wordmark as SVG or transparent-background PNG** | Pre-Phase 1 | Current PNG uses `mix-blend-mode: screen` which breaks on light backgrounds |
| **Hero visual content decision** | Required before Phase 2 | Agent orchestration graph vs. streaming LLM trace vs. refined dot-only network |

---

## Phase Recommendations

### Phase 1: Foundation
Design system, typography, header, and baseline conventions.

- All CSS design tokens (primitives → semantic, spacing, motion, shadows)
- Fluid type scale with `clamp()`, negative letter-spacing on headings
- Non-blocking Inter variable font load
- Header redesign: floating pill, `backdrop-filter` with `-webkit-` prefix separated from `transform`
- Nav relabeled: "Services / Work / Process / About / Contact"
- Wordmark rendering fixed (SVG or transparent PNG)
- `content-visibility: auto` on heavy sections as architectural default
- `{ passive: true }` on all scroll/resize listeners from day one
- Full SME language audit completed and cut list documented before any copy is written

*Addresses pitfalls: D2 (accent system), D6 (nav), T2 (contrast ratios), T5 (passive listeners), T6 (CSS convention), T7 (blend mode), PR1 (logo assets), PR2 (font loading)*

### Phase 2: Hero
The conversion moment that establishes positioning in the first 5 seconds.

- Rewritten headline/copy with startup-native vocabulary; first-person voice throughout
- Eyebrow + H1 + subheadline + single "Book a discovery call" CTA + secondary "View work"
- Phone, Gmail, and ambient contact info removed from hero entirely
- Canvas: reduced to ≤40 particles, line-drawing eliminated, `requestIdleCallback` init, `visibilitychange` pause, debounced resize
- Hero visual column: new technical illustration replacing SME console (decided in pre-launch step)
- Particle color updated to violet accent

*Addresses pitfalls: D3 (purposeful animation), T3 (O(n²) jank), T4 (rAF hidden tab), PR4 (LCP canvas block), PR6 (resize debounce), P3 (generic headline), P6 (freelancer contact signals)*

### Phase 3: Core Sections
Services, portfolio, and tech strip — what you build and for whom.

- Tech strip: replace SME tools with AI/infra stack (OpenAI, Anthropic, LangChain, LangGraph, Supabase, AWS, Kubernetes, Terraform, GitHub Actions, Docker)
- Services section: 4 capability cards with outcome-first copy (AI Agents, AI Feature Integration, AI Infrastructure, DevOps & Delivery) — narrative/capabilities format, not 3-column icon grid
- Portfolio section: implement chosen format; fully styled, no placeholder text visible to visitors
- All new cards use `.card` base + `.card--featured` modifier pattern
- Card spotlight active on all new cards with violet accent gradient

*Addresses pitfalls: C3 (icon grid), C4 (placeholder cards), D4 (generic card layouts), P2 (outcomes-free copy)*

### Phase 4: Process, About, and CTA
Trust-building layer — who Manik is, how he works, and the conversion moment.

- Process section: 5 named steps from founder's POV; horizontal timeline; async/speed/transparency copy signals
- About section (new): split layout; first-person bio with credibility anchor; "solo operator as strength" framing; GitHub + LinkedIn
- CTA/Contact section: calendar booking link as primary action; scarcity signal; 3-field form (remove phone/WhatsApp, add startup-qualifying questions)
- Optimistic form submit feedback (immediate UI response before Netlify Lambda cold start)
- Footer: email + LinkedIn only; auto-updating copyright year

*Addresses pitfalls: P1 ("we" language), P5 (price tier framing), PR3 (cold start UX)*

### Phase 5: Polish, Responsive, and Performance Gate
Ship-ready quality — no phase is complete without iOS Safari and Lighthouse pass.

- Media queries: 940px and 640px consolidated blocks
- Mobile test: 375px, 430px, 768px for headline wrap, nav toggle, canvas behavior
- iOS Safari gate: header scroll, `backdrop-filter` compositing, `position: sticky`
- `prefers-reduced-motion` overrides for all animation
- `loading="lazy"` + `width`/`height` on all below-fold images
- Chrome DevTools Performance: canvas at ≤16ms/frame on 4x CPU throttle
- Lighthouse: LCP ≤2.5s simulated 3G, no CLS, no render-blocking resources
- `og:title`, `og:description`, `og:image` meta tags
- Confirm calendar booking link is live before marking launch-ready

*Addresses pitfalls: C5 (iOS Safari), D5 (mobile typography), T1 (backdrop-filter Safari), PR5 (content-visibility)*

---

## Open Questions for Implementation

1. **Calendar booking platform?** Calendly vs. Cal.com vs. other. Determines CTA URL and whether an embed or redirect is used. Must be decided before Phase 4.

2. **Branded email address?** Is `manik@agentopsstudio.com` set up? If not, Gmail should appear in footer only — not hero.

3. **Hero visual content?** Three options: (a) refined dot-only particle network — lowest effort, lower differentiation; (b) stylized agent orchestration ASCII/SVG — medium effort, high differentiation; (c) streaming terminal/LLM trace mockup — medium effort, highest "I build AI" signal. Decide before Phase 2.

4. **Portfolio section format?** Styled NDA placeholder cards, narrative paragraph format, or omit entirely. Decide before Phase 3 implementation begins.

5. **About section photo?** Professional photo (higher trust for solo operator) or purely typographic approach? If photo, must be provided before Phase 4.

6. **Availability/scarcity signal?** What is the actual current project capacity? The "currently taking 1-2 new projects in [quarter]" copy needs a real, current answer.

7. **"AgentOps Studio" vs. "Manik Malhotra"?** Lead with the studio name or the person? Elite solo engineers (Leerob.io) lead with the person; boutique studios (Evil Martians) lead with the brand. Pick one and apply consistently throughout copy.

8. **GSAP or pure CSS for hero entrance?** If no scroll-pinned sequence is needed, CSS transitions + `IntersectionObserver` are sufficient and eliminate the CDN dependency. Decide at start of Phase 2.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Stack choices | HIGH | Grounded in existing codebase; no new libraries except GSAP (optional/CDN) |
| Color system | HIGH | Direct inspection of Linear.app; confirmed pattern across Vercel, Resend, Raycast |
| Features / positioning | HIGH | Direct analysis of current site vs. target audience; established conversion research |
| Architecture | HIGH | Based on direct inspection of existing `index.html` / `styles.css` / `script.js` |
| Pitfalls | HIGH | Several (T3, T4, T5, T7, PR6) are confirmed bugs in the existing codebase, not hypothetical |
| Copy direction | MEDIUM | Directional; specific headline copy should be validated with real founder feedback post-launch |
| Phase ordering | HIGH | Dependencies are clear; foundation-before-sections has no plausible alternative |

**Overall: HIGH.** The primary unknowns are content decisions (portfolio format, hero visual, calendar link) — not technology or architecture unknowns.

---

## Sources

- Direct inspection: existing `index.html`, `styles.css`, `script.js` in this repository
- Reference aesthetic: Linear.app, Vercel, Resend, Raycast (inspectable CSS)
- Positioning comparisons: Evil Martians, Basement.studio, Maximeheckel.com, Leerob.io
- Technical standards: MDN (IntersectionObserver, CSS custom properties, `@property`, `content-visibility`)
- Font: Google Fonts Inter variable font specimen
- GSAP: cdn.jsdelivr.net (verify current patch version before implementation)
