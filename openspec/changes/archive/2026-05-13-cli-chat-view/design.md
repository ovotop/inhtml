## Context

The inhtml system currently shows artifact cards in a flat list. Users interact via a textarea that POSTs to `/~submit`, which writes to `pending.txt`. The AI is supposed to read `pending.txt` but the skill has no instruction to do so — the flow is broken.

All three target CLI tools have hook systems with identical event names:
- **Claude Code**: Hooks in `.claude/settings.json`, types: command, HTTP, prompt, agent
- **OpenCode**: Plugin hooks via `@opencode-ai/plugin`, types: `chat.message`, `tool.execute.after`, `event`
- **Codex**: Hooks in `~/.codex/config.toml`, types: command, prompt, agent

The key events for conversation capture are:
- `UserPromptSubmit` / `chat.message` → user sends a message
- `Stop` / `event` → AI finishes responding
- `PostToolUse` / `tool.execute.after` → AI uses a tool (e.g., Write → artifact created)

## Goals / Non-Goals

**Goals:**
- Chat-style UI showing user messages, AI text, and artifact cards in one timeline
- Single hook script works for all three CLI tools
- Real-time updates via SSE
- Browser input still works (now via hooks instead of `pending.txt`)
- `inhtml init-hooks` command to set up hook configs

**Non-Goals:**
- Not capturing full AI conversation text (only summaries and events)
- Not replacing the manifest/artifact system — artifacts still go to manifest
- Not supporting streaming token-by-token AI output
- Not modifying the CLI tools themselves — only configuration

## Decisions

### Decision 1: Session event log as single source of truth

All conversation events go to `.inhtml/session.json` — an append-only array of events. Each event has `{ type, role, text?, artifactId?, timestamp }`. The UI reads this file (via SSE-triggered refresh) instead of mixing manifest and pending.txt.

**Alternative considered**: Extend manifest.json with message entries. Rejected — manifest is for artifacts, mixing in messages dilutes its purpose.

### Decision 2: Shared hook script, per-tool config

One `assets/hook.sh` script handles all events. It reads the event type from stdin (JSON) and POSTs to `http://localhost:7654/~hook`. Each tool gets its own config file that calls this script:

- Claude Code: `.claude/settings.json` with `hooks` block
- OpenCode: Plugin that calls the hook script on events
- Codex: `~/.codex/config.toml` with `[[hooks]]` entries

**Alternative considered**: Per-tool native integrations. Rejected — too much maintenance; one script is simpler.

### Decision 3: Hook script uses HTTP, not file writes

The hook script POSTs to the server rather than writing session.json directly. This avoids file contention (multiple hooks writing simultaneously) and lets the server validate, deduplicate, and broadcast.

**Alternative considered**: Hook script writes directly to session.json. Rejected — race conditions with multiple hooks firing concurrently.

### Decision 4: Chat view replaces card list, not parallel

The chat-style mixed stream IS the main view. There's no separate "card list" tab. Artifact cards appear inline in the stream. This keeps the UX simple — one view, one input.

**Alternative considered**: Tabbed view (Chat | Cards). Rejected — adds complexity, and the chat view already shows cards.

### Decision 5: AI text capture via Stop hook

The `Stop` event includes the AI's response text (as `transcript_path` in Claude Code, or the last message in OpenCode/Codex). The hook script extracts a summary (first 200 chars or a structured snippet) and sends it as an `ai_response` event. We don't capture full conversation text — just enough for the chat view.

**Alternative considered**: Read the full transcript file. Rejected — too large, and format varies per tool.

## Risks / Trade-offs

- [Risk: Hook config differs between tool versions] → Mitigation: Document tested versions; hook script is simple enough to adapt
- [Risk: AI response summary is too brief] → Mitigation: Make summary length configurable; include artifact references
- [Risk: Session.json grows unbounded] → Mitigation: Server rotates after N events or on session start
- [Risk: Port 7654 not available when hook fires] → Mitigation: Hook script fails silently; session events are best-effort
