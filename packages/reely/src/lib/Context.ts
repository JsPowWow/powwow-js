import { ValueContext } from './types';

export function createContext<T>(defaultValue: T): ValueContext<T> {
  const context = {
    defaultValue,
  };
  Object.assign(context, { Provider: context });
  return context as ValueContext<T>;
}
