## ADDED Requirements

### Requirement: Skill file is bundled in the npm package
The Claude Code skill SHALL be stored as `assets/skill.md` inside the package and placed in the user's project by `inhtml init-skill`.

#### Scenario: Skill placed by init-skill
- **WHEN** user runs `npx inhtml init-skill`
- **THEN** `assets/skill.md` is copied to `.claude/commands/inhtml.md` in the project root

### Requirement: Skill instructs Claude to write artifacts to .inhtml/artifacts/
When invoked as `/inhtml`, the skill SHALL instruct Claude to write every rich HTML response as a complete self-contained file to `.inhtml/artifacts/<id>.html` and update `.inhtml/manifest.json`.

#### Scenario: Claude produces HTML output
- **WHEN** user invokes `/inhtml` and asks for a status report
- **THEN** Claude writes a complete HTML file to `.inhtml/artifacts/<id>.html` and appends a new entry to `.inhtml/manifest.json`

### Requirement: Skill provides the manifest update protocol
The skill SHALL specify exactly how to read the current manifest, compute the next ID, and append a new entry with fields: `id`, `title`, `type`, `prompt`, `timestamp`.

#### Scenario: Claude appends to manifest
- **WHEN** manifest currently has 3 entries
- **THEN** Claude uses id "0004", writes the artifact, then appends the new entry to manifest.json

### Requirement: Skill includes the standard design token palette
The skill SHALL embed the complete CSS `:root` token block so all artifacts share a consistent visual language.

#### Scenario: Artifact uses design tokens
- **WHEN** Claude produces any HTML artifact following the skill
- **THEN** the artifact's `<style>` block includes `--ivory: #FAF9F5`, `--clay: #D97757`, and the full token set

### Requirement: Skill includes a decision table for HTML vs plain text
The skill SHALL include a table mapping output types to formats so Claude does not produce HTML for simple conversational replies.

#### Scenario: Simple question asked
- **WHEN** user asks a yes/no question or requests a short answer
- **THEN** Claude responds in plain text, does not write to `.inhtml/artifacts/`

#### Scenario: Rich output requested
- **WHEN** user asks for a report, diagram, slide deck, comparison, or plan
- **THEN** Claude produces HTML and writes to `.inhtml/artifacts/`

### Requirement: Skill references example library for structural patterns
The skill SHALL list the example files in `/home/mi/Documents/ai/html-effectiveness/` by category so Claude can read them for layout patterns.

#### Scenario: Claude needs a layout reference
- **WHEN** Claude is producing a status report
- **THEN** the skill points Claude to `11-status-report.html` as the structural reference
