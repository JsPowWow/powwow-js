import { Maybe } from './';

class Just<T> implements Maybe.Just<T> {
  public static create = <T>(value: NonNullable<T>) => new Just(value);
  private readonly value: NonNullable<T>;

  private constructor(value: NonNullable<T>) {
    this.value = value;
    if (value === null || value === undefined) {
      throw new Error(`Expected non-nullable value, but got "${value}".`);
    }
  }

  isJust(): true {
    return true;
  }

  isNothing(): false {
    return false;
  }

  chain<U>(fn: (v: T) => Maybe.Of<U>): Maybe.Of<U> {
    return fn(this.value);
  }

  extract(): NonNullable<T> {
    return this.value;
  }
}

export { Just };
