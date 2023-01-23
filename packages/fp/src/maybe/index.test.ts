import { Maybe } from './index';

const none = Maybe.of(null);
const withNone = () => none;
const some = Maybe.of(Object.freeze({ just: 'value' }));
const withSome = () => some;
const withOtherSome = (v: object) =>
  Maybe.of({ ...v, ...Maybe.of(Object.freeze({ other: 'otherJustValue' })).extract() });

describe('Maybe tests', () => {
  it('export Maybe shortcut', () => {
    expect(Maybe).toStrictEqual({
      of: expect.any(Function),
      nothing: expect.any(Function),
    });
  });

  describe(`Maybe.chain(() => Maybe) continuation tests`, () => {
    /**
     * There are four possible combinations of 2 maybes
     * The only combination that leads to a new some(_) is when we combine the two some(_) paths .
     * - none( ).chain(withNone) -> none
     * - none( ).chain(withSome) -> none
     * - some(x).chain(withNone) -> none
     * - some(x).chain(withSome) -> some(x')
     */
    it('none().chain(withNone) -> none', () => {
      expect(none.chain(withSome)).toStrictEqual(Maybe.nothing());
    });
    it('none().chain(withSome) -> none', () => {
      expect(none.chain(withSome)).toStrictEqual(Maybe.nothing());
    });
    it('some(x).chain(withNone) -> none', () => {
      expect(some.chain(withNone)).toStrictEqual(Maybe.nothing());
    });
    it('some(x).chain(withSome) -> some', () => {
      expect(some.chain(withOtherSome)).toStrictEqual(
        Maybe.of({
          just: 'value',
          other: 'otherJustValue',
        }),
      );
    });
  });
});
