import { Nil } from '@powwow-js/core';

interface IMaybe<T> {
  /**
   * @description Indicates that this {@link Maybe} is "Just"
   */
  isJust(): this is IJust<T>;

  /**
   * @description Indicates that this {@link Maybe} is "nothing"
   */
  isNothing(): this is INothing;

  /**
   * @description Map the {@link Maybe} contained value with the given function
   */
  map<U>(fn: (v: T) => U): Maybe<U>;

  /**
   * @description Map the {@link Maybe} contained value using the given function which in turn will return another {@link Maybe}
   */
  fMap<U>(fn: (v: T) => Maybe<U>): Maybe<U>;

  /**
   * @description Returns `this` or Nothing depends on predicate function boolean result
   */
  filter<U extends T>(predicate: (v: T) => v is U): Maybe<U>;

  /**
   * @description Returns `this` or Nothing depends on predicate function boolean result
   */
  filter(predicate: (v: T) => boolean): Maybe<T>;

  /**
   * @description Match the {@link Maybe} stored value by executing a specific provided functions;
   * Will call "just" if it holds a value and "nothing" function if not
   */
  match<U>(options: { just: (v: T) => U; nothing: (...args: never[]) => U }): U;
}

export interface IJust<T> extends IMaybe<T> {
  readonly tag: 'AlwaysHasSome';

  extract(): T;
}

export interface INothing extends IMaybe<never> {
  readonly tag: 'AlwaysNothing';
}

export type Maybe<T> = IJust<T> | INothing;

export type MaybeOf<T> = T extends Nil ? INothing : IJust<T>;
