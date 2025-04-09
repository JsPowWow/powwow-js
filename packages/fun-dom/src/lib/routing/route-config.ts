import type { RouteDefinition, RoutesConfig } from '@powwow-js/routing-utils';

const setParametersKeys = (parametersKey: string[]): Record<string, string> =>
  Object.fromEntries(parametersKey.map((key) => [key, '']));

const splitPath = (path: string): string[] => path.split('/').slice(2);

export function parseConfig<Handler extends CallableFunction>(
  routeData: RoutesConfig<Handler>,
  basePath = '',
  nestedLevel = 0
): Record<string, RouteDefinition<Handler> & { isSubRoute: boolean; nestedLevel: number }> {
  const result: Record<string, RouteDefinition<Handler> & { isSubRoute: boolean; nestedLevel: number }> = {};

  routeData.forEach((routeInfo) => {
    const pathname = `${basePath}${routeInfo.pathname}`;

    const parametersKey = splitPath(pathname.replaceAll(':', ''));

    result[pathname] = {
      handler: routeInfo.handler,
      params: pathname.includes(':') ? setParametersKeys(parametersKey) : {},
      isSubRoute: Boolean(basePath),
      nestedLevel,
    };

    if (routeInfo.children) {
      Object.assign(result, parseConfig(routeInfo.children, pathname, nestedLevel + 1));
    }
  });
  return result;
}
