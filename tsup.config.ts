import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  banner: {
    js: '#!/usr/bin/env node'
  },
  esbuildOptions(options) {
    options.define = {
      'process.env.NODE_ENV': '"production"'
    };
  },
  plugins: [
    {
      name: 'inline-assets',
      setup(build) {
        build.onLoad({ filter: /assets\/.*\.(html|md)$/ }, (args) => {
          const content = readFileSync(args.path, 'utf-8');
          return {
            contents: `export default ${JSON.stringify(content)};`,
            loader: 'js'
          };
        });
      }
    }
  ]
});
