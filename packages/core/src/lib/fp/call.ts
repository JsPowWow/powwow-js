import { type UnknownVariadicFunction } from '../types/function.types';

/**
 * @description Call specified `function` with provided arguments
 */
export default function call<T>(f: UnknownVariadicFunction<T>, ...parameters: unknown[]): T {
  return f(...parameters);
}
