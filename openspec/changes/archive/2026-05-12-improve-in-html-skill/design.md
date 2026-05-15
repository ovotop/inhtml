## Context

The inhtml skill instructs AI to generate self-contained HTML artifacts. The current SKILL.md (127 lines) provides basic tokens and a template but lacks the design system depth needed for consistent, high-quality outputs. Meanwhile, 20+ example artifacts in `/home/mi/Documents/ai/html-effectiveness/` demonstrate rich patterns that the skill should encode.

The skill runs in two contexts:
- **OpenCode** (`.opencode/skills/inhtml/SKILL.md`) — primary, loaded via skill tool
- **Claude Code** (`assets/skill.md`) — secondary, installed via `npx inhtml init-skill`

Both must stay in sync.

## Goals / Non-Goals

**Goals:**
- Encode the proven design system from example artifacts into the skill
- Provide typography, layout, color, and component patterns so AI produces consistent output without reading examples each time
- Improve description triggering for edge-case queries
- Keep SKILL.md under 500 lines (progressive disclosure — heavy reference in separate files if needed)

**Non-Goals:**
- Changing the manifest.json schema or server endpoints
- Adding runtime dependencies to the npm package
- Creating a CSS framework — this is guidance for AI-generated inline styles
- Modifying the example HTML files themselves

## Decisions

### 1. Single canonical gray scale: `--gray-50/200/500/800`

**Why**: The host UI (`assets/index.html`) and newer examples (19, 20) use this scale. Older examples use `--gray-150/300/500/700` but the hex values map to the same visual grays. Aligning with the host UI ensures visual coherence when artifacts render inside it.

**Alternative considered**: Document both scales. Rejected — adds confusion with no benefit since the hex values are identical.

### 2. Add layout tokens but keep them minimal

**Why**: Examples consistently use `max-width: 860-1360px` containers, `padding: 56px 24px 96px`, and 12px border-radius panels. Encoding these as recommended defaults (not hard requirements) gives AI a starting point while allowing adaptation to content.

**Alternative considered**: No layout guidance, let AI freestyle. Rejected — leads to inconsistent spacing and widths.

### 3. Component patterns as CSS snippets, not HTML templates

**Why**: Providing full HTML templates constrains AI output. Instead, providing CSS class patterns (e.g., `.card { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 12px; padding: 24px; }`) gives guidance while letting AI compose freely.

### 4. Example Library points to actual file paths

**Why**: Listing `01 Code comparison` without paths means AI can't read the files. Changing to `01 — /home/mi/Documents/ai/html-effectiveness/01-exploration-code-approaches.html` makes them actionable.

**Alternative considered**: Copy examples into the skill's `references/` directory. Rejected — duplicates 500KB+ of files, and the originals are the source of truth.

### 5. Description stays in frontmatter, expanded with trigger phrases

**Why**: The skill-creator guide says description is the primary triggering mechanism. Adding explicit trigger phrases ("kanban board", "roadmap", "incident report", "comparison table", "TIL", "status update") combats under-triggering.

## Risks / Trade-offs

- **SKILL.md length** → Adding design system + component patterns may push toward 400+ lines. Mitigation: Keep examples as file path references, not inline code. Use concise tables over prose.
- **Over-specification** → Too many rules could make AI output formulaic. Mitigation: Frame as "recommended defaults" not "must follow exactly". Emphasize adaptation to content needs.
- **Example file availability** → If `html-effectiveness/` directory doesn't exist on user's machine, file path references are useless. Mitigation: The paths are absolute on the development machine; for published package, consider bundling 2-3 key examples in `assets/examples/`.

## Open Questions

- Should we bundle 2-3 canonical examples in `assets/examples/` for portability, or keep references to the dev-local `html-effectiveness/` directory?
- Should `assets/skill.md` be auto-generated from SKILL.md during build, or maintained manually?
