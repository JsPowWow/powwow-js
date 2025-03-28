/**
 * @description Checks if provided value can be classified as a `Boolean` primitive
 */
export default function isBoolean(source: unknown): source is boolean {
  return typeof source === 'boolean' || source instanceof Boolean;
}
