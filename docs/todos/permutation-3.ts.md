import type { TernaryFunction } from '../../packages/core/src/lib/types/function.types';

export type VariadicFunction = (...args: any[]) => any;

import type { FirstParameter, SecondParameter } from './permutation-2.ts.md';

export type ThirdParameter<Function extends VariadicFunction> = Parameters<Function>[2];

export default function permutation3<
F extends TernaryFunction<never, never, never>,
A = FirstParameter<F> | SecondParameter<F>,
B = SecondParameter<F> | ThirdParameter<F>,
C = ThirdParameter<F> | undefined

> (f: F, shouldCurry?: (a: A, b: B, c: C) => boolean): VariadicFunction;

export default function permutation3<
F extends TernaryFunction<never, never, never>,
A = FirstParameter<F> | SecondParameter<F>,
B = SecondParameter<F> | ThirdParameter<F>,
C = ThirdParameter<F> | undefined

> (f: F, shouldCurry?: (a: A, b: B, c: C) => boolean): VariadicFunction {
> return (...parameters: [A, B, C, ...rest: unknown[]]) => {

    const [a1, b, c] = parameters;

    const should = shouldCurry ? shouldCurry?.(a1, b, c) : parameters.length < f.length;

    if (should) {
      return (a2: FirstParameter<F>) => f(a2, a1, b);
    }

    return f(a1, b, c);

    // return should ? (a2: FirstParameter<F>) => f(a2, a1, b) : f(a1, b, c);

};
}
