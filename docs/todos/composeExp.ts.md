import { ParametersOf, ReturnTypeOf, type VariadicFunction } from '../../packages/core/src/lib/types/function.types';
import { type Last } from '../../packages/core/src/lib/types/utility.types';
import assertIsSomeFunction from '../../packages/core/src/lib/assertions/assertIsSomeFunction';

type AnyFunction = VariadicFunction<never>;

type Compose<First, Second, Return> = ParametersOf<First>[0] extends ReturnTypeOf<Second> ? Return : never;

type Iterate<T extends unknown[], Cache extends unknown[] = []> = T extends []
  ? Cache
  : T extends [infer Lst]
  ? Iterate<[], [...Cache, Lst]>
  : T extends [infer Fst, ...infer Lst]
  ? Compose<Fst, Lst[0], Iterate<Lst, [...Cache, Fst]>>
  : never;

type ComposeArgument<Fns extends AnyFunction[]> = Iterate<Fns> extends never ? never : ParametersOf<Last<Fns>>[0];

const composeExp =
  <F extends AnyFunction, Fns extends F[]>(...parameters: [...Fns]) =>
  (...data: [ComposeArgument<Fns>]): ReturnType<Fns[0]> => {
    throw new Error('Not implemented');
    // return parameters.reduceRight(
    //   (acc, f) => {
    //     //assertIsSomeFunction<ReturnType<Fns[0]>>(f);
    //     return f(acc);
    //   },
    //   data.length === 1 ? data[0] : data
    // );
  };

export default composeExp;
//
// declare function foo(a: number): 1 | 2 | 'fin';
// declare function bar(a: string): number;
// declare function baz(a: number[]): string;
//
// const check = composeExp(foo, (x: number) => x, bar, baz)([1, 2, 3]); // [number]
// const check2 = composeExp(bar, foo)(1); // expected error
// console.log(check, check2);
