import { createRoute } from 'filebased-hono/factory';
import { describeRoute } from 'hono-openapi';

export default createRoute(
  describeRoute({
    responses: {
      200: {
        description: 'Returns a greeting message.',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'Hello, World!',
            },
          },
        },
      },
    },
  }),
  (c) => {
    return c.text('Hello, World!');
  }
);
