import mapNullable from './mapNullable';
import type { MapFunction } from '@powwow-js/core';

const toUpperCase = (value: string): string => value.toUpperCase();
const addTen = (value: number): number => value + 10;
const toUndefined = (): undefined => undefined;
const notDefined = undefined;
describe('mapNullable tests', () => {
  const TEST_STRING = 'test me';

  it('should be curried having one provided argument', () => {
    expect(mapNullable(toUpperCase)).toBeInstanceOf(Function);
  });

  it('when given a concrete value applies the provided "mapper" function', () => {
    expect(mapNullable(toUpperCase, TEST_STRING)).toEqual('TEST ME');
    expect(mapNullable(toUpperCase)(TEST_STRING)).toEqual('TEST ME');
    expect(mapNullable(addTen, 15)).toBe(25);
  });

  it('when given a "Nil" returns null', () => {
    expect(mapNullable(toUpperCase, null)).toBe(null);
    expect(mapNullable(toUpperCase)(null)).toEqual(null);
    expect(mapNullable(toUpperCase, notDefined)).toBe(null);
    expect(mapNullable(toUpperCase)(notDefined)).toEqual(null);
  });

  it('safe', () => {
    expect(mapNullable(toUndefined, { foo: 'bar' })).toBe(null);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(mapNullable(null as unknown as MapFunction<null, unknown>, null)).toBe(null);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(mapNullable(null as unknown as MapFunction<null, unknown>)(null)).toBe(null);
    expect(mapNullable(toUpperCase)(null)).toEqual(null);
    expect(mapNullable(toUpperCase, notDefined)).toBe(null);
    expect(mapNullable(toUpperCase)(notDefined)).toEqual(null);
  });
});
