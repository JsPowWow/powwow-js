import type { Maybe } from './maybe';

export const justUid = Symbol.for('@powwow-js::just');

export type Just<Value> = {
  [justUid]: Value;
  toString(): string;
};

export default function just<Value>(value: Value): Just<Value> {
  return {
    [justUid]: value,
    toString(): string {
      return `Just [${String(value)}]`;
    },
  };
}

export function isJust<Value>(value: unknown): value is Just<Value> {
  return Object.prototype.hasOwnProperty.call(value, justUid);
}

export function fold<Value>(monad: Maybe<Value>): Value | undefined {
  return isJust(monad) ? monad[justUid] : undefined;
}
