import { useEffect } from '@powwow-js/reely';
import { findMatchingRoute } from '@powwow-js/routing-utils';
import { useRouter } from './useRouter';
import { useFetchData } from '@powwow-js/reely-hook';

export const usePageLoader = () => {
  const { pathName, pathNames, fallback, navigate, getRouteData } = useRouter();
  const {
    isLoading,
    error,
    data: Page,
  } = useFetchData(pathName, async (pathName = '') => {
    const route = getRouteData(pathName);
    // console.log(`\u001B[41;93;4m~~ loading page: ${pathName}\u001B[m`);
    return await route.handler();
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
