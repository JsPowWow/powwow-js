import { useDefault } from './use-default';

describe('Nullable "useDefault" tests', () => {
  it('should be curried having one provided argument', () => {
    expect(useDefault('')).toBeInstanceOf(Function);
  });

  it('when given a default value and "Nil" returns the default value', () => {
    expect(useDefault('<<nil>>', null)).toBe('<<nil>>');
    expect(useDefault('<<nil>>')(null)).toBe('<<nil>>');
    expect(useDefault('<<nil>>', undefined)).toBe('<<nil>>');
    expect(useDefault('<<nil>>')(undefined)).toBe('<<nil>>');
  });

  describe('when given a default and a concrete values', () => {
    it('returns the concrete value value', () => {
      expect(useDefault<string>('<<nil>>', 'test me')).toBe('test me');
    });
  });
});
