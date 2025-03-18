export type UnknownUnaryFunction = (v: unknown) => unknown;
export type UnknownBinaryFunction = (a: unknown, b: unknown) => unknown;
export type UnknownTernaryFunction = (a: unknown, b: unknown, c: unknown) => unknown;
export type UnknownVariadicFunction = (...parameters: unknown[]) => unknown;

export type PromiseResolve<Result> = (value: PromiseLike<Result> | Result) => void;
export type PromiseReject<Reason> = (reason: Reason) => void;

export type MapFunction<From, To> = (v: From) => To;
