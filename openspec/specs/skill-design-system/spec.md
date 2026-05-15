# Skill Design System

## Purpose

Defines the canonical design system for the inhtml skill, including design tokens, typography, layout containers, color semantics, and responsive behavior to ensure visual consistency across all generated artifacts.

## Requirements

### Requirement: Canonical design tokens
The skill SHALL define a single set of CSS custom properties as the canonical design token palette. The palette MUST include color tokens (ivory, slate, clay, clay-d, oat, olive, rust), a 4-step gray scale (50/200/500/800), white, font stacks (serif, sans, mono), border/radius tokens, and spacing defaults.

#### Scenario: AI generates an HTML artifact
- **WHEN** AI creates any HTML artifact using the skill
- **THEN** the artifact's `:root` block contains all canonical tokens and uses only those token names for styling (no ad-hoc gray values)

### Requirement: Typography hierarchy
The skill SHALL define a clear type hierarchy: h1 (serif, 34-38px, letter-spacing -0.01em), eyebrow/label (mono, 11-12px, uppercase, letter-spacing 0.06-0.08em), body (sans, 14-15px, line-height 1.5-1.6), and caption/meta (mono or sans, 12-13px, gray-500).

#### Scenario: AI generates a status report
- **WHEN** AI creates a report-type artifact
- **THEN** the h1 uses serif font at 34-38px, any eyebrow/label text uses mono font at 11-12px uppercase, and body text uses sans at 14-15px

### Requirement: Layout container pattern
The skill SHALL specify a recommended page container pattern: `.page` or `.wrap` with `max-width` between 860-1360px (content-dependent), `margin: 0 auto`, and vertical padding of at least 48px top and 80px bottom.

#### Scenario: AI generates any artifact
- **WHEN** AI creates an HTML artifact
- **THEN** the body content is wrapped in a max-width container centered horizontally with adequate vertical padding

### Requirement: Color semantics
The skill SHALL define when to use each accent color: clay/clay-d for primary accent and interactive elements, olive for success/positive status, rust for errors/danger/warnings, oat for secondary accent and subtle highlights, gray-50 for background surfaces, gray-200 for borders and dividers, gray-500 for muted/secondary text, gray-800 for primary text.

#### Scenario: AI generates a status report with mixed statuses
- **WHEN** a section has items with "complete", "at risk", and "blocked" statuses
- **THEN** "complete" uses olive, "at risk" uses clay, and "blocked" uses rust

### Requirement: Responsive breakpoints
The skill SHALL specify that artifacts must include at least one responsive breakpoint for multi-column layouts, using `@media (max-width)` with a breakpoint between 768-920px that collapses to single-column.

#### Scenario: AI generates a two-column layout
- **WHEN** an artifact uses CSS Grid or Flexbox for side-by-side layout
- **THEN** a `@media` query collapses the layout to single-column below the specified breakpoint
