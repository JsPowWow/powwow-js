import { useEffect, useFetchData } from '@powwow-js/reely';
import { findMatchingRoute } from '@powwow-js/routing-utils';
import { useRouter } from './Router';

const pagesCache = new Map<string, unknown>();

export const useLoadPage = () => {
  const { pathName, pathNames, fallback, navigate, getRouteData } = useRouter();
  const {
    isLoading,
    error,
    data: Page,
  } = useFetchData(pathName, async (pathName = '') => {
    if (pagesCache.has(pathName)) {
      return pagesCache.get(pathName);
    }

    const route = getRouteData(pathName);
    if (pagesCache.has(route.pathname)) {
      return pagesCache.get(route.pathname);
    }
    console.log(`\u001B[41;93;4m~~ loading page: ${pathName}\u001B[m`);
    const page = await route.handler();
    pagesCache.set(pathName, page);

    return page;
  });

  // console.log({ pathName, isLoading, error, Page });

  useEffect(() => {
    const matching = findMatchingRoute(pathNames, globalThis.location.pathname);
    if (matching.success) {
      navigate(matching.route.pathname);
    } else {
      navigate(fallback);
    }
  }, []);

  return { isLoading, error, Page };
};
