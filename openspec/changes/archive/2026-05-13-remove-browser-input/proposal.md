## Why

The in-html browser UI has an input box that POSTs to `/~submit`, which writes to `pending.txt`. But the AI never reads `pending.txt` — the browser→CLI flow is broken by design. Fixing it properly requires Channel MCP servers (Claude Code), REST API integration (OpenCode), or WebSocket connections (Codex) — significant complexity for a feature that most users don't need (CLI is the primary input for all three tools).

Removing the input box eliminates the broken flow, removes ~40% of the server code, and makes the architecture purely one-directional: CLI → hooks → server → SSE → browser.

Additionally, investigation reveals several pieces of dead code and a watcher bug that should be cleaned up in the same pass.

## What Changes

- Remove the textarea and Send button from `index.html`
- Remove `submitPrompt()` JS function
- Remove `POST /~submit` handler from `server.ts`
- Remove `pending.txt` and `last-message.txt` writes
- Update empty state text to reference CLI input only
- Remove input-related CSS styles
- Remove dead `manifest.ts` module (never imported)
- Remove dead `serveStatus` + `/~status` endpoint (UI no longer uses it)
- Remove dead `status.json` creation from `ensureDirectories`
- Fix SSE script to remove `_loadStatus` call (function doesn't exist)
- Fix watcher to monitor `session.json` instead of `manifest.json`

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ui`: Remove input area, update empty state, fix SSE script
- `server`: Remove `/~submit`, `/~status` endpoints; remove dead code
- `browser-cli-bridge`: Remove `/~submit` requirement; fix watcher to monitor session.json

## Impact

- `assets/index.html` — input area removed, SSE script fixed
- `src/server.ts` — `/~submit` and `/~status` handlers removed
- `src/manifest.ts` — deleted entirely
- `src/watcher.ts` — monitors `session.json` instead of `manifest.json`
- `src/cli.ts` — removes `status.json` creation
- `.in-html/pending.txt` — no longer written
- `.in-html/last-message.txt` — no longer written
- `.in-html/status.json` — no longer created
