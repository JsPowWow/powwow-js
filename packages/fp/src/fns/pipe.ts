import type { UnaryFunction } from '@powwow-js/core';
import { assertIsSomeFunction } from '@powwow-js/core';

/**
 * Makes a pipeline of functions from received arguments.
 */
export type Pipe<Arguments extends unknown[], Functions extends unknown[] = []> = Arguments['length'] extends 0
  ? Functions
  : Arguments extends [infer A, infer B]
  ? [(argument: A) => B, ...Functions]
  : Arguments extends [infer A, ...infer Rest, infer P, infer L]
  ? Pipe<[A, ...Rest, P], [(argument: P) => L, ...Functions]>
  : [];

/**
 * Destructures a pipeline of functions into arguments.
 */
export type DePipe<Functions extends UnaryFunction[], Arguments extends unknown[] = []> = Functions extends [
  (argument: infer Argument) => infer Return
]
  ? [...Arguments, Argument, Return]
  : Functions extends [(argument: infer Argument) => unknown, ...infer Rest extends UnaryFunction[]]
  ? DePipe<Rest, [...Arguments, Argument]>
  : [];

/**
 * (A -> B) . (B -> C) = A -> C
 */
export default function pipe<A extends unknown[], B, C>(
  f1: (...parameters: A) => B,
  f2: (v: B) => C
): (...parameters: A) => C;

/**
 * (A -> B) . (B -> C) = A -> C
 */
export default function pipe<A extends unknown[], B, C>(
  ...parameters: [...args: A, f1: (...parameters: A) => B, f2: (v: B) => C]
): C;

/**
 * (A -> B) . (B -> C) = A -> C
 */
export default function pipe<A extends unknown[], B, C>(
  ...initialArguments: [...parameters: A, f: (...parameters: A) => B, g: (v: B) => C]
): C | ((...parameters: A) => C) {
  if (initialArguments.length === 2) {
    return (...parameters: A): C => {
      const f1 = initialArguments[0];
      assertIsSomeFunction<unknown, B>(f1);
      const f2 = initialArguments[1];
      assertIsSomeFunction<B, C>(f2);

      return f2(f1(...parameters));
    };
  }

  const f2 = initialArguments.at(-1);
  assertIsSomeFunction<B, C>(f2);
  const f1 = initialArguments.at(-2);
  assertIsSomeFunction<unknown, B>(f1);

  return f2(f1(...initialArguments.slice(0, -2)));
}
