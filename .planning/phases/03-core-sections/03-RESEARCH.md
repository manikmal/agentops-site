# Phase 3: Core Sections — Research

**Researched:** 2026-05-07
**Domain:** Vanilla HTML/CSS/JS section replacement — tech strip, services, portfolio
**Confidence:** HIGH (all findings verified directly from codebase or fetched SVG files)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Tech Strip**
- D-01: Brand logos + text pills. Small inline SVG icon beside tool name. Source: Simple Icons.
- D-02: Even split — 5 AI/infra + 5 SME. Tools: OpenAI, Anthropic, LangChain, Docker, GitHub Actions | WhatsApp, Meta, Google Sheets, Gmail, Zapier.
- D-03: SVG assets inlined directly in HTML — no CDN dependency. Existing `.marquee-track` JS duplication reused as-is.
- D-04: `.logo-strip` and `.marquee-track` CSS stays intact; only inner pill HTML changes.

**Services Section**
- D-05: Two named capability clusters in one `<section id="services">`. Cluster 1: "For Growing Businesses". Cluster 2: "For Startups & Product Teams".
- D-06: Card format: minimal dark text cards, no icons. Title + 2–3 sentence outcome-focused description.
- D-07: 3 cards per cluster (6 total). SME cluster: automation systems, AI assistants, social media. Startup cluster: agent development, AI integration, DevOps & delivery.
- D-08: Section ID: `#services`. Old `#agents`, `#automations`, `#devops` IDs deleted.
- D-09: Cursor spotlight on all service cards: `rgba(124, 92, 252, 0.12)` radial gradient. `script.js` spotlight selector updated to include `.service-card`.

**Portfolio Section**
- D-10: 4 NDA placeholder cards (reduced from 6).
- D-11: 2 startup + 2 SME. Card 1: AI agent compliance pipeline — Series-A fintech. Card 2: DevOps + CI/CD — Product team. Card 3: WhatsApp workflow — Retail chain. Card 4: Social + CRM — Service business.
- D-12: Replace current SME stock photos with abstract/technical Unsplash imagery.
- D-13: `<span>` = client category; `<h3>` = project title; `<p>` = outcome summary.
- D-14: `.portfolio-card` spotlight already wired — no JS change needed.

**Section Consolidation**
- D-15: All 4 old SME sections deleted entirely from index.html. Their CSS deleted from styles.css.
- D-16: `script.js` spotlight selector updated: remove `.agent-card`, `.package-card`, `.devops-card`; add `.service-card`.
- D-17: DOM order after Phase 3: hero → tech strip → services (#services) → portfolio (#portfolio) → [Phase 4 sections].

### Claude's Discretion
- Exact copy for each of the 6 service cards
- Specific Unsplash photo IDs for the 4 portfolio cards
- New `.service-card` CSS and grid layout within the two-cluster structure
- SVG path data for each brand icon
- Exact NDA problem statements and outcome copy for each portfolio card
- Whether two service clusters use `<h3>` heading or eyebrow label style

### Deferred Ideas
None — discussion stayed within Phase 3 scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STRIP-01 | Even split AI/infra + SME integration tools with brand logos in marquee strip | SVG paths verified for all 10 tools; marquee JS pattern audited (line 7–13 script.js) |
| SERV-01 | Services covers both tiers — SME (automation, AI, social) + startup (agents, integration, DevOps) | Two-cluster HTML architecture mapped; `.service-card` CSS pattern defined |
| SERV-02 | Services layout is narrative/capabilities format — NOT 3-column icon grid | Two-cluster section with `<h3>` cluster headings confirmed as compliant approach |
| SERV-03 | All cards have cursor-glow spotlight with `rgba(124, 92, 252, 0.12)` | Spotlight block at line 138 script.js audited; selector update specified |
| PORT-01 | 4 fully-styled NDA placeholder cards — no "coming soon" text | Portfolio card HTML structure audited; 4 Unsplash photo IDs selected |
| PORT-02 | Portfolio cards accept real case study content as drop-in | Existing `.portfolio-card` div structure preserved; span/h3/p markup confirmed |
</phase_requirements>

---

## Summary

Phase 3 is a surgical HTML/CSS/JS replacement. Three tasks in sequence: (1) delete the four old SME sections and their orphaned CSS, (2) rebuild the tech strip pill HTML with inline SVG brand icons, and (3) rebuild the services and portfolio sections with new copy and card CSS.

All source files have been read and audited. The exact line ranges to delete, CSS classes to remove, and JS integration points are fully mapped. No architectural ambiguity remains.

**Primary recommendation:** Execute as three sequential commits — delete pass, then tech strip rebuild, then services + portfolio rebuild. The delete pass first makes the CSS audit clean and prevents stale classes from conflicting with new `.service-card` styles.

---

## HTML Audit: What to Delete

All four old SME sections live between lines 115–274 of `index.html`. The portfolio section (lines 219–275) is NOT deleted — it is replaced in place. The process section (lines 277–304) and contact section (lines 306–332) are untouched.

### Sections to Delete Entirely

| Lines | ID / Class | Content |
|-------|-----------|---------|
| 115–153 | `id="agents"` | 6-card agent grid (Sales, Support, Accounts, Social Media, Operations, Owner Briefing) |
| 155–171 | `id="automations"` `.split-section` | Split layout with workflow automation copy and check-list |
| 173–196 | `.social-section` (no ID) | Social grid with wide-card + 2 mini-cards |
| 198–217 | `id="devops"` `.devops-section` | DevOps 3-card grid |

**Delete block:** lines 115–217 (inclusive). This is a single contiguous block.

### Portfolio Section: Replace in Place (lines 219–275)

Keep the outer `<section class="section portfolio-section" id="portfolio">` wrapper and the `.section-heading` block, but replace:
- The `<div class="portfolio-grid">` contents — delete all 6 `<article class="portfolio-card">` cards (lines 226–273)
- Replace with 4 new cards

### Nav Links: Replace Stale Anchors (line 32–35)

**Current nav (lines 32–35):**
```html
<a class="nav-link" href="#agents">Services</a>
<a class="nav-link" href="#automations">Work</a>
<a class="nav-link" href="#devops">Process</a>
<a class="nav-link" href="#portfolio">About</a>
```

**Required nav after Phase 3:**
```html
<a class="nav-link" href="#services">Services</a>
<a class="nav-link" href="#portfolio">Work</a>
<a class="nav-link" href="#contact">Process</a>   <!-- placeholder until Phase 4 adds #process -->
<a class="nav-link" href="#contact">About</a>      <!-- placeholder until Phase 4 adds #about -->
```

Note: "Work" link (`#portfolio`) is already correct on line 35. "Services" link must change from `#agents` to `#services`. Process and About nav links point to dead anchors (#devops, #portfolio) — update to `#contact` as placeholder until Phase 4 adds those sections.

### Tech Strip: Replace Pill HTML Only (lines 105–112)

**Current pill HTML (lines 106–112):**
```html
<div class="marquee-track">
  <span>Google Sheets</span>
  <span>WhatsApp</span>
  <span>Gmail</span>
  <span>GitHub</span>
  <span>Docker</span>
  <span>Meta</span>
</div>
```

Replace the inner `<span>` elements only. The `<div class="marquee-track">` wrapper stays. The `aria-label` on `.logo-strip` changes from "Systems we connect" to "Tools and platforms I work with".

### Services Section: New HTML (insert after tech strip, before portfolio)

Insert new `<section id="services">` block between line 113 (end of logo-strip) and line 219 (start of portfolio-section).

---

## CSS Audit: Keep vs Delete

### Delete Entirely

These classes are only used by the four deleted sections. No surviving element references them.

| Class | Lines in styles.css | Reason to Delete |
|-------|---------------------|-----------------|
| `.agent-grid` | 619–625 (shared with `.portfolio-grid`, `.devops-grid`) | Only used in `#agents` section |
| `.devops-grid` | 619–625 (same rule) | Only used in `#devops` section |
| `.agent-card` | 627–652 (shared hover block) | Only used in `#agents` section |
| `.devops-card` | 627–652, 742–744 | Only used in `#devops` section |
| `.mini-card` | 627–652 | Only used in `.social-section` |
| `.split-section` | 244–246 (padding rule), 671–676 | Used by `#automations` section only |
| `.image-panel` | 678–689 | Used by `.split-section` only |
| `.check-list` | 691–703 | Used by `.split-section` only |
| `.social-grid` | 705–709 | Only used in `.social-section` |
| `.wide-card` | 711–737 | Only used in `.social-section` |
| `.devops-section` | 742–744 | Only used by `#devops` section |
| `.social-section` | No dedicated rule — uses `.section` | The section is deleted but `.social-section` has no isolated CSS rule to delete |

**Critical shared-rule warning:** `.agent-grid`, `.portfolio-grid`, and `.devops-grid` share one CSS rule at line 619:
```css
.agent-grid,
.portfolio-grid,
.devops-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
```
When deleting `.agent-grid` and `.devops-grid` from this rule, **keep `.portfolio-grid`** in it.

Similarly, the hover rule at lines 641–652:
```css
.agent-card:hover,
.devops-card:hover,
.mini-card:hover,
.timeline-step:hover,
.portfolio-card:hover { ... }
```
Remove `.agent-card:hover`, `.devops-card:hover`, `.mini-card:hover`. Keep `.timeline-step:hover` and `.portfolio-card:hover`.

The base card rule at lines 627–638:
```css
.agent-card,
.devops-card,
.mini-card,
.timeline-step { ... }
```
Remove `.agent-card`, `.devops-card`, `.mini-card`. Keep `.timeline-step`.

The span/label rule at lines 654–661:
```css
.agent-card span,
.portfolio-card span,
.timeline-step span { ... }
```
Remove `.agent-card span`. Keep `.portfolio-card span` and `.timeline-step span`.

The paragraph rule at lines 663–669:
```css
.agent-card p,
.devops-card p,
.mini-card p,
.timeline-step p,
.portfolio-card p { ... }
```
Remove `.agent-card p`, `.devops-card p`, `.mini-card p`. Keep `.timeline-step p` and `.portfolio-card p`.

The responsive rules at lines 896–907 (`@media max-width: 940px`) and lines 933–939 (`@media max-width: 640px`) include:
```css
.agent-grid,
.portfolio-grid,
.devops-grid,
.timeline,
.social-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
```
Remove `.agent-grid`, `.devops-grid`, `.social-grid`. Keep `.portfolio-grid` and `.timeline`.

Also at line 888 (`max-width: 940px`):
```css
.hero-grid,
.split-section,
.contact-section,
.wide-card { grid-template-columns: 1fr; }
```
Remove `.split-section` and `.wide-card`. Keep `.hero-grid` and `.contact-section`.

At line 904:
```css
.wide-card { grid-column: 1 / -1; }
```
Delete this rule entirely.

### Keep Intact

| Class | Lines | Why |
|-------|-------|-----|
| `.logo-strip` | 560–566 | Tech strip outer wrapper — reused as-is |
| `.marquee-track` | 568–584 | Marquee animation — reused as-is |
| `.logo-strip span` | 605–612 | Pill base styles — extended, not replaced |
| `.portfolio-grid` | part of 619–625 | Portfolio grid — kept |
| `.portfolio-card` | 711–766 | Portfolio cards — kept, content replaced |
| `.portfolio-section` | 747–753 | Section background — kept |
| `.section-heading` | 614–617 | Used by services + portfolio headings |
| `.eyebrow` | 297–303 | Used by cluster headings |
| `.timeline-step` | part of 627–638 | Used by Phase 4 process section |
| `.reveal` | 841–850 | Used everywhere |

### New CSS to Add

New classes required for services section. Add immediately after the cleaned-up portfolio card CSS block:

```css
/* === SERVICES === */

.services-section {
  background: var(--color-surface-1);
}

.services-clusters {
  display: grid;
  gap: 56px;
}

.cluster-heading {
  margin-bottom: var(--space-6);
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.service-card {
  min-height: 220px;
  padding: 28px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: transparent;
  box-shadow:
    0 0 0 1px var(--color-accent),
    0 0 20px rgba(124, 92, 252, 0.35),
    0 0 60px rgba(124, 92, 252, 0.12),
    var(--shadow-card);
}

.service-card h3 {
  margin-bottom: var(--space-3);
}

.service-card p {
  color: var(--color-text-secondary);
}
```

**Responsive additions** (inside existing `@media (max-width: 940px)` block):
```css
.service-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

**Inside existing `@media (max-width: 640px)` block:**
```css
.service-grid {
  grid-template-columns: 1fr;
}
```

### Logo Strip Pill Extension

The existing `.logo-strip span` rule at lines 605–612 needs a small addition to accommodate the inline SVG icon layout:

```css
.logo-strip span {
  display: inline-flex;          /* ADD: flex for icon+text alignment */
  align-items: center;           /* ADD */
  gap: var(--space-2);           /* ADD: 8px gap between icon and label */
  padding: 10px 14px;            /* existing */
  color: var(--color-text-secondary);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 700;
}

.logo-strip svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  flex-shrink: 0;
}
```

---

## JS Integration Points

### Spotlight Selector (line 138, script.js)

**Current:**
```javascript
document.querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card").forEach((card) => {
```

**Required after Phase 3:**
```javascript
document.querySelectorAll(".service-card, .portfolio-card").forEach((card) => {
```

- `.agent-card` removed (section deleted)
- `.package-card` removed (was never in the HTML — orphaned from a prior version)
- `.devops-card` removed (section deleted)
- `.service-card` added (new services section)
- `.portfolio-card` kept (still present)

**Location:** Line 138 of `script.js`. The event listener block spans lines 138–149. Only the selector string on line 138 changes.

### Marquee Track Duplication (lines 7–13, script.js)

```javascript
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  Array.from(marqueeTrack.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}
```

**How it works:** On page load, this block clones every child of `.marquee-track` and appends clones with `aria-hidden="true"`. This doubles the content so the CSS `translateX(-50%)` animation creates seamless infinite scroll.

**Impact of new pill HTML:** The cloneNode(true) call copies the full SVG markup including nested elements. This works correctly with inline SVGs. No JS changes needed.

**Constraint:** The total pill count (original set) determines scroll speed. The current 6 pills with marquee duration of `18s` will need recalibration with 10 pills. At 10 pills the track is significantly wider — consider increasing animation duration to `28s` or `32s` in the CSS `@keyframes marquee` / `.marquee-track` rule to maintain a comfortable reading pace. [ASSUMED — visual judgment needed; test in browser]

### Section Observer (lines 37–53, script.js)

The `sectionObserver` fires on `section[id]` elements and activates the matching nav link. It will automatically pick up `#services` once that section exists. No code change needed — the observer queries all `section[id]` on page load.

**Risk:** Nav links pointing to deleted IDs (`#automations`, `#devops`) will never fire the active state. This is resolved by updating the nav href values in the HTML (audited above).

---

## Simple Icons SVG Data

All 10 paths verified by fetching from `cdn.jsdelivr.net/npm/simple-icons@v14/icons/[slug].svg`. [VERIFIED: jsdelivr CDN]

All icons use `viewBox="0 0 24 24"`. All use a single `<path>` element. Render at `width="16" height="16"` with `fill="currentColor"`.

### AI / Infra Tools

**OpenAI** (slug: `openai`)
```
M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z
```

**Anthropic** (slug: `anthropic`)
```
M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z
```

**LangChain** (slug: `langchain`)
```
M6.0988 5.9175C2.7359 5.9175 0 8.6462 0 12s2.736 6.0825 6.0988 6.0825h11.8024C21.2641 18.0825 24 15.3538 24 12s-2.736-6.0825-6.0988-6.0825ZM5.9774 7.851c.493.0124 1.02.2496 1.273.6228.3673.4592.4778 1.0668.8944 1.4932.5604.6118 1.199 1.1505 1.7161 1.802.4892.5954.8386 1.2937 1.1436 1.9975.1244.2335.1257.5202.31.7197.0908.1204.5346.4483.4383.5645.0555.1204.4702.286.3263.4027-.1944.04-.4129.0476-.5616-.1074-.0549.126-.183.0596-.2819.0432a4 4 0 0 0-.025.0736c-.3288.0219-.5754-.3126-.732-.565-.3111-.168-.6642-.2702-.982-.446-.0182.2895.0452.6485-.231.8353-.014.5565.8436.0656.9222.4804-.061.0067-.1286-.0095-.1774.0373-.2239.2172-.4805-.1645-.7385-.007-.3464.174-.3808.3161-.8096.352-.0237-.0359-.0143-.0592.0059-.0811.1207-.1399.1295-.3046.3356-.3643-.2122-.0334-.3899.0833-.5686.1757-.2323.095-.2304-.2141-.5878.0164-.0396-.0322-.0208-.0615.0018-.0864.0908-.1107.2102-.127.345-.1208-.663-.3686-.9751.4507-1.2813.0432-.092.0243-.1265.1068-.1845.1652-.05-.0548-.0123-.1212-.0099-.1857-.0598-.028-.1356-.041-.1179-.1366-.1171-.0395-.1988.0295-.286.0952-.0787-.0608.0532-.1492.0776-.2125.0702-.1216.23-.025.3111-.1126.2306-.1308.552.0814.8155.0455.203.0255.4544-.1825.3526-.39-.2171-.2767-.179-.6386-.1839-.9695-.0268-.1929-.491-.4382-.6252-.6462-.1659-.1873-.295-.4047-.4243-.6182-.4666-.9008-.3198-2.0584-.9077-2.8947-.266.1466-.6125.0774-.8418-.119-.1238.1125-.1292.2598-.139.4161-.297-.2962-.2593-.8559-.022-1.1855.0969-.1302.2127-.2373.342-.3316.0292-.0213.0391-.0419.0385-.0747.1174-.5267.5764-.7391 1.0694-.7267m12.4071.46c.5575 0 1.0806.2159 1.474.6082s.61.9145.61 1.4704c0 .556-.2167 1.078-.61 1.4698v.0006l-.902.8995a2.08 2.08 0 0 1-.8597.5166l-.0164.0047-.0058.0164a2.05 2.05 0 0 1-.474.7308l-.9018.8995c-.3934.3924-.917.6083-1.4745.6083s-1.0806-.216-1.474-.6083c-.813-.8107-.813-2.1294 0-2.9402l.9019-.8995a2.056 2.056 0 0 1 .858-.5143l.017-.0053.0058-.0158a2.07 2.07 0 0 1 .4752-.7337l.9018-.8995c.3934-.3924.9171-.6083 1.4745-.6083zm0 .8965a1.18 1.18 0 0 0-.8388.3462l-.9018.8995a1.181 1.181 0 0 0-.3427.9252l.0053.0572c.0323.2652.149.5044.3374.6917.13.1296.2733.2114.4471.2686a.9.9 0 0 1 .014.1582.884.884 0 0 1-.2609.6304l-.0554.0554c-.3013-.1028-.5525-.253-.7794-.4792a2.06 2.06 0 0 1-.5761-1.0968l-.0099-.0578-.0461.0368a1.1 1.1 0 0 0-.0876.0794l-.9024.8995c-.4623.461-.4623 1.212 0 1.673.2311.2305.535.346.8394.3461.3043 0 .6077-.1156.8388-.3462l.9019-.8995c.4623-.461.4623-1.2113 0-1.673a1.17 1.17 0 0 0-.4367-.2749a1 1 0 0 1-.014-.1611c0-.2591.1023-.505.2901-.6923.3019.1028.57.2694.7962.495.3007.2999.4994.679.5756 1.0968l.0105.0578.0455-.0373a1.1 1.1 0 0 0 .0887-.0794l.902-.8996c.4622-.461.4628-1.2124 0-1.6735a1.18 1.18 0 0 0-.8395-.3462Zm-9.973 5.1567-.0006.0006c-.0793.3078-.1048.8318-.506.847-.033.1776.1228.2445.2655.1874.141-.0645.2081.0508.2557.1657.2177.0317.5394-.0725.5516-.3298-.325-.1867-.4253-.5418-.5662-.8709
```

**Docker** (slug: `docker`)
```
M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z
```

**GitHub Actions** (slug: `githubactions`)
```
M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z
```

### SME Integration Tools

**WhatsApp** (slug: `whatsapp`)
```
M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z
```

**Meta** (slug: `meta`)
```
M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z
```

**Google Sheets** (slug: `googlesheets`)
```
M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z
```

**Gmail** (slug: `gmail`)
```
M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z
```

**Zapier** (slug: `zapier`)
```
M4.157 0A4.151 4.151 0 0 0 0 4.161v15.678A4.151 4.151 0 0 0 4.157 24h15.682A4.152 4.152 0 0 0 24 19.839V4.161A4.152 4.152 0 0 0 19.839 0H4.157Zm10.61 8.761h.03a.577.577 0 0 1 .23.038.585.585 0 0 1 .201.124.63.63 0 0 1 .162.431.612.612 0 0 1-.162.435.58.58 0 0 1-.201.128.58.58 0 0 1-.23.042.529.529 0 0 1-.235-.042.585.585 0 0 1-.332-.328.559.559 0 0 1-.038-.235.613.613 0 0 1 .17-.431.59.59 0 0 1 .405-.162Zm2.853 1.572c.03.004.061.004.095.004.325-.011.646.064.937.219.238.144.431.355.552.609.128.279.189.582.185.888v.193a2 2 0 0 1 0 .219h-2.498c.003.227.075.45.204.642a.78.78 0 0 0 .646.265.714.714 0 0 0 .484-.136.642.642 0 0 0 .23-.318l.915.257a1.398 1.398 0 0 1-.28.537c-.14.159-.321.284-.521.355a2.234 2.234 0 0 1-.836.136a1.923 1.923 0 0 1-1.001-.245 1.618 1.618 0 0 1-.665-.703 2.221 2.221 0 0 1-.227-1.036 1.95 1.95 0 0 1 .48-1.398 1.9 1.9 0 0 1 1.3-.488Zm-9.607.023c.162.004.325.026.48.079.207.065.4.174.563.314.26.302.393.692.366 1.088v2.276H8.53l-.109-.711h-.065c-.064.163-.155.31-.272.439a1.122 1.122 0 0 1-.374.264 1.023 1.023 0 0 1-.453.083 1.334 1.334 0 0 1-.866-.264.965.965 0 0 1-.329-.801.993.993 0 0 1 .076-.431 1.02 1.02 0 0 1 .242-.363 1.478 1.478 0 0 1 1.043-.303h.952v-.181a.696.696 0 0 0-.136-.454.553.553 0 0 0-.438-.154.695.695 0 0 0-.378.086.48.48 0 0 0-.193.254l-.99-.144a1.26 1.26 0 0 1 .257-.563c.14-.174.321-.302.533-.378.261-.091.54-.136.82-.129.053-.003.106-.007.163-.007Zm4.384.007c.174 0 .347.038.506.114.182.083.34.211.458.374.257.423.377.911.351 1.406a2.53 2.53 0 0 1-.355 1.448 1.148 1.148 0 0 1-1.009.517c-.204 0-.401-.045-.582-.136a1.052 1.052 0 0 1-.48-.457 1.298 1.298 0 0 1-.114-.234h-.045l.004 1.784h-1.059v-4.713h.904l.117.805h.057c.068-.208.177-.401.328-.56a1.129 1.129 0 0 1 .843-.344h.076v-.004Zm7.559.084h.903l.113.805h.053a1.37 1.37 0 0 1 .235-.484.813.813 0 0 1 .313-.242.82.82 0 0 1 .39-.076h.234v1.051h-.401a.662.662 0 0 0-.313.008.623.623 0 0 0-.272.155.663.663 0 0 0-.174.26.683.683 0 0 0-.027.314v1.875h-1.054v-3.666Zm-17.515.003h3.262v.896L3.73 13.104l.034.113h1.973l.042.9H2.4v-.9l1.931-1.754-.045-.117H2.441v-.896Zm11.815 0h1.055v3.659h-1.055V10.45Zm3.443.684.019.016a.69.69 0 0 0-.351.045.756.756 0 0 0-.287.204c-.11.155-.174.336-.189.522h1.545c-.034-.526-.257-.787-.74-.787h.003Zm-5.718.163c-.026 0-.057 0-.083.004a.78.78 0 0 0-.31.053.746.746 0 0 0-.257.189 1.016 1.016 0 0 0-.204.695v.064c-.015.257.057.507.204.711a.634.634 0 0 0 .253.196.638.638 0 0 0 .314.061.644.644 0 0 0 .578-.265c.14-.223.204-.48.189-.74a1.216 1.216 0 0 0-.181-.711.677.677 0 0 0-.503-.257Zm-4.509 1.266a.464.464 0 0 0-.268.102.373.373 0 0 0-.114.276c0 .053.008.106.027.155a.375.375 0 0 0 .087.132.576.576 0 0 0 .397.11v.004a.863.863 0 0 0 .563-.182.573.573 0 0 0 .211-.457v-.14h-.903Z
```

### Inline SVG Template (for each pill)

```html
<span>
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="[PATH DATA]"/>
  </svg>
  Tool Name
</span>
```

---

## Portfolio Card Structure

### Current HTML Pattern (lines 226–274, index.html)

```html
<article class="portfolio-card reveal">
  <img src="https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=900&q=80" alt="[alt text]">
  <div>
    <span>[Category Label]</span>
    <h3>[Project Title]</h3>
    <p>[Outcome Description]</p>
  </div>
</article>
```

This exact structure is the drop-in contract (D-13). The `<span>` is the client category tag, `<h3>` is project name, `<p>` is outcome. No structural changes for Phase 3 or future case study drop-ins.

### Current Portfolio CSS (preserved, styles.css)

- `.portfolio-grid`: 3-column grid, `gap: 16px`
- `.portfolio-card`: `overflow: hidden`, surface-2 background, border, border-radius, box-shadow, transition
- `.portfolio-card img`: `height: 190px`, `min-height: 190px`, `object-fit: cover`
- `.portfolio-card div`: `padding: 24px`
- `.portfolio-card span`: `margin-bottom: 12px`, color `#007d80` (teal — this is a hardcoded hex, not a token)
- `.portfolio-card p`: `color: var(--color-text-secondary)`
- `.portfolio-card:hover`: translateY(-5px), violet border glow (shared hover rule)

**Note on `.portfolio-card span` color:** `#007d80` is a hardcoded hex (line 765), not a CSS token. The planner may want to replace with `var(--color-cyan)` which equals `#22d3ee`. The current teal is darker and less visible on dark backgrounds. [ASSUMED — visual preference, not a technical blocker]

### Unsplash Photo IDs for 4 NDA Cards

These IDs are selected from known Unsplash technical/abstract photo collections appropriate for each card's context. [ASSUMED — selections based on training knowledge of well-known Unsplash photos; confirm visually before shipping]

| Card | Context | Suggested Photo ID | Query Direction |
|------|---------|-------------------|-----------------|
| Card 1: AI compliance pipeline (Startup/fintech) | Abstract code, data visualization | `iar-afB0QQw` | Dark code screen, terminal, abstract data |
| Card 2: DevOps + CI/CD (Startup/product team) | Server racks, terminal, infrastructure | `M5tzZtFCOfs` | Server room, dark infrastructure |
| Card 3: WhatsApp workflow (SME/retail) | Mobile phone, messaging UI, abstract | `IgUR1iX0mqM` | Phone screen, messaging, clean |
| Card 4: Social + CRM (SME/service business) | Analytics dashboard, abstract visualization | `hpjSkU2UYSU` | Dashboard, analytics, data |

URL format: `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=900&q=80`

**Important:** The Unsplash source URL approach (hotlinking) is the same pattern already in use for the 6 existing cards. No change in how images are loaded.

### Portfolio Grid: 4-Card Responsive Behavior

The existing `.portfolio-grid` uses `repeat(3, 1fr)`. With 4 cards this creates a row of 3 + orphaned 1-card row. Options:

1. Keep `repeat(3, 1fr)` — 3+1 layout. Clean at desktop.
2. Change to `repeat(2, 1fr)` — 2+2 layout. More balanced.
3. Use `repeat(auto-fill, minmax(300px, 1fr))` — fluid responsive.

Decision D-10 says "cleaner at grid breakpoints" — a 2-column grid is cleaner for 4 cards. [ASSUMED — planner should choose; recommend option 2 or auto-fill]

---

## New Section Architecture

### Services Section HTML Structure

```html
<section class="section services-section" id="services">
  <div class="section-heading reveal">
    <p class="eyebrow">What I Build</p>
    <h2>Built for how you actually work.</h2>
  </div>
  <div class="services-clusters">

    <div class="services-cluster">
      <p class="cluster-heading">For Growing Businesses</p>
      <div class="service-grid">
        <article class="service-card reveal">
          <h3>Automation Systems</h3>
          <p>[copy]</p>
        </article>
        <article class="service-card reveal">
          <h3>AI Assistants</h3>
          <p>[copy]</p>
        </article>
        <article class="service-card reveal">
          <h3>Social Media</h3>
          <p>[copy]</p>
        </article>
      </div>
    </div>

    <div class="services-cluster">
      <p class="cluster-heading">For Startups & Product Teams</p>
      <div class="service-grid">
        <article class="service-card reveal">
          <h3>Agent Development</h3>
          <p>[copy]</p>
        </article>
        <article class="service-card reveal">
          <h3>AI Integration</h3>
          <p>[copy]</p>
        </article>
        <article class="service-card reveal">
          <h3>DevOps & Delivery</h3>
          <p>[copy]</p>
        </article>
      </div>
    </div>

  </div>
</section>
```

The `cluster-heading` uses `<p>` with uppercase/tracking styling (same visual weight as `.eyebrow` but different semantic role). This keeps `<h2>` for the section title and avoids heading-level confusion with the card `<h3>` elements. [ASSUMED — heading level choice; planner may prefer `<h3>` cluster headings with `<h4>` card headings]

### Tech Strip New Pill HTML

```html
<section class="logo-strip" aria-label="Tools and platforms I work with">
  <div class="marquee-track">
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[OPENAI_PATH]"/></svg> OpenAI</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[ANTHROPIC_PATH]"/></svg> Anthropic</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[LANGCHAIN_PATH]"/></svg> LangChain</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[DOCKER_PATH]"/></svg> Docker</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[GITHUBACTIONS_PATH]"/></svg> GitHub Actions</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[WHATSAPP_PATH]"/></svg> WhatsApp</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[META_PATH]"/></svg> Meta</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[GOOGLESHEETS_PATH]"/></svg> Google Sheets</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[GMAIL_PATH]"/></svg> Gmail</span>
    <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="[ZAPIER_PATH]"/></svg> Zapier</span>
  </div>
</section>
```

---

## Risk Flags

### Risk 1: Shared CSS Rule Fragmentation (HIGH impact if wrong)

The rules for `.agent-card`, `.devops-card`, `.mini-card` are co-mingled with `.timeline-step` and `.portfolio-card` in several rule blocks. Deleting the wrong selectors from these compound rules will break Phase 4 (timeline) or existing portfolio cards.

**Specific danger zones:**
- Line 619: grid rule — keep `.portfolio-grid`, delete `.agent-grid` + `.devops-grid`
- Line 627: base card rule — keep `.timeline-step`, delete `.agent-card` + `.devops-card` + `.mini-card`
- Line 641: hover rule — keep `.timeline-step:hover` + `.portfolio-card:hover`, delete the other three
- Line 654: span rule — keep `.portfolio-card span` + `.timeline-step span`, delete `.agent-card span`
- Line 663: paragraph rule — keep `.timeline-step p` + `.portfolio-card p`, delete the other three

**Mitigation:** The planner should treat each of these as an individual edit operation, not a block delete.

### Risk 2: Nav Active-State Mismatch (MEDIUM impact)

The `sectionObserver` in `script.js` keys on `link.getAttribute("href") === '#' + section.id`. If the nav href is `#agents` but the section ID is now `#services`, the active highlight will never fire for the Services link.

The nav href on line 32 currently reads `href="#agents"`. This must be changed to `href="#services"` in the same commit that adds `id="services"` to the new section. Doing these in separate commits will leave a window where the nav active state is broken.

### Risk 3: Spotlight Selector Update Timing (MEDIUM impact)

The spotlight `querySelectorAll` on line 138 runs once on page load. If the HTML for `.service-card` is added before the selector is updated, service cards will silently have no spotlight interaction. Since both changes are in different files (index.html vs script.js), the executor must update both in the same commit.

### Risk 4: `.split-section` in Responsive Rule (LOW impact, easy to miss)

`.split-section` appears in the `@media (max-width: 940px)` responsive collapse rule alongside `.hero-grid` and `.contact-section`. Deleting `.split-section` from this shared rule is required — but it's in a media query block, not the main CSS. Easy to miss in a visual diff.

### Risk 5: Marquee Speed Calibration (LOW impact)

Going from 6 to 10 pills makes the marquee track roughly 67% wider. The current 18s animation duration will now scroll faster (each pill passes in less time). The `to: translateX(-50%)` approach still works correctly (it always scrolls exactly one set's worth), but the speed per pill changes. A duration of ~28–30s is likely more appropriate. [ASSUMED — needs browser test]

### Risk 6: `.portfolio-card span` Hardcoded Color

Line 765 in styles.css: `color: #007d80` — this is a hardcoded hex, not a CSS token. It is not technically broken, but it won't change if the design system accent colors are updated. Phase 5 polish may flag this. Not a Phase 3 blocker.

### Risk 7: iOS Safari — No New backdrop-filter Risk

The new `.service-card` uses `box-shadow` and `border` only — no `backdrop-filter`. The new `services-section` uses a simple background color (`var(--color-surface-1)`). No iOS Safari compositing risk introduced.

### Risk 8: `aria-hidden` on Marquee Clones

The marquee JS duplication adds `aria-hidden="true"` to cloned pills. This is already implemented and works correctly. The new pills (with SVG children) will be cloned identically — inline SVGs already have `aria-hidden="true"` on the `<svg>` element, so duplicate content is doubly hidden from screen readers.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Marquee duration of 28–30s is appropriate for 10 pills | JS Integration Points, Risk 5 | Marquee scrolls too fast or too slow — cosmetic only, easy to fix |
| A2 | 4-card portfolio grid should use `repeat(2, 1fr)` rather than `repeat(3, 1fr)` | Portfolio Card Structure | Orphaned single-card row at desktop — cosmetic, easy to fix |
| A3 | `cluster-heading` should use `<p>` rather than `<h3>` for cluster labels | New Section Architecture | Heading hierarchy inconsistency — no functional impact |
| A4 | Unsplash photo IDs selected for 4 NDA cards | Portfolio Card Structure | Photos may not match the intended aesthetic — trivially replaceable |
| A5 | `.portfolio-card span` color `#007d80` should be replaced with `var(--color-cyan)` | CSS Audit | Purely cosmetic; not a Phase 3 requirement |

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely HTML/CSS/JS edits with no external tool dependencies beyond a text editor and browser. No runtimes, databases, CLIs, or package managers required.

---

## Sources

### Primary (HIGH confidence — verified from live codebase)
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/index.html` — exact line numbers for all sections, nav links, marquee HTML
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/styles.css` — all CSS classes, rule locations, shared selectors
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/script.js` — spotlight selector (line 138), marquee duplication (lines 7–13)

### Primary (HIGH confidence — verified by fetching from CDN)
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/openai.svg` — OpenAI path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/anthropic.svg` — Anthropic path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/langchain.svg` — LangChain path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/docker.svg` — Docker path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/githubactions.svg` — GitHub Actions path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/whatsapp.svg` — WhatsApp path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/meta.svg` — Meta path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/googlesheets.svg` — Google Sheets path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/gmail.svg` — Gmail path data
- `cdn.jsdelivr.net/npm/simple-icons@v14/icons/zapier.svg` — Zapier path data

### Tertiary (LOW confidence — Assumed)
- Unsplash photo IDs for 4 NDA cards — selected from training knowledge, must be visually confirmed

---

## Metadata

**Confidence breakdown:**
- HTML audit (line ranges, delete targets): HIGH — read directly from source file
- CSS audit (keep vs delete): HIGH — read directly from source file, rule-by-rule
- JS integration points: HIGH — read directly from source file, line-exact
- Simple Icons SVG path data: HIGH — fetched from official CDN
- Unsplash photo IDs: LOW — training knowledge, unverified
- Marquee speed recommendation: LOW — judgment call, needs browser test

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable vanilla codebase, no moving parts)
