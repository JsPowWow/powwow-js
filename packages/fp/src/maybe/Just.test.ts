import { Maybe } from './index';

describe('Just tests', () => {
  const Nothing = Maybe.nothing();
  const withNothing = () => Nothing;
  const just = Maybe.of(Object.freeze({ just: 'value' }));
  const withJust = () => just;
  const otherJust = Maybe.of(Object.freeze({ other: 'otherJustValue' }));
  const withOtherJust = (v: object) => Maybe.of({ ...v, ...otherJust.extract() });

  it('inspect available functionality', () => {
    expect(just.isJust()).toBe(true);
    expect(just.isNothing()).toBe(false);

    expect(just.chain(withNothing).isJust()).toBe(false);
    expect(just.chain(withNothing).isNothing()).toBe(true);

    expect(just.chain(withOtherJust).isJust()).toBe(true);

    expect(just.extract()).toStrictEqual({
      just: 'value',
    });
    expect(otherJust.extract()).toStrictEqual({
      other: 'otherJustValue',
    });
    // TODO
    // expect(just.chain(withOtherJust).extract()).toStrictEqual({
    //   just: 'value',
    //   other: 'otherJustValue',
    // });
  });

  // it('as a smart nullish value constant tests', () => {
  //   expect(Maybe.of(null) === Maybe.of(undefined)).toBe(true);
  //   expect(Maybe.of(null)).toStrictEqual(Nothing);
  //   expect(Maybe.of(undefined)).toStrictEqual(Nothing);
  //
  //   expect(none.chain(withNone)).toStrictEqual(Nothing);
  //   expect(Nothing.chain(withNone)).toStrictEqual(none);
  //
  //   expect(none.chain(withJust)).toStrictEqual(Nothing);
  //   expect(Nothing.chain(withJust)).toStrictEqual(none);
  // });

  it('chain(() => Maybe).chain(() => Maybe)... tests', () => {
    expect(just.chain(withNothing).chain(withJust)).toStrictEqual(Nothing);
    expect(Nothing.chain(withJust).chain(withNothing)).toStrictEqual(Nothing);
    expect(just.extract()).toStrictEqual({
      just: 'value',
    });
    const m = just.chain(withOtherJust);
    if (m.isJust()) {
      m.extract();
    }
  });
});
