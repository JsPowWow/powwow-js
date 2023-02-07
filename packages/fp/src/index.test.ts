import { Maybe } from './';
import { Nothing } from './maybe/Nothing';

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
