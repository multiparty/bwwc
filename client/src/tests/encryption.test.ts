import BigNumber from 'bignumber.js';
import { Point } from '@utils/data-format';
import { deepEqual, evaluateAtPoint, shamirShare, sampleShamirPolynomial } from '../utils/shamirs';

describe('evaluateAtPoint', () => {
  let prime: BigNumber;
  let coefficients: BigNumber[];

  beforeEach(() => {
    // Initialize global variable
    prime = new BigNumber(15485867);
    coefficients = [100, 5083274, 13697430, 601383, 10660686].map((x) => new BigNumber(x));
  });

  test('generate secret shares', () => {
    const point = 1;
    const result = new BigNumber(14557006);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  test('generate secret shares', () => {
    const point = 2;
    const result = new BigNumber(8050403);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 3;
    const result = new BigNumber(11698344);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 4;
    const result = new BigNumber(2858006);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 5;
    const result = new BigNumber(13426759);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 6;
    const result = new BigNumber(5955230);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 7;
    const result = new BigNumber(13020106);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 8;
    const result = new BigNumber(13337198);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 9;
    const result = new BigNumber(9190776);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });

  it('generate secret shares', () => {
    const point = 10;
    const result = new BigNumber(10947702);
    expect(evaluateAtPoint(coefficients, point, prime)).toEqual(result);
  });
});

describe('sampleShamirPolynomial', () => {
  it('should generate coefficients from the secret value', () => {
    const secret = BigNumber(1234);
    const threshold = BigNumber(5);
    const prime = BigNumber(15485867);

    expect(secret.toNumber()).toBeLessThan(prime.toNumber());

    const coefficients = sampleShamirPolynomial(secret, threshold, prime);

    for (const number of coefficients) {
      expect(number.toNumber()).toBeLessThan(prime.toNumber());
      expect(number.toNumber()).toBeGreaterThanOrEqual(0);
    }

    expect(coefficients.length).toEqual(threshold.toNumber());
  });
});

describe('deepEqual', () => {
  it('should return true for deeply equal objects', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22
      }
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22
      }
    };

    expect(deepEqual(obj1, obj2)).toBeTruthy();
  });

  it('should return false for objects with different keys', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22
      }
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key23: 22
      }
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });

  it('should return false for objects with different values', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22
      }
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 23
      }
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });

  it('should return false for objects with different nested structures', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22
      }
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: {
          key221: 22
        }
      }
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });
});
