import type { Head, Last } from './utility.types';

export type UnaryFunction<Parameter = unknown, R = unknown> = (v: Parameter) => R;

export type VariadicFunction<Parameters = unknown, R = unknown> = (...parameters: Parameters[]) => R;

export type ParametersOf<T> = T extends (...parameters: infer P) => unknown ? P : never;

export type LastParameterOf<Fns extends VariadicFunction<never>[]> = Last<Fns> extends VariadicFunction<never>
  ? Head<Parameters<Last<Fns>>>
  : never;

export type FirstParameterOf<T extends VariadicFunction<never>[]> = Head<T> extends VariadicFunction<never>
  ? Head<Parameters<Head<T>>>
  : never;

export type ReturnTypeOf<T> = T extends (...parameters: never) => infer R ? R : never;

export type FirstReturnType<Fns extends VariadicFunction<never>[]> = Head<Fns> extends VariadicFunction<never>
  ? ReturnType<Head<Fns>>
  : never;

export type LastReturnType<Fns extends VariadicFunction<never>[]> = Last<Fns> extends VariadicFunction<never>
  ? ReturnType<Last<Fns>>
  : never;

export type BinaryFunction = <A = unknown, B = unknown, R = unknown>(a: A, b: B) => R;
export type TernaryFunction = <A = unknown, B = unknown, C = unknown, R = unknown>(a: A, b: B, c: C) => R;

export type PromiseResolve<Result> = (value: PromiseLike<Result> | Result) => void;
export type PromiseReject<Reason> = (reason: Reason) => void;

export type MapFunction<From, To> = (v: From) => To;
