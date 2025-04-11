import { RouteConfig } from '@powwow-js/routing-utils';
import { ComponentFunction } from '@powwow-js/reely';
import { PageRouteHandler } from '../shared/routing/useRouter';

export type Route = RouteConfig<PageRouteHandler, PathName>;

export type PathName = '/' | '/login' | '/chat' | '/about' | '/help' | '/404';

export const route404 = {
  pathname: '/404',
  handler: notFoundPage,
} satisfies Route;

export const routes = [
  {
    pathname: '/',
    handler: () => {
      // TODO
      return loginPage();
    },
  },
  {
    pathname: '/login',
    handler: loginPage,
  },
  {
    pathname: '/chat',
    handler: chatPage,
  },
  {
    pathname: '/about',
    handler: aboutPage,
  },
  {
    pathname: '/help',
    handler: helpPage,
  },
  route404,
] satisfies Route[];

async function loginPage() {
  const Page = await import('../pages/login').then(getPage);
  return <Page />;
}

async function chatPage() {
  const Page = await import('../pages/chat').then(getPage);
  return <Page />;
}

async function aboutPage() {
  const Page = await import('../pages/about').then(getPage);
  return <Page />;
}

async function helpPage() {
  const Page = await import('../pages/help').then(getPage);
  return <Page />;
}

async function notFoundPage() {
  const Page = await import('../pages/not-found').then(getPage);
  return <Page />;
}

function getPage({ default: Page }: { default: unknown }): ComponentFunction {
  return Page as ComponentFunction;
}
