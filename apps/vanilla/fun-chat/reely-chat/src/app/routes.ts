import { findMatchingRoute, RouteConfig } from '@powwow-js/routing-utils';
import { Maybe, Nullable } from '@powwow-js/core';
import { useCallback, useEffect, useFetchData, useState } from '@powwow-js/reely';

export type RouteHandler = () => Promise<unknown>;

export type Route = RouteConfig<RouteHandler, PathName>;

export type PathName = '/login' | '/chat' | '/about' | './404';

const route404: Route = {
  pathname: './404',
  handler: async () => {
    const { default: Page } = await import('../pages/not-found');
    return Page;
  },
} as const;

const routes: Route[] = [
  {
    pathname: '/login',
    handler: async () => {
      const { default: Page } = await import('../pages/login');
      return Page;
    },
  },
  {
    pathname: '/chat',
    handler: async () => {
      const { default: Page } = await import('../pages/chat');
      return Page;
    },
  },
  {
    pathname: '/about',
    handler: async () => {
      const { default: Page } = await import('../pages/about');
      return Page;
    },
  },
  route404,
] as const;

const pathNames = routes.map((r) => r.pathname);

const getRouteByPathName = (pathname: Nullable<string>): RouteConfig<RouteHandler, PathName> =>
  Maybe.from(routes.find((r) => r.pathname === pathname)).getOrDefault(route404);

const pagesCache = new Map<string, unknown>();

const loadPage = async (pathName = '') => {
  if (pagesCache.has(pathName)) {
    return pagesCache.get(pathName);
  }
  const route = getRouteByPathName(pathName);
  if (pagesCache.has(route.pathname)) {
    return pagesCache.get(route.pathname);
  }
  const page = await route.handler();
  pagesCache.set(pathName, page);
  return page;
};

export const useGetCurrentPage = () => {
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const { isLoading, error, data: Page } = useFetchData(currentPage, loadPage);
  console.log({ isLoading, error, Page });

  const handlePopStateChange = useCallback((popstate: PopStateEvent) => {
    console.log('~~ popstate:', popstate);
  }, []);

  useEffect(() => {
    const matching = findMatchingRoute(pathNames, globalThis.location.pathname);
    if (matching.success) {
      setCurrentPage(matching.route.pathname);
    } else {
      setCurrentPage(route404.pathname);
    }

    globalThis.addEventListener('popstate', handlePopStateChange);
    return () => {
      globalThis.removeEventListener('popstate', handlePopStateChange);
    };
  }, []);

  return { isLoading, error, Page };
};
