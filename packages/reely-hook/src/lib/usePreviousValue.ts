import type { RefObject } from '@powwow-js/reely';
import { useEffect, useRef } from '@powwow-js/reely';

export default function usePreviousValue<TValue>(value: TValue): RefObject<TValue | null> {
  const previousValue = useRef<TValue | null>(null);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue;
}
