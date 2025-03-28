import { Either } from './Either';
import identity from '../identity';

describe('Either tests', () => {
  it.skip('inspect available functionality', () => {
    // TODO AR
  });

  test('unwrap', () => {
    const v1 = Either.Right<TypeError, number>(2);
    const v2 = Either.Left<TypeError, number>(new TypeError('Test message'));

    const r1 = v1.unwrap(identity, identity);
    expect(r1).toBe(2);
    const r2 = v2.unwrap(identity, identity);
    expect(r2).toBeInstanceOf(TypeError);

    const R1 = Either.UnwrapC(identity, identity)(v1);
    expect(R1).toBe(2);
    const R2 = Either.UnwrapC(identity, identity)(v2);
    expect(R2).toBeInstanceOf(TypeError);
  });
});
