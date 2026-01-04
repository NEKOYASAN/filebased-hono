# filebased-hono
A file-based routing helper for [Hono](https://hono.dev/).

## Installation

```bash
npm install filebased-hono
# or
yarn add filebased-hono
# or
pnpm add filebased-hono
``` 

## Usage

`filebased-hono` scans `src/routes` and automatically wires every `get.ts`, `post.ts`, … file into a single Hono instance. A minimal Worker (taken from `examples/basic`) looks like this:

```ts
// src/index.ts
import { createApp } from 'filebased-hono';
import { createHono } from 'filebased-hono/factory';

const app = createApp({
  app: createHono().basePath('/'),
  initializer: (app) => {
    app.use('*', async (c, next) => {
      console.log(`[request] ${c.req.method} ${c.req.path}`);
      await next();
    });
  },
});

export default app;
```

### Creating routes

Every HTTP method is represented by a file named after the method inside `src/routes`. Whatever the file exports as `default` (usually via `createRoute`) becomes the handler for that path. Subdirectories map straight to URL segments:

```
src/routes
├─ get.ts                 → GET /
├─ hello/get.ts           → GET /hello
├─ todos/get.ts           → GET /todos
└─ todos/[todoId]/get.ts  → GET /todos/:todoId
```

`createRoute` is just `createFactory().createHandlers` under the hood, so you can compose middlewares, validators, or OpenAPI helpers exactly like in a normal Hono app:

```ts
// src/routes/get.ts
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
            schema: { type: 'string', example: 'Hello, World!' },
          },
        },
      },
    },
  }),
  validator('query', z.object({ name: z.string().min(1).optional() })),
  (c) => {
    const { name } = c.req.valid('query');
    return c.text(`Hello, ${name ?? 'Hono'}!`);
  }
);
```

### Customizing the Env type

Augment the `filebased-hono/factory` module to describe your own `Env`. Once declared, helpers such as `createRoute`, `createHono`, or any `Context` imported from `filebased-hono/factory` will reflect your bindings and variables.

```ts
// env.d.ts (or any file included by TypeScript)
declare module 'filebased-hono/factory' {
  export interface Env {
    Variables: {
      CUSTOM_VARIABLE: string;
    };
    Bindings: {};
  }
}
```

Now, within a route handler you can access `c.env.get("CUSTOM_VARIABLE")` with proper type inference.

### Dynamic, catch-all, and helper directories

- `[slug]` folders map to required parameters (e.g. `todos/[todoId]/get.ts` → `/todos/:todoId`).
- `[...slug]` creates a catch-all segment (see `examples/basic/src/routes/catchall/[...catchall]/get.ts` for a simple version).
- Directories that start with `_` or `-` are ignored, which makes them perfect for colocated helpers such as `routes/todos/_utils/todoSchema.ts`.

You can also define `src/routes/global-error.ts` that exports a standard Hono `ErrorHandler` to control error responses for every route.

### Running the basic example

To explore a working project and view the generated OpenAPI docs, run the example inside this repo:

```bash
cd examples/basic
bun install
bun run dev
```

### Note

This helper strongly inspired by honox. In many cases, honox would be a better choice.
Also, this helper is under development. We welcome feature requests, but we have no plans to implement rendering or support for island architecture in order to differentiate it from honox.

<https://github.com/honojs/honox>
