import hasSome from './hasSome';
import type { RecordKey } from '../types/core.types';
import isObjectTypeOf from './isObjectTypeOf';

export default function isPlainObject(source: unknown): source is Record<RecordKey, unknown> {
  return hasSome(source) && isObjectTypeOf('Object', source);
}

// export const isPlainObject = (val: unknown): val is Record<string, unknown> =>
//   Object.prototype.toString.call(val) === '[object Object]' &&
//   [Object.prototype, null].includes(Object.getPrototypeOf(val));
