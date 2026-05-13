## 1. Server — Session event endpoints

- [x] 1.1 Add `POST /~hook` handler: parse JSON body, append event to `.in-html/session.json`, broadcast SSE
- [x] 1.2 Add `GET /session.json` handler: serve `.in-html/session.json` with no-cache, return `[]` if absent
- [x] 1.3 Update SSE `/~events` to watch both `manifest.json` and `session.json`
- [x] 1.4 Update `POST /~submit` to also append a `user_prompt` event to session.json (backward compat)

## 2. Hook script

- [x] 2.1 Create `assets/hook.sh`: read JSON from stdin, extract event type, POST to `http://localhost:7654/~hook`
- [x] 2.2 Handle `user_prompt_submit` event: extract user text, POST as `user_prompt`
- [x] 2.3 Handle `stop` event: extract AI summary (from transcript_path or stdin), POST as `ai_response`
- [x] 2.4 Handle `post_tool_use` event: detect Write to `.in-html/artifacts/`, POST as `artifact_created`

## 3. CLI — init-hooks command

- [x] 3.1 Add `in-html init-hooks` command with `--tool` flag (claude / opencode / codex / all)
- [x] 3.2 Claude Code: generate/merge hooks in `.claude/settings.json` for UserPromptSubmit, Stop, PostToolUse
- [x] 3.3 OpenCode: generate plugin config calling hook.sh for chat.message, event, tool.execute.after
- [x] 3.4 Codex: generate/merge `[[hooks]]` in `~/.codex/config.toml` for UserPromptSubmit, Stop, PostToolUse

## 4. UI — Chat-style mixed stream

- [x] 4.1 Replace card list with chat stream container: fetch `/session.json` instead of `/manifest.json`
- [x] 4.2 Render user_prompt events as right-aligned message bubbles
- [x] 4.3 Render ai_response events as left-aligned text blocks
- [x] 4.4 Render artifact events as inline card previews (fetch manifest for metadata)
- [x] 4.5 Update input box to POST to `/~hook` as `user_prompt`, add optimistic rendering (bubble appears immediately)
- [x] 4.6 Add empty state for empty session with `npx in-html init-hooks` hint
- [x] 4.7 Add type badge colors for `prototype` and `editor` types
- [x] 4.8 Auto-scroll to bottom on new events via SSE

## 5. Validation

- [x] 5.1 Start in-html server, run `npx in-html init-hooks --tool claude`, verify `.claude/settings.json` has hooks
- [x] 5.2 Simulate hook events via curl POST to `/~hook`, verify session.json updates and browser shows chat stream
- [x] 5.3 Verify browser input sends user_prompt event and bubble appears in stream
- [x] 5.4 Verify artifact cards still open in overlay when clicked
