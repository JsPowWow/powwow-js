import { isFunction, isNil, isNumber, isSome, isString } from './index';

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

describe('isSome', () => {
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
    expect(isSome(value)).toStrictEqual(expected);
  });
});

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
    ${NaN}                      | ${true}
    ${Infinity}                 | ${true}
    ${Number.NEGATIVE_INFINITY} | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isNumber(value)).toStrictEqual(expected);
  });
});

describe('isFunction', () => {
  const fn = function () {
    /** this is intentional */
  };

  const arrowFn = function () {
    /** this is intentional */
  };

  const clz = class test extends Object {
    foo() {
      /** this is intentional */
    }
  };

  test.each`
    value             | expected
    ${undefined}      | ${false}
    ${null}           | ${false}
    ${'phrase'}       | ${false}
    ${''}             | ${false}
    ${['foo', 'bar']} | ${false}
    ${{ foo: 'bar' }} | ${false}
    ${10}             | ${false}
    ${fn}             | ${true}
    ${arrowFn}        | ${true}
    ${clz}            | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isFunction(value)).toStrictEqual(expected);
  });
});
