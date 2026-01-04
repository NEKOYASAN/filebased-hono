import { createHono } from './factory';
import { InternalRoutingTree, RoutingTree } from './routing-tree';

const createSubPathHandler = (
  app: ReturnType<typeof createHono>,
  routingTree: InternalRoutingTree
) => {
  const { children, dynamic: _, ...routeHandlers } = routingTree;
  if (children) {
    for (const [path, innerTree] of Object.entries(children)) {
      const subPathApp = createHono();
      if (path === '<dynamic>') {
        const dynamicConfig = innerTree.dynamic;
        if (!dynamicConfig) {
          throw new Error('Dynamic route config missing');
        }
        if (dynamicConfig.catchAll) {
          app.route('/*', createSubPathHandler(subPathApp, innerTree));
        } else {
          app.route(
            `/:${dynamicConfig.slugName}`,
            createSubPathHandler(subPathApp, innerTree)
          );
        }
      } else {
        app.route(`/${path}`, createSubPathHandler(subPathApp, innerTree));
      }
    }
  }

  for (const [method, handler] of Object.entries(routeHandlers)) {
    app.on(method, '/', ...handler);
  }

  return app;
};

export const createHandlers = (
  app: ReturnType<typeof createHono>,
  routingTree: RoutingTree
) => {
  const { globalError, ...restRoutingTree } = routingTree;

  createSubPathHandler(app, restRoutingTree);
  if (globalError) {
    app.onError(globalError);
  }
};
