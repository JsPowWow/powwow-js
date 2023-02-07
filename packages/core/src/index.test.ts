import { Nullable } from './nullable';

describe('"Nullable" tests', () => {
  it('should export "Nullable" utils shortcut', () => {
    expect(Nullable).toStrictEqual({
      isNil: expect.any(Function),
      isSome: expect.any(Function),
      isString: expect.any(Function),
      isNumber: expect.any(Function),
      isFunction: expect.any(Function),
    });
  });
});
