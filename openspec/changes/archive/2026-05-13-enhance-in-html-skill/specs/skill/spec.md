## MODIFIED Requirements

### Requirement: Skill includes a decision table for HTML vs plain text
The skill SHALL include a table mapping output types to formats so Claude does not produce HTML for simple conversational replies. The table SHALL include a heuristic: "if the output has structure, hierarchy, or multiple sections — use HTML."

#### Scenario: Simple question asked
- **WHEN** user asks a yes/no question or requests a short answer
- **THEN** Claude responds in plain text, does not write to `.inhtml/artifacts/`

#### Scenario: Rich output requested
- **WHEN** user asks for a report, diagram, slide deck, comparison, or plan
- **THEN** Claude produces HTML and writes to `.inhtml/artifacts/`

#### Scenario: Structured but unfamiliar output type
- **WHEN** user asks for an output not explicitly listed in the decision table
- **THEN** Claude applies the "if it has structure, hierarchy, or multiple sections" heuristic to decide

### Requirement: Skill references example library for structural patterns
The skill SHALL list all 20 example files in `/home/mi/Documents/ai/html-effectiveness/` by category so Claude can read them for layout patterns. The list SHALL cover: exploration (code approaches, visual designs, implementation plan), code review (PR review, PR writeup, module map), design (design system, component variants), prototyping (animation, interaction), diagrams (SVG illustrations, flowcharts), decks (slide deck), research (feature explainer, concept explainer), reports (status report, incident report), and editors (triage board, feature flags, prompt tuner).

#### Scenario: Claude needs a layout reference
- **WHEN** Claude is producing a status report
- **THEN** the skill points Claude to `11-status-report.html` as the structural reference

#### Scenario: Claude needs an interactive pattern reference
- **WHEN** Claude is producing an interactive tool like a triage board
- **THEN** the skill points Claude to `18-editor-triage-board.html` for drag-and-drop patterns

### Requirement: Skill includes typography rules
The skill SHALL embed CSS typography rules as copy-ready snippets: h1 (serif, 500 weight, 38px, letter-spacing -0.01em), eyebrow/label (mono, 11px, uppercase, letter-spacing 0.08em, gray-500), body (sans, 15px, line-height 1.6), and code spans (mono, 0.9em, gray-100 background, 4px radius).

#### Scenario: Claude produces a report
- **WHEN** Claude creates a report-type artifact
- **THEN** the h1 uses serif font at 38px with -0.01em letter-spacing, and any eyebrow text uses mono 11px uppercase

### Requirement: Skill includes layout container guidance
The skill SHALL specify recommended max-width values: 860px for reports, documents, and text-heavy content; 1200px for dashboards, comparison layouts, and wide data views. All containers SHALL use `margin: 0 auto` and include responsive collapse for multi-column layouts.

#### Scenario: Claude produces a dashboard
- **WHEN** Claude creates a wide comparison or dashboard artifact
- **THEN** the container uses max-width between 1000-1200px with responsive collapse below 768px
