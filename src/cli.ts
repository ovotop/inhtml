import { join, resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { findProjectRoot } from './root';
import { createAppServer, broadcast } from './server';
import { startWatcher } from './watcher';
import { homedir } from 'os';

const DEFAULT_PORT = 7654;

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const result: {
    command: string;
    port: number;
    open: boolean;
    force: boolean;
    tool: string;
  } = {
    command: 'start',
    port: DEFAULT_PORT,
    open: true,
    force: false,
    tool: 'all'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'init') {
      result.command = 'init';
    } else if (arg === 'init-skill') {
      result.command = 'init-skill';
    } else if (arg === 'init-hooks') {
      result.command = 'init-hooks';
    } else if (arg === '--port' && i + 1 < args.length) {
      result.port = parseInt(args[++i], 10);
    } else if (arg === '--no-open') {
      result.open = false;
    } else if (arg === '--force') {
      result.force = true;
    } else if (arg === '--tool' && i + 1 < args.length) {
      result.tool = args[++i];
    }
  }

  return result;
}

function ensureDirectories(root: string) {
  const inHtmlDir = join(root, '.inhtml');
  const artifactsDir = join(inHtmlDir, 'artifacts');

  if (!existsSync(inHtmlDir)) {
    mkdirSync(inHtmlDir, { recursive: true });
  }
  if (!existsSync(artifactsDir)) {
    mkdirSync(artifactsDir, { recursive: true });
  }

  const manifestPath = join(inHtmlDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    writeFileSync(manifestPath, '[]');
  }
}

function initSkill(root: string, force: boolean) {
  const targetDir = join(root, '.claude', 'commands');
  const targetPath = join(targetDir, 'inhtml.md');
  const sourcePath = join(__dirname, '..', 'assets', 'skill.md');

  if (existsSync(targetPath) && !force) {
    console.log('Skill file already exists. Use --force to overwrite.');
    process.exit(1);
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  copyFileSync(sourcePath, targetPath);
  console.log('✓ Skill file created at .claude/commands/inhtml.md');
}

function initHooks(root: string, tool: string, force: boolean) {
  const hooksDir = join(root, '.inhtml', 'hooks');
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }

  const hookSource = join(__dirname, '..', 'assets', 'hook.sh');
  const hookTarget = join(hooksDir, 'hook.sh');
  copyFileSync(hookSource, hookTarget);
  console.log('✓ Hook script placed at .inhtml/hooks/hook.sh');

  const tools = tool === 'all' ? ['claude', 'opencode', 'codex'] : [tool];

  for (const t of tools) {
    switch (t) {
      case 'claude':
        initClaudeHooks(root, hookTarget, force);
        break;
      case 'opencode':
        initOpenCodeHooks(root, hookTarget, force);
        break;
      case 'codex':
        initCodexHooks(root, hookTarget, force);
        break;
      default:
        console.log(`  Unknown tool: ${t}. Supported: claude, opencode, codex, all`);
    }
  }

  console.log('\nDone! Restart your CLI tool to activate hooks.');
}

function initClaudeHooks(root: string, hookPath: string, force: boolean) {
  const settingsPath = join(root, '.claude', 'settings.json');
  let settings: any = {};

  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      settings = {};
    }
  }

  if (settings.hooks && !force) {
    console.log('  Claude Code: hooks already exist in .claude/settings.json. Use --force to overwrite.');
    return;
  }

  settings.hooks = {
    UserPromptSubmit: [{
      hooks: [{
        type: 'command',
        command: hookPath
      }]
    }],
    Stop: [{
      hooks: [{
        type: 'command',
        command: hookPath
      }]
    }],
    PostToolUse: [{
      matcher: 'Write',
      hooks: [{
        type: 'command',
        command: hookPath
      }]
    }]
  };

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  console.log('  ✓ Claude Code: hooks added to .claude/settings.json');
}

function initOpenCodeHooks(root: string, hookPath: string, force: boolean) {
  const pluginsDir = join(root, '.opencode', 'plugins');
  const targetPath = join(pluginsDir, 'inhtml-sync.ts');
  const sourcePath = join(__dirname, '..', 'assets', 'opencode-plugin.ts');

  if (existsSync(targetPath) && !force) {
    console.log('  OpenCode: plugin already exists at .opencode/plugins/inhtml-sync.ts. Use --force to overwrite.');
    return;
  }

  if (!existsSync(pluginsDir)) {
    mkdirSync(pluginsDir, { recursive: true });
  }

  copyFileSync(sourcePath, targetPath);
  console.log('  ✓ OpenCode: plugin installed at .opencode/plugins/inhtml-sync.ts');
}

function initCodexHooks(root: string, hookPath: string, force: boolean) {
  const codexConfigPath = join(homedir(), '.codex', 'config.toml');

  if (!existsSync(codexConfigPath)) {
    console.log(`  Codex: config not found at ${codexConfigPath}. Create it manually.`);
    console.log(`  Add [[hooks]] entries for UserPromptSubmit, Stop, PostToolUse.`);
    console.log(`  Hook command: ${hookPath}`);
    return;
  }

  let config = readFileSync(codexConfigPath, 'utf-8');

  if (config.includes('hook.sh') && !force) {
    console.log('  Codex: hooks already reference hook.sh. Use --force to overwrite.');
    return;
  }

  const hooksBlock = `
[[hooks]]
event = "UserPromptSubmit"
command = "${hookPath}"

[[hooks]]
event = "Stop"
command = "${hookPath}"

[[hooks]]
event = "PostToolUse"
matcher = "Write"
command = "${hookPath}"
`;

  config += hooksBlock;
  writeFileSync(codexConfigPath, config);
  console.log('  ✓ Codex: hooks appended to ~/.codex/config.toml');
}

function startServer(root: string, port: number, open: boolean) {
  ensureDirectories(root);

  const server = createAppServer(root, port);
  const watcher = startWatcher(root, broadcast);

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`✓ inhtml server running at ${url}`);
    console.log(`  Project root: ${root}`);

    if (open) {
      import('open').then(({ default: openBrowser }) => {
        openBrowser(url);
      }).catch(() => {
        console.log('  Could not open browser automatically. Open the URL manually.');
      });
    }
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Error: Port ${port} is already in use.`);
      console.error(`Try: npx inhtml --port ${port + 1}`);
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    watcher.close();
    server.close();
    process.exit(0);
  });
}

const args = parseArgs(process.argv);
const root = findProjectRoot();

if (args.command === 'init') {
  console.log('Initializing inhtml in', root);
  ensureDirectories(root);
  initSkill(root, args.force);
  initHooks(root, 'all', args.force);
  console.log('\n✓ Initialization complete!');
  console.log('  Start talking to AI in your CLI.');
  console.log('  AI will auto-start the server when needed.');
} else if (args.command === 'init-skill') {
  initSkill(root, args.force);
} else if (args.command === 'init-hooks') {
  initHooks(root, args.tool, args.force);
} else {
  startServer(root, args.port, args.open);
}
