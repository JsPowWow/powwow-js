import compose from './compose';

describe('compose', () => {
  it('should apply both functions in right-to-left order starting from the argument', () => {
    const result = compose(
      (x: number) => `${x * 10}`,
      (x) => x + 1,
      5
    );
    expect(result).toBe('60');
  });

  describe('when the last function requires several arguments', () => {
    it('should apply the arguments and continue', () => {
      const result = compose(
        (x: number) => `${x * 10}`,
        (a: number, b: number) => a + b
      )(2, 3);
      expect(result).toBe('50');
    });
  });
});
