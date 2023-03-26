import BigNumber from 'bignumber.js';
import { Point } from '@utils/data-format';

function getRandomBigNumber(min: BigNumber, max: BigNumber) {
  let bigMax = new BigNumber(0);
  let bigMin = new BigNumber(0);

  if (max == null) {
    bigMax = new BigNumber(min);
    bigMin = new BigNumber(0);
  } else {
    bigMax = new BigNumber(max);
    bigMin = new BigNumber(min);
  }

  const range = bigMax.minus(bigMin).plus(1);
  const bytesNeeded = Math.ceil((range.toString(2).length + 7) / 8);
  const randomBytes = new Uint8Array(bytesNeeded);
  const crypto = window.crypto || window.Crypto;
  crypto.getRandomValues(randomBytes);
  let result = new BigNumber(0);
  
  for (let i = 0; i < bytesNeeded; i++) {
    result = result.plus(new BigNumber(randomBytes[i]).shiftedBy(i * 8));
  }

  return bigMin.plus(result.mod(range));
}  

function isIntGreaterThanZero(num: number): boolean {
    return Number.isInteger(num) && num > 0;
}

/*
Generate a Shamir polynomial with a given zero_value.

inputs:
zeroValue (BigNumber) - The secret value to be shared.
threshold (BigNumber) - The minimum number of shares required to reconstruct the secret.
prime (BigNumber) - The prime number to use for the polynomial modulus.

output:
coefs (BigNumber[]) - A list of coefficients representing the polynomial.
*/
function sampleShamirPolynomial(zeroValue: BigNumber, threshold: BigNumber, prime: BigNumber): BigNumber[] {
    const length = threshold.minus(BigNumber(1)).toNumber();
    const coefs = [zeroValue, ...Array.from({ length: length }, () => getRandomBigNumber(BigNumber(1), prime))];
    return coefs;
}

/*
Evaluate the polynomial at a given point using the provided coefficients.
    
inputs:
coefs (BigNumber[]) - A list of coefficients representing the polynomial.
point (number) - The point at which to evaluate the polynomial.
prime (BigNumber) - The prime number to use for the polynomial modulus.

output:
result (BigNumber) - The result of the polynomial evaluation at the specified point, modulo the prime.
*/
function evaluateAtPoint(coefs: BigNumber[], point: number, prime: BigNumber): BigNumber {
    let result = BigNumber(0);
    const bigIntPoint = BigNumber(point); // Convert point to a BigInt
    for (const coef of coefs.reverse()) {
        result = BigNumber(coef).plus(bigIntPoint.multipliedBy(result)).modulo(prime);
    }
    return result;
}

/*
Split a secret into a list of shares.

inputs:
secret (number) - The secret to be shared.
numShares (number) - The number of shares to generate.
threshold (number) - The minimum number of shares required to reconstruct the secret.
prime (number) - The prime number to use for the polynomial modulus.

output:
shares (Point[]) - A list of tuples containing the x and y values of the shares.
*/
export function shamirShare(secret: number, numShares: number, threshold: number, prime: number=180252380737439): Point[] {
    const bigPrime = new BigNumber(prime);
    const bigSecret = new BigNumber(secret);
    const bigThreshold = new BigNumber(threshold);
    
    if (!isIntGreaterThanZero(secret) || !isIntGreaterThanZero(prime)) {
        throw new Error('Secret must be a positive integer');
    }

    const polynomial = sampleShamirPolynomial(bigSecret, bigThreshold, bigPrime);
    return Array.from({ length: numShares }, (_, i) => [BigNumber(i + 1), evaluateAtPoint(polynomial, i + 1, bigPrime)]);
}