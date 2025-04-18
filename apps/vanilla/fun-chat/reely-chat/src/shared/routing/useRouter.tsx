import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from '@powwow-js/reely';
import { RouteConfig } from '@powwow-js/routing-utils';
import { hasProperty, isInstanceOf, isString, Maybe, noop, Nullable } from '@powwow-js/core';

export type PageRouteHandler = () => Promise<unknown>;

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
  getRouteData: (_pathname: Nullable<string>) => ({
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
  const previousPathName = useRef(pathName);
  previousPathName.current = pathName;

  const navigate = useCallback((event: string | Event) => {
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

    if (newPathName && previousPathName.current !== newPathName) {
      // console.log('newPathName', { prev: previousPathName.current, new: newPathName });
      setPathName(newPathName);
      previousPathName.current = newPathName;
      Router.navigate(newPathName);
    }
  }, []);

  const handleUrlChange = useCallback((event: Event) => {
    const path = currentPathName();
    console.log(
      `%c~~ urlChange: ${event.type} - "${path}"`,
      'background-color: darkblue; color: white; font-style: italic; border: 2px solid hotpink;'
    );
    navigate(path);
  }, []);

  const getRouteData = useCallback(
    (pathname: Nullable<string>): RouteConfig<PageRouteHandler, P> =>
      Maybe.from(routes.find((routeConfig) => routeConfig.pathname === pathname)).getOrDefault(fallback),
    []
  );

  useEffect(() => {
    globalThis.addEventListener('popstate', handleUrlChange);

    return () => {
      globalThis.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    globalThis.addEventListener('pushStateChanged', handleUrlChange);

    return () => {
      globalThis.removeEventListener('pushStateChanged', handleUrlChange);
    };
  }, []);

  const contextValue = useMemo<RouteContext>(
    () => ({ pathName, pathNames, navigate, getRouteData, fallback: fallback.pathname }),
    [pathName]
  );

  return <RoutingContext.Provider value={contextValue}>{children}</RoutingContext.Provider>;
};

export const useRouter = () => {
  return useContext(RoutingContext);
};

(function (history) {
  const originalPushState = history.pushState;

  history.pushState = function (...parameters: Parameters<typeof originalPushState>) {
    const result = originalPushState.apply(this, parameters);
    globalThis.dispatchEvent(new Event('pushStateChanged'));
    return result;
  };
})(globalThis.history);

export const Router = {
  navigate: (pathname: string) => globalThis.history.pushState({}, '', pathname),
  back: () => {
    if (globalThis.history.length > 0) {
      globalThis.history.back();
    }
  },
  getLength(): number {
    return globalThis.history.length;
  },
};
