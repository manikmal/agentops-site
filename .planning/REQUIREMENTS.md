# Requirements: AgentOps Studio Website Redesign

**Defined:** 2026-05-06
**Core Value:** A startup founder lands on the site and immediately feels they've found a serious technical partner who builds AI products end-to-end — not a freelancer running automations for small businesses.

---

## v1 Requirements

### Foundation & Design System

- [ ] **FOUN-01**: Design system is established with violet `#7c5cfc` as the sole primary accent, `#0a0a0b` as the base background, and a 4-step dark surface hierarchy (`#111113` / `#18181b` / `#232326`)
- [ ] **FOUN-02**: CSS design tokens follow primitives → semantic separation; all colors, spacing, and motion values are defined as custom properties before any section CSS is written
- [ ] **FOUN-03**: Inter variable font loads non-blocking with `opsz,wght` axes; all headings have negative `letter-spacing` (`-0.04em` h1, `-0.03em` h2); `font-optical-sizing: auto` and `-webkit-font-smoothing: antialiased` on body
- [ ] **FOUN-04**: Fluid type scale uses `clamp()` for all heading sizes — no breakpoint-scoped `font-size` overrides
- [ ] **FOUN-05**: Full SME language is audited and removed — no "automation audit", no "SMEs", no "we" in copy, Gmail address moved to footer only, phone number removed entirely, service package tiers removed

### Header & Navigation

- [ ] **HEAD-01**: Header is redesigned as a floating pill with `backdrop-filter` blur on scroll; `-webkit-backdrop-filter` included; `backdrop-filter` and `transform` never on the same element
- [ ] **HEAD-02**: Nav links are relabeled to match startup-native positioning: Services / Work / Process / About / Contact
- [ ] **HEAD-03**: A "Book a call" CTA button is visible in the header nav at all viewport sizes

### Hero

- [ ] **HERO-01**: Hero headline speaks to both audiences — SMEs see automation/efficiency value, startups see AI engineering depth; first-person, confident, not a generic category label
- [ ] **HERO-02**: Hero has a single primary "Book a discovery call" CTA and a secondary "View work" link — no form, no phone, no Gmail in this section
- [ ] **HERO-03**: Right column contains an agent orchestration trace visual — an animated, stylized multi-step AI agent flow (not the SME console copy)
- [ ] **HERO-04**: Canvas particle system is fixed: ≤40 particles, O(n²) line-drawing loop eliminated, canvas init deferred via `requestIdleCallback`, rAF loop paused on `visibilitychange`, resize handler debounced, particle color updated to violet accent
- [ ] **HERO-05**: A scarcity signal ("Currently taking 1–2 new projects") is visible in or near the hero CTA area

### Tech Strip

- [ ] **STRIP-01**: Logo/tool strip shows an even split between AI/infra tools and SME integration tools — e.g. OpenAI, Anthropic, LangChain, Docker, GitHub Actions on the AI side; WhatsApp, Meta, Google Sheets, Gmail, Zapier/Make on the SME side — signalling capability to both audiences

### Services

- [ ] **SERV-01**: Services section covers both tiers — SME-focused services (social media automation, marketing workflows, AI assistants) and startup-focused services (AI agent development, AI feature integration, DevOps & delivery) — outcome-first copy throughout
- [ ] **SERV-02**: Services layout is a narrative or capabilities format — not a 3-column grid with icons and short descriptions (the generic agency template)
- [ ] **SERV-03**: All cards have the cursor-glow / card spotlight interaction with violet gradient (`rgba(124, 92, 252, 0.12)`)

### Portfolio

- [ ] **PORT-01**: Portfolio section has 3–4 fully-styled NDA placeholder cards; each card has a real-seeming problem statement, anonymous client context, and outcome — no "coming soon" text visible to visitors
- [ ] **PORT-02**: Portfolio cards are designed to accept real case study content as drop-in replacements with no layout changes

### Process

- [ ] **PROC-01**: Process section has 5 named steps written from the founder's point of view — what the client experiences at each stage, not what Manik does internally
- [ ] **PROC-02**: Process copy emphasizes async-first working style (weekly Loom updates, no endless meetings) and speed as a solo operator advantage
- [ ] **PROC-03**: Process section uses a horizontal timeline layout (or equivalent stepped visual at desktop; stacked at mobile)

### About

- [ ] **ABOU-01**: About section exists (new — not in current site) with a first-person bio; 2–3 sentences with one strong credibility anchor; not a resume or skills list
- [ ] **ABOU-02**: About copy frames solo operation as the key differentiator: "You work directly with me, not through account managers or junior devs"
- [ ] **ABOU-03**: About section links to GitHub and LinkedIn
- [ ] **ABOU-04**: About section uses a split layout (consistent with the established grid pattern)

### CTA & Contact

- [ ] **CTA-01**: A dedicated CTA/contact section at the bottom uses a direct calendar booking link (Calendly or Cal.com) as the primary action — not a contact form as the primary path
- [ ] **CTA-02**: The "Currently taking 1–2 new projects" scarcity signal is reinforced near the CTA section
- [ ] **CTA-03**: A lightweight secondary contact form is available with startup-qualifying fields (name, company, what you're building, timeline) — no phone field
- [ ] **CTA-04**: Form submission shows an immediate optimistic UI response (not waiting for Netlify function cold start)

### Footer

- [ ] **FOOT-01**: Footer contains email and LinkedIn only — no phone number, no WhatsApp
- [ ] **FOOT-02**: Copyright year updates automatically via JS

### Performance & Technical

- [ ] **PERF-01**: Site is fully responsive at 375px, 430px, 768px, and 940px — all headings use `clamp()`, no overflow, nav collapses cleanly
- [ ] **PERF-02**: iOS Safari tested and passing: header `backdrop-filter` compositing works, no fixed-element flicker, `position: sticky` sections behave correctly
- [ ] **PERF-03**: Canvas animation runs at ≤16ms/frame on 4x CPU throttle in Chrome DevTools
- [ ] **PERF-04**: `prefers-reduced-motion` disables all CSS transitions and canvas animation
- [ ] **PERF-05**: All below-fold images have `loading="lazy"` and explicit `width`/`height` attributes
- [ ] **PERF-06**: `og:title`, `og:description`, and `og:image` meta tags are set
- [ ] **PERF-07**: No render-blocking resources; Lighthouse LCP ≤2.5s on simulated 3G

---

## v2 Requirements

### Social Proof

- **SOCL-01**: At least one anonymous client quote or testimonial on the page
- **SOCL-02**: Case study pages (linked from portfolio cards) with full project narrative

### About Enhancements

- **ABOU-05**: Professional photo in About section
- **ABOU-06**: Featured open-source or public GitHub project

### SEO & Discovery

- **SEO-01**: Structured data (`Person` or `LocalBusiness` schema) for search visibility
- **SEO-02**: Blog or writing section for content-led discovery

### Contact Enhancements

- **CTA-05**: Calendar widget embedded inline (not just a link redirect)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-page routing | Single-page marketing site; no benefit from multiple pages for this scope |
| Framework migration (React/Next.js) | Build complexity with no benefit for a static marketing site |
| CMS integration | Content is hardcoded in v1; no editor workflow needed yet |
| Blog / articles section | Content-led SEO is v2; don't delay launch for content infrastructure |
| Real calendar booking link in code | Placeholder `#contact` until Manik sets up Calendly/Cal.com |
| About section photo | Deferred to v2 — typographic approach works for v1 |
| Client testimonials | No confirmed quotes available; deferred to v2 |
| Mobile app / PWA | Not relevant for a marketing site |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Pending |
| FOUN-02 | Phase 1 | Pending |
| FOUN-03 | Phase 1 | Pending |
| FOUN-04 | Phase 1 | Pending |
| FOUN-05 | Phase 1 | Pending |
| HEAD-01 | Phase 1 | Pending |
| HEAD-02 | Phase 1 | Pending |
| HEAD-03 | Phase 1 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| STRIP-01 | Phase 3 | Pending |
| SERV-01 | Phase 3 | Pending |
| SERV-02 | Phase 3 | Pending |
| SERV-03 | Phase 3 | Pending |
| PORT-01 | Phase 3 | Pending |
| PORT-02 | Phase 3 | Pending |
| PROC-01 | Phase 4 | Pending |
| PROC-02 | Phase 4 | Pending |
| PROC-03 | Phase 4 | Pending |
| ABOU-01 | Phase 4 | Pending |
| ABOU-02 | Phase 4 | Pending |
| ABOU-03 | Phase 4 | Pending |
| ABOU-04 | Phase 4 | Pending |
| CTA-01 | Phase 4 | Pending |
| CTA-02 | Phase 4 | Pending |
| CTA-03 | Phase 4 | Pending |
| CTA-04 | Phase 4 | Pending |
| FOOT-01 | Phase 4 | Pending |
| FOOT-02 | Phase 4 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| PERF-05 | Phase 5 | Pending |
| PERF-06 | Phase 5 | Pending |
| PERF-07 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-06 — traceability confirmed after roadmap creation*
