import type { FirstParameterOf, LastReturnType } from '../types/function.types';
import { type VariadicFunction } from '../types/function.types';
import { type Head } from '../types/utility.types';

type AnyFunction = VariadicFunction<never>;

type Allowed<Fns extends AnyFunction[], Cache extends AnyFunction[] = []> = Fns extends []
  ? Cache
  : Fns extends [infer Lst]
  ? Lst extends AnyFunction
    ? Allowed<[], [...Cache, Lst]>
    : never
  : Fns extends [infer Fst, ...infer Lst]
  ? Fst extends AnyFunction
    ? Lst extends AnyFunction[]
      ? Head<Lst> extends AnyFunction
        ? ReturnType<Fst> extends Head<Parameters<Head<Lst>>>
          ? Allowed<Lst, [...Cache, Fst]>
          : never
        : never
      : never
    : never
  : never;

export default function pipeC<
  F extends AnyFunction,
  Fns extends F[],
  Allow extends {
    0: [never];
    1: [FirstParameterOf<Fns>];
  }[Allowed<Fns> extends never ? 0 : 1]
>(...parameters: [...Fns]): (...data: Allow) => LastReturnType<Fns>;

export default function pipeC<F extends VariadicFunction, Fns extends F[], Allow extends unknown[]>(
  ...parameters: [...Fns]
) {
  return (...data: Allow): unknown => {
    return parameters.reduce((acc, f) => f(acc), data.length === 1 ? data[0] : data);
  };
}

//
// declare function foo(v: string): [1, 2, 3];
// declare function baz(x: number[]): number;
// declare function bar(x: number): string[];
// declare function fin(x: string[]): symbol[];
//
// const check = pipeC(foo, baz, bar, fin)('hello'); // string[]
// const check3 = pipeC(baz, bar)([2]); // string[]
// const check2 = pipeC(baz, bar)('hello'); // expected error
// console.log(check, check2, check3);
