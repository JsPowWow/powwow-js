import { Nullable } from './index';

const useDefaultImpl = <T>(defaultValue: T, value: Nullable.Of<T>): T =>
  Nullable.isSome(value) ? value : defaultValue;

function useDefault<T>(defaultValue: T, value: Nullable.Of<T>): T;
function useDefault<T>(defaultValue: T): (value: Nullable.Of<T>) => T;

function useDefault<T>(defaultValue: T, value?: Nullable.Of<T>) {
  return arguments.length === 1
    ? (value: Nullable.Of<T>): T => useDefaultImpl(defaultValue, value)
    : useDefaultImpl(defaultValue, value);
}

export { useDefault };
