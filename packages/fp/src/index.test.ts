import { Maybe } from './';
import { Nothing } from './maybe/Nothing';
import { Nullable } from './';

describe('"Maybe" tests', () => {
  it('should export "Maybe" utils shortcut', () => {
    expect(Maybe).toStrictEqual({
      hasSome: expect.any(Function),
      hasNothing: expect.any(Function),
      of: expect.any(Function),
      nothing: Nothing,
    });
  });
});

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
