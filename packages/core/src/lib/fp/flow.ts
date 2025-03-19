import type { UnaryFunction } from '../types/function.types';

type Flow = {
  (): <A>(v: A) => A;
  <A, B>(f1: (v: A) => B): (v: A) => B;
  <A, B, C>(f1: (v: A) => B, f2: (v: B) => C): (v: A) => C;
  <A, B, C, D>(f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D): (v: A) => D;
  <A, B, C, D, E>(f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D, f4: (v: D) => E): (v: A) => E;
  <A, B, C, D, E, F>(f1: (v: A) => B, f2: (v: B) => C, f3: (v: C) => D, f4: (v: D) => E, f5: (v: E) => F): (v: A) => F;
  // ... etc.
};

/**
 * @description flow(f1, f2, f3, ..., fn)(initialValue);
 */
const flow: Flow = <T>(...fns: UnaryFunction<T, T>[]) => {
  return (value: T) => fns.reduce((acc, f) => f(acc), value);
};

export default flow;
