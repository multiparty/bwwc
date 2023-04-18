import BigNumber from 'bignumber.js';
import { gcd, power, modularInverse, lagrangeConstantsForPoint } from '../utils/shamirs';

describe('gcd', () => {
  test('calculates the greatest common divisor of two numbers', () => {
    expect(gcd(54, 24)).toEqual(6);
    expect(gcd(1071, 1029)).toEqual(21);
    expect(gcd(14, 28)).toEqual(14);
  });
});

describe('power', () => {
  test('calculates the result of raising a number to a given power modulo a modulus', () => {
    expect(power(5, 3, 13)).toEqual(8);
    expect(power(4, 5, 9)).toEqual(7);
    expect(power(7, 7, 10)).toEqual(3);
  });
});

describe('modularInverse', () => {
  test('calculates the modular multiplicative inverse of a number', () => {
    expect(modularInverse(BigNumber(3), BigNumber(11))?.toNumber()).toEqual(4);
    expect(modularInverse(BigNumber(7), BigNumber(17))?.toNumber()).toEqual(5);
    expect(modularInverse(BigNumber(5), BigNumber(13))?.toNumber()).toEqual(8);
  });
});

describe('lagrangeConstantsForPoint', () => {
  const prime = new BigNumber(17);

  test('calculates the Lagrange constants for a given point', () => {
    const points = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
    const point = new BigNumber(0);
    const expectedResult = [new BigNumber(3), new BigNumber(14), new BigNumber(1)];

    expect(lagrangeConstantsForPoint(points, point, prime)).toEqual(expectedResult);
  });
});
