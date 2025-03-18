export default function removeProperty<TargetObject, Property extends keyof TargetObject>(
  object: TargetObject,
  property: Property
): Omit<TargetObject, Property> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [property]: _, ...rest } = object;
  return rest;
}
