import { Reely } from '@pw-internals/jsx-runtime';
import { getRandomNumber, waitFor } from '@powwow-js/core';

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

export const useFetchData = <D>(url: string): FetchDataOutput<D> => {
  const [isLoading, setIsLoading] = Reely.useState(false);
  const [data, setData] = Reely.useState();
  const [error, setError] = Reely.useState();

  Reely.useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setData(undefined);
    setError(undefined);

    fetch(url)
      .then(waitFor(getRandomNumber(300, 2000)))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: failed to fetch, status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          setData(jsonData);
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
  }, [url]);

  return {
    isLoading,
    data,
    error,
  } as FetchDataOutput<D>;
};
