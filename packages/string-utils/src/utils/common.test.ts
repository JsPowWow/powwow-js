import { capitalizeFirstCharacter } from './common';

describe('capitalizeFirstCharacter', () => {
  it('provides a type-guard', () => {
    expect(capitalizeFirstCharacter('test-me')).toBe('Test-me');
    expect(capitalizeFirstCharacter('')).toBe('');
    expect(capitalizeFirstCharacter(null)).toBe('');
    expect(capitalizeFirstCharacter(undefined)).toBe('');
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(capitalizeFirstCharacter(42)).toBe('');
    // @ts-ignore
    expect(capitalizeFirstCharacter({})).toBe('');
    // @ts-ignore
    expect(capitalizeFirstCharacter(['a,b,c'])).toBe('');
    // @ts-ignore
    expect(capitalizeFirstCharacter()).toBe('');
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  });

  test.each`
    value             | expected
    ${undefined}      | ${''}
    ${null}           | ${''}
    ${''}             | ${''}
    ${' '}            | ${' '}
    ${'phrase'}       | ${'Phrase'}
    ${['foo', 'bar']} | ${''}
    ${{ foo: 'bar' }} | ${''}
    ${10}             | ${''}
    ${'two words'}    | ${'Two words'}
  `('"$value" -> "$expected"', ({ value, expected }) => {
    expect(capitalizeFirstCharacter(value)).toStrictEqual(expected);
  });
});
