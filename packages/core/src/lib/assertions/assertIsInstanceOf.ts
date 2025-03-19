import type { ConstructorOf } from '../types/utility.types';
import assertIsNonNullable from './assertIsNonNullable';

export default function assertIsInstanceOf<T>(elementType: ConstructorOf<T>, value: unknown): asserts value is T {
  assertIsNonNullable(value, `#${String(elementType)}`);
  if (!(value instanceof elementType)) {
    throw new TypeError(`Not expected value: ${JSON.stringify(value)} of type: "${String(elementType)}"`);
  }
}
