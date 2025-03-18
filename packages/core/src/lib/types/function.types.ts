export type UnknownUnaryFunction = (v: unknown) => unknown;
export type UnknownBinaryFunction = (a: unknown, b: unknown) => unknown;
export type UnknownTernaryFunction = (a: unknown, b: unknown, c: unknown) => unknown;
export type UnknownVariadicFunction = (...parameters: unknown[]) => unknown;

export type MapFunction<From, To> = (v: From) => To;
