## Context

A Python prototype (`server.py`) exists but was never intended for distribution. The goal is a proper npm package with a TypeScript codebase, zero-config UX, and a stable manifest contract that the bundled Claude Code skill depends on.

The UI design is complete — built and validated as `www/output.html` using the html-effectiveness example library's design tokens. It becomes `assets/index.html` inside the package.

## Goals / Non-Goals

**Goals:**
- Zero-config: `npx in-html` in any directory just works
- TypeScript source compiled to a single distributable with `tsup`
- UI served from the package itself (not copied to user's project)
- Stable `manifest.json` schema locked at v0.1
- Cross-platform: macOS, Linux, Windows (WSL)
- `init-skill` command places the Claude Code skill in the user's project

**Non-Goals:**
- No authentication, no cloud sync, no backend database
- No React/Vue/Svelte — the UI is plain HTML+CSS+JS, bundled as an asset string
- No WebSocket (SSE is sufficient for one-way server→browser push)
- No Windows native browser automation (WSL-only for now)
- No artifact editing or deletion in v0.1

## Decisions

### Decision 1: TypeScript + tsup → single `dist/cli.js`

`tsup` bundles everything (server, watcher, UI HTML string, skill markdown) into one file. This means `npx in-html` downloads and runs in seconds with no secondary installs.

**Alternative**: esbuild directly. Rejected — tsup is a thin, well-maintained wrapper with better defaults for CLI tools.

### Decision 2: UI served from package, not copied to user project

`assets/index.html` is read at runtime from the package directory (`__dirname`). The user's `.in-html/` contains only data (manifest, artifacts, pending.txt). Updating the package updates the UI automatically.

**Alternative**: Copy `index.html` to `.in-html/` on init. Rejected — stale UI copies, harder upgrades.

### Decision 3: chokidar for file watching

`chokidar` wraps `fs.watch` with reliable cross-platform behaviour (Linux inotify, macOS FSEvents, Windows ReadDirectoryChangesW). Native `fs.watch` misses events on Linux in some configurations.

**Dependency footprint**: chokidar + its deps add ~300KB to the install. Acceptable for a dev tool.

### Decision 4: `.in-html/` at project root, found by walking up

On startup, walk up from `cwd` looking for `package.json` or `.git`. Use that directory as the project root. Fall back to `cwd` if neither found. This mirrors how git and npm resolve the project root.

**Alternative**: Always use `cwd`. Rejected — running from a subdirectory (e.g., `src/`) would scatter `.in-html/` inside source trees.

### Decision 5: Manifest is an append-only JSON array

```json
[
  {
    "id": "0001",
    "title": "Birchline — Engineering Status — Week 11",
    "type": "report",
    "prompt": "show me weekly engineering status",
    "timestamp": "2026-05-12T10:23:00Z"
  }
]
```

ID is zero-padded 4-digit sequential (`String(items.length + 1).padStart(4, '0')`). The skill reads this to determine the next ID and appends a new entry after writing the artifact. The server watches this file and broadcasts an SSE event on change.

**Why not a database or NDJSON?** Plain JSON array is the simplest format Claude can reliably read and write with the Write tool. The array never grows large enough to make parsing expensive.

### Decision 6: Browser opened with `open` package

The `open` package handles cross-platform browser launching (respects `$BROWSER`, falls back to system default). Replaces the `google-chrome --window-position` approach from the prototype — too brittle across platforms.

### Decision 7: POST /~submit writes to `.in-html/pending.txt` + prints to terminal

When the user submits from the browser, the server writes the text to `pending.txt` and prints it clearly to the terminal (`[html →] <text>`). The terminal user (or a Claude hook) can read and act on it. No attempt to inject into Claude's stdin — out of scope for v0.1.

## Risks / Trade-offs

- [Risk: chokidar misses rapid successive writes] → Mitigation: 50ms debounce on the watcher before broadcasting SSE
- [Risk: manifest.json written by Claude and read by server concurrently] → Mitigation: server only reads on mtime change; JSON parse errors are caught and ignored (no crash)
- [Risk: port 7654 already in use] → Mitigation: `--port` flag; error message suggests `--port` if bind fails
- [Risk: `open` package doesn't work in headless/SSH environments] → Mitigation: `--no-open` flag; always print the URL to terminal regardless
- [Risk: Windows path separators in manifest IDs] → Mitigation: IDs are numeric strings only; no path separators involved
