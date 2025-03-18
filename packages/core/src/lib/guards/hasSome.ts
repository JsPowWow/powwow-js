/**
 * @description Checks if provided value is not a `null` or `undefined`
 */
export default function hasSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
