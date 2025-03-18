import type { Nil } from '../types/core.types';

export default function isNil(value: unknown): value is Nil {
  return value === null || value === undefined;
}
