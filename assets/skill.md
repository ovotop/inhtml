# inhtml Skill

You create rich HTML visualizations. When the user asks for reports, diagrams, slides, or any visual content, you create self-contained HTML files and register them in the manifest.

## Server Auto-Start

Before creating any HTML artifact, check if the inhtml server is running:

```bash
curl -s http://localhost:7654/manifest.json > /dev/null 2>&1
```

If the server is not running (curl fails), start it in the background:

```bash
npx inhtml --no-open &
sleep 1
```

Then proceed with creating the artifact.

## Browser Messages

Before responding to any user prompt, check `.inhtml/pending.txt`. If it contains text, treat it as a user message from the browser — respond to it, then clear the file by writing an empty string to it. If the file is empty or missing, proceed normally.

## Decision Table: HTML vs Plain Text

| Content Type | Use HTML | Use Plain Text |
|--------------|----------|----------------|
| Status reports | ✓ | |
| Comparisons | ✓ | |
| Flowcharts | ✓ | |
| Diagrams | ✓ | |
| Slides | ✓ | |
| Reviews | ✓ | |
| Explainers | ✓ | |
| Plans / roadmaps | ✓ | |
| Kanban boards | ✓ | |
| Incident reports | ✓ | |
| Simple lists | | ✓ |
| Quick answers | | ✓ |

## Design Tokens

Always include these CSS custom properties in `:root`:

```css
:root {
  /* ── Colors ── */
  --ivory:    #FAF9F5;
  --slate:    #141413;
  --clay:     #D97757;
  --clay-d:   #B85C3E;
  --oat:      #E3DACC;
  --olive:    #788C5D;
  --rust:     #B04A3F;
  --gray-50:  #F0EEE6;
  --gray-200: #D1CFC5;
  --gray-500: #87867F;
  --gray-800: #3D3D3A;
  --white:    #FFFFFF;

  /* ── Typography ── */
  --serif: ui-serif, Georgia, "Times New Roman", serif;
  --sans:  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --mono:  ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  /* ── Surfaces ── */
  --border: 1.5px solid var(--gray-200);
  --radius-panel: 12px;
  --radius-row: 8px;
}
```

### Color Semantics

| Token | Use For |
|-------|---------|
| `clay` | Primary accent, links, interactive elements, "in progress" status |
| `clay-d` | Hover state for clay elements, deeper accent |
| `olive` | Success, "complete/done" status, positive indicators |
| `rust` | Error, danger, "blocked" status, warnings |
| `oat` | Secondary accent, subtle highlights, tags |
| `gray-50` | Background surfaces, input fills, hover rows |
| `gray-200` | Borders, dividers, card outlines |
| `gray-500` | Muted/secondary text, labels, timestamps |
| `gray-800` | Primary body text, headings (alternative to slate) |
| `slate` | Primary text color, headings |
| `ivory` | Page background |
| `white` | Card backgrounds, elevated surfaces |

## Typography Hierarchy

Use this consistent type scale:

| Element | Font | Size | Weight | Extra |
|---------|------|------|--------|-------|
| `h1` | `var(--serif)` | 34-38px | 500 | `letter-spacing: -0.01em` |
| `h2` | `var(--serif)` | 24-28px | 500 | |
| `h3` | `var(--sans)` | 18-20px | 600 | |
| Eyebrow / label | `var(--mono)` | 11-12px | 400 | `text-transform: uppercase; letter-spacing: 0.06-0.08em; color: var(--gray-500)` |
| Body | `var(--sans)` | 14-15px | 400 | `line-height: 1.5-1.6` |
| Caption / meta | `var(--mono)` or `var(--sans)` | 12-13px | 400 | `color: var(--gray-500)` |
| Code inline | `var(--mono)` | 13px | 400 | |

## Layout Patterns

### Page Container

Always wrap content in a centered container:

```css
.page {
  max-width: 920px;       /* 860-1360px depending on content density */
  margin: 0 auto;
  padding: 56px 24px 96px;
}
```

- **Narrow content** (reports, explainers): 860-920px
- **Medium content** (reviews, plans): 980-1120px
- **Wide content** (kanban, dashboards): 1180-1360px

### Responsive Breakpoints

Multi-column layouts MUST include a collapse breakpoint:

```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 32px;
}
@media (max-width: 920px) {
  .layout { grid-template-columns: 1fr; }
}
```

### Common Grid Layouts

```css
/* 2-column comparison */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

/* Content + sidebar */
.grid-sidebar { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 32px; }

/* 3-column cards */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
```

## Component Patterns

### Card / Panel

```css
.card {
  background: var(--white);
  border: var(--border);
  border-radius: var(--radius-panel);
  padding: 24px;
}
```

Use cards for: comparison items, content sections, data groups, sidebar widgets.

### Status Indicator (Pill Badge)

```css
.pill {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.pill--done    { background: var(--oat); color: var(--olive); }
.pill--active  { background: #f5e6dc; color: var(--clay); }
.pill--blocked { background: #f5ddd8; color: var(--rust); }
.pill--muted   { background: var(--gray-50); color: var(--gray-500); }
```

### Prompt Box

Display the user's original prompt at the top of the artifact:

```css
.prompt-box {
  background: var(--gray-50);
  border: var(--border);
  border-radius: var(--radius-panel);
  padding: 16px 20px;
  font-size: 14.5px;
  color: var(--gray-800);
}
.prompt-box .label {
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gray-500);
  margin-bottom: 6px;
}
```

### Eyebrow Label

```css
.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-500);
  margin-bottom: 10px;
}
```

### Table

```css
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gray-500);
  text-align: left;
  padding: 8px 12px;
  border-bottom: var(--border);
}
td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--gray-200);
  font-size: 14px;
}
tr:last-child td { border-bottom: none; }
```

## Manifest Update Protocol

When creating an artifact:

1. Read `.inhtml/manifest.json` to get current entries
2. Compute next ID: `String(manifest.length + 1).padStart(4, '0')`
3. Write HTML artifact to `.inhtml/artifacts/<id>.html`
4. Append new entry to manifest:

```json
{
  "id": "0001",
  "title": "Your Artifact Title",
  "type": "report",
  "prompt": "user's original prompt",
  "timestamp": "2026-05-12T10:23:00Z"
}
```

## Type Taxonomy

- `report` — Status reports, summaries, weekly updates
- `slide` — Presentations, decks (use scroll-snap for slides)
- `diagram` — Visual diagrams, architecture overviews
- `flowchart` — Process flows, decision trees
- `exploration` — Research, investigations, approach comparisons
- `review` — Code reviews, PR analysis, audits
- `explainer` — Tutorials, concept explanations, TIL notes
- `plan` — Project plans, roadmaps, implementation plans
- `tool` — Utilities, calculators, interactive widgets

## Example Library

Read these files for inspiration and pattern reference:

| ID | File | When to Read |
|----|------|--------------|
| `01` | `/home/mi/Documents/ai/html-effectiveness/01-exploration-code-approaches.html` | Comparing multiple approaches side-by-side |
| `03` | `/home/mi/Documents/ai/html-effectiveness/03-code-review-pr.html` | PR reviews, code audits |
| `09` | `/home/mi/Documents/ai/html-effectiveness/09-slide-deck.html` | Slide presentations (scroll-snap) |
| `11` | `/home/mi/Documents/ai/html-effectiveness/11-status-report.html` | Weekly status, engineering updates |
| `13` | `/home/mi/Documents/ai/html-effectiveness/13-flowchart-diagram.html` | Flowcharts with SVG diagrams |
| `14` | `/home/mi/Documents/ai/html-effectiveness/14-research-feature-explainer.html` | Feature explainers |
| `15` | `/home/mi/Documents/ai/html-effectiveness/15-research-concept-explainer.html` | Concept explainers, TIL |
| `16` | `/home/mi/Documents/ai/html-effectiveness/16-implementation-plan.html` | Implementation plans, roadmaps |
| `18` | `/home/mi/Documents/ai/html-effectiveness/18-editor-triage-board.html` | Kanban boards, triage views |

Read the most relevant example before generating an artifact to match its quality and patterns.

## Preview Anchor

The card list UI shows a preview of each artifact. To control what the preview displays, add `id="preview"` to the most important content container in your HTML.

**Where to place it:**
- Status reports: wrap the metrics/summary section
- Comparisons: wrap the comparison grid
- Flowcharts/diagrams: wrap the SVG or diagram container
- Explainers: wrap the key content area (not the header or prompt box)
- Kanban boards: wrap the board columns

**Example:**
```html
<section id="preview">
  <div class="metrics-grid">
    <!-- key content here -->
  </div>
</section>
```

**Rules:**
- Use `id="preview"` on a `<section>` or `<div>` containing the core visual content
- Do NOT place it on the entire page or header — pick the section most worth previewing
- If omitted, the preview defaults to the top portion of the artifact
- The preview iframe blocks JavaScript, so only static HTML/CSS renders in preview

## Browser Communication

The inhtml system supports bidirectional communication between the browser and the CLI.

### Checking for browser messages

Before responding to any user prompt, check if there are new messages from the browser:

1. Read `.inhtml/pending.txt` — if it exists and has content, the user sent a message from the browser
2. Respond to the message, then clear the file (write empty string)
3. This ensures browser input is never lost

### Writing status updates

During artifact generation, write status updates to `.inhtml/status.json` so the browser shows progress:

```json
{ "state": "thinking", "message": "Generating artifact..." }
```

Valid states: `idle`, `thinking`, `done`, `error`

**Workflow:**
1. Before generating: write `{ "state": "thinking", "message": "Creating artifact..." }`
2. After generating: write `{ "state": "done", "message": "Artifact created" }`
3. On error: write `{ "state": "error", "message": "Error: ..." }`
4. When idle: write `{ "state": "idle" }` (or delete the file)

## Important Notes

- Each HTML file MUST be completely self-contained (no external dependencies)
- Use inline CSS only
- Use inline JS only if needed (interactive elements, collapsible sections)
- Keep files under 500KB
- Use semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`)
- Always include `-webkit-font-smoothing: antialiased` on body
- Reset with `* { box-sizing: border-box; margin: 0; padding: 0; }`
