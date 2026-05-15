## Why

The inhtml browser UI shows only artifact cards — a flat list of outputs with no conversation context. Users can't see what they asked, what the AI replied, or how the artifacts fit together. The input box writes to `pending.txt` but the AI never reliably reads it.

All three target CLI tools (Claude Code, OpenCode, Codex) have hook systems that fire on `UserPromptSubmit`, `Stop`, and `PostToolUse` — the exact lifecycle events needed to capture a full conversation stream. We can use hooks to build a real-time chat view in the browser.

## What Changes

**Chat-style mixed stream** — Replace the card-only list with a unified timeline showing user messages, AI text responses, and artifact cards interleaved. The input box stays but now works through hooks instead of `pending.txt`.

**Hook-based event capture** — A shared hook script that all three tools can invoke. It POSTs conversation events (`user_prompt`, `ai_response`, `artifact_created`) to the inhtml server. Each tool gets its own config format (Claude Code: `settings.json`, OpenCode: plugin, Codex: `config.toml`).

**Server `/~hook` endpoint** — New endpoint that receives hook events, appends them to `.inhtml/session.json`, and broadcasts via SSE. Replaces the `pending.txt` + `status.json` approach.

## Capabilities

### New Capabilities

- `session-hooks`: Hook scripts, server endpoint, and tool-specific configurations for capturing conversation events from Claude Code, OpenCode, and Codex via their native hook systems

### Modified Capabilities

- `ui`: Replace card-only list with chat-style mixed stream (messages + cards), update input box to work with hook-based flow
- `server`: Add `/~hook` POST endpoint, serve session data via GET, SSE broadcast for session events
- `browser-cli-bridge`: Unify message flow through hooks — user input and AI output both captured by hooks, `pending.txt` replaced by hook-driven `/~hook` calls

## Impact

- New files: `assets/hook.sh` (shared hook script), `assets/session.html` (or updated `index.html`)
- Modified files: `src/server.ts` (new endpoints), `assets/index.html` (chat UI)
- Config additions: hook configs for Claude Code, OpenCode plugin, Codex config
- `.inhtml/session.json` — new session event log file
- `.inhtml/pending.txt` — deprecated, replaced by hook flow
- `.inhtml/status.json` — deprecated, replaced by session events
- No breaking changes to manifest or artifact format
