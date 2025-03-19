import composeLeft from './composeLeft';

describe('composeLeft', () => {
  it('should apply both functions in left-to-right order starting from the argument', () => {
    const result = composeLeft(
      5,
      (x) => `${x * 10}`,
      (s: string) => [...s]
    );
    expect(result).toStrictEqual(['5', '0']);
  });

  describe('when the first function requires several arguments', () => {
    it('should apply the arguments and continue', () => {
      const result = composeLeft(
        (a: number, b: number) => a + b,
        (x) => `${x * 10}`
      )(2, 3);
      expect(result).toStrictEqual('50');
    });
  });
});
