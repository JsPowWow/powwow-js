import type { RefObject } from '@powwow-js/reely';
import { useRef } from '@powwow-js/reely';

export default function useCurrentValueReference<Value>(value: Value): RefObject<Value> {
  const valueReference = useRef(value);
  valueReference.current = value;
  // useLayoutEffect(() => {
  //   valueRef.current = value;
  // });

  return valueReference;
}
