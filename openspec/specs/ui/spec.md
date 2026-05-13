# UI

## Purpose

Browser-based chat-style interface that displays a mixed stream of conversation messages and artifact cards, supports live reload via SSE, and allows submitting prompts back to the CLI.

## Requirements

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

#### Scenario: Correct badge color applied
- **WHEN** a card has type "diagram"
- **THEN** its badge uses the green-toned color scheme (background #E8EDE0, color #4A6030)

#### Scenario: New type badge
- **WHEN** a card has type "prototype" or "editor"
- **THEN** its badge uses a distinct color scheme not used by other types

### Requirement: Card click opens artifact overlay
Clicking a card SHALL open a full-screen overlay containing an iframe loaded with the artifact, the artifact title and badge in a top bar, a Back button, and a Download button.

#### Scenario: Card clicked
- **WHEN** user clicks a card
- **THEN** a full-screen overlay appears with the artifact in an iframe, the title in the top bar, and a Download button

#### Scenario: Overlay dismissed
- **WHEN** user clicks the Back button or presses Escape
- **THEN** the overlay closes and the iframe src is cleared

### Requirement: Download button exports artifact as named HTML file
The Download button in the overlay SHALL trigger a browser file download of the artifact HTML, named `<id>-<slugified-title>.html`.

#### Scenario: Download triggered
- **WHEN** user clicks the Download button for artifact id "0004", title "Birchline — Engineering Status — Week 11"
- **THEN** browser downloads the file as `0004-birchline-engineering-status-week-11.html`

### Requirement: Input box submits to /~hook
The textarea at the bottom SHALL POST its content to `/~hook` as `{ "event": "user_prompt", "text": "<content>" }` on Enter (without Shift). Shift+Enter inserts a newline. The textarea grows with content up to 160px. The sent message also appears immediately in the stream as a user bubble.

#### Scenario: Enter submits via hook
- **WHEN** user types text and presses Enter
- **THEN** text is POSTed to `/~hook`, a user bubble appears in the stream, and the textarea clears

### Requirement: Live dot indicates SSE connection status
A small dot in the header SHALL be olive-green (animated) when the SSE connection is open, and gray when disconnected.

#### Scenario: Connected
- **WHEN** SSE EventSource is open
- **THEN** dot is olive-green with a breathing animation

#### Scenario: Disconnected
- **WHEN** SSE connection is lost
- **THEN** dot turns gray

### Requirement: Empty state shown when no session events exist
When session.json is empty or absent, the UI SHALL show a centered empty state with the message "No conversation yet" and a hint to run `npx in-html init-hooks` to set up hook integration. No input box is displayed.

#### Scenario: Empty session
- **WHEN** session.json is `[]` or absent
- **THEN** empty state is displayed with CLI-focused setup instructions and no input area
