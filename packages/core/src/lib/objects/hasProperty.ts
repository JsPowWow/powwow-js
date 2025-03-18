export default function hasProperty<TargetObject, Property extends string>(
  object: TargetObject,
  property: Property
): object is TargetObject & Record<Property, unknown> {
  return Object.prototype.hasOwnProperty.call(object, property);
}
