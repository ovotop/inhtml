import { watch, FSWatcher } from 'chokidar';
import { join } from 'path';

export function startWatcher(root: string, broadcast: () => void): FSWatcher {
  const sessionPath = join(root, '.inhtml', 'session.json');

  let debounceTimer: NodeJS.Timeout | null = null;

  const watcher = watch(sessionPath, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      broadcast();
      debounceTimer = null;
    }, 50);
  });

  return watcher;
}
