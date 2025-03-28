export default function toRemovedProperty<SourceObject, Property extends keyof SourceObject>(
  property: Property,
  object: SourceObject
): Omit<SourceObject, Property> {
  // TODO AR
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [property]: _, ...rest } = object;
  return rest;
}
