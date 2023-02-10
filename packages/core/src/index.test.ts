import * as core from './';

describe('"core" tests', () => {
  it('should export "core" utils appropriate', () => {
    expect(core).toMatchObject({
      isNil: expect.any(Function),
      isSome: expect.any(Function),
      isString: expect.any(Function),
      isNumber: expect.any(Function),
      isFunction: expect.any(Function),
      map: expect.any(Function),
      useDefault: expect.any(Function),
    });
  });
});
