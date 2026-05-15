## ADDED Requirements

### Requirement: Serve card list UI from package assets
GET `/` SHALL respond with the `index.html` bundled inside the npm package, with a live-reload SSE script injected before `</body>`.

#### Scenario: Browser requests root
- **WHEN** browser sends GET `/`
- **THEN** server responds with the package's `assets/index.html`, `Content-Type: text/html`, `Cache-Control: no-cache`, and the SSE reload script injected

### Requirement: Serve manifest with no-cache
GET `/manifest.json` SHALL return `.inhtml/manifest.json` with `Cache-Control: no-cache` so the browser always fetches fresh data.

#### Scenario: Manifest requested
- **WHEN** browser sends GET `/manifest.json`
- **THEN** server responds with current file contents and `Cache-Control: no-cache`

#### Scenario: Manifest does not exist yet
- **WHEN** `.inhtml/manifest.json` is absent
- **THEN** server responds with `[]`

### Requirement: Serve artifacts as static files
GET `/artifacts/<id>.html` SHALL serve the corresponding file from `.inhtml/artifacts/` without modification (no script injection).

#### Scenario: Artifact requested
- **WHEN** browser sends GET `/artifacts/0001.html`
- **THEN** server responds with the file contents, `Content-Type: text/html`

### Requirement: SSE endpoint for live reload
GET `/~events` SHALL hold an open SSE connection and send `data: r\n\n` whenever `manifest.json` changes.

#### Scenario: Manifest updated by Claude
- **WHEN** `.inhtml/manifest.json` is written (mtime changes)
- **THEN** all connected `/~events` clients receive `data: r\n\n` within 400ms

#### Scenario: Heartbeat keeps connection alive
- **WHEN** no manifest change occurs for 20 seconds
- **THEN** server sends `: ping\n\n` to all connected clients

### Requirement: POST /~submit accepts browser input
POST `/~submit` with a plain-text body SHALL write the text to `.inhtml/pending.txt` and print it to the terminal.

#### Scenario: User submits from browser
- **WHEN** browser POSTs text to `/~submit`
- **THEN** `.inhtml/pending.txt` is written with the submitted text, terminal prints `[html →] <text>`, and server responds `{"ok":true}`

### Requirement: chokidar watches manifest.json
The server SHALL use chokidar (not `fs.watch`) to watch `.inhtml/manifest.json`, with a 50ms debounce before broadcasting SSE events.

#### Scenario: Rapid successive writes
- **WHEN** manifest is written twice within 50ms
- **THEN** only one SSE broadcast is sent (debounced)
