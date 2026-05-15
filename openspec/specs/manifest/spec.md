# Manifest

## Purpose

Defines the manifest file format that tracks all AI-produced artifacts in the `.inhtml/` directory.

## Requirements

### Requirement: Manifest is a JSON array stored at .inhtml/manifest.json
The manifest SHALL be a valid JSON array at `.inhtml/manifest.json`, append-only, where each element represents one AI-produced artifact.

#### Scenario: Manifest initialized
- **WHEN** `.inhtml/` is created for the first time
- **THEN** `manifest.json` is written as `[]`

### Requirement: Each manifest entry has the required fields
Every entry SHALL include: `id` (string, zero-padded 4 digits), `title` (string), `type` (string from the closed type set), `prompt` (string, the user's original prompt), `timestamp` (ISO 8601 UTC string).

#### Scenario: Valid entry
- **WHEN** an artifact is created
- **THEN** its manifest entry contains all five fields with correct types

#### Scenario: ID is sequential and zero-padded
- **WHEN** 3 entries already exist
- **THEN** the new entry gets id `"0004"`

### Requirement: Type field is one of a closed set
The `type` field SHALL be one of: `report`, `slide`, `diagram`, `flowchart`, `exploration`, `review`, `explainer`, `plan`, `tool`, `prototype`, `editor`.

#### Scenario: Known type used
- **WHEN** Claude produces a weekly status report
- **THEN** the entry type is `"report"`

#### Scenario: Prototype type used
- **WHEN** Claude produces an animation demo or clickable interaction prototype
- **THEN** the entry type is `"prototype"`

#### Scenario: Editor type used
- **WHEN** Claude produces an interactive tool like a triage board, feature flag editor, or prompt tuner
- **THEN** the entry type is `"editor"`

#### Scenario: Unknown type falls back
- **WHEN** the output type does not clearly match any known type
- **THEN** Claude uses `"tool"` as the fallback type

### Requirement: Manifest format is stable at v0.1
The five fields (`id`, `title`, `type`, `prompt`, `timestamp`) are locked. New optional fields may be added in future versions but SHALL NOT break existing readers that ignore unknown fields.

#### Scenario: Reader encounters unknown field
- **WHEN** a future entry contains an additional field not in the v0.1 schema
- **THEN** the server and UI ignore the unknown field and render the card normally
