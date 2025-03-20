import isSomeFunction from './isSomeFunction';

const normalFunction = function (): void {
  /** this is intentional */
};

const arrowFunction = function (): void {
  /** this is intentional */
};

const clz = class test extends Object {
  public foo(): void {
    /** this is intentional */
  }
};

describe('isFunction', () => {
  test.each`
    value             | expected
    ${undefined}      | ${false}
    ${null}           | ${false}
    ${'phrase'}       | ${false}
    ${''}             | ${false}
    ${['foo', 'bar']} | ${false}
    ${{ foo: 'bar' }} | ${false}
    ${10}             | ${false}
    ${normalFunction} | ${true}
    ${arrowFunction}  | ${true}
    ${clz}            | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isSomeFunction(value)).toStrictEqual(expected);
  });
});
