## 1. Phase A — Skill file content upgrade

- [x] 1.1 Add typography rules to `inhtml.md`: h1 (serif 500 38px -0.01em), eyebrow (mono 11px uppercase 0.08em gray-500), body (sans 15px 1.6), code spans (mono 0.9em gray-100 bg 4px radius)
- [x] 1.2 Add layout container guidance: 860px for reports, 1200px for dashboards, responsive collapse below 768px
- [x] 1.3 Add "when in doubt" heuristic: "if the output has structure, hierarchy, or multiple sections — use HTML"
- [x] 1.4 Expand pattern reference table from 8 to all 20 examples, grouped by category (exploration, code review, design, prototyping, diagrams, decks, research, reports, editors)

## 2. Phase B — Interactive patterns

- [x] 2.1 Add drag-and-drop pattern section: draggable cards, grip handles, dragover/drop handlers, visual feedback
- [x] 2.2 Add contenteditable pattern section: contenteditable="true", paste-as-plain-text, input event for live preview
- [x] 2.3 Add keyboard navigation pattern: scroll-snap for slide decks, Escape for overlays, Tab order
- [x] 2.4 Add CSS animation pattern: @keyframes, CSS custom properties for easing/timing, parameter controls
- [x] 2.5 Add export/copy-to-clipboard pattern: navigator.clipboard.writeText(), visual feedback
- [x] 2.6 Add collapsible/tabbed content pattern: details/summary, tab interfaces

## 3. Manifest type taxonomy

- [x] 3.1 Add `prototype` and `editor` to the type taxonomy section in `inhtml.md`
- [x] 3.2 Add type descriptions: prototype (animation demos, clickable flows), editor (triage boards, flag editors, prompt tuners)

## 4. Validation

- [x] 4.1 Read the final `inhtml.md` and verify it includes all typography rules, layout guidance, 20 pattern references, and interactive patterns
- [x] 4.2 Invoke `/inhtml` and ask for a status report — verify typography and layout match the rules
- [x] 4.3 Invoke `/inhtml` and ask for a simple question — verify Claude responds in plain text, not HTML
