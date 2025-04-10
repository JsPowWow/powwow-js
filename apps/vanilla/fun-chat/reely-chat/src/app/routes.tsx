import { RouteConfig } from '@powwow-js/routing-utils';
import { PageRouteHandler } from '../shared/routing/types';

export type Route = RouteConfig<PageRouteHandler, PathName>;

export type PathName = '/login' | '/chat' | '/about' | '/help' | '/404';

export const route404 = {
  pathname: '/404',
  handler: () => import('../pages/not-found').then(getPage),
} satisfies Route;

export const routes = [
  {
    pathname: '/login',
    handler: () => import('../pages/login').then(getPage),
  },
  {
    pathname: '/chat',
    handler: () => import('../pages/chat').then(getPage),
  },
  {
    pathname: '/about',
    handler: () => import('../pages/about').then(getPage),
  },
  {
    pathname: '/help',
    handler: () => import('../pages/help').then(getPage),
  },
  route404,
] satisfies Route[];

function getPage({ default: Page }: { default: unknown }) {
  return Page;
}
