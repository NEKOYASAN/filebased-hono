import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts', './src/factory.ts', './src/vite.ts'],
  dts: true,
  splitting: false,
  minify: false,
  format: ['esm'],
  bundle: true,
  platform: 'node',
  external: ['*'],
});
