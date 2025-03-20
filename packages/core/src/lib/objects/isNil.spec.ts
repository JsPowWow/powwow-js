import isNil from './isNil';

describe('isNil', () => {
  test.each`
    value             | expected
    ${undefined}      | ${true}
    ${null}           | ${true}
    ${['foo', 'bar']} | ${false}
    ${{ foo: 'bar' }} | ${false}
    ${10}             | ${false}
    ${''}             | ${false}
    ${'phrase'}       | ${false}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isNil(value)).toStrictEqual(expected);
  });
});
