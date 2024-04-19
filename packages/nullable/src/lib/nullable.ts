import { Nil, Nullable } from './types';

export function isNil<T>(value: Nullable<T>): value is Nil {
  return value === null || value === undefined;
}

export function isSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isSomeFunction<Fn extends (...args: unknown[]) => unknown>(
  value: unknown
): value is NonNullable<Fn> {
  return isSome<Fn>(value) && typeof value === 'function';
}
