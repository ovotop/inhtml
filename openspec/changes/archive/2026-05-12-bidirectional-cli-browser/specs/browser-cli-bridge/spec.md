## ADDED Requirements

### Requirement: Browser messages reach AI agent
When a user sends a message from the browser input box, the server SHALL write the message to `.in-html/pending.txt` AND update `.in-html/last-message.txt` with a timestamp. The AI skill SHALL instruct the agent to check `pending.txt` before responding to user prompts.

#### Scenario: User sends message from browser
- **WHEN** user types a message in the browser input and clicks Send
- **THEN** the message is written to `.in-html/pending.txt`
- **AND** a timestamp is written to `.in-html/last-message.txt`
- **AND** the server logs `[html →] <message>` to stdout

#### Scenario: AI checks pending messages
- **WHEN** the AI agent is invoked via the in-html skill
- **THEN** the skill instructs the AI to read `.in-html/pending.txt` and respond to any new messages before proceeding

### Requirement: CLI status visible in browser
The server SHALL expose a `GET /~status` endpoint returning the current CLI-side state. The AI agent SHALL write status updates to `.in-html/status.json`. The browser SHALL display the current status (idle, thinking, done, error) in the header area.

#### Scenario: AI starts processing
- **WHEN** the AI agent begins generating an artifact
- **THEN** it writes `{ "state": "thinking", "message": "Generating artifact..." }` to `.in-html/status.json`
- **AND** the browser displays "thinking" status in the header

#### Scenario: AI completes processing
- **WHEN** the AI agent finishes generating an artifact
- **THEN** it writes `{ "state": "done", "message": "Artifact created" }` to `.in-html/status.json`
- **AND** the browser updates to show "done" status

#### Scenario: Status endpoint returns current state
- **WHEN** the browser requests `GET /~status`
- **THEN** the server reads `.in-html/status.json` and returns it as JSON
- **AND** if the file doesn't exist, returns `{ "state": "idle" }`

### Requirement: Card list scrolls instead of compressing
The card list container SHALL scroll vertically when cards overflow the available space. Cards SHALL NOT be compressed vertically to fit.

#### Scenario: Many cards in the list
- **WHEN** there are enough cards to exceed the viewport height
- **THEN** the card list scrolls vertically
- **AND** each card maintains its full height (preview + metadata)
- **AND** cards do not shrink to fit

#### Scenario: Browser window is resized smaller
- **WHEN** the user resizes the browser window to a smaller height
- **THEN** the card list scrolls to accommodate the reduced space
- **AND** card heights remain unchanged
