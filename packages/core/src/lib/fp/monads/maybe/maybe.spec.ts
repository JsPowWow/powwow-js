import just, { isJust } from './just';
import type { Maybe } from './maybe';
import maybe from './maybe';
import nothing, { isNothing } from './nothing';
import bind from './bind';
import fold from './fold';
import fmap from './fmap';
import foldMap from './foldMap';

const notDefined = undefined;

describe('maybe', () => {
  describe('when provided with a non-nullable value', () => {
    it('should create a `just` wrapper around the value', () => {
      expect(isJust(maybe('non-nullable value'))).toBe(true);
    });
  });

  describe('when provided with a nullable value', () => {
    it('should create a `nothing` wrapper with `undefined` value', () => {
      [maybe(null), maybe(notDefined)].forEach((value) => {
        expect(isNothing(value)).toBe(true);
      });
    });
  });

  describe('operators', () => {
    describe('bind', () => {
      describe('when provided with the `just` monad', () => {
        it('should unfold the transition function producing new `maybe` monad', () => {
          const result = isJust(bind(maybe(5), (x) => just(x + 1)));
          expect(result).toBe(true);

          const resultC = isJust(bind((x: number) => just(x + 1))(maybe(5)));
          expect(resultC).toBe(true);

          const resultC2 = isJust(bind(() => just(15))(maybe(null)));
          expect(resultC2).toBe(false);
        });
      });

      describe('when provided with the `nothing` monad', () => {
        it('should return provided `nothing` monad', () => {
          expect(isNothing(bind(maybe<number>(notDefined), (x) => just(x + 1)))).toBe(true);
        });
      });
    });

    describe('fmap', () => {
      it('inspect available functionality', () => {
        const result = fold(fmap(maybe(5), (x) => x + 1));
        expect(result).toBe(6);

        const resultC = fold(fmap((x: number) => x * 2)(maybe(10)));
        expect(resultC).toBe(20);
      });

      describe('when provided with the `just` monad', () => {
        let monad: Maybe<string>;

        beforeEach(() => {
          monad = fmap(maybe(5), (x) => `${x + 1}`);
        });

        it('should produce new `maybe` monad', () => {
          expect(isJust(monad)).toBe(true);
        });

        it("should apply the transition to the provided monad's value", () => {
          expect(fold(monad)).toBe('6');
        });
      });
    });

    describe('fold', () => {
      describe('when provided with the `just` monad', () => {
        it('should return its wrapped value', () => {
          expect(fold(maybe(5))).toBe(5);
        });
      });

      describe('when provided with `nothing` monad', () => {
        it('should return `undefined`', () => {
          expect(fold(maybe(notDefined))).toBe(undefined);
        });
      });
    });

    describe('foldMap', () => {
      describe('when provided with a `just` wrapper', () => {
        it('should map and return the wrapped value', () => {
          expect(foldMap(just(5), (x) => x + 1)).toBe(6);
        });
      });

      describe('when provided with a `nothing` wrapper', () => {
        it('should return `undefined`', () => {
          expect(foldMap(nothing() as Maybe<number>, (x) => x + 1)).toBe(undefined);
        });
      });
    });
  });
});
