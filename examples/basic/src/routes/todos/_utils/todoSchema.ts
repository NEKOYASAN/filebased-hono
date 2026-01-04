import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(255),
  completed: z.boolean(),
});
