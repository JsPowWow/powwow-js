import * as fp from './';
import { Nothing } from './maybe/Nothing';

describe('"fp" exports tests', () => {
  it('should export "fp" utils & primitives appropriate', () => {
    expect(fp).toMatchObject({
      identity: expect.any(Function),
      call: expect.any(Function),
      noop: expect.any(Function),
      Maybe: expect.objectContaining({
        hasSome: expect.any(Function),
        hasNothing: expect.any(Function),
        of: expect.any(Function),
        nothing: Nothing,
      }),
    });
  });
});
