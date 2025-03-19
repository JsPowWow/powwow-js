import hasSome from './hasSome';
import isValidRecordKey from './isValidRecordKey';
import type { RecordKey } from '../types/core.types';

export default function hasProperty<Property extends RecordKey, SourceObject>(
  property: unknown,
  source: SourceObject
): source is SourceObject & Record<Property, unknown> {
  return isValidRecordKey(property) && typeof source === 'object' && hasSome(source) && property in source;
}
