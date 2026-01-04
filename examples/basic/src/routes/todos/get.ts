import { createRoute } from 'filebased-hono/factory';
import { describeRoute, resolver } from 'hono-openapi';
import { z } from 'zod';

import { getAllTodos } from './_utils/todoData';
import { TodoSchema } from './_utils/todoSchema';

export default createRoute(
  describeRoute({
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: resolver(
              z.object({
                data: z.array(TodoSchema),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const todos = getAllTodos();
    return c.json(TodoSchema.parse({ data: todos }), 200);
  }
);
