# Roadmap: AgentOps Studio Website Redesign

## Overview

A ground-up redesign of the AgentOps Studio site — repositioning from "freelancer for SMEs" to "premium AI engineering partner for startups." Five sequential phases build from the design foundation upward: tokens and header first, then the conversion moment (hero), then the capability proof (services, portfolio, tech strip), then the trust layer (process, about, CTA), and finally the quality gate (responsive, performance, SEO).

## Phases

- [x] **Phase 1: Foundation** - Design system, typography, floating header, and full SME language audit *(Complete — 2026-05-07)*
- [x] **Phase 2: Hero** - Startup-native headline, agent orchestration visual, canvas performance fix, scarcity signal *(Complete — 2026-05-07)*
- [x] **Phase 3: Core Sections** - Even-split tech strip, dual-audience services, NDA portfolio cards *(Complete — 2026-05-07)*
- [x] **Phase 4: Trust & Conversion** - Process timeline, about section (new), CTA, footer *(Complete — 2026-05-08)*
- [x] **Phase 5: Polish** - Responsive layout, iOS Safari gate, performance, SEO meta *(Complete — 2026-05-08)*

## Phase Details

### Phase 1: Foundation
**Goal**: The design system and structural shell are in place — every subsequent phase writes into a consistent token, typography, and header baseline.
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05, HEAD-01, HEAD-02, HEAD-03
**Success Criteria** (what must be TRUE):
  1. Opening the site in a browser shows the floating pill header with backdrop blur, "Services / Work / Process / About / Contact" nav labels, and a "Book a call" button — at all viewport sizes
  2. No SME-era language appears anywhere in the codebase: no "automation audit," no "SMEs," no Gmail in hero, no phone number, no service package tiers
  3. Inspecting `styles.css` shows a design tokens block at the top with violet `#7c5cfc` as the sole primary accent, `#0a0a0b` base background, and three dark surface values — before any section CSS
  4. All heading elements on the page render with negative `letter-spacing` and fluid `clamp()` sizes; Inter variable font loads non-blocking
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — CSS design system: two-layer token block, fluid typography, iOS Safari header split, violet btn-primary
- [x] 01-02-PLAN.md — HTML structure: Inter font loading, header wrapper split, startup nav labels + CTA button, full SME language audit
- [x] 01-03-PLAN.md — JS wiring: passive scroll handler, violet card spotlight, active nav IntersectionObserver
**UI hint**: yes

### Phase 2: Hero
**Goal**: A visitor landing on the site immediately understands who Manik works with, what he builds, and has a single clear action to take — in the first 5 seconds.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05
**Success Criteria** (what must be TRUE):
  1. The hero headline speaks to both SME and startup audiences in first-person, confident voice — no generic category label, no phone number, no Gmail visible in this section
  2. A single "Book a discovery call" primary CTA and a secondary "View work" link are visible above the fold; no contact form appears in the hero
  3. The right column displays a styled, animated agent orchestration trace visual — not the old SME console copy
  4. The canvas particle system runs at ≤40 particles with the O(n²) line-drawing loop removed, violet accent color, and pauses when the tab is hidden
  5. A "Currently taking 1–2 new projects" scarcity signal is visible in or near the hero CTA area
**Plans**: 3 plans
Plans:
**Wave 1** *(parallel)*
- [x] 02-01-PLAN.md — Hero copy + styles: h1/lede rewrite, scarcity signal HTML+CSS, violet console border, flow-dot pulse
- [x] 02-02-PLAN.md — Canvas rewrite: 35 particles, violet colors, k-nearest lines, requestIdleCallback, visibilitychange pause, debounced resize

**Wave 2** *(blocked on Wave 1 — 02-03 requires console HTML from 02-01)*
- [x] 02-03-PLAN.md — Agent-trace animation: dual-loop startup/SME console animation with MutationObserver reveal-wait

Cross-cutting constraints: `data-*` attribute hooks for all JS elements; CSS token values only (`--color-accent`, `--color-success`); iOS Safari `backdrop-filter` never on same element as `transform`
**UI hint**: yes

### Phase 3: Core Sections
**Goal**: The services, portfolio, and tech strip sections demonstrate credibility to both audiences — showing what tools are used, what is built, and proof of past work.
**Depends on**: Phase 2
**Requirements**: STRIP-01, SERV-01, SERV-02, SERV-03, PORT-01, PORT-02
**Success Criteria** (what must be TRUE):
  1. The tech strip shows an even split between AI/infra tools (OpenAI, Anthropic, LangChain, Docker, GitHub Actions) and SME integration tools (WhatsApp, Meta, Google Sheets, Gmail, Zapier/Make)
  2. The services section covers both SME-focused and startup-focused offerings in a narrative or capabilities format — no three-column icon grid, outcome-first copy throughout
  3. All service and portfolio cards respond to cursor movement with a violet spotlight glow (`rgba(124, 92, 252, 0.12)`)
  4. The portfolio section shows 3–4 fully-styled NDA placeholder cards with real-seeming problem statements and outcomes — no "coming soon" text visible to visitors
  5. Portfolio card markup accepts real case study content as a drop-in replacement without layout changes
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 03-01-PLAN.md — Delete old SME sections, fix nav hrefs (#agents→#services), update spotlight JS selector

**Wave 2** *(depends on 03-01)*
- [x] 03-02-PLAN.md — CSS cleanup: remove stale classes, add services CSS block, update marquee speed, extend logo-strip span for SVG

**Wave 3** *(depends on 03-01 and 03-02)*
- [x] 03-03-PLAN.md — HTML content: 10-pill tech strip, dual-cluster services section, 4 NDA portfolio cards

Cross-cutting constraints: `.timeline-step` preserved in all compound-selector edits (Phase 4 dependency); CSS token variables only (`var(--color-accent)` etc.) — no inline hex; `reveal` class on all new cards/headings
**UI hint**: yes

### Phase 4: Trust & Conversion
**Goal**: A prospect who has scrolled through the site understands exactly how Manik works, who he is, and has a frictionless path to book a call.
**Depends on**: Phase 3
**Requirements**: PROC-01, PROC-02, PROC-03, ABOU-01, ABOU-02, ABOU-03, ABOU-04, CTA-01, CTA-02, CTA-03, CTA-04, FOOT-01, FOOT-02
**Success Criteria** (what must be TRUE):
  1. The process section shows 5 named steps written from the client's point of view, in a horizontal timeline at desktop and stacked at mobile, with async-first working language (weekly Loom, no endless meetings)
  2. An about section (new — not in current site) exists with a first-person bio, at least one strong credibility anchor, a "you work directly with me" framing, and links to GitHub and LinkedIn — in a split layout
  3. The CTA/contact section uses a calendar booking link as the primary action, reinforces the scarcity signal, and includes a lightweight qualifying form (name, company, what you're building, timeline — no phone field) with immediate optimistic UI feedback on submit
  4. The footer shows email and LinkedIn only — no phone number; the copyright year updates automatically
**Plans**: 3 plans
Plans:
**Wave 1**
- [x] 04-01-PLAN.md — Process section rewrite: nav href fix, id="process", 5-step timeline (Discovery→Iterate), CSS grid 4→5 columns

**Wave 2** *(depends on 04-01)*
- [x] 04-02-PLAN.md — About section (new): DOM insertion after #portfolio, nav href fix, split layout with credentials-card, full About CSS block

**Wave 3** *(depends on 04-01, 04-02)*
- [x] 04-03-PLAN.md — CTA rebuild, footer update, JS wiring: Calendly button, qualifying form, copyright year, spotlight selector + credentials-card

Cross-cutting constraints: CSS token variables only — no inline hex; `reveal` class on all new section headings, bio, credentials-card, contact divs; iOS Safari — `.credentials-card` has NO `backdrop-filter`; `#contact` ID preserved; `data-lead-form` / `data-form-status` attributes preserved
**UI hint**: yes

### Phase 5: Polish
**Goal**: The site is ship-ready — fully responsive, passing iOS Safari, hitting Lighthouse targets, and correctly meta-tagged for sharing.
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, PERF-07
**Success Criteria** (what must be TRUE):
  1. The layout is intact and readable at 375px, 430px, 768px, and 940px — all headings clip correctly with `clamp()`, the nav collapses cleanly, no horizontal overflow
  2. On iOS Safari: the floating header backdrop blur composites correctly, no fixed-element flicker, and `position: sticky` sections behave as expected
  3. In Chrome DevTools with 4x CPU throttle, the canvas animation runs at ≤16ms/frame; enabling `prefers-reduced-motion` disables all CSS transitions and the canvas animation entirely
  4. A simulated-3G Lighthouse run reports LCP ≤2.5s, no render-blocking resources, and all below-fold images have `loading="lazy"` with explicit dimensions
  5. Pasting the page URL into a social media link preview shows the correct `og:title`, `og:description`, and `og:image`
**Plans**: 5 plans
Plans:
**Wave 1** *(parallel — zero file overlap)*
- [x] 05-01-PLAN.md — SVG wordmark: create wordmark.svg with path-converted text (violet AgentOps + white Studio)
- [x] 05-02-PLAN.md — HTML head + structure: og: meta block, preload hints, wordmark.svg references, mobile CTA DOM reorder
- [x] 05-03-PLAN.md — CSS polish: prefers-reduced-motion kill-all, mix-blend-mode removal, compact mobile CTA styles at 940px
- [x] 05-04-PLAN.md — JS fix + lazy images: canvas reduced-motion guard, visibilitychange guard, below-fold lazy loading

**Wave 2** *(depends on 05-02 for og-image URL context)*
- [x] 05-05-PLAN.md — og-image.png: branded 1200×630 social card + iOS Safari + full phase verification checkpoint

**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-05-07 |
| 2. Hero | 3/3 | Complete | 2026-05-07 |
| 3. Core Sections | 3/3 | Complete | 2026-05-07 |
| 4. Trust & Conversion | 3/3 | Complete | 2026-05-08 |
| 5. Polish | 5/5 | Complete | 2026-05-08 |
