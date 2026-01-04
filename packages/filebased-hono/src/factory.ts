import { Env as HonoEnv } from 'hono';
import { createFactory } from 'hono/factory';

export interface Env extends HonoEnv {}

const factory = createFactory<Env>();

export const createRoute = factory.createHandlers;
export const createHono = factory.createApp;
