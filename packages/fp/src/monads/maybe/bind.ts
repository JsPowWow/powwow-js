import { isJust } from './just';
import type { MapFunction } from '@powwow-js/core';
import { identity } from '@powwow-js/core';
import fold from './fold';
import type { Maybe } from './maybe';
import { compose } from '../../fns';
import __permutation from '../../internals/__permutation';

const bindMaybe = __permutation(<From, To>(monad: Maybe<From>, map: MapFunction<From, Maybe<To>>): Maybe<To> => {
  return isJust(monad) ? compose(map, fold, monad) : identity(monad);
});

/** @description Binds the value of the `monad` to new monad created by the `map`. */
export default function bind<From, To>(monad: Maybe<From>, map: MapFunction<From, Maybe<To>>): Maybe<To>;

/** @description Binds the value of the `monad` to new monad created by the `map`. */
export default function bind<From, To>(map: MapFunction<From, Maybe<To>>): (monad: Maybe<From>) => Maybe<To>;

/** @description Binds the value of the `monad` to new monad created by the `map`. */
export default function bind(...parameters: [unknown, unknown?]): unknown {
  return bindMaybe(...parameters);
}
