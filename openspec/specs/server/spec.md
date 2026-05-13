# Server

## Purpose

HTTP server that serves the chat view UI, manifest data, session data, artifacts, and provides SSE live-reload and browser-to-CLI communication.

## Requirements

### Requirement: Serve card list UI from package assets
GET `/` SHALL respond with the `index.html` bundled inside the npm package, with a live-reload SSE script injected before `</body>`.

#### Scenario: Browser requests root
- **WHEN** browser sends GET `/`
- **THEN** server responds with the package's `assets/index.html`, `Content-Type: text/html`, `Cache-Control: no-cache`, and the SSE reload script injected

### Requirement: Serve manifest with no-cache
GET `/manifest.json` SHALL return `.in-html/manifest.json` with `Cache-Control: no-cache` so the browser always fetches fresh data.

#### Scenario: Manifest requested
- **WHEN** browser sends GET `/manifest.json`
- **THEN** server responds with current file contents and `Cache-Control: no-cache`

#### Scenario: Manifest does not exist yet
- **WHEN** `.in-html/manifest.json` is absent
- **THEN** server responds with `[]`

### Requirement: Serve artifacts as static files
GET `/artifacts/<id>.html` SHALL serve the corresponding file from `.in-html/artifacts/` without modification (no script injection).

#### Scenario: Artifact requested
- **WHEN** browser sends GET `/artifacts/0001.html`
- **THEN** server responds with the file contents, `Content-Type: text/html`

### Requirement: SSE endpoint for live reload
GET `/~events` SHALL hold an open SSE connection and send `data: r\n\n` whenever `manifest.json` or `session.json` changes.

#### Scenario: Manifest updated by Claude
- **WHEN** `.in-html/manifest.json` is written (mtime changes)
- **THEN** all connected `/~events` clients receive `data: r\n\n` within 400ms

#### Scenario: Session event received
- **WHEN** `/~hook` appends to session.json
- **THEN** all connected `/~events` clients receive `data: r\n\n` within 400ms

#### Scenario: Heartbeat keeps connection alive
- **WHEN** no manifest or session change occurs for 20 seconds
- **THEN** server sends `: ping\n\n` to all connected clients

### Requirement: POST /~hook accepts conversation events
POST `/~hook` with a JSON body SHALL append the event to `.in-html/session.json` and broadcast an SSE reload event. Accepted event types: `user_prompt` (with `text` field), `ai_response` (with `text` field), `artifact_created` (with `artifactId` field).

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
GET `/session.json` SHALL return `.in-html/session.json` with `Cache-Control: no-cache`. If the file doesn't exist, return `[]`.

#### Scenario: Session requested
- **WHEN** browser sends GET `/session.json`
- **THEN** server responds with current session events and `Cache-Control: no-cache`

### Requirement: POST /~submit accepts browser input
POST `/~submit` with a plain-text body SHALL write the text to `.in-html/pending.txt`, append a `user_prompt` event to session.json, print to terminal, and broadcast SSE. This maintains backward compatibility while integrating with the new session flow.

#### Scenario: User submits from browser
- **WHEN** browser POSTs text to `/~submit`
- **THEN** `.in-html/pending.txt` is written with the submitted text, terminal prints `[html →] <text>`, and server responds `{"ok":true}`

#### Scenario: Browser submits via old endpoint
- **WHEN** browser POSTs text to `/~submit`
- **THEN** pending.txt is written AND session.json gets a user_prompt event AND SSE fires

### Requirement: chokidar watches manifest.json and session.json
The server SHALL use chokidar (not `fs.watch`) to watch `.in-html/manifest.json` and `.in-html/session.json`, with a 50ms debounce before broadcasting SSE events.

#### Scenario: Rapid successive writes
- **WHEN** manifest or session is written twice within 50ms
- **THEN** only one SSE broadcast is sent (debounced)
