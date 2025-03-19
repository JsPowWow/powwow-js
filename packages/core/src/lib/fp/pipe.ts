import type { UnaryFunction } from '../types/function.types';

type Pipe = {
  <A>(v: A): A;
  <A, B>(v: A, f1: (v: A) => B): B;
  <A, B, C>(v: A, f1: (v: A) => B, f2: (v: B) => C): C;
  <A, B, C, D>(v: A, f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D): D;
  <A, B, C, D, E>(v: A, f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D, f4: (v: D) => E): E;
  <A, B, C, D, E, F>(v: A, f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D, f4: (v: D) => E, f5: (v: E) => F): F;
  // ... etc.
};

/**
 * @description
 * @example pipe('initialValue', f1, f2,...f2);
 */
export const pipe: Pipe = <T>(initialValue: T, ...fns: UnaryFunction<T, T>[]): unknown => {
  return fns.reduce((acc, f) => f(acc), initialValue);
};

export default pipe;
