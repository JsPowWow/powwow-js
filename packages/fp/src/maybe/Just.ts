import { Maybe } from './';

class Just<T> implements Maybe.Just<T> {
  public static of = <T>(value: NonNullable<T>): Maybe.Just<T> => new Just(value);

  private readonly value: NonNullable<T>;

  constructor(value: NonNullable<T>) {
    this.value = value;
    if (!Maybe.hasSome(value)) {
      throw new Error(`Expect to have non-nullable value provided, but got "${value}".`);
    }
  }

  isJust(): true {
    return true;
  }

  isNothing(): false {
    return false;
  }

  map<U>(fn: (v: T) => NonNullable<U>): Maybe.Of<U> {
    return new Just<U>(fn(this.value));
  }

  fMap<U>(fn: (v: T) => Maybe.Of<U>): Maybe.Of<U> {
    return fn(this.value);
  }

  match<U>(options: { just: (v: NonNullable<T>) => NonNullable<U>; nothing: () => U }): U {
    return options.just(this.value);
  }

  extract(): NonNullable<T> {
    return this.value;
  }
}

export { Just };
