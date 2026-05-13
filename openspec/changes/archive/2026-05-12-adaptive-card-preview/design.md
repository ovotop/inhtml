## Context

The in-html host UI (`assets/index.html`) renders a card list of artifacts. Each card currently has a 16:9 preview container with a scaled-down iframe. The iframe uses `transform: scale()` with `transform-origin: top left` to shrink the full page into the preview area. Problem: the 16:9 ratio arbitrarily crops content, and important information is often not at the top.

Current flow:
```
iframe loads full artifact → scale down to 16:9 container → top portion visible
```

Proposed flow:
```
iframe loads full artifact → locate #preview element → read its rect →
scale + translate so #preview fills the container
```

## Goals / Non-Goals

**Goals:**
- Show the most important part of each artifact in the card preview
- Let the AI control what's previewed via a simple convention (`id="preview"`)
- Gracefully fall back when no `#preview` exists
- Keep the card clickable to open full overlay

**Non-Goals:**
- Server-side screenshot generation
- Real-time preview updates (still loads on card render)
- Scrollable card previews (future enhancement)
- Changing the overlay behavior

## Decisions

### 1. Convention: `id="preview"` on a container element

**Why**: Simplest possible convention for AI. Just add an id attribute to a `<section>` or `<div>`. No meta tags, no data attributes, no configuration files.

**Alternatives considered**:
- `<meta name="preview" content="selector=...;ratio=...">` — more declarative but harder for AI to get right
- `data-preview` attribute — similar to id but less semantic
- CSS class `.preview` — could conflict with user styles

### 2. Read element rect from iframe DOM (same-origin)

**Why**: Artifacts are served from the same origin (`localhost:7654`), so we can directly read `iframe.contentDocument.getElementById('preview').getBoundingClientRect()`. No postMessage needed.

**Flow**:
1. Create iframe with `src="/artifacts/<id>.html#preview"`
2. Wait for iframe `load` event
3. Read `#preview` element's `getBoundingClientRect()` and `scrollHeight`
4. Calculate scale = `containerWidth / rect.width`
5. Calculate offset = `rect.top * scale`
6. Set iframe width/height to full artifact size × scale
7. Apply `transform: scale(scale)` + `margin-top: -offset` to position `#preview` at top

**Key insight**: Use `margin-top: -offset` instead of `transform: translate()` because transform-origin is already `top left` for scaling. Combining scale + translate in one transform is tricky. Separate margin is cleaner.

```
┌─ container ─────────────────────────┐
│ ┌─ iframe (scaled) ───────────────┐ │
│ │  (hidden: page top)              │ │
│ │  · · · · · · · · · · · · · · · │ │
│ │  ┌─ #preview ─────────────────┐ │ │ ← margin-top: -offset scrolls this into view
│ │  │  Key content here           │ │ │
│ │  │  Full width of container    │ │ │
│ │  └────────────────────────────┘ │ │
│ │  (hidden: page bottom)          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 3. Container height = preview element height × scale

**Why**: Instead of forcing a fixed aspect ratio, let the container height match the actual content. This means cards may have different heights — which is fine and even desirable (a short table preview vs a tall diagram preview).

### 4. Fallback: show top 600px of artifact

**Why**: Old artifacts without `#preview` should still work. Default to showing the first 600px of the page at whatever width the container provides. This is better than the current 16:9 because 600px usually captures the header + first section.

### 5. Use `sandbox` attribute on preview iframe

**Why**: The preview iframe should not run JavaScript or execute forms. Use `sandbox="allow-same-origin"` to allow DOM reading but block JS execution in the preview. The full overlay iframe remains unsandboxed.

**Trade-off**: Some artifacts rely on JS for rendering (interactive tools). Those will look broken in preview. Acceptable — previews are for visual overview, not full functionality.

## Risks / Trade-offs

- **[Preview iframe blocks JS]** → Some artifacts may render differently in preview vs overlay. Mitigation: acceptable trade-off; preview is for overview only.
- **[Variable card heights]** → Cards have different heights depending on `#preview` size. Could look uneven. Mitigation: constrain max-height, add overflow fade.
- **[#preview element too tall]** → AI might mark a very large section. Mitigation: cap container height at e.g. 320px, show top portion with fade.
- **[iframe load timing]** → Need to wait for full render before reading DOM. Mitigation: `onload` event + `requestAnimationFrame`.

## Open Questions

- Should we constrain max card preview height? If so, what value? (suggest 320px)
- Should the preview iframe use `sandbox` to block JS, or keep it fully functional?
