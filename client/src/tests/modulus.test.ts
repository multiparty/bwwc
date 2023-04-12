// modulus.test.ts
import { modulus } from '../utils/shamirs';
import BigNumber from 'bignumber.js';

describe('modulus', () => {
  test('returns the correct positive remainder for positive dividend', () => {
    const num = new BigNumber(25);
    const mod = new BigNumber(7);
    const expected = new BigNumber(4);
    expect(modulus(num, mod).isEqualTo(expected)).toBe(true);
  });

  test('returns the correct positive remainder for negative dividend', () => {
    const num = new BigNumber(-25);
    const mod = new BigNumber(7);
    const expected = new BigNumber(3);
    expect(modulus(num, mod).isEqualTo(expected)).toBe(true);
  });

  test('returns zero when the dividend is a multiple of the divisor', () => {
    const num = new BigNumber(21);
    const mod = new BigNumber(7);
    const expected = new BigNumber(0);
    expect(modulus(num, mod).isEqualTo(expected)).toBe(true);
  });

  test('returns the same dividend when the divisor is 1', () => {
    const num = new BigNumber(25);
    const mod = new BigNumber(1);
    const expected = new BigNumber(0);
    expect(modulus(num, mod).isEqualTo(expected)).toBe(true);
  });

  test('returns the positive remainder for negative dividend', () => {
    const num = new BigNumber(-1);
    const mod = new BigNumber(17);
    const expected = new BigNumber(16);
    expect(modulus(num, mod).isEqualTo(expected)).toBe(true);
  });
});
