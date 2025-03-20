import type { Nullable } from '@powwow-js/core';
import { hasSome } from '@powwow-js/core';

const useDefaultImpl = <T>(defaultValue: T, value: Nullable<T>): T => (hasSome(value) ? value : defaultValue);

export default function usingDefault<T>(defaultValue: T, value: Nullable<T>): T;
export default function usingDefault<T>(defaultValue: T): (value: Nullable<T>) => T;

/**
 * @description Returns provided source value or `defaultValue` in case of `nullish` source
 */
export default function usingDefault<T>(defaultValue: T, value?: Nullable<T>): unknown {
  return arguments.length === 1
    ? (value: Nullable<T>): T => useDefaultImpl(defaultValue, value)
    : useDefaultImpl(defaultValue, value);
}

export { usingDefault };
