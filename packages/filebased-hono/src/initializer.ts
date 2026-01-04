import { createHandlers } from './create-handlers';
import { createHono } from './factory';
import { getRoutingTree } from './routing-tree';

export const createApp = (config?: {
  app: ReturnType<typeof createHono>;
  initializer?: (app: ReturnType<typeof createHono>) => void;
}) => {
  const app = config?.app ?? createHono();
  config?.initializer?.(app);
  const routingTree = getRoutingTree();
  createHandlers(app, routingTree);
  return app;
};
