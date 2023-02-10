import { isString, Nullable, useDefault } from '@powwow-js/core';
import { identity, Maybe } from '@powwow-js/fp';

const capitalize1stChar = (s: string): NonNullable<string> =>
  s.charAt(0).toUpperCase() + s.slice(1);

/**
 * @description Get a copy of source string with first character capitalized
 * @param {string} source
 * @return {string}
 */
const capitalizeFirstCharacter = (
  source: Nullable<string>
): NonNullable<string> =>
  Maybe.of(source)
    .filter(isString)
    .map(capitalize1stChar)
    .match<string>({
      just: identity,
      nothing: useDefault(''),
    });

export { capitalizeFirstCharacter };
