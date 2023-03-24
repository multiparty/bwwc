import { randomInt } from 'crypto';

type Point = [number, number];

function isIntGreaterThanZero(num: number): boolean {
    return Number.isInteger(num) && num > 0;
}

function sampleShamirPolynomial(zeroValue: number, threshold: number, prime: number): number[] {
    const coefs = [zeroValue, ...Array.from({ length: threshold - 1 }, () => randomInt(prime))];
    return coefs;
}

function evaluateAtPoint(coefs: number[], point: number, prime: number): number {
    let result = 0;
    for (const coef of coefs.reverse()) {
        result = (coef + point * result) % prime;
    }
    return result;
}

export function shamirShare(secret: number, numShares: number, threshold: number, prime: number=180252380737439): Point[] {
    if (!isIntGreaterThanZero(secret) || !isIntGreaterThanZero(prime)) {
        throw new Error('Secret must be a positive integer');
    }

    const polynomial = sampleShamirPolynomial(secret, threshold, prime);
    return Array.from({ length: numShares }, (_, i) => [i + 1, evaluateAtPoint(polynomial, i + 1, prime)]);
}