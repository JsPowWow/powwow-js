import noop from '../fp/noop';
import objectsKeyMap from './objectsKeysMap';

const notDefined = undefined;

describe('objectsKeyMap tests', () => {
  it('inspect available functionality', () => {
    const keys = objectsKeyMap();
    expect(keys.getKeyOf(null as unknown as object)).toBe('null');
    expect(keys.getKeyOf(notDefined as unknown as object)).toBe('undefined');
    expect(keys.getKeyOf('' as unknown as object)).toBe('');
    expect(keys.getKeyOf(noop)).toBe('2');
    expect(keys.getKeyOf({})).toBe('4');
  });

  describe('hasSome', () => {
    const keys = objectsKeyMap();

    const theObject = { test: 'me' };

    test.each`
      value             | expected
      ${undefined}      | ${`undefined`}
      ${null}           | ${`null`}
      ${['foo', 'bar']} | ${'2'}
      ${theObject}      | ${'4'}
      ${{ foo: 'bar' }} | ${'8'}
      ${10}             | ${'10'}
      ${''}             | ${''}
      ${'phrase'}       | ${'phrase'}
      ${{ foo: 'bar' }} | ${'16'}
      ${theObject}      | ${'4'}
    `('"$value" -> $expected', ({ value, expected }: { value: object; expected: unknown }) => {
      expect(keys.getKeyOf(value)).toStrictEqual(expected);
    });
  });
});
