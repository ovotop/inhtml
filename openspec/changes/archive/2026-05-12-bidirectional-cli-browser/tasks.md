## 1. Server — New Endpoints & File Watch

- [x] 1.1 Add `GET /~status` endpoint that reads `.in-html/status.json` and returns it as JSON (default: `{ "state": "idle" }`)
- [x] 1.2 Update `handleSubmit` to also write timestamp to `.in-html/last-message.txt`
- [x] 1.3 Ensure `ensureDirectories` creates `.in-html/status.json` with default idle state

## 2. Browser — Status Display & Polling

- [x] 2.1 Add status indicator in the header bar (next to artifact count)
- [x] 2.2 Add `loadStatus()` function that fetches `/~status` and updates the indicator
- [x] 2.3 Poll `/~status` on the same SSE event that triggers manifest refresh
- [x] 2.4 Style status states: idle (gray dot), thinking (animated clay dot), done (olive dot), error (rust dot)

## 3. Card List — Scrolling Fix

- [x] 3.1 Add `min-height: 0` to `.cards` container (flex overflow fix)
- [x] 3.2 Add `flex-shrink: 0` to `.card` elements
- [x] 3.3 Verify scrolling works with many cards (10+)

## 4. Skill — Pending Message Check

- [x] 4.1 Add instruction to SKILL.md: check `.in-html/pending.txt` before responding
- [x] 4.2 Add instruction: write status to `.in-html/status.json` during artifact generation
- [x] 4.3 Sync `assets/skill.md` with updated SKILL.md

## 5. Verify

- [x] 5.1 Test: browser message → server log + pending.txt
- [x] 5.2 Test: AI reads pending.txt and responds
- [x] 5.3 Test: status indicator shows thinking/done states
- [x] 5.4 Test: card list scrolls with 10+ cards
