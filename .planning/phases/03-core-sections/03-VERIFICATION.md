---
phase: 03-core-sections
verified: 2026-05-07T00:00:00Z
status: human_needed
score: 4/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "View the portfolio section in a browser and confirm the four NDA card images render as actual photographs"
    expected: "Each of the four portfolio cards shows a contextually appropriate Unsplash photograph (abstract data viz, server room, messaging interface, analytics dashboard)"
    why_human: "All four Unsplash image URLs return HTTP 404. The markup structure and copy are correct, but whether the cards appear 'fully-styled' with working images — which is part of what SC4 means — cannot be verified programmatically beyond confirming they 404. There is no onerror fallback, so visitors see broken-image icons today."
  - test: "View the services section in a browser and confirm the layout reads as a 'capabilities' or 'narrative' format, not the generic agency icon-grid pattern"
    expected: "The two-cluster, three-cards-per-cluster layout reads differently from the typical icon + one-liner agency pattern — outcome-first paragraphs and a dual-audience cluster structure differentiate it visually from a commodity template"
    why_human: "The CSS uses repeat(3, minmax(0, 1fr)) which is technically a 3-column grid. The cards contain no icons and use long outcome-first paragraphs, satisfying the intent of SERV-02 ('not a 3-column grid with icons and short descriptions'). Whether this achieves the 'narrative or capabilities format' quality judgment requires human eyes."
---

# Phase 3: Core Sections Verification Report

**Phase Goal:** The services, portfolio, and tech strip sections demonstrate credibility to both audiences — showing what tools are used, what is built, and proof of past work.
**Verified:** 2026-05-07
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Tech strip shows an even split between AI/infra tools (OpenAI, Anthropic, LangChain, Docker, GitHub Actions) and SME integration tools (WhatsApp, Meta, Google Sheets, Gmail, Zapier/Make) | ✓ VERIFIED | index.html lines 107–145: all 10 tools present in this exact order — 5 AI/infra first, then 5 SME tools, each with inline SVG icon |
| 2 | Services section covers both SME-focused and startup-focused offerings in a narrative or capabilities format — no three-column icon grid, outcome-first copy throughout | ? UNCERTAIN | Two clusters present: "For Growing Businesses" (3 cards) and "For Startups & Product Teams" (3 cards). Cards contain h3 + full outcome-first paragraphs, no icons. The CSS uses `repeat(3, minmax(0, 1fr))` — technically 3-column, but without icons/short-descriptions. Human judgment required on whether this satisfies "narrative or capabilities format" |
| 3 | All service and portfolio cards respond to cursor movement with a violet spotlight glow (rgba(124, 92, 252, 0.12)) | ✓ VERIFIED | script.js line 138: `querySelectorAll(".service-card, .portfolio-card")` with pointermove handler applying `radial-gradient(circle at ${x}px ${y}px, rgba(124, 92, 252, 0.12), transparent 34%)`. No backdrop-filter on .service-card (iOS Safari constraint respected) |
| 4 | Portfolio section shows 3–4 fully-styled NDA placeholder cards with real-seeming problem statements and outcomes — no "coming soon" text visible to visitors | ? UNCERTAIN | 4 cards present with correct markup (article.portfolio-card.reveal > img + div > span + h3 + p). Copy: AI Compliance Pipeline, DevOps & CI/CD, WhatsApp Workflow, Social Media & CRM. Zero "coming soon" matches. However, all 4 Unsplash image URLs return HTTP 404 — cards will render with broken-image icons. Structural and copy requirements met; image quality requires human confirmation |
| 5 | Portfolio card markup accepts real case study content as a drop-in replacement without layout changes | ✓ VERIFIED | Each card follows the contract: `<article class="portfolio-card reveal"><img ...><div><span>[client]</span><h3>[title]</h3><p>[outcome]</p></div></article>`. Consistent 4-slot structure on all cards. Swapping content requires no CSS changes |

**Score:** 3/5 truths fully verified; 2/5 require human confirmation

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Tech strip with 10 SVG pills, services section, 4-card portfolio | ✓ VERIFIED | Lines 104–235: logo-strip (line 104) → services (line 149, id="services") → portfolio (line 195, id="portfolio"). All 10 viewBox="0 0 24 24" SVG pills present. 6× class="service-card reveal". 4× class="portfolio-card reveal" |
| `index.html` | Contains id="services" | ✓ VERIFIED | Line 149: `<section class="section services-section" id="services">` |
| `index.html` | Portfolio contains "AI compliance pipeline" | ✓ VERIFIED | Line 206: `<h3>AI Compliance Pipeline</h3>` |
| `styles.css` | New .service-card, .services-section, .service-grid CSS | ✓ VERIFIED | Lines 693–741: services block with .services-section, .services-clusters, .cluster-heading, .service-grid, .service-card, .service-card:hover, .service-card h3, .service-card p |
| `styles.css` | Responsive service-grid rules | ✓ VERIFIED | .service-grid appears at line 711 (base), line 894 (940px breakpoint), line 924 (640px breakpoint) |
| `script.js` | Spotlight selector targeting .service-card and .portfolio-card | ✓ VERIFIED | Line 138: `document.querySelectorAll(".service-card, .portfolio-card")` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| index.html nav | #services section | `href="#services"` on Services nav-link | ✓ WIRED | Line 32: `<a class="nav-link" href="#services">Services</a>` matches `id="services"` at line 149 |
| script.js spotlight querySelectorAll | .service-card elements | selector string ".service-card, .portfolio-card" | ✓ WIRED | Line 138 selector targets both class names; 6 .service-card and 4 .portfolio-card elements exist in DOM |
| index.html .service-card | styles.css .service-card | CSS class selector | ✓ WIRED | styles.css line 717: `.service-card {` rule with background, border, border-radius, box-shadow, transition |
| index.html .portfolio-card | styles.css .portfolio-card | CSS class selector | ✓ WIRED | styles.css lines 668, 676, 680, 687, 754, 758, 763: multiple .portfolio-card rules present |
| styles.css .timeline-step | index.html process section | CSS class selector (must survive Phase 3 edits) | ✓ WIRED | styles.css: .timeline-step at lines 634, 644, 656, 663 — 4 rules survived the compound-selector surgery |

### Data-Flow Trace (Level 4)

Not applicable. This phase delivers static HTML/CSS/JS with no dynamic data sources — all content is hardcoded markup.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| 10 SVG pills present in tech strip | `grep -c 'viewBox="0 0 24 24"' index.html` | 10 | ✓ PASS |
| Services section at id="services" | `grep -c 'id="services"' index.html` | 1 | ✓ PASS |
| 6 service cards with reveal class | `grep -c 'class="service-card reveal"' index.html` | 6 | ✓ PASS |
| 4 portfolio cards with reveal class | `grep -c 'class="portfolio-card reveal"' index.html` | 4 | ✓ PASS |
| No "coming soon" text | `grep 'coming soon' index.html` | 0 matches | ✓ PASS |
| All stale CSS classes gone | `grep -c 'agent-card\|devops-card\|wide-card\|split-section...' styles.css` | 0 | ✓ PASS |
| Spotlight selector correct | `grep '".service-card, .portfolio-card"' script.js` | line 138 | ✓ PASS |
| Unsplash images resolve | `curl -s -o /dev/null -w "%{http_code}" [4 URLs]` | 404, 404, 404, 404 | ✗ FAIL |
| DOM order: logo-strip → services → portfolio | `grep -n 'logo-strip\|id="services"\|id="portfolio"' index.html` | lines 104, 149, 195 | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| STRIP-01 | 03-02, 03-03 | Even split AI/infra and SME tools in logo strip | ✓ SATISFIED | 5 AI tools + 5 SME tools with inline SVG icons at lines 107–145 of index.html |
| SERV-01 | 03-02, 03-03 | Both SME and startup services covered, outcome-first copy | ✓ SATISFIED | Two clusters present; SME cluster: Automation Systems, AI Assistants, Social Media Systems; Startup cluster: Agent Development, AI Integration, DevOps & Delivery |
| SERV-02 | 03-02, 03-03 | Capabilities format, not 3-column icon grid | ? NEEDS HUMAN | 3-column grid layout but no icons, full outcome paragraphs. See human verification item #2 |
| SERV-03 | 03-01 | All cards have violet spotlight (rgba(124, 92, 252, 0.12)) | ✓ SATISFIED | script.js line 138–148: wired selector + exact rgba value confirmed |
| PORT-01 | 03-03 | 3–4 NDA placeholder cards, no "coming soon" | ? NEEDS HUMAN | 4 cards with correct copy and structure, but all 4 Unsplash images 404. See human verification item #1 |
| PORT-02 | 03-03 | Portfolio card markup is drop-in replaceable | ✓ SATISFIED | Consistent article > img + div > span + h3 + p contract on all 4 cards |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| index.html | 203, 211, 219, 227 | Broken image URLs (`photo-iar-afB0QQw`, etc. all return HTTP 404) | ⚠️ Warning | Portfolio cards render with broken-image icons instead of photographs. Structure and copy are correct, but visual presentation is degraded. No onerror fallback. SUMMARY.md acknowledged this as a known stub: "URLs specified in the plan — if any fail to load, real Unsplash photos can be substituted" |
| index.html | 35 | Both "Process" and "About" nav links point to #contact — there is no #process or #about section yet | ℹ️ Info | Expected — Phase 4 adds these sections. This is by design per the Phase 3 plan spec |

### Human Verification Required

#### 1. Portfolio card images are broken — confirm visual acceptability

**Test:** Open the site in a browser and navigate to the portfolio section (#portfolio)
**Expected:** Four cards appear fully-styled with contextually appropriate photographs — abstract data visualization, server infrastructure, phone messaging interface, analytics dashboard
**Why human:** All four Unsplash URLs (`photo-iar-afB0QQw`, `photo-M5tzZtFCOfs`, `photo-IgUR1iX0mqM`, `photo-hpjSkU2UYSU`) return HTTP 404. Real Unsplash URLs use longer hash IDs (e.g. `photo-1518770660439-4636190af475`). These appear to be truncated/invalid IDs from the plan spec. The cards will show broken-image icons unless valid URLs are substituted. SC4 requires "fully-styled" cards — broken images break the visual claim.

**To fix:** Replace the four `src` values with valid Unsplash URLs for thematically appropriate photos. The NDA copy and card structure are correct and do not need changes.

#### 2. Services layout — confirm it does not read as a "generic agency icon grid"

**Test:** View the services section at desktop viewport width (1200px+)
**Expected:** The two-cluster, 6-card layout reads as a capabilities showcase that differentiates by audience — not as the typical "3 icons in a row with a headline and two-sentence blurb" agency pattern
**Why human:** The CSS implements `repeat(3, minmax(0, 1fr))` — technically three columns. SERV-02 prohibits "a 3-column grid with icons and short descriptions." The current cards have no icons and use full outcome-first paragraphs (~30+ words each). Whether this satisfies the "narrative or capabilities format" quality standard requires visual judgment.

### Gaps Summary

No hard blockers. The phase goal is substantially achieved in structure, content, and wiring. Two items require human confirmation before marking as fully passed:

1. **Portfolio images (WARNING):** All four Unsplash image URLs are invalid (404). This is a known issue acknowledged in SUMMARY.md. The card markup, copy, and styles are correct — only the `src` values need to be updated with valid Unsplash photo IDs.

2. **Services layout format (UNCERTAIN):** The implementation uses 3-column grid with no icons and outcome-first copy. Whether this satisfies the "narrative/capabilities format" quality bar in SERV-02 is a visual judgment call.

Commits a3ec9fb, a1626f6, 41275a1, 7bc947c, 4c9bebc all verified in git history.

---

_Verified: 2026-05-07_
_Verifier: Claude (gsd-verifier)_
