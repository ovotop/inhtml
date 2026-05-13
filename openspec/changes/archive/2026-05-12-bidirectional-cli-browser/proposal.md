## Why

Browser-to-CLI communication is broken: messages sent from the browser input box reach the server (`pending.txt` + `console.log`) but never notify the AI agent. The AI must actively poll to discover browser input. Conversely, CLI-side AI results (new artifacts) already refresh to the browser via SSE, but there's no mechanism to push status updates or key results back to the browser's card list in real-time.

Additionally, when many cards accumulate, the card list compresses cards vertically instead of scrolling, making the preview unusable.

## What Changes

- **Browser → CLI notification**: When a user sends a message from the browser, the server writes to `pending.txt` AND actively notifies the CLI-side AI agent (via file watch on `pending.txt` that the AI can observe, or via a new polling-friendly mechanism).
- **CLI → Browser status push**: Add a `GET /~status` endpoint that the browser can poll or subscribe to for CLI-side status updates (e.g., "AI is thinking...", "Artifact created").
- **Card list scrolling**: Fix the `.cards` container to scroll properly when cards overflow, instead of compressing card height.

## Capabilities

### New Capabilities
- `browser-cli-bridge`: Mechanism for browser messages to reach CLI-side AI agent, and for CLI status to reach the browser.

### Modified Capabilities
(none — no existing main specs)

## Impact

- `src/server.ts` — New endpoints, pending.txt watch
- `src/cli.ts` — File watch integration for pending.txt
- `assets/index.html` — Card list scrolling fix, status polling
- `.opencode/skills/in-html/SKILL.md` — Update skill to check pending.txt
