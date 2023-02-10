import { IJust, Maybe } from './types';
import { isSome } from '@powwow-js/core';
import { Nothing } from './Nothing';

class Just<T> implements IJust<T> {
  readonly tag = 'AlwaysHasSome';

  public static of = <T>(value: T): IJust<T> => new Just(value);

  private readonly value: T;

  constructor(value: T) {
    this.value = value;
    if (!isSome(value)) {
      throw new Error(
        `Expect to have non-nullable provided value, but got "${value}".`
      );
    }
  }

  isJust(): true {
    return true;
  }

  isNothing(): false {
    return false;
  }

  map<U>(fn: (v: T) => U): Maybe<U> {
    return new Just<U>(fn(this.value));
  }

  fMap<U>(fn: (v: T) => Maybe<U>): Maybe<U> {
    return fn(this.value);
  }

  filter<U extends T>(predicate: (v: T) => v is U): Maybe<U>;
  filter(predicate: (v: T) => boolean): Maybe<T>;
  filter(predicate: (v: T) => boolean) {
    return predicate(this.value) ? Just.of(this.value) : Nothing;
  }

  match<U>(options: { just: (v: T) => U; nothing: () => U }): U {
    return options.just(this.value);
  }

  extract(): T {
    return this.value;
  }
}

export { Just };
