//import type { BinaryFunction, VariadicFunction } from '../types/function.types';

export type VariadicFunction = (...args: any[]) => any;
export type BinaryFunction = (a: any, b: any) => any;

export type FirstParameter<Function extends VariadicFunction> = Parameters<Function>[0];

export type SecondParameter<Function extends VariadicFunction> = Parameters<Function>[1];

export default function permutation2<
  F extends BinaryFunction,
  A = FirstParameter<F> | SecondParameter<F>,
  B = SecondParameter<F> | undefined
>(f: F, shouldCurry?: (a: A, b: B) => false): (a: FirstParameter<F>) => ReturnType<F>;

// export default function permutation2<
//   F extends BinaryFunction,
//   A = FirstParameter<F> | SecondParameter<F>,
//   B = SecondParameter<F> | undefined
// >(f: F, shouldCurry?: (a: A, b: B) => true): (a: FirstParameter<F>) => ReturnType<F>;

export default function permutation2<F extends BinaryFunction>(
  f: F,
  shouldCurry?: (a: FirstParameter<F> | SecondParameter<F>, b: SecondParameter<F> | undefined) => boolean
): VariadicFunction {
  return (...parameters) => {
    const [a1, b] = parameters;

    const should = shouldCurry ? shouldCurry?.(a1, b) : parameters.length < f.length;

    if (should) {
      return (a2: FirstParameter<F>) => f(a2, a1);
    }

    return f(a1, b);
    //return should ? (a2: FirstParameter<F>) => f(a2, a1) : f(a1, b);
  };
}
