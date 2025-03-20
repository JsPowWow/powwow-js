import noop from './noop';
import { vitest } from 'vitest';

describe('noop tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${undefined}
    ${''}             | ${undefined}
    ${{ foo: 'bar' }} | ${undefined}
    ${'whatever'}     | ${undefined}
  `("noop('$value') returns $expected", ({ value, expected }) => {
    const noOperation = vitest.fn().mockImplementation(noop);
    expect(noOperation(value)).toBe(expected);
  });
});
