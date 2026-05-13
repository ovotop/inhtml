## Why

The in-html SKILL.md is the primary instruction set that guides AI to produce high-quality HTML artifacts. Current issues reduce output quality and consistency:

1. **Design tokens mismatch** — SKILL.md uses `--gray-50/200/500/800` but most example artifacts use `--gray-150/300/500/700`. No canonical guidance on which to use.
2. **Missing design primitives** — No `--clay-d`, `--rust`, `--radius-panel`, `--radius-row`, `--border` tokens that examples rely on.
3. **No typography/layout rules** — Examples have consistent patterns (serif headings, mono eyebrows, max-width containers, spacing) but SKILL.md doesn't encode them.
4. **Example Library is a dead reference** — Lists `01`, `03` etc. with no file paths. AI can't read actual examples.
5. **Description under-triggers** — Doesn't cover near-edge cases like "kanban", "roadmap", "comparison table", "incident report".
6. **No color semantic guidance** — When to use clay vs rust vs olive vs oat is never explained.

## What Changes

- Rewrite SKILL.md with corrected and expanded design tokens
- Add typography hierarchy rules (h1, eyebrow, body, caption)
- Add layout patterns (container widths, spacing, responsive breakpoints)
- Add color semantics (accent, success, error, neutral palette usage)
- Add reusable component patterns (cards, panels, pills, status indicators)
- Update Example Library with actual file paths the AI can read
- Rewrite description for stronger triggering
- Add guidance on reading examples before generating artifacts

## Capabilities

### New Capabilities
- `skill-design-system`: Comprehensive design token reference and usage rules for HTML artifact generation
- `skill-component-patterns`: Reusable UI component patterns (cards, panels, pills, grids) with CSS snippets

### Modified Capabilities
(none — no existing specs)

## Impact

- `assets/skill.md` — The Claude Code version of the skill (should stay in sync with SKILL.md)
- `.opencode/skills/in-html/SKILL.md` — Primary file being rewritten
- Future artifact quality — More consistent, better-styled HTML outputs
