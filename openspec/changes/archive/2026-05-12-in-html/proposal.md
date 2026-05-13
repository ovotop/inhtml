## Why

AI assistants produce rich output — diagrams, reports, slide decks, interactive tools — but the only place to see it is a text chat window. `in-html` gives AI a persistent visual screen alongside the CLI: a live card list of every HTML artifact produced in a session, with one click to view it full-screen. It ships as an npm package so any developer can add it to any project with `npx in-html`.

## What Changes

- New npm package `in-html` (TypeScript, published to the npm registry)
- CLI command `npx in-html` starts a live-reload HTTP server and opens a browser companion
- Browser window shows a chronological card list: each card = one user prompt + AI artifact title/type
- Clicking a card opens the artifact full-screen in an iframe overlay with a Download button
- All runtime data (manifest + artifacts) stored in `.in-html/` inside the user's project
- `npx in-html init-skill` places a Claude Code skill at `.claude/commands/in-html.md`
- The skill instructs Claude to write self-contained HTML artifacts + update `.in-html/manifest.json`
- `server.py` and `www/` from the old prototype are removed from the repo

## Capabilities

### New Capabilities

- `cli`: The `in-html` binary — argument parsing, `start` and `init-skill` commands, auto-creates `.in-html/` on first run
- `server`: TypeScript HTTP server — static file serving, SSE live-reload, POST `/~submit` for browser input, watches `.in-html/manifest.json` with chokidar
- `ui`: The card list web app (`index.html` bundled in the package) — cards with prompt + title + type badge, artifact overlay with iframe + download, auto-scroll, live SSE updates
- `skill`: The Claude Code skill file bundled with the package — HTML output conventions, design tokens, manifest update workflow, type taxonomy
- `manifest`: The `.in-html/manifest.json` schema and append protocol — stable contract between skill and server

### Modified Capabilities

<!-- None — this is a new package -->

## Impact

- New package published to npm as `in-html`
- Project directory gains `package.json`, `tsconfig.json`, `src/`, `assets/` (UI + skill)
- Old `server.py`, `start.sh`, `www/` removed
- `.in-html/` added to `.gitignore` template provided by `init`
- The UI mockup built in `www/output.html` becomes `assets/index.html` inside the package
