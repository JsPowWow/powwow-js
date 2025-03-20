import identity from './identity';

describe('identity tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${undefined}
    ${''}             | ${''}
    ${{ foo: 'bar' }} | ${{ foo: 'bar' }}
    ${5}              | ${5}
    ${[1, 2, 3]}      | ${[1, 2, 3]}
  `("identity('$value') returns $expected", ({ value, expected }) => {
    expect(identity(value)).toStrictEqual(expected);
  });
});
