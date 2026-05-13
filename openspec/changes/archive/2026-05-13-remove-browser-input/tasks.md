## 1. UI — Remove input area

- [x] 1.1 Remove `<div class="input-area">` block from `index.html` (textarea, send button, hint)
- [x] 1.2 Remove `submitPrompt()` function from JS
- [x] 1.3 Remove textarea event listeners (input resize, Enter key)
- [x] 1.4 Remove input-related CSS (`.input-area`, `.input-row`, `textarea`, `.send-btn`, `.input-hint`)
- [x] 1.5 Update empty state text: remove "or type a message below to start", change to CLI-focused

## 2. Server — Remove dead endpoints

- [x] 2.1 Remove `handleSubmit` function and `POST /~submit` route from `server.ts`
- [x] 2.2 Remove `serveStatus` function and `GET /~status` route from `server.ts`
- [x] 2.3 Remove unused imports (`appendFileSync`, `extname`)

## 3. Dead code cleanup

- [x] 3.1 Delete `src/manifest.ts` (never imported)
- [x] 3.2 Remove `status.json` creation from `ensureDirectories()` in `cli.ts`
- [x] 3.3 Fix SSE script in `server.ts`: remove `_loadStatus` call (function doesn't exist)
- [x] 3.4 Fix watcher to monitor `session.json` instead of `manifest.json`

## 4. Spec cleanup

- [x] 4.1 Update `browser-cli-bridge` spec to remove `/~submit` requirement

## 5. Validation

- [x] 5.1 Build succeeds
- [x] 5.2 Browser shows chat stream without input box
- [x] 5.3 `/~hook` endpoint still works for hook events
- [x] 5.4 `/~submit` returns 404
- [x] 5.5 `/~status` returns 404
- [x] 5.6 Watcher triggers SSE on session.json changes
