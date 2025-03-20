import noop from '../noop';
import type Maybe from './Maybe';
import { some, none, from } from './Maybe';

const Null = from(null);
const withNone = (): Maybe<null> => Null;
const someObject = from(Object.freeze({ just: 'value' }));
const withSome = (): unknown => someObject;
const withOtherSome = (v: object) =>
  from({ ...v, ...from(Object.freeze({ other: 'otherJustValue' })).getOrElse({ notExpected: true }) });
const notDefined = undefined;

describe('Maybe tests', () => {
  it('inspect available functionality', () => {
    expect(from(null).getOrElse('<null>')).toBe('<null>');
    expect(from(notDefined).getOrElse('<undefined>')).toBe('<undefined>');
    expect(from('something').getOrElse('<not-expected>')).toBe('something');
    expect(from(noop).getOrElse('<not-expected>')).toStrictEqual(noop);

    expect(() => some(null)).toThrowError();
    expect(() => some(notDefined)).toThrowError();
    expect(some('phrase').getOrElse('<not-expected>')).toBe('phrase');
    expect(some(noop).getOrElse('<not-expected>')).toStrictEqual(noop);
  });

  // TODO AR
  it.skip('"nothing" is a smart nullish value constant tests', () => {
    expect(Object.is(from(null), from(notDefined))).toBe(true);
    expect(from(null)).toStrictEqual(none());
    expect(from(notDefined)).toStrictEqual(none());
    expect(from(null)).toStrictEqual(from(notDefined));
    expect(from(notDefined)).toStrictEqual(from(null));

    expect(Null.map(withNone)).toStrictEqual(none());
    expect(none().map(withNone)).toStrictEqual(Null);

    expect(Null.map(withSome)).toStrictEqual(none());
    expect(none().map(withSome)).toStrictEqual(Null);

    expect(someObject.map(withNone).map(withOtherSome)).toStrictEqual(none()); // TODO AR WTF ?
    expect(none().map(withSome).map(withOtherSome)).toStrictEqual(Null);
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
      expect(Null.map(withSome)).toStrictEqual(none());
    });
    it('none().fMap(withSome) -> none', () => {
      expect(Null.map(withSome)).toStrictEqual(none());
    });
    // TODO AR
    it.skip('some(x).fMap(withNone) -> none', () => {
      expect(someObject.map(withNone)).toStrictEqual(none());
    });

    // TODO AR
    it.skip('some(x).fMap(withSome) -> some', () => {
      expect(someObject.map(withOtherSome)).toStrictEqual(
        from({
          just: 'value',
          other: 'otherJustValue',
        })
      );
    });
  });
});

// container.addEventListener(
//   'click',
//   flow(preventDefault, getEventTarget, (target) => {
//     Maybe.from(target)
//       .flatMap(maybeInstanceOf(Element))
//       .mapNullable(getClosestByDataAttribute('action'))
//       .flatMap(maybeInstanceOf(HTMLElement))
//       .mapNullable(getDataAttributeValue('action'))
//       .flatMap(maybeKeyOf(actions))
//       .unwrap((a) => actions[a](), noop);
//   }),
//   { signal },
// );
