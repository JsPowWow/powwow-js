import type { FirstReturnType, LastParameterOf } from '../types/function.types';
import { type VariadicFunction } from '../types/function.types';
import { type Head } from '../types/utility.types';

type Allowed<Fns extends VariadicFunction<never>[], Cache extends VariadicFunction<never>[] = []> = Fns extends []
  ? Cache
  : Fns extends [infer Lst]
  ? Lst extends VariadicFunction<never>
    ? Allowed<[], [...Cache, Lst]>
    : never
  : Fns extends [infer Fst, ...infer Lst]
  ? Fst extends VariadicFunction<never>
    ? Lst extends VariadicFunction<never>[]
      ? Head<Lst> extends VariadicFunction<never>
        ? Head<Parameters<Fst>> extends ReturnType<Head<Lst>>
          ? Allowed<Lst, [...Cache, Fst]>
          : never
        : never
      : never
    : never
  : never;

export default function compose<
  F extends VariadicFunction<never>,
  Fns extends F[],
  Allow extends {
    0: [never];
    1: [LastParameterOf<Fns>];
  }[Allowed<Fns> extends never ? 0 : 1]
>(...parameters: [...Fns]): (...data: Allow) => FirstReturnType<Fns>;

export default function compose<F extends VariadicFunction, Fns extends F[], Allow extends unknown[]>(
  ...parameters: [...Fns]
) {
  return (...data: Allow): unknown => {
    return parameters.reduceRight((acc, f) => f(acc), data.length === 1 ? data[0] : data);
  };
}
//
// declare function foo(a: number): number[];
// declare function bar(a: string, s: symbol): number;
// declare function baz(a: number[]): string;
//
// const check = compose(foo, bar, baz)([1, 2, 3]); // [number]
// const check2 = compose(bar, foo)(1); // expected error
// console.log(check, check2);
