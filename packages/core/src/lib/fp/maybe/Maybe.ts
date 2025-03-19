import type { Nullable } from '../../types/core.types';
import hasSome from '../../objects/hasSome';

type MaybeWrapper<T> = { maybe: 'some'; value: NonNullable<T> } | { maybe: 'none' };

export class Maybe<T> {
  private constructor(private value: Nullable<T>) {}

  public static some<T>(value: T): Maybe<NonNullable<T>> {
    if (!hasSome(value)) {
      throw new Error('The provide value must not be a nullable.');
    }
    return new Maybe(value);
  }

  public static none<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  public static of<T>(value: Nullable<T>): Maybe<T> {
    return hasSome(value) ? Maybe.some(value) : Maybe.none<T>();
  }

  public map<R>(f: (wrapped: NonNullable<T>) => R): Maybe<R> {
    return hasSome(this.value) ? Maybe.of(f(this.value)) : Maybe.none<R>();
  }

  public flatMap<R>(f: (wrapped: NonNullable<T>) => Maybe<R>): Maybe<R> {
    return hasSome(this.value) ? f(this.value) : Maybe.none<R>();
  }

  public unwrap<R, D>(some: (wrapped: NonNullable<T>) => R, none: () => D): R | D {
    return hasSome(this.value) ? some(this.value) : none();
  }

  public match<R, D>(pattern: { some: (wrapped: NonNullable<T>) => R; none?: () => D }): R | D | undefined {
    return hasSome(this.value) ? pattern.some(this.value) : pattern.none?.();
  }

  public get(): MaybeWrapper<T> {
    return hasSome(this.value) ? { maybe: 'some', value: this.value } : { maybe: 'none' };
  }

  public getOrElse<V>(value: V): V | NonNullable<T> {
    return hasSome(this.value) ? this.value : value;
  }

  public getOrDefault(defaultValue: NonNullable<T>): NonNullable<T> {
    return hasSome(this.value) ? this.value : defaultValue;
  }
}
