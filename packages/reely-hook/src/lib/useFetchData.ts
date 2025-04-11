import { isInstanceOf } from '@powwow-js/core';
import { useEffect } from '@powwow-js/reely';
import { useRef } from '@powwow-js/reely';
import { useState } from '@powwow-js/reely';

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

export default function useFetchData<D, K = unknown>(
  key: K,
  fetcher: (parameters: K) => Promise<unknown>
): FetchDataOutput<D> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<D>();
  const [error, setError] = useState();

  const fetcherFunction = useRef(fetcher);
  fetcherFunction.current = fetcher;

  useEffect(() => {
    if (!key) {
      return;
    }

    let ignore = false;

    setIsLoading(true);
    setData(undefined);
    setError(undefined);

    fetcherFunction
      .current(key)
      // .then(waitFor(getRandomNumber(300, 2000)))
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
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          setData(response as D);
          setError(undefined);
        }
      })
      .catch((error) => {
        if (!ignore) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    return (): void => {
      ignore = true;
    };
  }, [key]);

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    isLoading,
    data,
    error,
  } as FetchDataOutput<D>;
}
