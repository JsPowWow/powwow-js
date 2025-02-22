import { ConstructorOf, Nil, Nullable } from './types';

export function isNil<T>(value: Nullable<T>): value is Nil {
  return value === null || value === undefined;
}

export function hasSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isSomeFunction<Fn extends (...args: unknown[]) => unknown>(value: unknown): value is NonNullable<Fn> {
  return hasSome<Fn>(value) && typeof value === 'function';
}

export function assertIsNonNullable<T>(value: unknown, ...messages: Array<string>): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Nullish assertion Error: "${String(value)}"; ${messages?.join(' ')}`);
  }
}

export function assertIsInstanceOf<T>(elemType: ConstructorOf<T>, value: unknown): asserts value is T {
  assertIsNonNullable(value, `#${String(elemType)}`);
  if (!(value instanceof elemType)) {
    throw new Error(`Not expected value: ${String(value)} of type: "${String(elemType)}"`);
  }
}

export function isInstanceOf<T>(elemType: ConstructorOf<T>, value: unknown): value is T {
  return value instanceof elemType;
}

// export const isDeepFrozen = <T extends object>(obj: T): boolean => {
//   return (
//     Object.isFrozen(obj) && Object.keys(obj).every((prop) => typeof obj[prop] !== 'object' || isDeepFrozen(obj[prop]))
//   );
// };
//
// export const deepFreeze = <T extends object>(obj: T) => {
//   Object.keys(obj).forEach((prop) => {
//     if (typeof obj[prop as keyof T] === 'object' && !Object.isFrozen(obj[prop as keyof T])) {
//       deepFreeze(obj[prop as keyof T]);
//     }
//   });
//   return Object.freeze(obj);
// };
