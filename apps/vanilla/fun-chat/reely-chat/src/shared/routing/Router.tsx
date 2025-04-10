import { createContext, useCallback, useContext, useEffect, useMemo, useState } from '@powwow-js/reely';
import { RouteConfig } from '@powwow-js/routing-utils';
import { PageRouteHandler } from './types';
import { hasProperty, isInstanceOf, isString, Maybe, noop, Nullable } from '@powwow-js/core';

interface RouteContext<P extends string = string> {
  pathName: string;
  pathNames: P[];
  fallback: P;
  navigate: (pathName: P | Event) => void;
  getRouteData: (pathname: Nullable<string>) => RouteConfig<PageRouteHandler, P>;
}

const currentPathName = () => globalThis.location.pathname;

const routingContextDefault = {
  pathName: currentPathName(),
  fallback: '/',
  pathNames: [],
  navigate: noop,
  getRouteData: () => ({
    pathname: '',
    children: [],
    handler: () => Promise.reject(new Error('RouterContext is not provided.')),
  }),
} satisfies RouteContext;

const RoutingContext = createContext<RouteContext>(routingContextDefault);

interface RouterContextProviderProps<PathName extends string = string> {
  routes: RouteConfig<PageRouteHandler, PathName>[];
  fallback: RouteConfig<PageRouteHandler, PathName>;
  children?: unknown[];
}

export const RouterContextProvider = <P extends string = string>({
  routes,
  fallback,
  children,
}: RouterContextProviderProps<P>) => {
  const pathNames = useMemo(() => {
    return routes.map((r) => r.pathname);
  }, []);

  const [pathName, setPathName] = useState<string>(currentPathName);

  const navigate = useCallback(
    (event: string | Event) => {
      let newPathName: Nullable<string>;
      if (isInstanceOf(Event, event)) {
        event.preventDefault();
        if (hasProperty('href', event.target)) {
          const href = event.target.href;
          newPathName = isString(href) ? new URL(href).pathname : null;
        }
      } else if (isString(event)) {
        newPathName = event;
      }

      if (newPathName && newPathName !== pathName) {
        setPathName(newPathName);
        globalThis.history.pushState({}, newPathName, newPathName);
      }
    },
    [pathName]
  );

  const handlePopStateChange = useCallback((_popstate: PopStateEvent) => {
    const path = currentPathName();
    console.log(
      `%c~~ popstate: ${path}`,
      'background-color: darkblue; color: white; font-style: italic; border: 2px solid hotpink;'
    );
    navigate(path);
  }, []);

  const getRouteConfig = useCallback(
    (pathname: Nullable<string>): RouteConfig<PageRouteHandler, P> =>
      Maybe.from(routes.find((routeConfig) => routeConfig.pathname === pathname)).getOrDefault(fallback),
    []
  );

  useEffect(() => {
    globalThis.addEventListener('popstate', handlePopStateChange);

    return () => {
      globalThis.removeEventListener('popstate', handlePopStateChange);
    };
  }, []);

  const contextValue = useMemo<RouteContext>(
    () => ({ pathName, pathNames, navigate, getRouteData: getRouteConfig, fallback: fallback.pathname }),
    [pathName]
  );

  return <RoutingContext.Provider value={contextValue}>{children}</RoutingContext.Provider>;
};

export const useRouter = () => {
  return useContext(RoutingContext);
};
