import build from '@hono/vite-build/cloudflare-workers';
import devServer from '@hono/vite-dev-server';
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare';
import filebasedHonoVitePlugin from 'filebased-hono/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    devServer({
      adapter: () =>
        cloudflareAdapter({
          proxy: {},
        }),
      entry: 'src/index.ts',
    }),
    build({
      entry: './src/index.ts',
      outputDir: './dist',
    }),
    filebasedHonoVitePlugin(),
  ],
});
