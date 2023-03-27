function arrayBufferToPem(buffer: ArrayBuffer, publicKey = true): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const matches = base64.match(/.{1,64}/g);

  if (matches === null) {
    throw new Error('Invalid base64 string');
  }

  const pem = `-----BEGIN ${publicKey ? 'PUBLIC' : 'PRIVATE'} KEY-----\n${matches.join('\n')}\n-----END ${publicKey ? 'PUBLIC' : 'PRIVATE'} KEY-----`;
  return pem;
}

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicKeyPem = arrayBufferToPem(publicKeySpki);
  const privateKeyPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyPem = arrayBufferToPem(privateKeyPkcs8, false);

  return { publicKey: publicKeyPem, privateKey: privateKeyPem };
}
