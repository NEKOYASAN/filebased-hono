export * from 'filebased-hono/factory';

declare module 'filebased-hono/factory' {
  export interface Env {
    Variables: {
      CUSTOM_VARIABLE: string;
    };
    Bindings: {};
  }
}
