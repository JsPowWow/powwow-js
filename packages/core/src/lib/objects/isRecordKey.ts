import isValidRecordKey from './isValidRecordKey';
import type { UnknownRecord } from '../types/core.types';

export default function isRecordKey<Source extends UnknownRecord>(key: unknown, source: Source): key is keyof Source {
  return isValidRecordKey(key) && key in source;
}
