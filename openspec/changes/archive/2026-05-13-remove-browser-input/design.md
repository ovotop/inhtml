## Context

The inhtml browser UI has an input box for sending messages to the AI. The current flow: browser textarea → POST /~submit → write pending.txt → AI reads pending.txt. But the AI never reads pending.txt — the flow is broken.

Fixing it properly requires per-tool integration:
- Claude Code: Channel MCP server (~200 lines of MCP boilerplate)
- OpenCode: REST API calls to localhost:4096
- Codex: WebSocket connection to app-server

This is significant complexity for a feature most users don't need. All three CLI tools are terminal-first — users always have the terminal available. The browser is a "second screen" for viewing results.

## Goals / Non-Goals

**Goals:**
- Remove the browser input box and all related code
- Simplify server by removing `/~submit` endpoint
- Remove all dead code (manifest.ts, serveStatus, status.json)
- Fix watcher to monitor the correct data source (session.json)
- Keep the browser as a read-only display (chat stream + artifact cards)

**Non-Goals:**
- Not removing the chat stream or artifact overlay
- Not changing hooks, manifest, or artifact system
- Not removing the SSE live-reload mechanism

## Decisions

### Decision 1: Remove, don't deprecate

Remove the input area entirely rather than hiding it behind a feature flag. The feature was never functional (pending.txt was never read), so there's no backward compatibility concern.

### Decision 2: Keep session.json user_prompt events

The session.json format keeps `user_prompt` events (from hooks). The UI renders them as bubbles. Only the browser-side input is removed — CLI-side user messages still appear in the stream.

### Decision 3: Remove /~submit entirely

No backward compatibility shim. The endpoint wrote to pending.txt which was never read. Removing it cleanly is better than keeping a dead endpoint.

### Decision 4: Remove manifest.ts entirely

The module exports `readManifest()`, `appendEntry()`, `nextId()` but nothing imports them. The server reads manifest.json directly. Delete the file.

### Decision 5: Remove /~status and status.json

The UI no longer has a status indicator. `serveStatus()` serves `status.json` but no consumer exists. Remove the endpoint, the function, and the `status.json` creation in `ensureDirectories()`.

### Decision 6: Fix watcher to monitor session.json

The watcher monitors `manifest.json` but the chat stream reads `session.json`. Currently works by coincidence because `handleHook()` calls `broadcast()` directly. Fix the watcher to monitor `session.json` so file-based changes also trigger SSE.

## Risks / Trade-offs

- [Risk: Users want browser input later] → Mitigation: Can be re-added as a separate change with proper Channel/API integration
- [Risk: /~submit removal breaks external tools] → Mitigation: No known external consumers; endpoint was only used by the browser input box
- [Risk: manifest.ts removal breaks something] → Mitigation: Grep confirms zero imports; server reads manifest.json directly
- [Risk: Watcher change breaks manifest reload] → Mitigation: Hook handler already calls broadcast() on manifest changes; watcher change is additive
