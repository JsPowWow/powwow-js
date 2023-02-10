import { Nothing } from './Nothing';
import { identity } from '../fn';

describe('Nothing tests', () => {
  const withNothing = jest.fn().mockImplementation(() => Nothing);
  const addTen = jest.fn().mockImplementation((v: number) => v + 10);
  const isTen = jest.fn().mockImplementation((v: number) => v === 10);

  it('inspect available functionality', () => {
    expect(Nothing.isJust()).toBe(false);
    expect(Nothing.isNothing()).toBe(true);

    expect(Nothing.map(addTen)).toBe(Nothing);
    expect(addTen).not.toHaveBeenCalled();

    expect(Nothing.fMap(withNothing)).toBe(Nothing);
    expect(
      Nothing.fMap(withNothing).match({
        just: identity,
        nothing: () => 'nil',
      })
    ).toBe('nil');
    expect(withNothing).not.toHaveBeenCalled();

    expect(Nothing.filter(isTen)).toStrictEqual(Nothing);
    expect(isTen).not.toHaveBeenCalled();
  });
});
