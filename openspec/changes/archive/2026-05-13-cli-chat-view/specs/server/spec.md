## MODIFIED Requirements

### Requirement: POST /~hook accepts conversation events
POST `/~hook` with a JSON body SHALL append the event to `.inhtml/session.json` and broadcast an SSE reload event. Accepted event types: `user_prompt` (with `text` field), `ai_response` (with `text` field), `artifact_created` (with `artifactId` field).

#### Scenario: User prompt event
- **WHEN** server receives POST `/~hook` with `{ "event": "user_prompt", "text": "make a report" }`
- **THEN** event is appended to session.json with `{ "type": "user_prompt", "role": "user", "text": "make a report", "timestamp": "..." }`
- **AND** SSE broadcast fires

#### Scenario: AI response event
- **WHEN** server receives POST `/~hook` with `{ "event": "ai_response", "text": "Created a status report..." }`
- **THEN** event is appended as `{ "type": "ai_response", "role": "ai", "text": "...", "timestamp": "..." }`

#### Scenario: Artifact created event
- **WHEN** server receives POST `/~hook` with `{ "event": "artifact_created", "artifactId": "0005" }`
- **THEN** event is appended as `{ "type": "artifact", "artifactId": "0005", "timestamp": "..." }`

### Requirement: Serve session data
GET `/session.json` SHALL return `.inhtml/session.json` with `Cache-Control: no-cache`. If the file doesn't exist, return `[]`.

#### Scenario: Session requested
- **WHEN** browser sends GET `/session.json`
- **THEN** server responds with current session events and `Cache-Control: no-cache`

### Requirement: SSE endpoint for live reload
GET `/~events` SHALL hold an open SSE connection and send `data: r\n\n` whenever `session.json` changes (in addition to manifest.json changes).

#### Scenario: Session event received
- **WHEN** `/~hook` appends to session.json
- **THEN** all connected `/~events` clients receive `data: r\n\n` within 400ms

### Requirement: POST /~submit accepts browser input
POST `/~submit` with a plain-text body SHALL write the text to `.inhtml/pending.txt`, append a `user_prompt` event to session.json, print to terminal, and broadcast SSE. This maintains backward compatibility while integrating with the new session flow.

#### Scenario: Browser submits via old endpoint
- **WHEN** browser POSTs text to `/~submit`
- **THEN** pending.txt is written AND session.json gets a user_prompt event AND SSE fires
