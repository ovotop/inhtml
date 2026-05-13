## MODIFIED Requirements

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
