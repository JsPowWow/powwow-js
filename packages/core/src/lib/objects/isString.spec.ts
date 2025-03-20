import isString from './isString';

describe('isString', () => {
  test.each`
    value             | expected
    ${undefined}      | ${false}
    ${null}           | ${false}
    ${' '}            | ${true}
    ${['foo', 'bar']} | ${false}
    ${{ foo: 'bar' }} | ${false}
    ${10}             | ${false}
    ${''}             | ${true}
    ${'phrase'}       | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isString(value)).toStrictEqual(expected);
  });
});
