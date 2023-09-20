import { map } from './map';
import { useDefault } from './use-default';
import { Nil, Nullable } from '../types';

/**
 * @description Simple shorthand to check if provided value is null or undefined
 * @param source
 * @returns {boolean}
 */
export const isNil = <T>(source: Nullable<T>): source is Nil =>
  source === null || source === undefined;

/**
 * @description Simple shorthand to check if provided value is not null and not undefined
 * @param source
 * @returns {boolean}
 */
export const isSome = <T>(source: Nullable<T>): source is NonNullable<T> =>
  !isNil(source);

/**
 * @description Checks if provided value classified as a {@link String} primitive
 * @param source
 * @returns {boolean}
 */
export const isString = (source: Nullable<unknown>): source is string =>
  typeof source === 'string' || source instanceof String;

/**
 * @description Checks if provided value classified as a {@link Number} primitive
 * @param source
 * @returns {boolean}
 */
export const isNumber = (source: Nullable<unknown>): source is number =>
  typeof source === 'number' || source instanceof Number;

/**
 * @description Checks if provided value is a {@link Function} object
 * @param source
 * @returns {boolean}
 */
export const isFunction = (source: Nullable<unknown>): boolean =>
  typeof source === 'function' || source instanceof Function;

export { map };

export { useDefault };
