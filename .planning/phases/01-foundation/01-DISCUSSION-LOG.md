# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-06
**Phase:** 1-Foundation
**Areas discussed:** Token Architecture, iOS Safari Header Fix, Inter Font Loading, Language Audit Depth

---

## Token Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Two-layer (primitives → semantic) | Primitive block first, semantic block second | ✓ |
| Single semantic layer | Skip primitives, go straight to semantic names | |
| Three-layer (primitives → semantic → component) | Add a third component-specific token layer | |

**User's choice:** Two-layer

---

| Option | Description | Selected |
|--------|-------------|----------|
| Three surfaces | --color-surface-1: #111113, -2: #18181b, -3: #232326 | ✓ |
| Two surfaces | surface-1 and surface-2 only | |
| Four surfaces | Add surface-4 for deeply nested elements | |

**User's choice:** Three surfaces (matches REQUIREMENTS.md values)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Motion tokens too | --duration-fast, --duration-base, --ease-out in tokens block | ✓ |
| Color and spacing only | Keep tokens minimal, inline motion values | |

**User's choice:** Motion tokens included

---

| Option | Description | Selected |
|--------|-------------|----------|
| Tokenize borders | --color-border and --color-border-strong tokens | ✓ |
| Leave as inline rgba | Border colors inlined where used | |

**User's choice:** Tokenize borders

---

## iOS Safari Header Fix

| Option | Description | Selected |
|--------|-------------|----------|
| Wrapper approach | Outer .header-positioner handles transform, inner .site-header handles backdrop-filter | ✓ |
| ::before pseudo-element | Single element, blur layer on ::before pseudo | |
| Use inset instead of transform | Remove transform entirely, center via margin | |

**User's choice:** Wrapper approach

---

| Option | Description | Selected |
|--------|-------------|----------|
| Darken on scroll | .scrolled class at ~30px, background opacity increases | ✓ |
| Stay the same | No scroll state changes | |

**User's choice:** Darken on scroll

---

| Option | Description | Selected |
|--------|-------------|----------|
| Solid violet pill button | background: #7c5cfc, rounded-full | ✓ |
| Ghost/outline button | Transparent, 1px violet border | |
| White text-link style | No background, arrow only | |

**User's choice:** Solid violet pill

---

## Inter Font Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Google Fonts with preconnect | Variable font via fonts.googleapis.com, display=swap | ✓ |
| Self-hosted variable font | InterVariable.woff2 in project root | |
| System font fallback only | Rely on system Inter, no network load | |

**User's choice:** Google Fonts with preconnect

---

| Option | Description | Selected |
|--------|-------------|----------|
| Token-based letter-spacing | --tracking-tight and --tracking-heading tokens | ✓ |
| Hardcoded in selectors | -0.04em / -0.03em directly on h1/h2 | |

**User's choice:** Token-based

---

| Option | Description | Selected |
|--------|-------------|----------|
| Consistent scale ratio | h1/h2/h3 all use the same fluid progression | ✓ |
| Size each heading independently | Per-heading visual judgment | |

**User's choice:** Consistent scale ratio

---

## Language Audit Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder startup copy | Replace SME hero text with believable startup-native placeholder | ✓ |
| Leave as empty elements | Remove content, leave HTML structure | |
| HTML comments only | Remove text, add <!-- TODO --> comments | |

**User's choice:** Placeholder startup copy

---

| Option | Description | Selected |
|--------|-------------|----------|
| Startup-native placeholder title/meta | Update <title> and meta description to startup positioning | ✓ |
| Leave unchanged | Keep SME-era title/meta for Phase 5 | |
| Blank/empty placeholder | Clear meta description | |

**User's choice:** Startup-native placeholder

---

| Option | Description | Selected |
|--------|-------------|----------|
| Replace with placeholder startup metrics | Swap counter section for startup-relevant numbers | |
| Remove counter section entirely | Delete .hero-metrics from HTML | ✓ |
| Leave SME metrics as-is | Keep for Phase 2 to overwrite | |

**User's choice:** Remove counter section entirely

---

| Option | Description | Selected |
|--------|-------------|----------|
| Remove silently | Delete Gmail and phone from hero and footer entirely | ✓ |
| Placeholder branded email | Swap with manik@agentopsstudio.com (not yet live) | |

**User's choice:** Remove silently

---

## Claude's Discretion

- Primitive color naming convention (e.g., `--violet-600`, `--gray-950`)
- Border-radius tokens (optional)
- `--color-text-muted` semantic token for secondary text
- Mobile nav toggle animation

## Deferred Ideas

None — discussion stayed within phase scope.
