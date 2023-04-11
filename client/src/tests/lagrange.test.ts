import BigNumber from 'bignumber.js';
import { gcd, power, modInverse, lagrangeConstantsForPoint } from '../utils/shamirs';

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

describe('modInverse', () => {
  test('calculates the modular multiplicative inverse of a number', () => {
    expect(modInverse(3, 11)).toEqual(4);
    expect(modInverse(7, 17)).toEqual(5);
    expect(modInverse(5, 13)).toEqual(8);
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

  test('calculates the Lagrange constants for another point', () => {
    const points = [new BigNumber(2), new BigNumber(3), new BigNumber(4)];
    const point = new BigNumber(1);
    const expectedResult = [new BigNumber(3), new BigNumber(14), new BigNumber(1)];
	const res = lagrangeConstantsForPoint(points, point, prime)

	console.log(res)
    expect(res).toEqual(expectedResult);
  });
});
