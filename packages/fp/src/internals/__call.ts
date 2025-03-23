import type { VariadicFunction } from '@powwow-js/core';

export default function call<Return = unknown, Parameters = unknown>(
  maybeFunction: unknown,
  ...parameters: Parameters[]
): Return {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (maybeFunction as VariadicFunction<unknown, Return>)(...parameters);
}
