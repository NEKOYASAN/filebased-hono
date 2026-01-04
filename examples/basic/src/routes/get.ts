import { createRoute } from 'filebased-hono/factory';
import { describeRoute, validator } from 'hono-openapi';
import { z } from 'zod';

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
  validator(
    'query',
    z.object({
      name: z.string().min(1).optional(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query');
    return c.text(`Hello, ${name ?? 'Hono'}!`);
  }
);
