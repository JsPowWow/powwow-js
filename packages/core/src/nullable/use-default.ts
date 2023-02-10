import { Nullable } from '../types';
import { isSome } from './index';

const useDefaultImpl = <T>(defaultValue: T, value: Nullable<T>): T =>
  isSome(value) ? value : defaultValue;

function useDefault<T>(defaultValue: T, value: Nullable<T>): T;
function useDefault<T>(defaultValue: T): (value: Nullable<T>) => T;
/**
 * @description Returns provided source value or "defaultValue" for nullish source
 */
function useDefault<T>(defaultValue: T, value?: Nullable<T>) {
  return arguments.length === 1
    ? (value: Nullable<T>): T => useDefaultImpl(defaultValue, value)
    : useDefaultImpl(defaultValue, value);
}

export { useDefault };
