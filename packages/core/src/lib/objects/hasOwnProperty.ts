export default function hasOwnProperty<Property extends PropertyKey, SourceObject>(
  property: Property,
  source: SourceObject
): source is SourceObject & Record<Property, unknown> {
  return Object.prototype.hasOwnProperty.call(source, property);
}
