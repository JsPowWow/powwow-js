import permutation3 from './permutation-3';

const subAndDiv = (a: number, b: number, c: number): number => (a + b) / c;

describe('permutation3', () => {
  describe('when third argument is `undefined`', () => {
    it('should curry first argument pushing the application order to the right', () => {
      const result = permutation3(subAndDiv)(2, 3)(7);
      expect(result).toBe(3);
    });
  });

  describe('when third argument is defined', () => {
    it('should not curry, applying the arguments in order', () => {
      const result = permutation3(subAndDiv)(7, 2, 3);
      expect(result).toBe(3);
    });
  });
});
