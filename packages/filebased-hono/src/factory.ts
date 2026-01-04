import { Env as HonoEnv, Context as HonoContext } from 'hono';
import { createFactory } from 'hono/factory';

export interface Env extends HonoEnv {}
export interface Context extends HonoContext<Env> {}

const factory = createFactory<Env>();

export const createRoute = factory.createHandlers;
export const createHono = factory.createApp;
