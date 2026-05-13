## Why

The current card preview uses a fixed 16:9 aspect ratio, which arbitrarily crops content. Important content (tables, conclusions, key diagrams) often isn't at the top of the artifact, making the preview useless. Users can't scroll the preview either. The preview should adapt to the content, not force content into a fixed frame.

## What Changes

- **New convention**: AI marks the most important section of each artifact with `id="preview"`. The host UI reads this element's position and size to render an adaptive preview.
- **Host UI rewrite**: Replace the fixed 16:9 iframe scaling with a system that loads the artifact, locates `#preview`, reads its bounding box, and scales/translates the iframe so that section fills the card preview area.
- **Fallback**: If an artifact has no `#preview`, default to showing the top portion (current behavior, but with a better aspect ratio).
- **Skill update**: Add the `id="preview"` convention to SKILL.md so AI knows to use it when generating artifacts.

## Capabilities

### New Capabilities
- `preview-anchor`: Convention for AI to mark key content areas in artifacts, and rendering logic in the host UI to adaptively preview those areas.

### Modified Capabilities
(none — no existing main specs)

## Impact

- `assets/index.html` — Preview rendering logic (JS + CSS)
- `.opencode/skills/in-html/SKILL.md` — Add `id="preview"` convention
- `assets/skill.md` — Sync with SKILL.md
