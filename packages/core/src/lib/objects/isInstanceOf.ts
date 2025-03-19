import type { ConstructorOf } from '../types/utility.types';

export default function isInstanceOf<T>(instanceType: ConstructorOf<T>, instance: unknown): instance is T {
  return instance instanceof instanceType;
}
