import type { MapFunction, Nullable } from '@powwow-js/core';
import { hasSome } from '@powwow-js/core';

const useMapper =
  <T, O>(f: MapFunction<T, O>) =>
  (value: Nullable<T>): Nullable<O> =>
    hasSome(value) ? f(value) ?? null : null;

export default function mapNullable<T, O>(f: MapFunction<T, O>, value: Nullable<T>): Nullable<O>;
export default function mapNullable<T, O>(f: MapFunction<T, O>): (value: Nullable<T>) => Nullable<O>;

/**
 * @description Returns mapped source value using provided `map` function
 */
export default function mapNullable<T, O>(f: MapFunction<T, O>, value?: Nullable<T>): unknown {
  const mapper = useMapper(f);
  if (arguments.length === 1) {
    return mapper;
  }
  return mapper(value);
}

export { mapNullable };
