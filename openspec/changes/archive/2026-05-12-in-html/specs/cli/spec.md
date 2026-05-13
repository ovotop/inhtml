## ADDED Requirements

### Requirement: Start command launches server and opens browser
Running `npx in-html` (or `in-html` after global install) SHALL start the HTTP server, create `.in-html/` if absent, and open the browser to the card list UI.

#### Scenario: First run in a project
- **WHEN** user runs `npx in-html` in a directory with no `.in-html/` folder
- **THEN** `.in-html/`, `.in-html/artifacts/`, and `.in-html/manifest.json` are created, the server starts on port 7654, the browser opens to `http://localhost:7654/`, and the terminal prints the URL

#### Scenario: Custom port
- **WHEN** user runs `npx in-html --port 8080`
- **THEN** server binds to port 8080 and browser opens to `http://localhost:8080/`

#### Scenario: Port already in use
- **WHEN** the chosen port is already bound
- **THEN** the process exits with a clear error message suggesting `--port <other>`

#### Scenario: No-open flag
- **WHEN** user runs `npx in-html --no-open`
- **THEN** server starts but browser is NOT opened; URL is printed to terminal

### Requirement: init-skill command places Claude Code skill
`in-html init-skill` SHALL copy the bundled skill file to `.claude/commands/in-html.md` relative to the project root.

#### Scenario: Skill placed successfully
- **WHEN** user runs `npx in-html init-skill` in a project directory
- **THEN** `.claude/commands/in-html.md` is created and terminal confirms the path

#### Scenario: Skill already exists
- **WHEN** `.claude/commands/in-html.md` already exists
- **THEN** the command prints a warning and does NOT overwrite unless `--force` is passed

### Requirement: Project root detection
The CLI SHALL locate the project root by walking up from `cwd` to find `package.json` or `.git`. `.in-html/` is created at the project root, not necessarily at `cwd`.

#### Scenario: Run from subdirectory
- **WHEN** user runs `npx in-html` from `<project>/src/components/`
- **THEN** `.in-html/` is created at `<project>/` (where `package.json` or `.git` lives)

#### Scenario: No project root found
- **WHEN** no `package.json` or `.git` is found in any ancestor directory
- **THEN** `cwd` is used as the project root
