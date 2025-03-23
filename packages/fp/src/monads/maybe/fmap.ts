import { isJust } from './just';
import type { MapFunction } from '@powwow-js/core';
import { assertIsNonNullable, assertIsSomeFunction, identity } from '@powwow-js/core';
import maybe from './maybe';
import foldMap from './foldMap';
import type { Maybe } from './maybe';
import compose from '../../fns/compose';

const fmapImpl = (monad: Maybe<unknown>, map: MapFunction<unknown, Maybe<unknown>>): Maybe<unknown> => {
  return isJust(monad) ? compose(maybe<unknown>, foldMap(map), monad) : identity(monad);
};

/** @description Maps the value of the provided `monad` through the `map` function and returns a new `Maybe` of the mapped value. */
export default function fmap<From, To>(map: MapFunction<From, To>): (monad: Maybe<From>) => Maybe<NonNullable<To>>;

/** @description Maps the value of the provided `monad` through the `map` function and returns a new `Maybe` of the mapped value. */
export default function fmap<From, To>(monad: Maybe<From>, map: MapFunction<From, To>): Maybe<NonNullable<To>>;

/** @description Maps the value of the provided `monad` through the `map` function and returns a new `Maybe` of the mapped value. */
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

  // TODO AR permutation
  assertIsNonNullable<Maybe<unknown>>(monad);
  assertIsSomeFunction<unknown, never>(map);

  return fmapImpl(monad, map);
  // return permutation2Ts(<Value, NextValue>(monad: Maybe<Value>, map: MapFunction<Value, NextValue>): Maybe<NextValue> => {
  //   return isJust(monad) ? flowRight(maybe<NextValue>, foldMap(map), monad) : identity(monad);
  // })(...parameters);
}
