import type { BinaryFunction, UnaryFunction } from '@powwow-js/core';
import { hasSome } from '@powwow-js/core';
import __call from './__call';

export default function __permutation<F extends BinaryFunction<never, never>>(f: F) {
  return <
    Parameters extends [unknown, unknown?],
    First = Parameters extends [infer A] ? A : never,
    Return = Parameters extends [First] ? UnaryFunction<First, ReturnType<F>> : ReturnType<F>
  >(
    ...parameters: Parameters
  ): Return => {
    if (hasSome(parameters[1])) {
      return __call(f, ...parameters);
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return ((p1: unknown): unknown => __call(f, p1, parameters[0])) as Return;
  };
}
