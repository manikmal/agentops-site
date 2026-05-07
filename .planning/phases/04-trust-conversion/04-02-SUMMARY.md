---
phase: 04-trust-conversion
plan: "02"
subsystem: about-section
tags: [html, css, about, credentials, navigation, ios-safari]
dependency_graph:
  requires: [04-01]
  provides: [about-section-with-id, credentials-card, nav-about-href]
  affects: [index.html, styles.css]
tech_stack:
  added: []
  patterns: [css-grid-split-layout, credentials-card-no-backdrop-filter, about-links-bottom-border]
key_files:
  created: []
  modified:
    - index.html
    - styles.css
decisions:
  - "credentials-card uses box-shadow only — no backdrop-filter — to comply with iOS Safari constraint from CLAUDE.md"
  - "about-link:hover uses color + border-color only — no transform — iOS Safari safety"
  - "About section inserted between #portfolio (line 201) and #process (line 268) to establish narrative flow: portfolio → who I am → how I work → CTA"
  - "All About CSS values use token variables — no inline hex introduced"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-07T17:50:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 4 Plan 02: About Section — Bio + Credentials Card Summary

One-liner: Inserted About section with split layout (bio + credentials-card), fixed nav About href from #contact to #about, added full About CSS including 940px responsive collapse.

## What Was Changed

### index.html

| Change | Old Value | New Value | Line |
|--------|-----------|-----------|------|
| Nav "About" href | `href="#contact"` | `href="#about"` | 35 |
| About section | (did not exist) | `<section id="about" class="section about-section">` inserted | 243 |
| About section heading | (new) | eyebrow "About" + h2 "You work directly with me." | 244–246 |
| Bio paragraph 1 | (new) | Manik bio with 5+ years AI engineering | 249 |
| Bio paragraph 2 | (new) | "no account managers" differentiator | 252 |
| GitHub link | (new) | `href="https://github.com/manik-malhotra"` `rel="noreferrer"` | 254 |
| LinkedIn link | (new) | `href="https://www.linkedin.com/in/manik-malhotra-9478617b/"` `rel="noreferrer"` | 255 |
| credentials-card | (new) | 4 credentials-line elements with exact copy from UI-SPEC | 259–264 |

About section inserted between closing `</section>` of `#portfolio` (previously line 241) and opening `<section class="section process-section" id="process">`.

### styles.css

| Change | Insertion Point | New Rules Added |
|--------|-----------------|-----------------|
| `/* === ABOUT === */` block | After `.portfolio-card span` block (line 775), before `.timeline` | `.about-section`, `.about-grid`, `.about-bio p`, `.about-links`, `.about-link`, `.about-link:hover`, `.credentials-card`, `.credentials-line`, `.credentials-line:last-child` |
| Responsive `.about-grid` | Inside `@media (max-width: 940px)` block | `.about-grid { grid-template-columns: 1fr }` |

CSS insertion point: after line 775 (`.portfolio-card span` closes), before line 777 (`.timeline` opens) in original file numbering.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `d5a864c` | feat(04-02): insert About section HTML and fix nav About href to #about |
| Task 2 | `d57e3a7` | feat(04-02): add About section CSS to styles.css |

## Deviations from Plan

### Accidental Commit to Main (Recovered — Same Pattern as Plan 01)

**Found during:** Task 1 execution

**Issue:** Task 1 edits were applied to the main repo path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/index.html`) via `cd /main-repo && git add`. The commit accidentally landed on the `main` branch.

**Fix:** Reverted the accidental commit on `main` via `git revert HEAD --no-edit`. Re-applied the same Task 1 changes to the correct worktree path (`/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-a6ea29903a00a74f2/index.html`). All subsequent commits landed on `worktree-agent-a6ea29903a00a74f2` as required.

**Net result:** No content deviation from the plan. Revert commit `8fc5d1d` on main is the only side effect.

## Known Stubs

None. All bio copy, credentials text, GitHub URL, and LinkedIn URL are final values from the Copywriting Contract in 04-UI-SPEC.md. No placeholder text exists in the About section.

## Threat Flags

None beyond what was pre-modeled in the plan's threat register. Both external links (GitHub, LinkedIn) have `target="_blank" rel="noreferrer"` per T-04-02-01 mitigation. No new security surface introduced.

## Self-Check

### Created files exist
- No new files created in this plan.

### Modified files exist
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-a6ea29903a00a74f2/index.html` — exists, contains `id="about"`, `href="#about"`, "no account managers", 4 credentials-line elements
- `/Users/manikmalhotra/Documents/Freelancing/sme-ai-devops-site/.claude/worktrees/agent-a6ea29903a00a74f2/styles.css` — exists, contains `.credentials-card` with `border-left: 3px solid var(--color-accent)` and NO `backdrop-filter`, `.about-grid { grid-template-columns: 1fr }` inside 940px media query

### Commits exist
- `d5a864c` — feat(04-02): insert About section HTML and fix nav About href to #about
- `d57e3a7` — feat(04-02): add About section CSS to styles.css

## Self-Check: PASSED

All success criteria verified:
- [x] `index.html` has `<section id="about" class="section about-section">` positioned after `#portfolio` closing tag (line 241) and before `#process` opening tag (line 268)
- [x] Nav contains `href="#about"` for the About link (line 35)
- [x] About section has `.section-heading reveal` with eyebrow "About" and h2 "You work directly with me."
- [x] `.about-bio` has 2 `<p>` tags; p2 contains "no account managers"
- [x] `.about-links` has 2 `<a class="about-link">` elements (GitHub, LinkedIn) with correct hrefs and `rel="noreferrer"`
- [x] `.credentials-card` has 4 `.credentials-line` elements with exact text from Copywriting Contract
- [x] `styles.css` contains `.credentials-card` rule with `border-left: 3px solid var(--color-accent)` and NO `backdrop-filter`
- [x] `styles.css` 940px media query contains `.about-grid { grid-template-columns: 1fr; }`
- [x] No inline hex values in new CSS (verified via grep)
