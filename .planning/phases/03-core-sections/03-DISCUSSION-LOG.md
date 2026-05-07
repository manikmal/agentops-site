# Phase 3: Core Sections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 3-Core Sections
**Areas discussed:** Services layout, Tech strip format, Portfolio card content, Section consolidation scope

---

## Services Layout

### Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Two named clusters | One section, two groups: "For growing businesses" + "For startups & product teams" | ✓ |
| Unified capability pillars | Single flat list of ~5 capability areas, no explicit segmentation | |
| Alternating split rows | 2–3 alternating left/right split rows, one per service type | |

**User's choice:** Two named clusters
**Notes:** Matches the approved preview exactly — clear audience signal without tabs.

### Card Format

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal text cards | Dark card, title + 2–3 sentence outcome-focused description, no icons | ✓ |
| Cards with icon/emoji accent | Same layout with emoji/SVG icon at top | |
| Cards with outcome callout | Title + description + highlighted outcome tag (e.g., "→ Live in 2–4 weeks") | |

**User's choice:** Minimal text cards
**Notes:** Linear.app aesthetic — clean, no icon system needed.

### Service Names

| Option | Description | Selected |
|--------|-------------|----------|
| Claude decides | Claude picks 3 cards per cluster within REQUIREMENTS.md scope | ✓ |
| I'll specify | User specifies exact service names | |

**User's choice:** Claude decides

---

## Tech Strip Format

### Logo Style

| Option | Description | Selected |
|--------|-------------|----------|
| Text-only pills | Keep existing pill style, add missing AI tools as text chips | |
| Brand logos + text | Add small SVG/PNG brand logos beside each tool name | ✓ |

**User's choice:** Brand logos + text
**Notes:** More visually credibility-boosting; SVG sourcing required.

### Asset Source

| Option | Description | Selected |
|--------|-------------|----------|
| SVG inline | Source from Simple Icons, inline in HTML — no external requests | ✓ |
| CDN-linked PNGs | Reference from public CDN — simpler HTML, adds external dependency | |
| Claude decides | Pick whichever is cleanest | |

**User's choice:** SVG inline (Simple Icons)

### Tool List

| Option | Description | Selected |
|--------|-------------|----------|
| Use proposed 10 tools | AI: OpenAI, Anthropic, LangChain, Docker, GitHub Actions. SME: WhatsApp, Meta, Google Sheets, Gmail, Zapier | ✓ |
| Swap or add tools | User specifies different tools | |

**User's choice:** Confirmed 10-tool list (5+5 even split)

---

## Portfolio Card Content

### Photo vs Photo-free

| Option | Description | Selected |
|--------|-------------|----------|
| Photo-free | No photos; dark card with gradient accent, category tag, and text | |
| Keep photos | Retain photo + text layout; replace with technical imagery | ✓ |

**User's choice:** Keep photos

### Image Type

| Option | Description | Selected |
|--------|-------------|----------|
| Abstract/technical Unsplash | Code screens, terminal windows, server racks, infra imagery | ✓ |
| Dark gradient fill | CSS dark-to-violet gradient fill instead of actual image | |
| Claude decides | Pick best for each card's topic | |

**User's choice:** Abstract/technical Unsplash (Claude picks query terms and IDs)

### Audience Mix

| Option | Description | Selected |
|--------|-------------|----------|
| Mix: 2 startup + 2 SME | 2 startup cases + 2 SME cases | ✓ |
| Startup-skewed: 3+1 | 3 startup + 1 SME | |
| Claude decides | Claude picks best mix | |

**User's choice:** 2 startup + 2 SME
**Notes:** Approved card mix: (1) AI agent pipeline fintech [Startup], (2) DevOps + CI/CD product team [Startup], (3) WhatsApp automation retail chain [SME], (4) Social + CRM service business [SME]

---

## Section Consolidation Scope

### New Services Section ID

| Option | Description | Selected |
|--------|-------------|----------|
| #services | Matches "Services" nav label exactly | ✓ |
| #work | Matches "Work" nav label | |
| Keep #agents | Preserve existing ID | |

**User's choice:** #services

### Old Section Fate

| Option | Description | Selected |
|--------|-------------|----------|
| Delete entirely | Remove all 4 old SME sections from HTML + CSS + JS | ✓ |
| Comment out | Keep commented in case content is needed later | |

**User's choice:** Delete entirely

---

## Claude's Discretion

- Exact copy for all 6 service cards (within D-07 guardrails)
- Specific Unsplash photo IDs for 4 portfolio cards
- New service card CSS class name and grid layout
- SVG path data for each brand icon (Simple Icons source)
- Exact NDA problem statements and outcome copy per portfolio card
- Whether cluster headings use `<h3>` or eyebrow label style

## Deferred Ideas

None — discussion stayed within Phase 3 scope.
