import { Maybe } from './index';

describe('"IMaybe" tests', () => {
  it('should export IMaybe utils shortcut', () => {
    expect(Maybe).toStrictEqual({
      of: expect.any(Function),
    });
  });

  describe('"IMaybe.of(...)" tests', () => {
    it('nullish values tests', () => {
      const maybeNull = Maybe.of(null);
      expect(maybeNull).toBeDefined();
    });
  });
});
