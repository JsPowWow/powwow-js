import { Nothing } from './Nothing';
import { Just } from './Just';

interface Maybe<T> {
  isJust(): this is Just<T>;

  isNothing(): this is Maybe.Nothing;

  /**
   * @description Map the "Maybe" contained value with the given function
   */
  map<U>(fn: (v: T) => U): Maybe.Of<U>;

  /**
   * @description Map the "Maybe" contained value using the given function which in turn will return another "Maybe"
   */
  fMap<U>(fn: (v: T) => Maybe.Of<U>): Maybe.Of<U>;

  /**
   * @description Match the "Maybe" stored value by executing a specific provided functions;
   * Will call "just" if it holds a value and "nothing" function if not
   */
  match<U>(options: { just: (v: NonNullable<T>) => NonNullable<U>; nothing: () => U }): U;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Maybe {
  export interface Just<T> extends Maybe<T> {
    extract(): T;
  }

  export interface Nothing extends Maybe<never> {
    isJust(): false;

    isNothing(): true;
  }

  export type Of<T> = Just<T> | Nothing;

  export type PickFrom<T> = T extends null | undefined ? Maybe.Nothing : Maybe.Just<T>;

  export const hasSome = <T>(value: unknown): value is NonNullable<T> => value !== null && value !== undefined;

  export const hasNothing = (value: unknown): value is null | undefined => value === null || value === undefined;

  /**
   * @description Factory function for {@link Of|Maybe's}. Depends on the "value" argument will return a Just<T> or Nothing
   */
  export function of<T>(value: T): PickFrom<T> {
    if (hasSome(value)) {
      return <PickFrom<T>>(<Just<T>>Just.of(value));
    }
    return <PickFrom<never>>Nothing;
  }

  export const nothing: Nothing = Nothing;
}

export { Maybe };
