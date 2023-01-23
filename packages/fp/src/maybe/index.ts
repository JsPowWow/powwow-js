import { Nothing } from './Nothing';
import { Just } from './Just';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Maybe {
  export interface Some<T> {
    isJust(): this is Just<T>;

    isNothing(): this is Nothing;

    chain<U>(fn: (v: T) => Of<U>): Of<U>;
  }

  export interface Just<T> extends Some<T> {
    extract(): T;
  }

  export interface Nothing extends Some<never> {
    isJust(): false;

    isNothing(): true;
  }

  export type Of<T> = Just<T> | Nothing;

  export type toJustOrNothing<T> = T extends null | undefined ? Nothing : Just<T>;

  export function of<T>(value: T): toJustOrNothing<T> {
    if (value !== null && value !== undefined) {
      return <toJustOrNothing<T>>(<Just<T>>Just.create(value));
    }
    return <toJustOrNothing<never>>Nothing;
  }

  export const nothing = (): Nothing => Nothing;
}

export { Maybe };

const iNull = Maybe.of(null);
const isAj = iNull.isJust();
const aa = Maybe.of(undefined);
const b = Maybe.of(42);
const isBj = b.isJust();
const o = Maybe.of({ foo: 'bar' });
const isOj = o.isJust();
console.log(iNull, isAj, aa, b, isBj, o, isOj);
