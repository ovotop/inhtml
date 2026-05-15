#!/bin/bash
# inhtml hook script — captures conversation events from Claude Code / OpenCode / Codex
# Reads JSON from stdin, determines event type, POSTs to inhtml server
#
# Usage: Called automatically by CLI tool hooks
# Manual test: echo '{"tool_name":"test"}' | ./hook.sh

set -euo pipefail

PORT="${IN_HTML_PORT:-7654}"
URL="http://localhost:${PORT}/~hook"

# Read JSON from stdin
INPUT=$(cat)

# Try to extract event name from various formats
# Claude Code: { "hookEventName": "UserPromptSubmit", ... }
# Codex: { "hookEventName": "user_prompt_submit", ... }
# Direct: { "event": "user_prompt", "text": "..." }
EVENT_NAME=$(echo "$INPUT" | jq -r '.hookEventName // .event // empty' 2>/dev/null || echo "")

# Normalize to lowercase
EVENT_NAME=$(echo "$EVENT_NAME" | tr '[:upper:]' '[:lower:]')

case "$EVENT_NAME" in
  userpromptsubmit|user_prompt_submit)
    # Extract user text from various formats
    TEXT=$(echo "$INPUT" | jq -r '
      .tool_input.prompt // .tool_input.text // .prompt // .text // empty
    ' 2>/dev/null || echo "")
    if [ -n "$TEXT" ]; then
      PAYLOAD=$(jq -n --arg text "$TEXT" '{event:"user_prompt", text:$text}')
      curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$PAYLOAD" >/dev/null 2>&1 || true
    fi
    ;;
  stop)
    # Try to extract AI summary from transcript or stdin
    SUMMARY=""
    TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null || echo "")
    if [ -n "$TRANSCRIPT" ] && [ -f "$TRANSCRIPT" ]; then
      # Extract last assistant message from transcript
      SUMMARY=$(jq -r '
        [.[] | select(.role == "assistant") | .content // .text // ""] | last // ""
      ' "$TRANSCRIPT" 2>/dev/null | head -c 500 || echo "")
    fi
    if [ -z "$SUMMARY" ]; then
      SUMMARY=$(echo "$INPUT" | jq -r '.summary // .text // empty' 2>/dev/null || echo "")
    fi
    if [ -n "$SUMMARY" ]; then
      PAYLOAD=$(jq -n --arg text "$SUMMARY" '{event:"ai_response", text:$text}')
      curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$PAYLOAD" >/dev/null 2>&1 || true
    fi
    ;;
  posttooluse|post_tool_use)
    # Check if a Write tool wrote to .inhtml/artifacts/
    TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || echo "")
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null || echo "")
    if echo "$FILE_PATH" | grep -q '\.inhtml/artifacts/.*\.html$'; then
      # Extract artifact ID from filename
      ARTIFACT_ID=$(basename "$FILE_PATH" .html)
      PAYLOAD=$(jq -n --arg id "$ARTIFACT_ID" '{event:"artifact_created", artifactId:$id}')
      curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$PAYLOAD" >/dev/null 2>&1 || true
    fi
    ;;
  *)
    # Unknown event — send as-is if it has meaningful content
    TEXT=$(echo "$INPUT" | jq -r '.text // .summary // empty' 2>/dev/null || echo "")
    if [ -n "$TEXT" ]; then
      PAYLOAD=$(jq -n --arg event "$EVENT_NAME" --arg text "$TEXT" '{event:$event, text:$text}')
      curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$PAYLOAD" >/dev/null 2>&1 || true
    fi
    ;;
esac

exit 0
