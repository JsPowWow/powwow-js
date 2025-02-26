import { RouteDefinition, RoutesConfig } from './types';

const setParamsKeys = (paramsKey: string[]) => paramsKey.reduce((obj, key) => ({ ...obj, [key]: '' }), {});

const splitPath = (path: string) => path.split('/').slice(2);

export function parseConfig<Handler extends CallableFunction>(
  routeData: RoutesConfig<Handler>,
  basePath = '',
  nestedLevel = 0
): Record<string, RouteDefinition<Handler>> {
  const result: Record<string, RouteDefinition<Handler>> = {};
  routeData.forEach((routeInfo) => {
    const pathname = `${basePath}${routeInfo.pathname}`;
    const paramsKey = splitPath(pathname.replaceAll(':', ''));
    result[pathname] = {
      handler: routeInfo.handler,
      params: pathname.indexOf(':') >= 0 ? setParamsKeys(paramsKey) : {},
      isSubRoute: Boolean(basePath),
      nestedLevel,
    };
    if (routeInfo.children) {
      Object.assign(result, parseConfig(routeInfo.children, pathname, nestedLevel + 1));
    }
  });
  return result;
}
