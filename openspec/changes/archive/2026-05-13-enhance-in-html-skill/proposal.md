## Why

The in-html skill file (`in-html.md`) produces visually flat output because it omits typography rules, layout guidance, and interaction patterns. The archived `html-effectiveness` project has 20 polished examples demonstrating richer techniques — interactive editors, animation prototypes, detailed typography — but none of this knowledge is in the current skill. The result: Claude generates HTML artifacts that are structurally correct but lack the visual polish and interactivity that make HTML output worth reading.

## What Changes

**Phase A — Skill file content upgrade** (update `in-html.md`):
- Add typography rules (h1 serif 38px, eyebrow mono 11px uppercase, code spans)
- Add layout container guidance (860px for reports, 1200px for dashboards)
- Expand pattern reference table from 8 to all 20 examples
- Add "when in doubt" heuristic for format selection

**Phase B — Interactive tool patterns** (new capability):
- Document drag-and-drop patterns (sortable lists, triage boards)
- Document contenteditable patterns (inline editing, prompt tuners)
- Document CSS animation patterns (keyframes, easing curves)
- Document export patterns (copy-to-clipboard, download buttons)
- Add new manifest types: `prototype`, `editor`

## Capabilities

### New Capabilities

- `skill-interactive-patterns`: Patterns for building interactive HTML tools — drag-and-drop, contenteditable, animations, keyboard navigation, export/copy-to-clipboard — so Claude can produce artifacts users interact with, not just read

### Modified Capabilities

- `skill`: Update the skill file (`in-html.md`) with typography rules, layout guidance, expanded pattern references, and the "when in doubt" heuristic

## Impact

- `.claude/commands/in-html.md` — rewritten with richer content
- `/home/mi/Documents/ai/html-effectiveness/` — referenced as pattern library (read-only)
- Manifest type taxonomy — extended with `prototype` and `editor` types
- No breaking changes; existing artifacts unaffected
