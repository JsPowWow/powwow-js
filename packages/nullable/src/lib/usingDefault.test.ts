import usingDefault from './usingDefault';

const notDefined = undefined;
describe('usingDefault tests', () => {
  it('should be curried having one provided argument', () => {
    const result = usingDefault('');
    expect(result).toBeInstanceOf(Function);
  });

  it('when given a default value and "null" returns the default value', () => {
    const result = usingDefault('<<nil>>', null);
    expect(result).toBe('<<nil>>');
    const resultC = usingDefault('<<nil>>')(null);
    expect(resultC).toBe('<<nil>>');
  });

  it('when given a default value and "undefined" returns the default value', () => {
    const result = usingDefault('<<nil>>', notDefined);
    expect(result).toBe('<<nil>>');
    const resultC = usingDefault('<<nil>>')(notDefined);
    expect(resultC).toBe('<<nil>>');
  });

  describe('when given a default and a concrete values', () => {
    it('returns the concrete value value', () => {
      const result = usingDefault<string>('<<nil>>', 'test me');
      expect(result).toBe('test me');
    });
  });
});
