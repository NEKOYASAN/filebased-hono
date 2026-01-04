import { createRoute } from 'filebased-hono/factory';

export default createRoute(async (c) => {
  return c.text(`Catchall route`);
});
