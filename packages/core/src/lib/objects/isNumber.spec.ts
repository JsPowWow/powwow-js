import isNumber from './isNumber';

describe('isNumber', () => {
  test.each`
    value                       | expected
    ${undefined}                | ${false}
    ${null}                     | ${false}
    ${'phrase'}                 | ${false}
    ${' '}                      | ${false}
    ${['foo', 'bar']}           | ${false}
    ${{ foo: 'bar' }}           | ${false}
    ${'10'}                     | ${false}
    ${10}                       | ${true}
    ${Number.NaN}               | ${true}
    ${Infinity}                 | ${true}
    ${Number.NEGATIVE_INFINITY} | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isNumber(value)).toStrictEqual(expected);
  });
});
