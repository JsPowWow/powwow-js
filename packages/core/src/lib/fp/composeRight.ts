import type { UnaryFunction } from '../types/function.types';

/**
 * Makes a composition of functions from received arguments.
 */
export type ComposeRight<Arguments extends unknown[], Functions extends unknown[] = []> = Arguments['length'] extends 0
  ? Functions
  : Arguments extends [infer A, infer B]
  ? [...Functions, (v: A) => B]
  : Arguments extends [infer A, ...infer Rest, infer P, infer L]
  ? ComposeRight<[A, ...Rest, P], [...Functions, (v: P) => L]>
  : [];

/**
 * Destructures a composition of functions into arguments.
 */
export type DecomposeRight<Functions extends UnaryFunction[], Arguments extends unknown[] = []> = Functions extends [
  (argument: infer Argument) => infer Return
]
  ? [...Arguments, Argument, Return]
  : Functions extends [...infer Rest extends UnaryFunction[], (argument: infer Argument) => unknown]
  ? DecomposeRight<Rest, [...Arguments, Argument]>
  : [];

/**
 * (B -> C) . (A -> B) = A -> C
 */
export default function composeRight<A extends unknown[], B, C>(
  f2: (v: B) => C,
  f1: (...parameters: A) => B
): (...parameters: A) => C;

/**
 * (B -> C) . (A -> B) = A -> C
 */
export default function composeRight<A extends unknown[], B, C>(
  f: (v: B) => C,
  g: (...parameters: A) => B,
  ...parameters: A
): C;

/**
 * (B -> C) . (A -> B) = A -> C
 */
export default function composeRight<A extends unknown[], B, C>(
  f: (v: B) => C,
  g: (...parameters: A) => B,
  ...initialArguments: A
): C | ((...parameters: A) => C) {
  return initialArguments.length === 0 ? (...parameters: A): C => f(g(...parameters)) : f(g(...initialArguments));
}
