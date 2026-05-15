## ADDED Requirements

### Requirement: Card list renders manifest entries oldest-to-newest
The UI SHALL fetch `/manifest.json` on load and render one card per entry, ordered oldest (top) to newest (bottom), and auto-scroll to the bottom on initial load and when new cards are added.

#### Scenario: Cards displayed in order
- **WHEN** manifest contains entries with timestamps 09:14, 09:31, 10:02
- **THEN** cards appear top-to-bottom in that order

#### Scenario: New card appended
- **WHEN** a new entry is added to the manifest and the SSE event fires
- **THEN** a new card appears at the bottom and the list scrolls to show it

### Requirement: Each card shows prompt and artifact metadata
Each card SHALL display the user's prompt (italic, gray, truncated to one line) above the artifact title, type badge, and timestamp.

#### Scenario: Card content
- **WHEN** a card is rendered for an entry with prompt "weekly status report", title "Birchline — Week 11", type "report", timestamp "10:45"
- **THEN** card shows the prompt text in gray italic, the title in dark weight, a blue "report" badge, and "10:45"

### Requirement: Type badges use distinct colors per type
The UI SHALL render type badges with distinct background/text color pairs for: `report`, `slide`, `diagram`, `flowchart`, `exploration`, `review`, `explainer`, `plan`, `tool`.

#### Scenario: Correct badge color applied
- **WHEN** a card has type "diagram"
- **THEN** its badge uses the green-toned color scheme (background #E8EDE0, color #4A6030)

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

### Requirement: Input box submits prompt to server
The textarea at the bottom SHALL POST its content to `/~submit` on Enter (without Shift), then clear. Shift+Enter inserts a newline. The textarea grows with content up to 160px.

#### Scenario: Enter submits
- **WHEN** user types text and presses Enter
- **THEN** text is POSTed to `/~submit`, textarea clears

#### Scenario: Shift+Enter inserts newline
- **WHEN** user presses Shift+Enter
- **THEN** a newline is inserted, no submission occurs

### Requirement: Live dot indicates SSE connection status
A small dot in the header SHALL be olive-green (animated) when the SSE connection is open, and gray when disconnected.

#### Scenario: Connected
- **WHEN** SSE EventSource is open
- **THEN** dot is olive-green with a breathing animation

#### Scenario: Disconnected
- **WHEN** SSE connection is lost
- **THEN** dot turns gray

### Requirement: Empty state shown when no artifacts exist
When the manifest is empty, the UI SHALL show a centered empty state with the message "No artifacts yet" and a hint to run `/inhtml` in the CLI.

#### Scenario: Empty manifest
- **WHEN** manifest.json is `[]`
- **THEN** empty state is displayed instead of a card list
