# inhtml

[中文版](README.zh-CN.md)

Give AI a screen. Rich HTML output from CLI conversations.

## Installation

```bash
npm install -g @ovotop/inhtml
```

Or run directly with npx (no installation needed):

```bash
npx @ovotop/inhtml init
```

## Usage

### Initialize your project

```bash
cd your-project
inhtml init              # If installed globally
npx @ovotop/inhtml init  # If using npx
```

This automatically:
- Creates `.inhtml/` runtime directory
- Installs AI tool hooks (Claude Code / OpenCode / Codex)
- Installs Claude Code skill (`.claude/commands/inhtml.md`)

### Start talking to AI

After initialization, just talk to AI in your CLI. The AI will automatically start the server and generate HTML artifacts.

```
You: Create an architecture diagram
AI:  [Auto-starts inhtml server]
     [Generates HTML artifact]
     [Browser opens, card appears]
```

### CLI Options

```bash
npx @ovotop/inhtml              # Start server (port 7654)
npx @ovotop/inhtml --port 8080  # Custom port
npx @ovotop/inhtml --no-open    # Don't open browser
npx @ovotop/inhtml init         # Initialize project
npx @ovotop/inhtml init --force # Overwrite existing config
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Environment                        │
├─────────────────────────────────────────────────────────────┤
│  CLI Terminal          ┌──────────┐          Browser         │
│  (npx @ovotop/inhtml)    ────▶│  Server  │────▶  localhost:7654     │
│                        └──────────┘                          │
├─────────────────────────────────────────────────────────────┤
│                     inhtml npm package                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  cli.ts  │  │server.ts │  │watcher.ts│  │  root.ts │    │
│  │  entry   │  │HTTP · SSE│  │ chokidar │  │find root │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    Runtime Data (.inhtml/)                   │
│  session.json · manifest.json · artifacts/ · live.json       │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Module | File | Responsibility |
|--------|------|----------------|
| CLI | `src/cli.ts` | Argument parsing, command dispatch |
| Server | `src/server.ts` | HTTP routes, SSE stream, hook handler |
| Watcher | `src/watcher.ts` | File monitoring, change broadcast |
| Root | `src/root.ts` | Find project root directory |
| UI | `assets/index.html` | Browser interface |
| Skill | `assets/skill.md` | AI instructions (includes server startup) |
| Hook | `assets/hook.sh` | CLI tool integration |
| Plugin | `assets/opencode-plugin.ts` | OpenCode integration |

## How It Works

### Data Flow

```
User ──▶ CLI ──▶ Server ──▶ Browser
                │
                ├── GET  /           → index.html
                ├── GET  /session.json → chat history
                ├── GET  /manifest.json → artifact registry
                ├── GET  /~events    → SSE stream
                ├── GET  /artifacts/:id → HTML files
                └── POST /~hook      ← AI tool events
```

### Workflow

1. User runs `npx @ovotop/inhtml init` in project directory
2. User talks to AI in CLI
3. AI detects inhtml skill, auto-starts server
4. AI generates HTML artifacts → writes to `.inhtml/artifacts/`
5. AI sends hook event → server updates `session.json`
6. Watcher detects change → SSE broadcast to browser
7. Browser renders cards with previews
8. Click card to view full-screen

### Hook Integration

AI tools send events to the server via `POST /~hook`:

```json
{"event": "user_prompt", "text": "Create a flowchart"}
{"event": "ai_response", "text": "Flowchart created successfully."}
{"event": "artifact_created", "artifactId": "0001"}
```

## Directory Structure

```
your-project/
  .inhtml/               ← Runtime data (add to .gitignore)
    session.json          ← Chat history
    manifest.json         ← Artifact registry
    live.json             ← Real-time AI output
    artifacts/
      0001.html
      0002.html
    hooks/
      hook.sh             ← Hook script
  .claude/
    commands/
      inhtml.md          ← Claude Code skill (auto-starts server)
  .opencode/
    plugins/
      inhtml-sync.ts     ← OpenCode plugin
```

## Development

```bash
git clone <repo>
cd inhtml
npm install
npm run build    # Build
npm run dev      # Watch mode
```

### Project Structure

```
inhtml/
  src/
    cli.ts           # Entry point, argument parsing
    server.ts        # HTTP server, SSE, routes
    watcher.ts       # File change monitoring
    root.ts          # Project root detection
  assets/
    index.html       # Browser UI
    skill.md         # AI skill definition (with server startup logic)
    hook.sh          # Hook script
    opencode-plugin.ts # OpenCode plugin
  dist/              # Build output
```

### Key Technologies

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Build**: tsup
- **File Watch**: chokidar
- **Real-time**: SSE (Server-Sent Events)

## License

MIT
