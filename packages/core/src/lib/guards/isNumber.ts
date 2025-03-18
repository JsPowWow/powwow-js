/**
 * @description Checks if provided value can be classified as a `Number` primitive
 */
export default function isNumber(source: unknown): source is number {
  return typeof source === 'number' || source instanceof Number;
}
