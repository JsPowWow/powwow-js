/**
 * @description Call specified "fn" function with provided arguments
 */
export const call = <T>(
  fn: (...fnArgs: unknown[]) => T,
  ...args: unknown[]
): T => {
  return fn(...args);
};

/**
 * @description The "no operation" function; It gets any and return nothing.
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (..._: unknown[]): void => {
  // This is intentional
};

/**
 * @description Returns the first argument it receives.
 */
export const identity = <T>(source: T) => source;
