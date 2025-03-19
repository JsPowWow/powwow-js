export type UnaryFunction<I = unknown, O = unknown> = (v: I) => O;
export type VariadicFunction<I = unknown, O = unknown> = (...parameters: I[]) => O;
export type UnknownBinaryFunction = (a: unknown, b: unknown) => unknown;
export type UnknownTernaryFunction = (a: unknown, b: unknown, c: unknown) => unknown;

export type PromiseResolve<Result> = (value: PromiseLike<Result> | Result) => void;
export type PromiseReject<Reason> = (reason: Reason) => void;

export type MapFunction<From, To> = (v: From) => To;
