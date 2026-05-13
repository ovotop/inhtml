import { existsSync } from 'fs';
import { join, dirname } from 'path';

export function findProjectRoot(): string {
  let dir = process.cwd();

  while (true) {
    if (existsSync(join(dir, 'package.json')) || existsSync(join(dir, '.git'))) {
      return dir;
    }

    const parent = dirname(dir);
    if (parent === dir) {
      return process.cwd();
    }

    dir = parent;
  }
}
