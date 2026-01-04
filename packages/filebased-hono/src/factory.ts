import { Env } from 'hono';
import { createFactory } from 'hono/factory';

const factory = createFactory<Env>();

export const createRoute = factory.createHandlers;
export const createHono = factory.createApp;
