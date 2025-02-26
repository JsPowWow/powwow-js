import { hasSome, isInstanceOf } from '@powwow-js/nullable';
import { MatchingRoute, RouteMatchingResult, RoutePath } from './types';

const toRegExp = (route: string): RegExp => {
  return new RegExp(
    route
      /** replaces literal dot "." in the route with the escaped dot (\\.) */
      .replace(/\./g, '\\.')
      /** escape literal slashes */
      .replace(/\//g, '/')
      /** replaces literal question marks (?) with escaped question marks (\\?) */
      .replace(/\?/g, '\\?')
      /** removes any trailing slashes (/) at the end of the route string */
      .replace(/\/+$/, '')
      /** replace  * (wildcard) characters in the route to the regular expression .* */
      .replace(/\*+/g, '.*')
      /** converts params from form of :paramName (e.g., :id) into regular expression named capturing groups. */
      .replace(/:([^\d|^/][a-zA-Z0-9_]*(?=(?:\/|\\.)|$))/g, (_, paramName) => `(?<${paramName}>[^/]+?)`)
      /** Allow optional trailing slash */
      .concat('(\\/|$)'),
    'gi'
  );
};

const matchPathWithUrl = (
  routePath: RoutePath,
  url: string
): {
  matches: boolean;
  params: Record<string, string> | null;
} => {
  const expression = isInstanceOf(RegExp, routePath) ? routePath : toRegExp(routePath);
  const match = expression.exec(url) || false;
  const matches = isInstanceOf(RegExp, routePath) ? !!match : !!match && match[0] === match.input;

  return {
    matches,
    params: match && matches ? match.groups || null : null,
  };
};

const toMatchingRoute =
  (url: string) =>
  (pathname: string): MatchingRoute | undefined => {
    const match = matchPathWithUrl(pathname, url);
    return match.matches
      ? {
          searchedTerm: url,
          pathname,
          params: match.params ?? {},
        }
      : undefined;
  };

export const getMatchingRoutes = (routes: string[], url: string): MatchingRoute[] =>
  routes.map(toMatchingRoute(url)).filter((r) => hasSome(r));

export const findMatchingRoute = (routes: string[], url: string): RouteMatchingResult => {
  const matchedRoutes = getMatchingRoutes(routes, url);

  if (!matchedRoutes.length) {
    return { success: false, error: new Error(`There wasn't found anything matching the url-request: "${url}"`) };
  }

  if (matchedRoutes.length > 1) {
    return { success: false, error: new Error(`There was found more than one matching for url-request: "${url}"`) };
  }

  return { success: true, route: matchedRoutes[0] };
};
