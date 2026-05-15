# Skill Component Patterns

## Purpose

Defines reusable UI component patterns for the inhtml skill, ensuring consistent styling for cards, status indicators, labels, prompt boxes, grids, and tables across all generated artifacts.

## Requirements

### Requirement: Card/panel component pattern
The skill SHALL define a reusable card/panel pattern: white background, 1.5px solid gray-200 border, 12px border-radius, 24px padding. Cards may optionally have a header section with bottom border separator.

#### Scenario: AI generates a comparison layout
- **WHEN** AI creates an artifact comparing multiple approaches or items
- **THEN** each item is rendered as a card with consistent border, radius, and padding

### Requirement: Status indicator patterns
The skill SHALL define visual patterns for status indicators: pill-shaped badges with mono font at 11px, using olive background for success, clay for warning/in-progress, rust for error/blocked, and gray-50 for neutral/inactive.

#### Scenario: AI generates a kanban or triage board
- **WHEN** items have status labels (e.g., "done", "in progress", "blocked")
- **THEN** each status is rendered as a colored pill badge with consistent styling

### Requirement: Eyebrow/label pattern
The skill SHALL define an eyebrow pattern: mono font, 11px, uppercase, letter-spacing 0.06-0.08em, gray-500 color, used above headings to indicate content type or category.

#### Scenario: AI generates any artifact with a category label
- **WHEN** an artifact has a category or type label above the main heading
- **THEN** the label uses the eyebrow pattern (mono, 11px, uppercase, gray-500)

### Requirement: Prompt box pattern
The skill SHALL define a prompt quote pattern for displaying the user's original prompt: gray-50 background, 1.5px gray-200 border, 12px border-radius, with a small "Prompt" or mono label.

#### Scenario: AI generates an artifact that references user input
- **WHEN** an artifact should show the user's original prompt
- **THEN** the prompt is displayed in a styled prompt-box component at the top of the page

### Requirement: Grid layout patterns
The skill SHALL define common grid layouts: 2-column comparison (`grid-template-columns: 1fr 1fr`), content + sidebar (`grid-template-columns: minmax(0,1fr) 280-320px`), and 3-column cards. All multi-column grids MUST include a responsive collapse breakpoint.

#### Scenario: AI generates a side-by-side comparison
- **WHEN** AI creates an artifact comparing two approaches
- **THEN** the layout uses a 2-column grid that collapses to single-column on mobile

### Requirement: Table styling pattern
The skill SHALL define a styled table pattern: no outer border, subtle row dividers using gray-200 bottom-border, left-aligned headers in mono 11px uppercase, cell padding of 10-12px vertical.

#### Scenario: AI generates a data table
- **WHEN** an artifact contains tabular data
- **THEN** the table uses the defined styling pattern with consistent dividers and header treatment
