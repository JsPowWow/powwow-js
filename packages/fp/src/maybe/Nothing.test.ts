import { Nothing } from './Nothing';
import { identity } from '../fn';

describe('Nothing tests', () => {
  const withNothing = () => Nothing;
  const addTen = (v: number) => v + 10;

  it('inspect available functionality', () => {
    expect(Nothing.isJust()).toBe(false);
    expect(Nothing.isNothing()).toBe(true);
    expect(Nothing.map(addTen)).toBe(Nothing);
    expect(Nothing.fMap(withNothing)).toBe(Nothing);
    expect(Nothing.fMap(withNothing).match({ just: identity, nothing: () => 'nil' })).toBe('nil');
  });
});
