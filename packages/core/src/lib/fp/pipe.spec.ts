import pipe from './pipe';

describe('pipe', () => {
  it('should apply both functions in left-to-right order starting from the argument', () => {
    const result = pipe(
      5,
      (x) => `${x * 10}`,
      (s) => [...s]
    );
    expect(result).toStrictEqual(['5', '0']);
  });
});
