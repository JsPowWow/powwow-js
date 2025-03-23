import flowLeft from './flowLeft';

const toNumber = (s: string): number => Number.parseInt(s);

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

describe('flowLeft', () => {
  it('should apply functions in left-to-right order starting from the argument', () => {
    const result = flowLeft(
      (x: number): string => `${x * 10}`,
      (s: string) => [...s],
      (s: string[]): string => s.join(''),
      toNumber
    )(5);
    expect(result).toStrictEqual(50);
  });

  describe('when the first function requires several arguments', () => {
    it('should apply the arguments and continue', () => {
      const result = flowLeft(
        (v: [number, number]) => v[0] + v[1],
        (x: number) => `${x * 10}`,
        toNumber
      )([2, 3]);
      expect(result).toBe(50);
    });

    it('should apply the array arguments and continue', () => {
      //const checkIfTsError = flowLeft(oneOrTwo, toTuple)(1); // expected error
      const result = flowLeft(say('hi'), oneOrTwo, toTuple, tupleToString, stringSplitBy(','))([1, 2, 3]); // [string]
      expect(result).toStrictEqual(['2', '2', '3']);
    });
  });
});
