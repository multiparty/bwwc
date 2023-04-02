import BigNumber from 'bignumber.js';
import { Point, PointWithEncryptedState } from '@utils/data-format';
import { encryptString, arrayBufferToBase64, base64ToArrayBuffer, decryptString } from '@utils/keypair';

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
asString (boolean, optional) - Whether to return the shares as strings. Default: false.
prime (number, optional) - The prime number to use for the polynomial modulus. Default: 180252380737439.

output:
shares (Point[]) - A list of tuples containing the x and y values of the shares.
*/
export function shamirShare(secret: number, numShares: number, threshold: number, asString: boolean=false, prime: number=180252380737439): Point[] {

    const bigPrime = new BigNumber(prime);
    const bigSecret = new BigNumber(secret);
    const bigThreshold = new BigNumber(threshold);
    
    if (!isIntGreaterThanZero(secret) || !isIntGreaterThanZero(prime)) {
        throw new Error('Secret must be a positive integer');
    }

    const polynomial = sampleShamirPolynomial(bigSecret, bigThreshold, bigPrime);

    return Array.from({ length: numShares }, (_, i) => {
      const point: Point = [
          new BigNumber(i + 1),
          evaluateAtPoint(polynomial, i + 1, bigPrime)
      ];

      if (asString) {
          const x = point[0].toString();
          const y = point[1].toString();
          return [x, y];
      } else {
          return point;
      }
  });
}

/*
Encrypt a specified number of shares using a public key.

inputs:
points (Point[]) - The list of shares to be encrypted, where each share is a tuple of two numbers (x, y).
numEncryptWithKey (number) - The number of shares to be encrypted using the public key.
publicKey (CryptoKey) - The public key used for encryption.

output:
encryptedPoints (Promise<Array<Point>>) - A promise that resolves to a list of encrypted shares, where each share is a tuple 
of two values (x, encrypted_y) for the encrypted shares, or (x, y) for the unencrypted shares.
*/
export async function encryptSecretShares(points: Point[], numEncryptWithKey: number, publicKey: CryptoKey): Promise<Array<PointWithEncryptedState>> {
  let numCalls = 0;
  const encryptedPoints = new Array();

  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1].toString();

    if (numCalls < numEncryptWithKey) {
      encryptedPoints.push([x, arrayBufferToBase64(await encryptString(publicKey, y)), 'enc-share']);
    } else {
      encryptedPoints.push([x, y, 'share']);
    }
    numCalls++;
  }

  return encryptedPoints;
}

async function decryptSecretShares(encryptedShares: Array<PointWithEncryptedState>, privateKey: CryptoKey): Promise<Array<Point>> {
  const decryptedShares = new Array();

  for (let i = 0; i < encryptedShares.length; i++) {
    const x = encryptedShares[i][0];
    const y = encryptedShares[i][1];
    const state = encryptedShares[i][2];

    if (state === 'enc-share') {
      decryptedShares.push([x, new BigNumber(await decryptString(privateKey, base64ToArrayBuffer(y)))]);
    } else {
      decryptedShares.push([x, new BigNumber(y)]);
    }
  }

  return decryptedShares;
}

/*
Convert a table into secret shares and encrypt a specified number of shares using a public key.

inputs:
obj (Record<string, any>) - The table object to be converted into secret shares.
numShares (number) - The number of shares to generate for each secret in the table.
threshold (number) - The minimum number of shares required to reconstruct each secret in the table.
numEncryptWithKey (number) - The number of shares to be encrypted using the public key.
publicKey (CryptoKey) - The public key used for encryption.
stringify (boolean, optional) - Whether to return the shares as strings. Default: false.

output:
encryptedSecretShares (Promise<Record<string, any>>) - A promise that resolves to an object with the same structure as the
 input table, where each secret value is replaced with a list of encrypted secret shares.
*/
export async function tableToSecretShares(obj: Record<string, any>, numShares: number, threshold: number, numEncryptWithKey: number, publicKey: CryptoKey, stringify: boolean=false): Promise<Record<string, any>> {
  const dfs = async (
    currentObj: Record<string, any>,
    originalObj: Record<string, any>
  ): Promise<Record<string, any>> => {
    const keys = Object.keys(originalObj);
    const encoder = new TextEncoder();

    for (const key of keys) {
      if (typeof originalObj[key] === 'number') {
        const points = shamirShare(originalObj[key], numShares, threshold, stringify);
        currentObj[key] = await encryptSecretShares(points, numEncryptWithKey, publicKey);
      } else if (typeof originalObj[key] === 'object') {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        await dfs(currentObj[key], originalObj[key]);
      }
    }

    return currentObj;
  };

  return await dfs({}, obj);
}


export async function secretSharesToTable(obj: Record<string, any>, privateKey: CryptoKey): Promise<Record<string, any>> {
  const dfs = async (
    currentObj: Record<string, any>,
    originalObj: Record<string, any>
  ): Promise<Record<string, any>> => {
    const keys = Object.keys(originalObj);
    const encoder = new TextEncoder();

    for (const key of keys) {
      if (Array.isArray(originalObj[key])) {
        currentObj[key] = await decryptSecretShares(originalObj[key], privateKey);
      } else if (typeof originalObj[key] === 'object') {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        await dfs(currentObj[key], originalObj[key]);
      }
    }

    return currentObj;
  };

  return await dfs({}, obj);
}

export function deepEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    // Check if the key is present in the second object
    if (!keys2.includes(key)) return false;

    const val1 = obj1[key];
    const val2 = obj2[key];

    // If the values are arrays of strings, compare them
    if (Array.isArray(val1) && Array.isArray(val2) && val1.every((elem: any) => typeof elem === 'string') && val2.every((elem: any) => typeof elem === 'string')) {
      if (!arraysEqual(val1, val2)) return false;
    } else if (typeof val1 === 'object' && typeof val2 === 'object') {
      // If the values are objects, perform a deep comparison using DFS
      if (!deepEqual(val1, val2)) return false;
    } else {
      // If the values are not equal, return false
      if (val1 !== val2) return false;
    }
  }

  // If all keys and values are equal, the objects are deeply equal
  return true;
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
