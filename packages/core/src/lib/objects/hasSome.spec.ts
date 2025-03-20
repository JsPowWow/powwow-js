import hasSome from './hasSome';
import noop from '../fp/noop';

const notDefined = undefined;

describe('hasSome tests', () => {
  it('inspect available functionality', () => {
    expect(hasSome(null)).toBe(false);
    expect(hasSome(notDefined)).toBe(false);
    expect(hasSome('')).toBe(true);
    expect(hasSome(noop)).toBe(true);
    expect(hasSome(noop())).toBe(false);
  });

  describe('hasSome', () => {
    test.each`
      value             | expected
      ${undefined}      | ${false}
      ${null}           | ${false}
      ${['foo', 'bar']} | ${true}
      ${{ foo: 'bar' }} | ${true}
      ${10}             | ${true}
      ${''}             | ${true}
      ${'phrase'}       | ${true}
    `('"$value" -> $expected', ({ value, expected }) => {
      expect(hasSome(value)).toStrictEqual(expected);
    });
  });
});
