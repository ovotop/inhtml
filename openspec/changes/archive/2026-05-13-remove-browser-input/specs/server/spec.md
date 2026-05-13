## MODIFIED Requirements

### Requirement: POST /~submit accepts browser input
This requirement is REMOVED. The `/~submit` endpoint and related file writes (`pending.txt`, `last-message.txt`) are no longer part of the system.

#### Reason
The browser input box has been removed. The `/~submit` endpoint wrote to `pending.txt` which was never read by the AI. Browser→CLI communication is not supported.

#### Migration
Use CLI input directly. Browser displays conversation events captured by hooks.

### Requirement: chokidar watches manifest.json
The server SHALL use chokidar to watch `.in-html/session.json` (not `manifest.json`), with a 50ms debounce before broadcasting SSE events.

#### Scenario: Session updated by hook
- **WHEN** `.in-html/session.json` is written
- **THEN** all connected `/~events` clients receive `data: r\n\n` within 400ms
