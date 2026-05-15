## MODIFIED Requirements

### Requirement: Browser messages reach AI agent
When a user sends a message from the browser input box, the server SHALL append a `user_prompt` event to `.inhtml/session.json` AND write to `.inhtml/pending.txt` for backward compatibility. The AI skill SHALL instruct the agent to check `pending.txt` before responding to user prompts.

#### Scenario: User sends message from browser
- **WHEN** user types a message in the browser input and presses Enter
- **THEN** the message is POSTed to `/~hook` as a `user_prompt` event
- **AND** the message appears immediately in the chat stream

### Requirement: CLI status visible in browser
The server SHALL expose a `GET /~status` endpoint returning the current CLI-side state. Status is now derived from session events — the most recent event type determines the displayed state.

#### Scenario: AI starts processing
- **WHEN** a `user_prompt` event is the most recent in session.json
- **THEN** the browser displays "thinking" status in the header

#### Scenario: AI completes processing
- **WHEN** an `ai_response` or `artifact_created` event is appended
- **THEN** the browser updates to show "done" status

### Requirement: Card list scrolls instead of compressing
The chat stream container SHALL scroll vertically when content overflows the available space. Messages and cards SHALL NOT be compressed vertically to fit. Each message bubble and card maintains its natural height.

#### Scenario: Many messages in the stream
- **WHEN** the chat stream exceeds the viewport height
- **THEN** the stream scrolls vertically
- **AND** each message/card maintains its full height
