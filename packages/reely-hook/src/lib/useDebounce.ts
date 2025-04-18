import type { AnyFunction, Nullable } from '@powwow-js/core';
import { hasSome } from '@powwow-js/core';
import useCurrentValueReference from './useCurrentValueRef';
import { useEffect, useMemo } from '@powwow-js/reely';

type Debounced<F extends AnyFunction> = { (...parameters: Parameters<F>): void; cancel(): void };

function debounce<F extends AnyFunction>(f: F, ms: number): Debounced<F> {
  let timeoutId: Nullable<NodeJS.Timeout> = null;

  function debounced(...parameters: Parameters<F>): void {
    if (hasSome(timeoutId)) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      f(...parameters);
    }, ms);
  }

  debounced.cancel = (): void => {
    if (hasSome(timeoutId)) {
      clearTimeout(timeoutId);
    }
  };

  return debounced;
}

export default function useDebounce<F extends AnyFunction>(f: F, ms: number): Debounced<F> {
  const savedFunctionReference = useCurrentValueReference(f);

  const debounced = useMemo(
    () =>
      debounce((...parameters: Parameters<F>) => {
        savedFunctionReference.current(...parameters);
      }, ms),
    [savedFunctionReference, ms]
  );

  useEffect(
    () => (): void => {
      debounced.cancel();
    },
    [debounced]
  );

  return debounced;
}
