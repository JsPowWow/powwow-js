import Reely from '@powwow-js/reely';
import { getRandomNumber, isInstanceOf, waitFor } from '@powwow-js/core';

type FetchDataOutput<Data> =
  | {
      isLoading: true;
      error: undefined;
      data: undefined;
    }
  | {
      isLoading: false;
      error: undefined;
      data: Data;
    }
  | {
      isLoading: false;
      error: Error;
      data: undefined;
    };

export const useFetchData = <D, K = unknown>(
  key: K,
  fetcher: (parameters: K) => Promise<unknown>
): FetchDataOutput<D> => {
  const [isLoading, setIsLoading] = Reely.useState(false);
  const [data, setData] = Reely.useState<D>();
  const [error, setError] = Reely.useState();

  const fetcherFunction = Reely.useRef(fetcher);
  fetcherFunction.current = fetcher;

  Reely.useEffect(() => {
    if (!key) {
      return;
    }

    let ignore = false;

    setIsLoading(true);
    setData(undefined);
    setError(undefined);

    fetcherFunction
      .current(key)
      .then(waitFor(getRandomNumber(300, 2000)))
      .then((response) => {
        if (isInstanceOf(Response, response)) {
          if (!response.ok) {
            throw new Error(`Error: failed to fetch, status: ${response.status}`);
          }
          return response.json();
        }
        return response;
      })
      .then((response) => {
        if (!ignore) {
          setData(response as D);
          setError(undefined);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error);
          setData(undefined);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    // cleanup
    return () => {
      ignore = true;
    };
  }, [key]);

  return {
    isLoading,
    data,
    error,
  } as FetchDataOutput<D>;
};
