import { Env, ErrorHandler } from 'hono/types';

import { createRoute } from './factory';

type DynamicRouteMeta =
  | {
      catchAll: false;
      slugName: string;
    }
  | {
      // if catchAll is true, children routing tree overrides the route file
      catchAll: true;
      slugName: string;
      optional: boolean;
    };

export type InternalRoutingTree = {
  get?: ReturnType<typeof createRoute>;
  post?: ReturnType<typeof createRoute>;
  put?: ReturnType<typeof createRoute>;
  patch?: ReturnType<typeof createRoute>;
  delete?: ReturnType<typeof createRoute>;
  head?: ReturnType<typeof createRoute>;
  options?: ReturnType<typeof createRoute>;
  // <dynamic> is a special key that will be used for dynamic routes
  // oxlint-disable-next-line typescript-eslint(no-redundant-type-constituents)
  children?: { [key: '<dynamic>' | string]: InternalRoutingTree };
  dynamic?: DynamicRouteMeta;
};

export type RoutingTree = InternalRoutingTree & {
  globalError?: ErrorHandler<Env>;
};

function buildRoutingTree<T extends keyof InternalRoutingTree>(
  routingTree: RoutingTree,
  path: string,
  key: T,
  value: InternalRoutingTree[T]
) {
  const routePathParts = path.split('/');

  let currentRoutingTree = routingTree;

  routePathParts.forEach((part, index) => {
    if (!part) {
      if (index === routePathParts.length - 1) {
        if (key !== 'children' && currentRoutingTree[key]) {
          throw new Error('Duplicate route definition for path: ${path}');
        }
        currentRoutingTree[key] = value;
        return;
      }
      throw new Error('Failed to parse route path: ${path}');
    }
    if (part.startsWith('[') && part.endsWith(']')) {
      let slugName = part.slice(1, -1);
      let isOptional = false;
      let isCatchAll = false;
      if (slugName.startsWith('[') && slugName.endsWith(']')) {
        slugName = slugName.slice(1, -1);
        isOptional = true;
      }
      if (slugName.startsWith('...')) {
        slugName = slugName.substring(3);
        isCatchAll = true;
      }
      if (!currentRoutingTree.children) {
        currentRoutingTree.children = {};
      }
      if (!currentRoutingTree.children['<dynamic>']) {
        currentRoutingTree.children['<dynamic>'] = {};
      }
      currentRoutingTree.children['<dynamic>'].dynamic = {
        catchAll: isCatchAll,
        slugName,
        optional: isOptional,
      };
      currentRoutingTree = currentRoutingTree.children['<dynamic>'];
    } else {
      if (!currentRoutingTree.children) {
        currentRoutingTree.children = {};
      }
      if (!currentRoutingTree.children[part]) {
        currentRoutingTree.children[part] = {};
      }
      currentRoutingTree = currentRoutingTree.children[part];
    }
  });
}

const handlersToRoutingTreeObject = (routingTree: RoutingTree): RoutingTree => {
  const routes = import.meta.glob<ReturnType<typeof createRoute>>(
    [
      '/src/routes/**/get.ts',
      '/src/routes/**/post.ts',
      '/src/routes/**/put.ts',
      '/src/routes/**/patch.ts',
      '/src/routes/**/delete.ts',
      '/src/routes/**/head.ts',
      '/src/routes/**/options.ts',
      '!/src/routes/**/_*/**/*.ts',
      '!/src/routes/**/-*/**/*.ts',
    ],
    {
      eager: true,
      import: 'default',
    }
  );
  for (const [path, route] of Object.entries(routes)) {
    const routePath = path
      .replace(`/src/routes/`, '')
      .replace(/(get|post|put|patch|delete|head|options)\.ts$/, '');
    const method = path.match(
      /(get|post|put|patch|delete|head|options)\.ts$/
    )?.[1] as keyof InternalRoutingTree;
    if (!method) {
      console.error('Failed to parse method: ${path}');
      continue;
    }
    if (!route) {
      console.error('Failed to load route handler: ${path}');
      continue;
    }
    buildRoutingTree(routingTree, routePath, method, route);
  }
  return routingTree;
};

export const getRoutingTree = (): RoutingTree => {
  let routingTree: RoutingTree = {};
  const globalError = import.meta.glob<ErrorHandler>(
    '/src/routes/global-error.ts',
    {
      eager: true,
      import: 'default',
    }
  );

  if (globalError['/src/routes/global-error.ts']) {
    routingTree.globalError = globalError['/src/routes/global-error.ts'];
  }
  routingTree = handlersToRoutingTreeObject(routingTree);
  return routingTree;
};
