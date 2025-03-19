/**
 * @description Checks if provided value can be classified as an `Error`
 */
export default function isError(maybeError: unknown): maybeError is Error {
  return maybeError instanceof Error;
}
