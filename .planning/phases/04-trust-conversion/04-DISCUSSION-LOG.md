# Phase 4: Trust & Conversion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 4-Trust-Conversion
**Areas discussed:** Process step names, About section right column, Calendar CTA structure, Footer & copyright

---

## Process Step Names

| Option | Description | Selected |
|--------|-------------|----------|
| Engagement arc | Discovery → Scope → Build → Ship → Iterate. Client-facing milestone names that feel like a product engagement. | ✓ |
| What you get at each stage | Steps named by their deliverable: 'A clear plan' → 'A working prototype' etc. Outcome-first. | |
| You decide | Claude picks the 5 step names based on async-first, startup-native positioning. | |

**User's choice:** Engagement arc (Discovery → Scope → Build → Ship → Iterate)

| Option | Description | Selected |
|--------|-------------|----------|
| Woven into step descriptions | Async-first language inline in each step's paragraph. | ✓ |
| Standalone eyebrow or intro line | An intro line above the timeline sets the tone. | |
| Both | Intro line + woven in. | |

**User's choice:** Woven into step descriptions

| Option | Description | Selected |
|--------|-------------|----------|
| Iterate — stay engaged after launch | Ongoing iteration: monitor, improve, extend. Product partnership framing. | ✓ |
| Handoff — clean exit | Documentation, knowledge transfer, client runs it. | |
| Support — async retainer | Available for questions and small fixes on retainer. | |

**User's choice:** Iterate — stay engaged after launch

---

## About Section Right Column

| Option | Description | Selected |
|--------|-------------|----------|
| Styled credentials block | Dark card with 3–4 bold credential lines: experience, client types, tools. | ✓ |
| Terminal / code decoration | Styled dark code block with real-seeming code or pseudo-terminal log. | |
| Accent-colored panel — text only | Violet-tinted panel with a single large pull quote. | |

**User's choice:** Styled credentials block

| Option | Description | Selected |
|--------|-------------|----------|
| Years + type of work | e.g. "5+ years building AI systems and automation pipelines for startups and growing businesses." | ✓ |
| Specific notable delivery | e.g. "I've shipped AI agents handling tens of thousands of operations a month." | |
| You decide | Claude writes a credibility-maximising anchor sentence. | |

**User's choice:** Years + type of work

---

## Calendar CTA Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder button with TODO comment | Styled button with href='#' and HTML comment marking the URL slot. | |
| Point to the secondary form for now | Calendar button scrolls to qualifying form below. | |
| Hide the button until URL is ready | Only the qualifying form visible in v1. | |

**User's choice (free text):** `https://calendly.com/manikmalhotra6/30min` — user provided the live Calendly URL directly. Hard blocker resolved. No placeholder needed.

| Option | Description | Selected |
|--------|-------------|----------|
| Calendar button dominant, form below | Large button is the hero action; form below with "Prefer to reach out first?" framing. | ✓ |
| Side by side — equal weight | Calendar CTA left column, qualifying form right column. | |
| Form only — calendar link in the button | Submit button opens Calendly in a new tab. | |

**User's choice:** Calendar button dominant, form below

| Option | Description | Selected |
|--------|-------------|----------|
| Inline status message | Button disables on submit, status line appears below form. Reuses data-form-status pattern. | ✓ |
| Replace form with thank-you block | Entire form fades out, replaced by thank-you message. | |
| Toast notification | Temporary toast top-right. New CSS/JS pattern required. | |

**User's choice:** Inline status message

---

## Footer & Copyright

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Gmail for now | manikmalhotra6@gmail.com stays. Replace when branded email is ready. | ✓ |
| Styled placeholder for branded email | Show hello@agentopsstudio.com with no active mailto. | |

**User's choice:** Keep Gmail for now

---

## Claude's Discretion

- Exact 5 step names and `<p>` descriptions for the process timeline (within the Discovery → Scope → Build → Ship → Iterate arc)
- Process section heading and eyebrow rewrite
- Exact bio copy for About left column (within: credibility anchor, ABOU-02 differentiator, first-person voice)
- Exact credentials block content (3–4 bold lines)
- DOM order: whether About goes before or after Process (narrative flow)
- CTA section heading and supporting copy above the calendar button
- Exact "what are you building?" field label text

## Deferred Ideas

None — discussion stayed within Phase 4 scope.
