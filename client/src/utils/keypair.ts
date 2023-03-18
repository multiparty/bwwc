function arrayBufferToPem(buffer: ArrayBuffer): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const matches = base64.match(/.{1,64}/g);

    if (matches === null) {
        throw new Error('Invalid base64 string');
    }

    const pem = `-----BEGIN PUBLIC KEY-----\n${matches.join('\n')}\n-----END PUBLIC KEY-----`;
    return pem;
}
  

export async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
    );

    const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKeyPem = arrayBufferToPem(publicKeySpki);

    console.log(publicKeyPem.toString());

    return { keyPair, publicKey: publicKeyPem };
}