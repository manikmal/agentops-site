---
status: complete
phase: 03-core-sections
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md]
started: 2026-05-07T00:00:00Z
updated: 2026-05-07T00:01:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Tech strip SVG pills
expected: The scrolling marquee shows 10 branded pills with recognisable icons and labels — OpenAI, Anthropic, LangChain, Docker, GitHub Actions (AI/infra) then WhatsApp, Meta, Google Sheets, Gmail, Zapier (SME tools). Icons render as actual SVGs, not broken boxes. Strip scrolls continuously.
result: pass

### 2. Services layout — capabilities feel vs icon grid
expected: At desktop width (1200px+) the services section reads as a capabilities showcase, not the typical agency "icon + two-sentence blurb" pattern. Each card has a Lucide stroked icon at the top, a heading, and a long outcome-first paragraph (~3–4 sentences). Two clusters ("For Growing Businesses" and "For Startups & Product Teams") with 3 cards each. The extended copy distinguishes it from a commodity icon grid.
result: pass

### 3. Card spotlight glow on hover
expected: Moving the cursor over any service card or portfolio card produces a soft violet radial glow that follows the pointer — rgba(124, 92, 252, 0.12) at the cursor position, fading to transparent. The glow appears on all 6 service cards and all 4 portfolio cards. No iOS Safari backdrop-filter issues (glow is a gradient, not a filter).
result: pass

### 4. Portfolio cards — images render as photographs
expected: The four NDA portfolio cards (AI Compliance Pipeline, DevOps & CI/CD Automation, WhatsApp Workflow Automation, Social Media & CRM Integration) each display an actual Unsplash photograph — data visualisation, server room, retail messaging, analytics dashboard. No broken-image icons. Client labels are anonymous (Series-A Fintech, Product Team, Retail Chain, Service Business). No "coming soon" text anywhere.
result: pass

### 5. Nav → services scroll
expected: Clicking "Services" in the top navigation smoothly scrolls the page to the services section. The section is visible and fully laid out at the scroll destination.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
