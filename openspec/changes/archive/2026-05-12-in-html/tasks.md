## 1. Project scaffold

- [x] 1.1 Delete `server.py`, `start.sh`, and `www/` from the repo
- [x] 1.2 Create `package.json` with name `in-html`, bin `{ "in-html": "./dist/cli.js" }`, and deps: `chokidar`, `open`; devDeps: `typescript`, `tsup`, `@types/node`
- [x] 1.3 Create `tsconfig.json` targeting Node 18, `moduleResolution: bundler`, `outDir: dist`
- [x] 1.4 Create `src/` and `assets/` directories
- [x] 1.5 Add `.gitignore` entries: `dist/`, `node_modules/`, `.in-html/`
- [x] 1.6 Run `npm install` to generate `package-lock.json`

## 2. Manifest schema

- [x] 2.1 Create `src/manifest.ts` — TypeScript types for `ManifestEntry` and `Manifest`
- [x] 2.2 Export helpers: `readManifest(dir)`, `appendEntry(dir, entry)`, `nextId(manifest)`

## 3. Project root detection

- [x] 3.1 Create `src/root.ts` — walk up from `cwd` looking for `package.json` or `.git`, return the found dir or `cwd`
- [x] 3.2 Export `findProjectRoot(): string`

## 4. HTTP server

- [x] 4.1 Create `src/server.ts` — `ThreadingHTTPServer` equivalent using Node `http.createServer`
- [x] 4.2 Implement GET `/` → serve `assets/index.html` with SSE script injected before `</body>`, `Cache-Control: no-cache`
- [x] 4.3 Implement GET `/manifest.json` → serve `.in-html/manifest.json` with `Cache-Control: no-cache`, fallback to `[]`
- [x] 4.4 Implement GET `/artifacts/:id.html` → serve `.in-html/artifacts/:id.html` as static
- [x] 4.5 Implement GET `/~events` → SSE endpoint; hold connection, send `data: r\n\n` on broadcast, `: ping\n\n` every 20s
- [x] 4.6 Implement POST `/~submit` → write `.in-html/pending.txt`, print `[html →] <text>` to stdout, respond `{"ok":true}`
- [x] 4.7 Export `createServer(root: string, port: number): http.Server`

## 5. File watcher

- [x] 5.1 Create `src/watcher.ts` — watch `.in-html/manifest.json` with chokidar, 50ms debounce
- [x] 5.2 On change, call a provided `broadcast()` callback
- [x] 5.3 Export `startWatcher(root: string, broadcast: () => void): FSWatcher`

## 6. UI asset

- [x] 6.1 Move `www/output.html` (the card list mockup) to `assets/index.html`
- [x] 6.2 Remove the static sample cards — make the JS fetch `/manifest.json` on load and render dynamically
- [x] 6.3 Connect SSE: `es.onmessage = () => loadManifest()` (already in mockup's `window._loadManifest`)
- [x] 6.4 Implement `submitPrompt()` → POST to `/~submit`
- [x] 6.5 Verify empty state renders when manifest is `[]`
- [x] 6.6 Verify card click opens overlay with correct iframe src and download filename

## 7. Skill asset

- [x] 7.1 Create `assets/skill.md` — the Claude Code skill for `/in-html`
- [x] 7.2 Skill content: decision table (HTML vs plain text), design token palette, manifest update protocol (read → compute next id → write artifact → append manifest entry), type taxonomy, example library references

## 8. CLI entry point

- [x] 8.1 Create `src/cli.ts` — parse argv: default = start, `init-skill` subcommand, `--port`, `--no-open`, `--force`
- [x] 8.2 Default command: call `findProjectRoot()`, ensure `.in-html/` + `artifacts/` exist, initialize manifest if absent, start server + watcher, call `open(url)` unless `--no-open`, print URL
- [x] 8.3 `init-skill` command: copy `assets/skill.md` to `<root>/.claude/commands/in-html.md`, create parent dirs, respect `--force`
- [x] 8.4 Add shebang `#!/usr/bin/env node` to compiled output via tsup banner option

## 9. Build

- [x] 9.1 Configure `tsup.config.ts`: entry `src/cli.ts`, format `cjs`, target `node18`, bundle assets as inline strings using `fs.readFileSync` at build time
- [x] 9.2 Add `npm run build` script running `tsup`
- [x] 9.3 Verify `dist/cli.js` is executable and `npx .` works locally

## 10. Validation

- [x] 10.1 Run `npx .` in a temp directory — verify `.in-html/` created, server starts, browser opens
- [x] 10.2 Manually write a test entry to `manifest.json` — verify browser card list updates without page reload
- [x] 10.3 Click a card — verify overlay opens with iframe
- [x] 10.4 Click Download — verify file downloads with slugified name
- [x] 10.5 Submit from browser input — verify `pending.txt` written and terminal prints `[html →]`
- [x] 10.6 Run `npx . init-skill` — verify `.claude/commands/in-html.md` created
- [x] 10.7 Invoke `/in-html` in Claude Code, ask for a status report — verify artifact written to `.in-html/artifacts/` and card appears in browser

## 11. Publish

- [x] 11.1 Add `README.md` with install, usage, and workflow sections
- [x] 11.2 Set `package.json` `files` field to include `dist/` and `assets/`
- [x] 11.3 `npm publish --dry-run` and verify package contents
- [x] 11.4 `npm publish` to publish `in-html@0.1.0`
