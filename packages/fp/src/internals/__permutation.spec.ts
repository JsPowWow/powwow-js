import __permutation from './__permutation';

const subtract = (a: number, b = 1): number => a - b;

describe('permutation2Ts', () => {
  it('should not curry applying arguments in order', () => {
    const result = __permutation(subtract)(1, 3);
    expect(result).toBe(-2);

    const result2 = __permutation(subtract)(3, 1);
    expect(result2).toBe(2);
  });

  it('should curry second argument reversing application order', () => {
    const result = __permutation(subtract)(1)(3);
    expect(result).toBe(2);
  });
});
