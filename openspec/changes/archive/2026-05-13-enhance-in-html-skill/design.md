## Context

The in-html system has a Claude Code skill at `.claude/commands/in-html.md` that instructs Claude to produce HTML artifacts. The current skill file is minimal — it has a decision table, design tokens, a manifest protocol, and 8 example references. It produces structurally valid but visually flat output.

The archived `html-effectiveness` project at `/home/mi/Documents/ai/html-effectiveness/` contains 20 polished HTML examples with richer techniques: detailed typography, interactive editors with drag-and-drop, animation prototypes, collapsible sections, keyboard navigation, and copy-to-clipboard export. None of this knowledge is transferred to the in-html skill.

The main specs (`openspec/specs/skill/spec.md`, `skill-design-system/spec.md`, `skill-component-patterns/spec.md`) already define requirements for typography, design tokens, and component patterns — but the actual skill file doesn't include all of them.

## Goals / Non-Goals

**Goals:**
- Skill file includes complete typography rules, layout guidance, and all 20 pattern references
- Skill file teaches Claude to build interactive tools (drag-drop, contenteditable, animations, export)
- Manifest type taxonomy extended to cover interactive artifact types
- Output quality matches the html-effectiveness examples

**Non-Goals:**
- Not modifying the html-effectiveness example files
- Not changing the server, CLI, or manifest format
- Not adding a build step or external dependencies
- Not creating a separate skill — everything stays in `in-html.md`

## Decisions

### Decision 1: Single skill file, not a separate interactive skill

All interactive patterns go into the existing `in-html.md` skill file rather than creating a second skill. The skill grows but stays under 300 lines by referencing example files for structural patterns rather than embedding full code.

**Alternative considered**: Separate `in-html-interactive.md` skill. Rejected — users shouldn't have to choose between two skills; the skill should handle the full spectrum from static reports to interactive tools.

### Decision 2: Interactive patterns as inline guidance, not separate spec

The drag-drop, contenteditable, and animation patterns are documented as guidance within the skill file and a new `skill-interactive-patterns` spec, rather than as separate standalone specs. This keeps the spec surface small.

**Alternative considered**: One spec per interaction type (drag-drop-spec, animation-spec, etc.). Rejected — overkill for patterns that are essentially CSS/JS templates.

### Decision 3: Extend manifest type taxonomy with two new types

Add `prototype` and `editor` to the closed type set in the manifest spec. These cover the interactive artifact categories that don't fit existing types.

**Alternative considered**: Use `tool` for all interactive artifacts. Rejected — `tool` is too generic; a triage board (editor) and an animation demo (prototype) are different UX patterns.

### Decision 4: Typography rules copied into skill file, not just referenced

The typography rules (h1 serif 38px, eyebrow mono 11px, code spans) are embedded directly in the skill file as CSS snippets, not just referenced from skill-design-system. Claude needs the rules inline to follow them — it won't reliably read external spec files.

**Rationale**: The skill file IS the instruction Claude reads. Specs are for validation; the skill file is for behavior.

## Risks / Trade-offs

- [Risk: Skill file grows too long] → Mitigation: Reference example files for structural patterns; keep CSS snippets compact; target under 300 lines
- [Risk: Interactive patterns produce broken JS] → Mitigation: Provide tested JS templates from the example library; keep patterns simple (no frameworks)
- [Risk: New manifest types break existing readers] → Mitigation: Manifest spec already says unknown fields are ignored; new types are additive
