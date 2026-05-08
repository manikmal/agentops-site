# Phase 5: Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 5-Polish
**Areas discussed:** OG image / Wordmark, Mobile "Book a call" placement, prefers-reduced-motion scope, Font loading for LCP

---

## OG Image / Wordmark

### What image for og:image?

| Option | Description | Selected |
|--------|-------------|----------|
| Gemini_Generated_Image (Recommended) | AI-generated PNG in root — likely purpose-made as a branded card | |
| logoandwordmark.png | Logo + wordmark combined | |
| logo.png only | Just the logomark | |
| Create a custom og-image | User-provided 1200×630 | |
| **Create new logo and wordmark** | Generate new on-brand assets entirely | ✓ |

**User's choice:** "create a new logo and wordmark according to the theme. the current is bad"
**Notes:** User rejected all existing assets; wants a purpose-built SVG wordmark and matching og-image.

---

### Scope of wordmark work?

| Option | Description | Selected |
|--------|-------------|----------|
| New og-image only (Recommended) | Social card only, site header unchanged | |
| New site wordmark + og-image | Replace header wordmark AND create og-image | ✓ |
| Use existing assets as-is | Point og:image at existing file | |

**User's choice:** New site wordmark + og-image

---

### Wordmark creation method?

| Option | Description | Selected |
|--------|-------------|----------|
| Generate SVG wordmark (Recommended) | Build wordmark.svg from theme — Inter, violet/white | ✓ |
| I'll provide the file | User supplies asset before Phase 5 runs | |

**User's choice:** Generate SVG wordmark

---

### What's wrong with the current wordmark?

| Issue | Selected |
|-------|----------|
| Wrong colors / off-brand | ✓ |
| Wrong typography | ✓ |
| Poor resolution / blurry | ✓ |
| Wrong proportions / layout | ✓ |

**Notes:** All four issues flagged — full redesign warranted.

---

## Mobile "Book a Call" CTA Placement

### Always visible or inside hamburger?

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible (Recommended) | Pinned in header bar outside collapsed nav | ✓ |
| Inside hamburger only | Current behavior — accessible after menu opens | |
| You decide | Claude picks based on conversion best practice | |

**User's choice:** Always visible

---

### Mobile button styling?

| Option | Description | Selected |
|--------|-------------|----------|
| Compact violet button (Recommended) | btn-primary with smaller padding (8px 12px) | ✓ |
| Text link only | Plain violet-colored text link, no background | |

**User's choice:** Compact violet button

---

## prefers-reduced-motion Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Kill all transitions (Recommended) | `* { transition: none !important; animation: none !important; }` — maximalist | ✓ |
| Kill keyframes only | Stop @keyframe animations but keep instant hover/focus transitions | |

**User's choice:** Kill all transitions — maximalist approach to fully satisfy PERF-04.

---

## Font Loading / LCP

### Font strategy?

| Option | Description | Selected |
|--------|-------------|----------|
| Self-host Inter woff2 (Recommended) | Serve from Netlify, no CDN round-trip | |
| Keep CDN + add preload hint | Add preload for Inter subset, keep Google Fonts | ✓ |
| Keep CDN as-is | No changes, accept Lighthouse flag | |

**User's choice:** Keep CDN + add preload hint

---

### Preload wordmark for LCP?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, preload the wordmark (Recommended) | `<link rel="preload" as="image" href="wordmark.svg">` in head | ✓ |
| No, let it load naturally | Standard browser fetch order | |

**User's choice:** Yes, preload the wordmark

---

## Claude's Discretion

None — all areas had explicit user choices.

## Deferred Ideas

None — discussion stayed within Phase 5 scope.
