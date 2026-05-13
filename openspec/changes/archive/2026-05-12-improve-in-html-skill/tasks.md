## 1. Design Tokens

- [x] 1.1 Replace gray scale in SKILL.md with canonical `--gray-50/200/500/800` and add missing tokens (`--clay-d`, `--rust`, `--radius-panel`, `--radius-row`, `--border`)
- [x] 1.2 Add color semantics section defining when to use clay, clay-d, oat, olive, rust, and each gray step
- [x] 1.3 Verify tokens match `assets/index.html` host UI tokens exactly

## 2. Typography & Layout

- [x] 2.1 Add typography hierarchy section: h1 (serif 34-38px), eyebrow (mono 11-12px uppercase), body (sans 14-15px), caption (12-13px gray-500)
- [x] 2.2 Add layout container pattern: `.page`/`.wrap` with max-width, centering, and vertical padding defaults
- [x] 2.3 Add responsive breakpoint guidance: `@media (max-width: 768-920px)` for multi-column collapse

## 3. Component Patterns

- [x] 3.1 Add card/panel pattern: white bg, 1.5px gray-200 border, 12px radius, 24px padding
- [x] 3.2 Add status indicator pattern: pill badges with mono 11px, color-coded by status
- [x] 3.3 Add prompt box pattern: gray-50 bg, border, 12px radius, mono label
- [x] 3.4 Add grid layout patterns: 2-col comparison, content+sidebar, 3-col cards
- [x] 3.5 Add table styling pattern: row dividers, mono uppercase headers, cell padding

## 4. Example Library & Triggering

- [x] 4.1 Replace Example Library placeholder names with actual file paths from `html-effectiveness/`
- [x] 4.2 Add brief description of what each example demonstrates (so AI knows when to read which)
- [x] 4.3 Rewrite description in frontmatter with stronger trigger phrases (kanban, roadmap, incident report, comparison table, status update, TIL)

## 5. Sync & Verify

- [x] 5.1 Copy updated SKILL.md content to `assets/skill.md` (strip YAML frontmatter)
- [x] 5.2 Verify final SKILL.md is under 500 lines
- [x] 5.3 Test: trigger skill with a sample prompt and verify output quality
