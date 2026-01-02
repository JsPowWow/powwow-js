import hasSome from './hasSome';
import isValidRecordKey from './isValidRecordKey';

export default function hasProperty<Property extends PropertyKey, SourceObject>(
  property: unknown,
  source: SourceObject
): source is SourceObject & Record<Property, unknown> {
  return isValidRecordKey(property) && typeof source === 'object' && hasSome(source) && property in source;
}
