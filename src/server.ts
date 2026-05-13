import { createServer as httpCreateServer, IncomingMessage, ServerResponse, Server } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ASSETS_DIR = join(__dirname, '..', 'assets');

export function createAppServer(root: string, port: number): Server {
  const server = httpCreateServer((req: IncomingMessage, res: ServerResponse) => {
    const rawUrl = req.url || '/';
    const url = rawUrl.split('?')[0];

    if (url === '/') {
      serveIndex(req, res, root);
    } else if (url === '/manifest.json') {
      serveManifest(req, res, root);
    } else if (url === '/session.json') {
      serveSession(req, res, root);
    } else if (url.startsWith('/artifacts/')) {
      serveArtifact(req, res, root, url);
    } else if (url === '/~events') {
      handleSSE(req, res);
    } else if (url === '/~live') {
      serveLive(req, res, root);
    } else if (url === '/~hook' && req.method === 'POST') {
      handleHook(req, res, root);
    } else if (url === '/favicon.ico') {
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return server;
}

function serveIndex(req: IncomingMessage, res: ServerResponse, root: string) {
  const indexPath = join(ASSETS_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    res.writeHead(404);
    res.end('index.html not found');
    return;
  }

  let html = readFileSync(indexPath, 'utf-8');

  const sseScript = `
<script>
(function() {
  const es = new EventSource('/~events');
  es.onmessage = function() {
    // Check for live updates first
    fetch('/~live?t=' + Date.now()).then(function(r) { return r.json(); }).then(function(live) {
      if (live && live.text) {
        if (window._showLive) window._showLive(live.text);
      } else {
        if (window._clearLive) window._clearLive();
      }
    }).catch(function() {});
    // Then reload session (for finalized messages)
    if (window._loadSession) window._loadSession();
    if (window._loadManifest) window._loadManifest();
  };
  es.onerror = function() {
    setTimeout(() => { es.close(); }, 1000);
  };
})();
</script>`;

  html = html.replace('</body>', sseScript + '\n</body>');

  res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
  res.end(html);
}

function serveManifest(req: IncomingMessage, res: ServerResponse, root: string) {
  const manifestPath = join(root, '.inhtml', 'manifest.json');
  if (!existsSync(manifestPath)) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end('[]');
    return;
  }

  try {
    const content = readFileSync(manifestPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(content);
  } catch {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end('[]');
  }
}

function serveSession(req: IncomingMessage, res: ServerResponse, root: string) {
  const sessionPath = join(root, '.inhtml', 'session.json');
  if (!existsSync(sessionPath)) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end('[]');
    return;
  }

  try {
    const content = readFileSync(sessionPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(content);
  } catch {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end('[]');
  }
}

function serveLive(req: IncomingMessage, res: ServerResponse, root: string) {
  const livePath = join(root, '.inhtml', 'live.json');
  try {
    const content = existsSync(livePath) ? readFileSync(livePath, 'utf-8') : '';
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(content || 'null');
  } catch {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end('null');
  }
}

function serveArtifact(req: IncomingMessage, res: ServerResponse, root: string, url: string) {
  const id = url.replace('/artifacts/', '').replace('.html', '');
  const artifactPath = join(root, '.inhtml', 'artifacts', `${id}.html`);

  if (!existsSync(artifactPath)) {
    res.writeHead(404);
    res.end('Artifact not found');
    return;
  }

  try {
    const content = readFileSync(artifactPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end('Error reading artifact');
  }
}

const sseClients: Set<ServerResponse> = new Set();

function handleSSE(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.write(': ping\n\n');

  sseClients.add(res);

  const pingInterval = setInterval(() => {
    res.write(': ping\n\n');
  }, 20000);

  req.on('close', () => {
    sseClients.delete(res);
    clearInterval(pingInterval);
  });
}

export function broadcast() {
  for (const client of sseClients) {
    client.write('data: r\n\n');
  }
}

function appendSessionEvent(root: string, event: Record<string, any>) {
  const sessionPath = join(root, '.inhtml', 'session.json');
  let events: any[] = [];
  try {
    if (existsSync(sessionPath)) {
      events = JSON.parse(readFileSync(sessionPath, 'utf-8'));
    }
  } catch {
    events = [];
  }
  events.push({ ...event, timestamp: new Date().toISOString() });
  writeFileSync(sessionPath, JSON.stringify(events, null, 2));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function handleHook(req: IncomingMessage, res: ServerResponse, root: string) {
  try {
    const body = await readBody(req);
    const data = JSON.parse(body);
    const event = data.event || data.hookEventName || 'unknown';

    if (event === 'user_prompt' || event === 'user_prompt_submit') {
      appendSessionEvent(root, {
        type: 'user_prompt',
        role: 'user',
        text: data.text || data.prompt || ''
      });
      console.log(`[hook ←] user_prompt: ${(data.text || '').slice(0, 80)}`);
    } else if (event === 'ai_update') {
      // Live update: write to live.json, broadcast to browser, don't persist
      const livePath = join(root, '.inhtml', 'live.json');
      writeFileSync(livePath, JSON.stringify({ text: data.text || '', messageId: data.messageId || '' }));
      broadcast();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, live: true }));
      return;
    } else if (event === 'ai_response' || event === 'stop') {
      // Finalize: clear live.json, persist to session.json
      const livePath = join(root, '.inhtml', 'live.json');
      try { writeFileSync(livePath, ''); } catch {}
      appendSessionEvent(root, {
        type: 'ai_response',
        role: 'ai',
        text: data.text || data.summary || ''
      });
      console.log(`[hook ←] ai_response`);
    } else if (event === 'artifact_created' || event === 'post_tool_use') {
      appendSessionEvent(root, {
        type: 'artifact',
        role: 'ai',
        artifactId: data.artifactId || data.id || ''
      });
      console.log(`[hook ←] artifact: ${data.artifactId || data.id || '?'}`);
    } else {
      appendSessionEvent(root, {
        type: event,
        role: 'system',
        text: data.text || JSON.stringify(data)
      });
      console.log(`[hook ←] ${event}`);
    }

    broadcast();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Invalid request' }));
  }
}


