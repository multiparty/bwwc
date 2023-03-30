import { encryptString, decryptString } from '../utils/keypair';
import crypto from 'crypto';

describe('Encryption and Decryption', () => {
  let publicKey: CryptoKey;
  let privateKey: CryptoKey;
  const plainText = 'This is a test string';

  beforeAll(async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
  });

  test('should encrypt and then decrypt the string', async () => {
    const encryptedString = await encryptString(publicKey, plainText);
    const encryptedBuffer = new TextEncoder().encode(encryptedString);
    const decryptedString = await decryptString(privateKey, encryptedBuffer);

    expect(decryptedString).toEqual(plainText);
  });
});
