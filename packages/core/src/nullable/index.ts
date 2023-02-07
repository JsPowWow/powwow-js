// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Nullable {
  export type Nil = null | undefined;
  export type Of<T> = T | Nil;

  /**
   * @description Simple shorthand to check if provided value is {@link null} or {@link undefined}
   * @param source
   * @returns {boolean}
   */
  export const isNil = <T>(source: Nullable.Of<T>): source is Nil => source === null || source === undefined;

  /**
   * @description Simple shorthand to check if provided value is not {@link null} and not {@link undefined}
   * @param source
   * @returns {boolean}
   */
  export const isSome = <T>(source: Nullable.Of<T>): source is NonNullable<T> => !isNil(source);

  /**
   * @description Checks if provided value classified as a {@link String} primitive
   * @param source
   * @returns {boolean}
   */
  export const isString = (source: Nullable.Of<unknown>): source is string =>
    typeof source === 'string' || source instanceof String;

  /**
   * @description Checks if provided value classified as a {@link Number} primitive
   * @param source
   * @returns {boolean}
   */
  export const isNumber = (source: Nullable.Of<unknown>): source is number =>
    typeof source === 'number' || source instanceof Number;

  /**
   * @description Checks if provided value is a {@link Function} object
   * @param source
   * @returns {boolean}
   */
  export const isFunction = (source: Nullable.Of<unknown>) =>
    typeof source === 'function' || source instanceof Function;
}

export { Nullable };
