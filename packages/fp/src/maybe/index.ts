import { Nothing } from './Nothing';
import { Just } from './Just';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Maybe {
  interface Maybe<T> {
    /**
     * @description Indicates that this {@link Of|Maybe} is "Just"
     */
    isJust(): this is Just<T>;

    /**
     * @description Indicates that this {@link Of|Maybe} is "nothing"
     */
    isNothing(): this is Maybe.Nothing;

    /**
     * @description Map the {@link Of|Maybe} contained value with the given function
     */
    map<U>(fn: (v: T) => U): Maybe.Of<U>;

    /**
     * @description Map the {@link Of|Maybe} contained value using the given function which in turn will return another {@link Of|Maybe}
     */
    fMap<U>(fn: (v: T) => Maybe.Of<U>): Maybe.Of<U>;

    /**
     * @description Match the {@link Of|Maybe} stored value by executing a specific provided functions;
     * Will call "just" if it holds a value and "nothing" function if not
     */
    match<U>(options: { just: (v: NonNullable<T>) => NonNullable<U>; nothing: () => U }): U;
  }

  export interface Just<T> extends Maybe<T> {
    extract(): T;
  }

  export interface Nothing extends Maybe<never> {
    isJust(): false;

    isNothing(): true;
  }

  export type Of<T> = Just<T> | Nothing;

  export type Infer<T> = T extends null | undefined ? Maybe.Nothing : Maybe.Just<T>;

  export const hasSome = <T>(value: unknown): value is NonNullable<T> => value !== null && value !== undefined;

  export const hasNothing = (value: unknown): value is null | undefined => value === null || value === undefined;

  /**
   * @description Factory function for {@link Of|Maybe's}. Depends on the "value" argument will return a Just<T> or Nothing
   */
  export function of<T>(value: T): Infer<T> {
    if (hasSome(value)) {
      return <Infer<T>>Just.of(value);
    }
    return <Infer<never>>Nothing;
  }

  export const nothing: Nothing = Nothing;
}

export { Maybe };
