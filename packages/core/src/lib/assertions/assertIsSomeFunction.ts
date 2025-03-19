import isSomeFunction from '../objects/isSomeFunction';
import type { VariadicFunction } from '../types/function.types';

export default function assertIsSomeFunction<
  I = unknown,
  O = unknown,
  F extends VariadicFunction<I, O> = VariadicFunction<I, O>
>(value: unknown, ...messages: string[]): asserts value is F {
  if (!isSomeFunction(value)) {
    throw new TypeError(`Not expected non-function value: ${JSON.stringify(value)} ; ${messages?.join(' ')}}`);
  }
}
