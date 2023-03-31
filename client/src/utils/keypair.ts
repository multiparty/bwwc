function arrayBufferToPem(buffer: ArrayBuffer, publicKey = true): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const matches = base64.match(/.{1,64}/g);

  if (matches === null) {
    throw new Error('Invalid base64 string');
  }

  const pem = `-----BEGIN ${publicKey ? 'PUBLIC' : 'PRIVATE'} KEY-----\n${matches.join('\n')}\n-----END ${publicKey ? 'PUBLIC' : 'PRIVATE'} KEY-----`;
  return pem;
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  return keyPair;
}

export async function keyPairToDictionary(keyPair: CryptoKeyPair): Promise<{ publicKey: string; privateKey: string }> {
  const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicKeyPem = arrayBufferToPem(publicKeySpki);
  const privateKeyPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyPem = arrayBufferToPem(privateKeyPkcs8, false);

  return { publicKey: publicKeyPem, privateKey: privateKeyPem };
}

function pemToUint8Array(pem: string): Uint8Array {
  const base64String = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s+/g, '');
  const byteArray = new Uint8Array(
    atob(base64String)
      .split('')
      .map(char => char.charCodeAt(0))
  );
  return byteArray;
}

export async function importPemPublicKey(publicKeyPem: string): Promise<CryptoKey> {
  try {
    const publicKeyUint8Array = pemToUint8Array(publicKeyPem);
    const publicKeyArrayBuffer = publicKeyUint8Array.buffer;
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyArrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
    return publicKey;
  } catch (error) {
    console.error('Error importing the public key:', error);
    throw error;
  }
}

function pemToPrivateKeyUint8Array(pem: string): Uint8Array {
  const base64String = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const byteArray = new Uint8Array(
    atob(base64String)
      .split('')
      .map(char => char.charCodeAt(0))
  );
  return byteArray;
}

export async function importPemPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
  try {
    const privateKeyUint8Array = pemToPrivateKeyUint8Array(privateKeyPem);
    const privateKeyArrayBuffer = privateKeyUint8Array.buffer;
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyArrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );
    return privateKey;
  } catch (error) {
    console.error('Error importing the private key:', error);
    throw error;
  }
}

export async function encryptString(publicKey: CryptoKey, plainText: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey,
      data
    );
    const encryptedString = new TextDecoder().decode(encryptedData);

    return encryptedString;
  } catch (error) {
    console.error('Error encrypting the string:', error);
    throw error;
  }
}

export async function decryptString(privateKey: CryptoKey, encryptedData: ArrayBuffer): Promise<string> {
  try {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      privateKey,
      encryptedData
    );
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedData);
    return decryptedString;
  } catch (error) {
    console.error('Error decrypting the string:', error);
    throw error;
  }
}

export function isCryptoKeyPair(keypair: { publicKey: string; privateKey: string } | CryptoKeyPair): boolean {
  return keypair.hasOwnProperty('publicKey') &&
  keypair.hasOwnProperty('privateKey');
}