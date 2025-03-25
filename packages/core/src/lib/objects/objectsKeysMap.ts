import isNil from './isNil';
import isNumber from './isNumber';
import isString from './isString';

type ObjectsKeyMap = {
  getKeyOf: (source: object) => string;
  /**
   * @param {object[]} keys
   * @example
   * Use the composite key in a regular Map:
   *
   * const map = new Map();
   *
   * const setValue = (o1, o2, o3, v) => {
   *   return map.set(compositeKey(o1, o2, o3), v);
   * };
   *
   * const getValue = (o1, o2, o3) => {
   *   return map.get(compositeKey(o1, o2, o3));
   * };
   */
  compositeKey: (...keys: object[]) => string;
};

export default function objectsKeyMap(): ObjectsKeyMap {
  const ids = new WeakMap<object, bigint>();
  let nextId = 1n;

  /** @description Generate a mask with a single bit set in the `id`-th place */
  const getBitMask = (o: object): bigint => {
    let id = ids.get(o);
    if (id === undefined) {
      id = nextId++;
      ids.set(o, id);
    }
    return 1n << id;
  };

  return {
    getKeyOf: (source: object): string => {
      if (isNil(source) || isString(source) || isNumber(source)) {
        return String(source);
      }
      //if (isPlainObject(source)) {
      return getBitMask(source).toString(10);
    },
    compositeKey: (...keys: object[]): string => keys.reduce((k, o) => k | getBitMask(o), 0n).toString(10),
  };
}
