import flowRight from './flowRight';

const stringSplitBy =
  (by: string) =>
  (v: string): string[] =>
    v.split(by);

const tupleToString = (v: number[]): string => v.join(',');

const toTuple = (v: 1 | 2): number[] => [v, 2, 3];

const oneOrTwo = (v: string): 1 | 2 => (v.length > 10 ? 1 : 2);

const say =
  (what: string) =>
  (v: number[]): string =>
    `${what} ${v.join(' ')}`;

describe('flowRight', () => {
  it('should apply many functions in right-to-left order starting from the argument', () => {
    const result = flowRight(
      String,
      Number,
      (x: number) => `${x * 10}`,
      (x: number) => x + 1
    )(5);
    expect(result).toBe('60');
  });

  describe('when the last function requires several arguments', () => {
    it('should apply the arguments and continue', () => {
      const result = flowRight(
        Number,
        (x: number) => `${x * 10}`,
        (v: [number, number]) => v[0] + v[1]
      )([2, 3]);
      expect(result).toBe(50);
    });

    it('should apply the array arguments and continue', () => {
      // const checkIfTsError = flowRight(oneOrTwo, toTuple)(1); // expected error
      const result = flowRight(stringSplitBy(','), tupleToString, toTuple, oneOrTwo, say('hi'))([1, 2, 3]); // [string]
      expect(result).toStrictEqual(['2', '2', '3']);
    });
  });
});
