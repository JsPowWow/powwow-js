import compose from '../../compose2';

import fold from './fold';
import type { Maybe } from './maybe';
import type { Just } from './just';
import { isJust } from './just';
import type { Nothing } from './nothing';
import type { MapFunction } from '../../../types/function.types';
import assertIsSomeFunction from '../../../assertions/assertIsSomeFunction';
import assertIsNonNullable from '../../../assertions/assertIsNonNullable';

/**
 * A type to unwrap the provided `Monad` into the new value type.
 */
export type FoldMap<Monad extends Maybe<never>, NextValue> = Monad extends Just<never>
  ? NextValue
  : Monad extends Nothing
  ? undefined
  : Monad extends Maybe<never>
  ? NextValue | undefined
  : never;

const foldImpl = (monad: Maybe<unknown>, map: MapFunction<unknown, Maybe<unknown>>): Maybe<unknown> | undefined => {
  return isJust(monad) ? compose(map, fold, monad) : undefined;
};

/**
 * @description Maps the value of the provided `monad` through the `transition` function
 * and returns the mapped value or `null`.
 */
export default function foldMap<Value, NextValue>(
  map: MapFunction<Value, NextValue>
): (monad: Maybe<Value>) => NextValue | undefined;

/**
 * @description  Maps the value of the provided `monad` through the `transition` function
 * and returns the mapped value or `null`.
 */
export default function foldMap<Value, NextValue>(
  monad: Maybe<Value>,
  map: MapFunction<Value, NextValue>
): NextValue | undefined;

export default function foldMap(...parameters: [unknown, unknown?]): unknown {
  if (parameters.length === 1) {
    const map = parameters[0];
    assertIsSomeFunction<unknown, never>(map);
    return (monad: Maybe<unknown>): Maybe<unknown> | undefined => {
      return foldImpl(monad, map);
    };
  }
  const monad = parameters[0];
  const map = parameters[1];

  assertIsNonNullable<Maybe<unknown>>(monad);
  assertIsSomeFunction<unknown, never>(map);

  return foldImpl(monad, map);

  // return permutation2Ts(
  //   <Value, NextValue>(monad: Maybe<Value>, map: MapFunction<Value, NextValue>): NextValue | undefined => {
  //     return isJust(monad) ? compose(map, fold, monad) : undefined;
  //   }
  // )(...parameters);
}
