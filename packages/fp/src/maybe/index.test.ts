import { Maybe } from './index';
import { noop } from '../fn';

describe('Maybe tests', () => {
  const none = Maybe.of(null);
  const withNone = () => none;
  const some = Maybe.of(Object.freeze({ just: 'value' }));
  const withSome = () => some;
  const withOtherSome = (v: object) =>
    Maybe.of({ ...v, ...Maybe.of(Object.freeze({ other: 'otherJustValue' })).extract() });

  it('inspect available functionality', () => {
    expect(Maybe.hasSome(null)).toBe(false);
    expect(Maybe.hasSome(undefined)).toBe(false);
    expect(Maybe.hasSome('')).toBe(true);
    expect(Maybe.hasSome(noop)).toBe(true);

    expect(Maybe.hasNothing(null)).toBe(true);
    expect(Maybe.hasNothing(undefined)).toBe(true);
    expect(Maybe.hasNothing('')).toBe(false);
    expect(Maybe.hasNothing(noop)).toBe(false);
  });

  it('"Nothing" is a smart nullish value constant tests', () => {
    expect(Maybe.of(null) === Maybe.of(undefined)).toBe(true);
    expect(Maybe.of(null)).toStrictEqual(Maybe.nothing);
    expect(Maybe.of(undefined)).toStrictEqual(Maybe.nothing);

    expect(none.fMap(withNone)).toStrictEqual(Maybe.nothing);
    expect(Maybe.nothing.fMap(withNone)).toStrictEqual(none);

    expect(none.fMap(withSome)).toStrictEqual(Maybe.nothing);
    expect(Maybe.nothing.fMap(withSome)).toStrictEqual(none);

    expect(some.fMap(withNone).fMap(withOtherSome)).toStrictEqual(Maybe.nothing);
    expect(Maybe.nothing.fMap(withSome).fMap(withOtherSome)).toStrictEqual(none);
  });

  describe(`Maybe bind another "Maybe" continuation tests`, () => {
    /**
     * There are four possible combinations of 2 maybes
     * The only combination that leads to a new some(_) is when we combine the two some(_) paths .
     * - none( ).bind(withNone) -> none
     * - none( ).bind(withSome) -> none
     * - some(x).bind(withNone) -> none
     * - some(x).bind(withSome) -> some(x')
     */
    it('none().fMap(withNone) -> none', () => {
      expect(none.fMap(withSome)).toStrictEqual(Maybe.nothing);
    });
    it('none().fMap(withSome) -> none', () => {
      expect(none.fMap(withSome)).toStrictEqual(Maybe.nothing);
    });
    it('some(x).fMap(withNone) -> none', () => {
      expect(some.fMap(withNone)).toStrictEqual(Maybe.nothing);
    });
    it('some(x).fMap(withSome) -> some', () => {
      expect(some.fMap(withOtherSome)).toStrictEqual(
        Maybe.of({
          just: 'value',
          other: 'otherJustValue',
        }),
      );
    });
  });
});
