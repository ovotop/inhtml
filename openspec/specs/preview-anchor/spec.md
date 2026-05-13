# Preview Anchor

## Purpose

TBD

## Requirements

### Requirement: AI marks key content with preview anchor
The skill SHALL instruct AI to add `id="preview"` to the most important content container in each generated artifact. This element defines what the card preview shows. The element SHOULD be a `<section>` or `<div>` containing the core visual content (not headers, footers, or prompt boxes).

#### Scenario: AI generates a status report
- **WHEN** AI creates a status report artifact
- **THEN** the artifact contains a `<section id="preview">` wrapping the key metrics or summary section

#### Scenario: AI generates a comparison layout
- **WHEN** AI creates a comparison artifact
- **THEN** the artifact contains a `<section id="preview">` wrapping the comparison grid

#### Scenario: AI generates a flowchart
- **WHEN** AI creates a flowchart artifact
- **THEN** the artifact contains a `<div id="preview">` wrapping the SVG diagram

### Requirement: Host UI reads preview anchor for adaptive rendering
The host UI SHALL load each artifact iframe, locate the `#preview` element via `getElementById`, read its bounding box with `getBoundingClientRect()`, and scale/translate the iframe so the `#preview` element fills the card preview container.

#### Scenario: Artifact has #preview element
- **WHEN** the card list renders an artifact that contains an element with `id="preview"`
- **THEN** the card preview shows the #preview element scaled to fit the container width, with the container height matching the element's aspect ratio (capped at max-height)

#### Scenario: Artifact has no #preview element
- **WHEN** the card list renders an artifact without a `#preview` element
- **THEN** the card preview falls back to showing the top 600px of the artifact at the container width

### Requirement: Card preview container has adaptive height
The card preview container SHALL NOT use a fixed aspect ratio. Its height SHALL be determined by the `#preview` element's actual height multiplied by the scale factor, subject to a maximum height constraint.

#### Scenario: Preview element is short
- **WHEN** the `#preview` element is 300px tall and the scale factor is 0.25
- **THEN** the card preview container height is 75px

#### Scenario: Preview element is very tall
- **WHEN** the `#preview` element is 2000px tall and the scale factor would make the container exceed max-height
- **THEN** the container is capped at max-height and a gradient fade is shown at the bottom

### Requirement: Preview iframe does not execute JavaScript
The preview iframe SHALL use the `sandbox="allow-same-origin"` attribute to allow DOM reading but prevent JavaScript execution and form submission in the preview.

#### Scenario: Artifact contains interactive JS
- **WHEN** an artifact has JavaScript-powered interactivity
- **THEN** the card preview shows the static HTML/CSS rendering without JS effects
