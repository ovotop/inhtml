# Skill Interactive Patterns

## Purpose

Defines interactive UI patterns that the inhtml skill SHALL use when producing editor, prototype, and other interactive artifacts.

## Requirements

### Requirement: Drag-and-drop pattern
The skill SHALL define a drag-and-drop pattern for sortable lists and kanban boards: cards with `draggable="true"`, drag handle (grip dots), visual feedback on drag (opacity, outline), and drop zones with `dragover`/`drop` event handlers.

#### Scenario: Claude produces a triage board
- **WHEN** Claude creates an artifact where the user sorts items into columns
- **THEN** each card is draggable with a grip handle, drop zones highlight on hover, and the final ordering can be exported

### Requirement: Contenteditable pattern
The skill SHALL define a contenteditable pattern for inline editing: containers with `contenteditable="true"`, paste handling (strip formatting), and change detection via `input` events.

#### Scenario: Claude produces a prompt tuner
- **WHEN** Claude creates an artifact where the user edits a template
- **THEN** the template area is contenteditable, pasted text is plain text only, and changes trigger live preview updates

### Requirement: Keyboard navigation pattern
The skill SHALL define keyboard navigation patterns: arrow-key navigation for slide decks (`scroll-snap`), Escape to close overlays, and Tab order for interactive elements.

#### Scenario: Claude produces a slide deck
- **WHEN** Claude creates a slide deck artifact
- **THEN** left/right arrow keys navigate between slides using `scroll-snap-type: y mandatory` and `scroll-snap-align: start`

### Requirement: CSS animation pattern
The skill SHALL define CSS animation patterns using `@keyframes` for micro-interactions: transitions with configurable easing curves, hover effects, and state-change animations. No external animation libraries.

#### Scenario: Claude produces an animation prototype
- **WHEN** Claude creates an artifact demonstrating a UI transition
- **THEN** the animation uses `@keyframes` with CSS custom properties for timing/easing, and includes controls to adjust parameters

### Requirement: Export and copy-to-clipboard pattern
The skill SHALL define export patterns: buttons that copy artifact content (or a derived format like JSON/markdown) to the clipboard using `navigator.clipboard.writeText()`, with visual feedback on copy.

#### Scenario: Claude produces an interactive editor
- **WHEN** Claude creates an artifact where the user configures something
- **THEN** a "Copy" or "Export" button copies the result to clipboard and shows brief confirmation feedback

### Requirement: Collapsible and tabbed content pattern
The skill SHALL define patterns for collapsible sections (`<details>`/`<summary>`) and tabbed interfaces for organizing dense content into navigable layers.

#### Scenario: Claude produces a feature explainer
- **WHEN** Claude creates an artifact explaining a complex feature
- **THEN** the content uses collapsible sections for deep-dives and tabs for alternative views, keeping the initial view scannable
