import type { Maybe } from './maybe';
import type { Just } from './just';
import { isJust, unwrap } from './just';
import type { Nothing } from './nothing';

/** @description A type to unwrap the value type of the provided `Monad`. */
export type Fold<Monad extends Maybe<never>> = Monad extends Just<infer Value>
  ? Value
  : Monad extends Nothing
  ? undefined
  : Monad extends Maybe<infer Value>
  ? Value | undefined
  : never;

/** @description  Returns the value of the provided `monad`. */
export default function fold<Monad extends Just<never>>(monad: Monad): Fold<Monad>;

/** @description  Returns the value of the provided `monad`. */
export default function fold<Value>(monad: Maybe<Value>): Value | undefined;

/** @description  Returns the value of the provided `monad`. */
export default function fold<Value>(monad: Maybe<Value>): Value | undefined {
  return isJust(monad) ? unwrap(monad) : undefined;
}
