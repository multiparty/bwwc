import BigNumber from 'bignumber.js';
import { Point } from '@utils/data-format';
import { gcd, power, modularInverse, lagrangeConstantsForPoint, interpolateAtPoint } from '../utils/shamirs';

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
    const xVals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => new BigNumber(x));
    const queryXAxis = new BigNumber(1);
    const constants = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(x => new BigNumber(x));
    expect(lagrangeConstantsForPoint(xVals, queryXAxis, prime)).toEqual(constants);
  });
});

describe('interpolateAtPoint', () => {
  const prime = new BigNumber('15485867');
  const queryXAxis = new BigNumber('0');
  const shares: Point[] = [
    ['1', '11640419'],
    ['2', '6340497'],
    ['3', '12316611'],
    ['4', '2435563'],
    ['5', '2615949'],
    ['6', '14398824'],
    ['7', '14947702'],
    ['8', '3506157'],
    ['9', '1397823'],
    ['10', '5568793']
];

  test('interpolate points to recover secret', () => {
    const secret = interpolateAtPoint(shares, queryXAxis, prime);
    expect(secret).toEqual(new BigNumber('300'));
  });
});
