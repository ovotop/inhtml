# session-hooks

## Purpose

Hook-based integration that captures conversation events from CLI tools (Claude Code, OpenCode, Codex) and forwards them to the inhtml server for display in the browser chat view.

## Requirements

### Requirement: Hook script captures conversation events
The system SHALL provide a shell script (`assets/hook.sh`) that reads JSON from stdin, determines the event type, and POSTs to `http://localhost:7654/~hook`. Supported events: `user_prompt_submit` (user input), `stop` (AI finished), `post_tool_use` with Write tool (artifact created).

#### Scenario: User submits a prompt
- **WHEN** the `UserPromptSubmit` hook fires in any supported CLI tool
- **THEN** the hook script POSTs `{ "event": "user_prompt", "text": "<user input>" }` to `/~hook`

#### Scenario: AI finishes responding
- **WHEN** the `Stop` hook fires
- **THEN** the hook script POSTs `{ "event": "ai_response", "text": "<summary>" }` to `/~hook`

#### Scenario: AI creates an artifact file
- **WHEN** the `PostToolUse` hook fires for a Write tool call targeting `.inhtml/artifacts/`
- **THEN** the hook script POSTs `{ "event": "artifact_created", "artifactId": "<id>" }` to `/~hook`

### Requirement: Claude Code hook configuration
The system SHALL generate a `.claude/settings.json` hooks block (or merge into existing) that registers the hook script for `UserPromptSubmit`, `Stop`, and `PostToolUse` events.

#### Scenario: User runs init-hooks for Claude Code
- **WHEN** user runs `npx inhtml init-hooks --tool claude`
- **THEN** `.claude/settings.json` is created/updated with hooks calling `assets/hook.sh` for the three events

### Requirement: OpenCode plugin hook configuration
The system SHALL provide an OpenCode plugin that registers `chat.message`, `event`, and `tool.execute.after` hooks calling the hook script.

#### Scenario: User runs init-hooks for OpenCode
- **WHEN** user runs `npx inhtml init-hooks --tool opencode`
- **THEN** the OpenCode plugin configuration is created/updated with hooks for the three events

### Requirement: Codex hook configuration
The system SHALL generate `~/.codex/config.toml` hook entries (or merge into existing) that register the hook script for `UserPromptSubmit`, `Stop`, and `PostToolUse` events.

#### Scenario: User runs init-hooks for Codex
- **WHEN** user runs `npx inhtml init-hooks --tool codex`
- **THEN** `~/.codex/config.toml` is created/updated with `[[hooks]]` entries calling the hook script

### Requirement: init-hooks CLI command
The CLI SHALL provide an `inhtml init-hooks` command with `--tool` flag accepting `claude`, `opencode`, `codex`, or `all`. It copies the hook script to the project and configures the specified tool(s).

#### Scenario: Init hooks for all tools
- **WHEN** user runs `npx inhtml init-hooks --tool all`
- **THEN** the hook script is placed at `.inhtml/hooks/hook.sh` and all three tool configs are created/updated
