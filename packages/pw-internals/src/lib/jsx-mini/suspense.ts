import { isSameDeps } from './hooks/utils';
import { AnyAsyncFunction, exhaustiveGuard } from '@powwow-js/core';

type FetchStatus = 'pending' | 'success' | 'error';

export function wrapPromise<Fetcher extends AnyAsyncFunction>(fetcher: Fetcher) {
  let status: FetchStatus = 'pending';
  let result: Awaited<ReturnType<Fetcher>>;
  let currentParameters: Parameters<Fetcher>;

  const suspender = (...parameters: Parameters<Fetcher>) => {
    return fetcher(...parameters).then(
      (r) => {
        status = 'success';
        result = r;
      },
      (e) => {
        status = 'error';
        result = e;
      }
    );
  };

  return {
    read(...parameters: Parameters<Fetcher>): Awaited<ReturnType<Fetcher>> {
      if (!isSameDeps(currentParameters, parameters)) {
        status = 'pending';
        currentParameters = parameters;
      }

      switch (status) {
        case 'pending': {
          throw suspender(...parameters);
        }
        case 'error': {
          throw result;
        }
        case 'success': {
          return result;
        }
        default: {
          exhaustiveGuard(status);
        }
      }
    },
  };
}
