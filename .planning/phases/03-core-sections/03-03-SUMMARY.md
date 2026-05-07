---
phase: 03-core-sections
plan: "03"
subsystem: html-content
tags: [tech-strip, services, portfolio, svg-icons, nda-cards]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [svg-branded-tech-strip, services-section-html, nda-portfolio-cards]
  affects: [index.html]
tech_stack:
  added: []
  patterns: [inline-svg-icons, intersection-observer-reveal, nda-placeholder-cards]
key_files:
  created: []
  modified:
    - index.html
decisions:
  - "10 inline SVG pills use verbatim brand paths from plan — no external sprite or CDN dependency"
  - "Services section inserted between logo-strip and portfolio per plan DOM order spec"
  - "Portfolio description updated to NDA framing — 'A selection of recent work — client details protected under NDA.'"
  - "Portfolio cards use anonymous client labels (Series-A Fintech, Retail Chain, etc.) — no real company names per T-03-04"
metrics:
  duration: ~4min
  completed: 2026-05-07
---

# Phase 3 Plan 03: HTML Content — Tech Strip, Services, Portfolio Summary

**One-liner:** Replaced 6 plain-text marquee pills with 10 inline-SVG branded pills, inserted a dual-cluster services section with 6 outcome-first service cards, and swapped 6 generic portfolio cards for 4 NDA placeholder cards with Unsplash photos.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Replace tech strip pills with 10 SVG icons; insert #services section | a1626f6 | index.html |
| 2 | Replace 6 old portfolio cards with 4 NDA placeholder cards | a3ec9fb | index.html |

## What Was Done

**Task 1 — Tech strip + services section:**
- Changed `aria-label` from `"Systems we connect"` to `"Tools and platforms I work with"`
- Replaced 6 plain `<span>` pills with 10 inline-SVG branded pills: OpenAI, Anthropic, LangChain, Docker, GitHub Actions, WhatsApp, Meta, Google Sheets, Gmail, Zapier
- All SVG paths inlined verbatim from plan spec — `fill="currentColor"` and `aria-hidden="true"` per threat model T-03-06
- Inserted `<section class="section services-section" id="services">` between logo-strip and portfolio
- Two clusters: "For Growing Businesses" (Automation Systems, AI Assistants, Social Media Systems) and "For Startups & Product Teams" (Agent Development, AI Integration, DevOps & Delivery)
- All 6 service cards carry `class="service-card reveal"` for intersection-observer fade-in
- Copy in first-person "I" voice, outcome-first language

**Task 2 — Portfolio NDA cards:**
- Updated section description from "These are practical business systems..." to "A selection of recent work — client details protected under NDA."
- Removed all 6 named SME cards (QuickBooks Lite, StockTrack Mini, FollowUp CRM, Appointment Desk, Profit Pulse, Service Ticket Hub)
- Inserted 4 NDA cards: AI Compliance Pipeline (Series-A Fintech), DevOps & CI/CD Automation (Product Team), WhatsApp Workflow Automation (Retail Chain), Social Media & CRM Integration (Service Business)
- All 4 cards use `loading="lazy"` with explicit `width="900" height="190"` per PERF-05
- No "coming soon" text anywhere in document

## Deviations from Plan

None — plan executed exactly as written.

## Threat Model Compliance

- T-03-04: NDA cards use anonymous client labels — no company names, no PII
- T-03-05: Unsplash hotlinking — same pattern as existing portfolio; accepted for static marketing page
- T-03-06: Inline SVG paths rendered presentation-only with `fill="currentColor"` and `aria-hidden="true"` — no script execution path

## Known Stubs

The Unsplash image URLs in the portfolio cards use abbreviated IDs (`photo-iar-afB0QQw`, `photo-M5tzZtFCOfs`, `photo-IgUR1iX0mqM`, `photo-hpjSkU2UYSU`) which are the exact URLs specified in the plan. These are the intended NDA placeholder images. If any fail to load, real Unsplash photos can be substituted with any thematically appropriate URLs — the NDA copy and structure are the primary deliverable.

## Self-Check

```
grep -c 'id="services"' index.html                        → 1  (PASS)
grep -c 'aria-label="Tools and platforms I work with"' index.html → 1  (PASS)
grep -c 'aria-label="Systems we connect"' index.html      → 0  (PASS)
grep -c 'class="service-card reveal"' index.html          → 6  (PASS)
grep -c 'class="portfolio-card reveal"' index.html        → 4  (PASS)
grep -c 'viewBox="0 0 24 24"' index.html                  → 10 (PASS)
grep -c 'coming soon' index.html                          → 0  (PASS)
grep -c 'QuickBooks\|StockTrack\|FollowUp' index.html     → 0  (PASS)
grep -c 'client details protected under NDA' index.html   → 1  (PASS)
grep -c 'loading="lazy"' index.html                       → 4  (PASS)
DOM order: logo-strip line 104 < services line 149 < portfolio line 195 (PASS)
Commit a1626f6 exists (PASS)
Commit a3ec9fb exists (PASS)
```

## Self-Check: PASSED
