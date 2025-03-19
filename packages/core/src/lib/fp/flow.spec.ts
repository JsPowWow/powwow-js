import flow from './flow';

describe('flow', () => {
  it('should apply the arguments and continue', () => {
    const result = flow(
      (a: number) => a + 2,
      (x) => `${x * 10}`,
      (x) => [x, x]
    )(2);
    expect(result).toStrictEqual(['40', '40']);
  });
});
