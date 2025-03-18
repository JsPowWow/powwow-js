import type { UnknownVariadicFunction } from '../types/function.types';
import hasSome from './hasSome';

/**
 * @description Checks if provided value can be classified as a callable `function`
 */
export default function isSomeFunction<SomeFunction extends UnknownVariadicFunction>(
  value: unknown
): value is NonNullable<SomeFunction> {
  return hasSome(value) && typeof value === 'function';
}
