import hasSome from './hasSome';
import type { RecordKey } from '../types/core.types';

export default function isPlainObject(source: unknown): source is Record<RecordKey, unknown> {
  return hasSome(source) && typeof source === 'object' && Array.isArray(source) === false;
}
