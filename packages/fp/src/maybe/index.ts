import { Nothing } from './Nothing';
import { Just } from './Just';
import { isNil, isSome, Nil } from '@powwow-js/core';
import { MaybeOf } from './types';

const Maybe = {
  hasSome: <T>(value: unknown): value is NonNullable<T> => isSome(value),
  hasNothing: (value: unknown): value is Nil => isNil(value),
  /**
   * @description Factory function for {@link Maybe|Maybe's}. Depends on the "value" argument will return a Just<T> or Nothing
   */
  of: <T>(value: T): MaybeOf<T> => {
    if (isSome(value)) {
      return <MaybeOf<T>>Just.of(value);
    }
    return <MaybeOf<never>>Nothing;
  },
  /**
   * @description The "always nothing" {@link Maybe} instance
   */
  nothing: Nothing,
};

export { Maybe };
