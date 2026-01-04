import { Scalar } from '@scalar/hono-api-reference';
import { createApp } from 'filebased-hono';
import { createHono } from 'filebased-hono/factory';
import { openAPIRouteHandler } from 'hono-openapi';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';

const app = createApp({
  app: createHono().basePath('/'),
  initializer: (app) => {
    if (import.meta.env.DEV) {
      app.use(logger());
    }
  },
});

if (import.meta.env.DEV) {
  showRoutes(app);

  app.get(
    '/openapi',
    Scalar({
      theme: 'saturn',
      url: '/openapi.json',
    })
  );

  app.get(
    '/openapi.json',
    openAPIRouteHandler(app, {
      documentation: {
        openapi: '3.0.0',
        info: {
          title: 'Basic Example',
          version: '1.0.0',
        },
      },
    })
  );
}

export default app;
