import { call, identity, noop } from './index';

describe('noop tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${undefined}
    ${''}             | ${undefined}
    ${{ foo: 'bar' }} | ${undefined}
    ${'whatever'}     | ${undefined}
  `("noop('$value') returns $expected", ({ value, expected }) => {
    const noOperation = jest.fn().mockImplementation(noop);
    expect(noOperation(value)).toBe(expected);
  });
});

describe('call tests', () => {
  it('"call(Fn, ...args)" should invoke function w/o need of giving _this context', () => {
    const sum = jest.fn((a, b) => a + b);
    expect(call(sum, 1, 2)).toBe(3);
    expect(sum).toHaveBeenCalledWith(1, 2);
  });
});

describe('identity tests', () => {
  test.each`
    value               | expected
    ${[undefined]}      | ${undefined}
    ${['']}             | ${''}
    ${[{ foo: 'bar' }]} | ${{ foo: 'bar' }}
    ${[5]}              | ${5}
    ${[1, 2, 3]}        | ${1}
  `("identity('$value') returns $expected", ({ value, expected }) => {
    expect(call(identity, ...value)).toStrictEqual(expected);
  });
});
