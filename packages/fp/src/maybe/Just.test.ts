import { Just } from './Just';
import { identity, noop } from '../fn';
import { isSome, isString } from '@powwow-js/core';
import { Nothing } from './Nothing';

describe('Just tests', () => {
  const withMerge = (o1: object) =>
    jest.fn().mockImplementation((o2: object) => ({ ...o1, ...o2 }));
  const just = Just.of(Object.freeze({ just: 'value' }));
  const otherJust = Just.of(Object.freeze({ other: 'otherJustValue' }));
  const withOtherJust = jest
    .fn()
    .mockImplementation((v: object) =>
      Just.of({ ...v, ...otherJust.extract() })
    );
  const withNothing = jest.fn().mockImplementation(noop);

  it('inspect available functionality', () => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(() => Just.of(null)).toThrow();
    // @ts-ignore
    expect(() => Just.of(undefined)).toThrow();
    // @ts-ignore
    expect(() => Just.of()).toThrow();
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    expect(just.isJust()).toBe(true);
    expect(just.isNothing()).toBe(false);
    expect(just.extract()).toStrictEqual({ just: 'value' });
    expect(just.fMap(withOtherJust)).toBeInstanceOf(Just);
  });

  it('Just.match(...) tests', () => {
    expect(just.match({ just: identity, nothing: withNothing })).toStrictEqual({
      just: 'value',
    });
    expect(
      otherJust.match({ just: identity, nothing: withNothing })
    ).toStrictEqual({ other: 'otherJustValue' });
    expect(withNothing).not.toHaveBeenCalled();
  });

  it('Just.map(...) tests', () => {
    const merge = withMerge({ foo: 'bar' });
    const maybe = just.map(merge);
    expect(maybe).toBeInstanceOf(Just);
    expect(maybe.match({ just: identity, nothing: withNothing })).toStrictEqual(
      {
        just: 'value',
        foo: 'bar',
      }
    );
    expect(merge).toHaveBeenCalledWith({ just: 'value' });
    expect(withNothing).not.toHaveBeenCalled();
  });

  it('Just.fMap(...) tests', () => {
    const maybe = just.fMap(withOtherJust);
    expect(maybe).toBeInstanceOf(Just);
    expect(maybe.match({ just: identity, nothing: withNothing })).toStrictEqual(
      {
        just: 'value',
        other: 'otherJustValue',
      }
    );
    expect(withOtherJust).toHaveBeenCalledWith({ just: 'value' });
    expect(withNothing).not.toHaveBeenCalled();
  });

  it('Just.filter(...) tests', () => {
    expect(just.filter(isSome)).toStrictEqual(just);
    expect(just.filter(isString)).toStrictEqual(Nothing);
  });
});
