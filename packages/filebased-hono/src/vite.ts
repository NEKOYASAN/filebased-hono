import type { PluginOption } from 'vite';

function honoFilebaseRoutingHelperVitePlugin(): PluginOption[] {
  return [
    {
      name: 'hono-filebased-routing-helper-vite-plugin',
      configureServer(server) {
        server.watcher.add('./src/routes/**');
        server.watcher.on('add', async () => {
          await server.restart();
        });
        server.watcher.on('unlink', async () => {
          await server.restart();
        });
      },
    },
  ];
}

export default honoFilebaseRoutingHelperVitePlugin;
