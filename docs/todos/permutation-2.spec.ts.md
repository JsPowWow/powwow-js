import permutation2 from './permutation-2.ts.md';

const subtract = (a: number, b = 1): number => a - b;

describe('permutation2Ts', () => {
  describe('when `shouldCurry` predicate is specified', () => {
    describe('when predicate is `true`', () => {
      it('should curry second argument reversing application order', () => {
        const result = permutation2(subtract, () => true)(1)(3);
        expect(result).toBe(2);
      });
    });

    describe('when predicate is `false`', () => {
      describe('when second argument is `undefined`', () => {
        it('should not curry', () => {
          const result = permutation2(subtract, () => false)(1);
          expect(result).toBe(0);
        });
      });

      describe('when second argument is defined', () => {
        it('should not curry applying arguments in order', () => {
          const result = permutation2(subtract, () => false)(3, 1);
          expect(result).toBe(2);
        });
      });
    });
  });
});
