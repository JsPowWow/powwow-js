import type { Maybe } from './maybe';
import type { Just } from './just';
import { isJust, justUid } from './just';
import { nothingUid } from './nothing';
import type { Nothing } from './nothing';

/**
 * A type to unwrap the value type of the provided `Monad`.
 */
export type Fold<Monad extends Maybe<never>> = Monad extends Just<infer Value>
  ? Value
  : Monad extends Nothing
  ? undefined
  : Monad extends Maybe<infer Value>
  ? Value | undefined
  : never;

/**
 * Returns the value of the provided `monad`.
 */
export default function fold<Monad extends Just<never>>(monad: Monad): Fold<Monad>;

/**
 * Returns the value of the provided `monad`.
 */
export default function fold<Value>(monad: Maybe<Value>): Value | undefined;

/**
 * Returns the value of the provided `monad`.
 */
export default function fold<Value>(monad: Maybe<Value>): Value | undefined {
  return isJust(monad) ? monad[justUid] : monad[nothingUid];
}
