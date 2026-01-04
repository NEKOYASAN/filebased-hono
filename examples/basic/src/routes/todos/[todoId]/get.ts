import { createRoute } from 'filebased-hono/factory';
import { describeRoute, resolver, validator } from 'hono-openapi';
import z from 'zod';

import { getTodoById } from '../_utils/todoData';
import { TodoSchema } from '../_utils/todoSchema';

export default createRoute(
  describeRoute({
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: resolver(
              z.object({
                data: TodoSchema,
              })
            ),
          },
        },
      },
    },
  }),
  validator(
    'param',
    z.object({
      todoId: z.string().min(1),
    })
  ),
  async (c) => {
    const { todoId } = c.req.valid('param');
    const todo = getTodoById(todoId);
    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    return c.json(TodoSchema.parse({ data: todo }), 200);
  }
);
