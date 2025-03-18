import type { ConstructorOf } from '@powwow-js/core';

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

export function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

// ================= https://catchts.com/FP-style =================

export const removeProperty = <TargetObject, Property extends keyof TargetObject>(
  object: TargetObject,
  property: Property
): Omit<TargetObject, Property> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [property]: _, ...rest } = object;
  return rest;
};

export const hasProperty = <TargetObject, Property extends string>(
  object: TargetObject,
  property: Property
): object is TargetObject & Record<Property, unknown> => Object.prototype.hasOwnProperty.call(object, property);
