import compose from '../../compose2';
import identity from '../../identity';
import type { Maybe } from './maybe';
import { isJust } from './just';

import fold from './fold';
import type { MapFunction } from '../../../types/function.types';
import assertIsSomeFunction from '../../../assertions/assertIsSomeFunction';
import assertIsNonNullable from '../../../assertions/assertIsNonNullable';

const bindImpl = (monad: Maybe<unknown>, map: MapFunction<unknown, Maybe<unknown>>): Maybe<unknown> => {
  return isJust(monad) ? compose(map, fold, monad) : identity(monad);
};

/**
 * @description Binds the value of the `monad` to new monad created by the `transition` function.
 */
export default function bind<Value, NextValue>(
  map: MapFunction<Value, Maybe<NextValue>>
): (monad: Maybe<Value>) => Maybe<NextValue>;

/**
 * @description Binds the value of the `monad` to new monad created by the `transition` function.
 */
export default function bind<Value, NextValue>(
  monad: Maybe<Value>,
  map: MapFunction<Value, Maybe<NextValue>>
): Maybe<NextValue>;

export default function bind(...parameters: [unknown, unknown?]): unknown {
  if (parameters.length === 1) {
    const map = parameters[0];
    assertIsSomeFunction<unknown, never>(map);
    return (monad: Maybe<unknown>): Maybe<unknown> => {
      return bindImpl(monad, map);
    };
  }
  const monad = parameters[0];
  const map = parameters[1];

  assertIsNonNullable<Maybe<unknown>>(monad);
  assertIsSomeFunction<unknown, never>(map);

  return bindImpl(monad, map);
  // return permutation2Ts(
  //   <Value, NextValue>(monad: Maybe<Value>, map: MapFunction<Value, Maybe<NextValue>>): Maybe<NextValue> => {
  //     return isJust(monad) ? compose(map, fold, monad) : identity(monad);
  //   }
  // )(...parameters);
}
