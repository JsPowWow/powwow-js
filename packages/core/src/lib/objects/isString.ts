/**
 * @description Checks if provided value can be classified as a `String` primitive
 */
export default function isString(source: unknown): source is string {
  return typeof source === 'string' || source instanceof String;
}
