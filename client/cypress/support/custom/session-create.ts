import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
});

const API_ENDPOINTS = {
  START_SESSION: 'start_session/',
  STOP_SESSION: 'stop_session/',
  END_SESSION: 'end_session/',
  GET_SUBMISSION_URLS: 'get_submission_urls/',
  GET_SUBMISSIONS: 'get_submitted_data/',
  SUBMIT_DATA: 'submit_data/'
};

interface StartSessionResponse {
  session_id: string;
}

export interface CreateSessionResponse {
  privateKey: string;
  publicKey: string;
  sessionId: string;
}

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

const convertToFormData = (data: any): FormData => {
  return Object.keys(data).reduce((formData, key) => {
    formData.append(key, data[key]);
    return formData;
  }, new FormData());
};

export async function startSession(): Promise<CreateSessionResponse> {
  const keypair = await generateKeyPair();
  const { publicKey, privateKey } = await keyPairToDictionary(keypair);
  const publicKeyPem = publicKey.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');

  const response: AxiosResponse<StartSessionResponse> = await axios.post(
    API_ENDPOINTS.START_SESSION,
    convertToFormData({
      public_key: publicKeyPem,
      auth_token: 'remove this later'
    })
  );

  return {
    privateKey,
    publicKey,
    sessionId: response.data.session_id
  };
}
