import type { RecordKey } from '../types/core.types';

export default function isValidRecordKey(source: unknown): source is RecordKey {
  return typeof source === 'string' || typeof source === 'number' || typeof source === 'symbol';
}
