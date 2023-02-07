import { map } from './map';

describe('Nullable "map" tests', () => {
  const TEST_STRING = 'test me';
  const toUpperCase = (value: string) => value.toUpperCase();
  const addTen = (value: number) => value + 10;
  const toUndefined = (): undefined => undefined;

  it('should be curried having one provided argument', () => {
    expect(map(toUpperCase)).toBeInstanceOf(Function);
  });

  it('when given a concrete value applies the provided "mapper" function', () => {
    expect(map(toUpperCase, TEST_STRING)).toEqual('TEST ME');
    expect(map(toUpperCase)(TEST_STRING)).toEqual('TEST ME');
    expect(map(addTen, 15)).toBe(25);
  });

  it('when given a "Nil" returns null', () => {
    expect(map(toUpperCase, null)).toBe(null);
    expect(map(toUpperCase)(null)).toEqual(null);
    expect(map(toUpperCase, undefined)).toBe(null);
    expect(map(toUpperCase)(undefined)).toEqual(null);
  });

  it('safe', () => {
    expect(map(toUndefined, { foo: 'bar' })).toBe(null);
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(map(null, null)).toBe(null);
    // @ts-ignore
    expect(map(null)(null)).toBe(null);
    expect(map(toUpperCase)(null)).toEqual(null);
    expect(map(toUpperCase, undefined)).toBe(null);
    expect(map(toUpperCase)(undefined)).toEqual(null);
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  });
});
