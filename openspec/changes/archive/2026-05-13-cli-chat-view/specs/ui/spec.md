## MODIFIED Requirements

### Requirement: Card list renders manifest entries oldest-to-newest
The UI SHALL fetch `/session.json` on load and render a mixed stream of messages and artifact cards, ordered oldest (top) to newest (bottom). User messages appear as right-aligned bubbles, AI messages as left-aligned blocks, and artifact cards as inline clickable previews. The view auto-scrolls to the bottom on load and when new items appear.

#### Scenario: Messages and cards displayed in order
- **WHEN** session contains: user prompt, AI response, artifact, user prompt, AI response
- **THEN** the stream shows: user bubble, AI text block, card preview, user bubble, AI text block

#### Scenario: New event appended
- **WHEN** a new session event arrives via SSE
- **THEN** the corresponding element (bubble, text, or card) appears at the bottom and the view scrolls to show it

### Requirement: Each card shows prompt and artifact metadata
Each artifact card in the stream SHALL display the artifact title, type badge, and timestamp. Cards are clickable to open the artifact overlay (same as current behavior).

#### Scenario: Card in stream
- **WHEN** an artifact_created event is rendered in the stream
- **THEN** it appears as a compact card with title, type badge, and click-to-open behavior

### Requirement: Type badges use distinct colors per type
The UI SHALL render type badges with distinct background/text color pairs for: `report`, `slide`, `diagram`, `flowchart`, `exploration`, `review`, `explainer`, `plan`, `tool`, `prototype`, `editor`.

#### Scenario: New type badge
- **WHEN** a card has type "prototype" or "editor"
- **THEN** its badge uses a distinct color scheme not used by other types

### Requirement: Input box submits to /~hook
The textarea at the bottom SHALL POST its content to `/~hook` as `{ "event": "user_prompt", "text": "<content>" }` on Enter (without Shift). Shift+Enter inserts a newline. The textarea grows with content up to 160px. The sent message also appears immediately in the stream as a user bubble.

#### Scenario: Enter submits via hook
- **WHEN** user types text and presses Enter
- **THEN** text is POSTed to `/~hook`, a user bubble appears in the stream, and the textarea clears

### Requirement: Empty state shown when no session events exist
When session.json is empty or absent, the UI SHALL show a centered empty state with the message "No conversation yet" and a hint to run `npx inhtml init-hooks` to set up hook integration.

#### Scenario: Empty session
- **WHEN** session.json is `[]` or absent
- **THEN** empty state is displayed with setup instructions
