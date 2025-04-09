import Either from './Either';
import identity from '../identity';
import type { Mock } from 'vitest';

describe('Either tests', () => {
  const eitherNumber = Either.Right<TypeError, number>(2);
  const eitherError = Either.Left<TypeError, number>(new TypeError('Test message'));

  it.skip('inspect available functionality', () => {
    const r1 = eitherNumber.unwrap(identity, identity);
    expect(r1).toBe(2);
    const r2 = eitherError.unwrap(identity, identity);
    expect(r2).toBeInstanceOf(TypeError);

    const tapFunction: Mock<unknown[], number> = vi.fn().mockImplementation((v: string) => Number.parseInt(v, 10));
    const rTapped1 = eitherNumber.tap(() => tapFunction('with-something')).getOrElse('not-expected');
    expect(rTapped1).toBe(2);
    expect(tapFunction.mock.calls[0]).toStrictEqual(['with-something']);

    const rTapped2 = eitherError.tap(() => tapFunction('with-something-else')).getOrElse('is-expected');
    expect(rTapped2).toBe('is-expected');
    expect(tapFunction.mock.calls[1]).toStrictEqual(['with-something-else']);
  });

  test('unwrap', () => {
    const R1 = Either.unwrapC(identity, identity)(eitherNumber);
    expect(R1).toBe(2);
    const R2 = Either.unwrapC(identity, identity)(eitherError);
    expect(R2).toBeInstanceOf(TypeError);
  });

  test('getOrDefault', () => {
    const r1 = eitherNumber.getOrDefault(-1);
    expect(r1).toBe(2);
    const r2 = eitherError.getOrDefault(-100);
    expect(r2).toBe(-100);

    const R1 = Either.getOrDefaultC(-10)(eitherNumber);
    expect(R1).toBe(2);
    const R2 = Either.getOrDefaultC(-1000)(eitherError);
    expect(R2).toBe(-1000);
  });

  test('getOrElse', () => {
    const r1 = eitherNumber.getOrElse('something-else');
    expect(r1).toBe(2);
    const r2 = eitherError.getOrElse('something-else');
    expect(r2).toBe('something-else');

    const R1 = Either.getOrElseC('something-else')(eitherNumber);
    expect(R1).toBe(2);
    const R2 = Either.getOrElseC('something-else')(eitherError);
    expect(R2).toBe('something-else');
  });

  test('getOrThrow', () => {
    const r1 = eitherNumber.getOrThrow();
    expect(r1).toBe(2);
    expect(() => eitherError.getOrThrow()).toThrowError(TypeError);

    const R1 = Either.getOrThrow(eitherNumber);
    expect(R1).toBe(2);
    expect(() => Either.getOrThrow(eitherError)).toThrowError(TypeError);
  });
});
