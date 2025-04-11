import { useEffect, useRef } from '@powwow-js/reely';
import type { AnyFunction } from '@powwow-js/core';

/**
 * @Description Perform periodic callback calls with provided interval
 * @Param callback The `callback` function
 * @Param {number|null} interval The `interval` in milliseconds or null to pause
 */
export default function useInterval<Callback extends AnyFunction>(callback: Callback, interval: number | null): void {
  const savedCallback = useRef<Callback>(callback);
  savedCallback.current = callback;
  // Remember the latest function.
  // useEffect(() => {
  //   savedCallback.current = callback;
  // }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      savedCallback.current();
    }
    if (interval !== null) {
      const id = setInterval(tick, interval);
      return (): void => clearInterval(id);
    }
    return undefined;
  }, [interval]);
}
