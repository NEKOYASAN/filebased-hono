import type { PluginOption } from 'vite';

function filebasedHonoVitePlugin(): PluginOption[] {
  return [
    {
      name: 'filebased-hono-vite-plugin',
      configureServer(server) {
        server.watcher.add('./src/routes/**');
        server.watcher.on('add', async () => {
          await server.restart();
        });
        server.watcher.on('unlink', async () => {
          await server.restart();
        });
      },
      config: () => {
        return {
          ssr: {
            noExternal: ['filebased-hono', 'filebased-hono/*'],
          },
        };
      },
    },
  ];
}

export default filebasedHonoVitePlugin;
