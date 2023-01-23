import { Maybe } from './index';

describe('Nothing tests', () => {
  const Nothing = Maybe.nothing();
  const none = Maybe.of(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const IVoid = Maybe.of(); // TODO
  const withNone = () => none;
  const just = Maybe.of(Object.freeze({ just: 'value' }));
  const withJust = () => just;

  it('inspect available functionality', () => {
    expect(none.isJust()).toBe(false);
    expect(none.isNothing()).toBe(true);
    expect(none.chain(withJust)).toBe(none);
    expect(just.chain(withNone)).toBe(none);
  });

  it('as a smart nullish value constant tests', () => {
    expect(Maybe.of(null) === Maybe.of(undefined)).toBe(true);
    expect(Maybe.of(null)).toStrictEqual(Nothing);
    expect(Maybe.of(undefined)).toStrictEqual(Nothing);

    expect(none.chain(withNone)).toStrictEqual(Nothing);
    expect(Nothing.chain(withNone)).toStrictEqual(none);

    expect(none.chain(withJust)).toStrictEqual(Nothing);
    expect(Nothing.chain(withJust)).toStrictEqual(none);
  });

  it('chain(() => Maybe).chain(() => Maybe)... tests', () => {
    expect(just.chain(withNone).chain(withJust)).toStrictEqual(Nothing);
    expect(Nothing.chain(withJust).chain(withNone)).toStrictEqual(none);
  });
});
