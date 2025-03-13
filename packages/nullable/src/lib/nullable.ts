import type { ConstructorOf, Nil, Nullable } from './types';

export function isNil<T>(value: Nullable<T>): value is Nil {
  return value === null || value === undefined;
}

export function hasSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isSomeFunction<SomeFunction extends (...parameters: unknown[]) => unknown>(
  value: unknown
): value is NonNullable<SomeFunction> {
  return hasSome<SomeFunction>(value) && typeof value === 'function';
}

/**
 * @description Checks if provided value can be classified as a `String` primitive
 */
export const isString = (source: Nullable<unknown>): source is string =>
  typeof source === 'string' || source instanceof String;

/**
 * @description Checks if provided value can be classified as a `Number` primitive
 */
export const isNumber = (source: Nullable<unknown>): source is number =>
  typeof source === 'number' || source instanceof Number;

export function assertIsNonNullable<T>(value: unknown, ...messages: string[]): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Nullish assertion Error: "${String(value)}"; ${messages?.join(' ')}`);
  }
}

export function assertIsInstanceOf<T>(elementType: ConstructorOf<T>, value: unknown): asserts value is T {
  assertIsNonNullable(value, `#${String(elementType)}`);
  if (!(value instanceof elementType)) {
    throw new TypeError(`Not expected value: ${JSON.stringify(value)} of type: "${String(elementType)}"`);
  }
}

export function isInstanceOf<T>(elementType: ConstructorOf<T>, value: unknown): value is T {
  return value instanceof elementType;
}

export const exhaustiveGuard = (_: never): never => {
  throw new Error(`Not expected value: "${String(_)}"`);
};

export const noop = (): void => {
  return undefined;
};

export const identity = <T>(source: T): T => source;

export function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
