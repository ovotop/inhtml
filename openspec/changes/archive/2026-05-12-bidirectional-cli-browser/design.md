## Context

The in-html system has a one-way communication gap:
- **CLI → Browser**: Works via SSE (watcher detects manifest change → broadcast → browser refreshes)
- **Browser → CLI**: Broken — `POST /~submit` writes to `pending.txt` and `console.log`, but the AI agent (running in a separate process, e.g., OpenCode) has no notification mechanism

The CLI process (`npx in-html`) and the AI agent are separate processes. They share the filesystem (`.in-html/` directory) but have no direct IPC.

## Goals / Non-Goals

**Goals:**
- Browser messages reach the AI agent without manual polling
- CLI-side status updates (thinking, done, error) visible in the browser
- Card list scrolls properly with many cards
- Minimal new dependencies

**Non-Goals:**
- Real-time bidirectional WebSocket (overkill for this use case)
- Modifying the AI agent's runtime (OpenCode/Claude Code internals)
- Server-side rendering of artifacts

## Decisions

### 1. Browser → CLI: File-based notification via `pending.txt`

**Why**: The filesystem is the only shared resource between the server process and the AI agent process. `pending.txt` already exists. The AI agent can check it at natural interaction points (before responding to the user).

**Mechanism:**
- Server writes to `pending.txt` on `POST /~submit` (already done)
- Server also writes a timestamp to `.in-html/last-message.txt` for quick polling
- AI skill instructs: "Before responding, check `.in-html/pending.txt` for new browser messages"
- Optional: Server can `touch` a marker file that the AI watches

**Alternative considered**: stdin injection — not possible because the AI agent is a separate process with its own stdin.

### 2. CLI → Browser: Poll `/~status` endpoint

**Why**: The browser already polls `/manifest.json` via SSE. Adding a `/~status` endpoint that returns the current CLI state is the simplest extension.

**Mechanism:**
- Server exposes `GET /~status` returning `{ "state": "idle" | "thinking" | "done", "message": "..." }`
- State is stored in a file `.in-html/status.json` that the AI writes
- Browser polls this endpoint on the same SSE event that triggers manifest refresh
- Or: extend SSE to also broadcast status changes

**Alternative considered**: WebSocket — more complex, not needed for one-directional status updates.

### 3. Card list scrolling: CSS fix

**Why**: The `.cards` container has `flex: 1; overflow-y: auto` which should scroll. The issue is likely that cards are being compressed instead of the container scrolling. This might be because `.card` has `flex-shrink: 1` (default) and the container doesn't have a min-height.

**Fix:**
- Add `min-height: 0` to `.cards` (flex overflow trick)
- Add `flex-shrink: 0` to `.card` to prevent compression
- Ensure the card list takes remaining height properly

## Risks / Trade-offs

- **[File-based polling has latency]** → AI checks `pending.txt` at interaction points, not continuously. Acceptable — browser messages are for human→AI communication, not real-time chat.
- **[Status file could be stale]** → If AI crashes, status.json might show "thinking" forever. Mitigation: add timeout or heartbeat.
- **[Many cards performance]** → DOM performance with 50+ cards. Mitigation: virtual scrolling (future enhancement, not in this change).

## Migration Plan

1. Deploy server changes (new endpoints, no breaking changes)
2. Update skill to check `pending.txt`
3. Update `assets/index.html` for scrolling and status display
4. Rebuild and restart
