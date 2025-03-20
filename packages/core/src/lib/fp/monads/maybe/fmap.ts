import compose from '../../compose2';
import identity from '../../identity';
import type { Maybe } from './maybe';
import maybe from './maybe';
import type { MapFunction } from '../../../types/function.types';
import { isJust } from './just';
import foldMap from './foldMap';
import assertIsSomeFunction from '../../../assertions/assertIsSomeFunction';
import assertIsNonNullable from '../../../assertions/assertIsNonNullable';

const fmapImpl = (monad: Maybe<unknown>, map: MapFunction<unknown, Maybe<unknown>>): Maybe<unknown> => {
  return isJust(monad) ? compose(maybe<unknown>, foldMap(map), monad) : identity(monad);
};

/**
 * @description Maps the value of the provided `monad` through the `transition` function
 * and returns a new `Maybe` of the mapped value.
 */
export default function fmap<Value, NextValue>(
  map: MapFunction<Value, NextValue>
): (monad: Maybe<Value>) => Maybe<NonNullable<NextValue>>;

/**
 * @description Maps the value of the provided `monad` through the `transition` function
 * and returns a new `Maybe` of the mapped value.
 */
export default function fmap<Value, NextValue>(
  monad: Maybe<Value>,
  map: MapFunction<Value, NextValue>
): Maybe<NonNullable<NextValue>>;

export default function fmap(...parameters: [unknown, unknown?]): unknown {
  if (parameters.length === 1) {
    const map = parameters[0];
    assertIsSomeFunction<unknown, never>(map);
    return (monad: Maybe<unknown>): Maybe<unknown> => {
      return fmapImpl(monad, map);
    };
  }
  const monad = parameters[0];
  const map = parameters[1];

  assertIsNonNullable<Maybe<unknown>>(monad);
  assertIsSomeFunction<unknown, never>(map);

  return fmapImpl(monad, map);
  // return permutation2Ts(<Value, NextValue>(monad: Maybe<Value>, map: MapFunction<Value, NextValue>): Maybe<NextValue> => {
  //   return isJust(monad) ? compose(maybe<NextValue>, foldMap(map), monad) : identity(monad);
  // })(...parameters);
}
