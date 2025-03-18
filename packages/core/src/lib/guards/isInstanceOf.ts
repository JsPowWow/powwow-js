import type { ConstructorOf } from '../types/object.types';

export default function isInstanceOf<T>(elementType: ConstructorOf<T>, value: unknown): value is T {
  return value instanceof elementType;
}
