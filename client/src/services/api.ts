import axios, { AxiosResponse } from 'axios';
import { generateKeyPair } from '@utils/keypair';

axios.defaults.headers.post['Content-Type'] = 'multipart/form-date';

const API_BASE_URL = 'https://localhost:8080/api/bwwc/';

// trailing slash is required by backend
const API_ENDPOINTS = {
  START_SESSION: 'start_session/',
  END_SESSION: 'end_session/',
  GET_SUBMISSION_URLS: 'get_submission_urls/',
  GET_ENCRYPTED_SHARES: 'get_encrypted_shares/',
  SUBMIT_DATA: 'submit_data/'
};

type NestedObject = {
  [key: string]: string | number | boolean | NestedObject | Array<string | number | boolean | NestedObject>;
};

interface StartSessionResponse {
  session_id: string;
}

interface EndSessionResponse {
  status: {
    [code: number]: any;
  };
}

interface GetSubmissionUrlsResponse {
  [participant: string]: string;
}

interface GetEncryptedSharesResponse extends NestedObject {}

interface SubmitDataResponse {
  status: {
    [code: number]: any;
  };
}

export interface CreateSessionResponse {
  privateKey: string;
  publicKey: string;
  sessionId: string;
}

export async function startSession(auth_token: string): Promise<CreateSessionResponse> {
  const { publicKey, privateKey } = await generateKeyPair();
  const publicKeyPem = publicKey.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');
  const response: AxiosResponse<StartSessionResponse> = await axios.post(
    `${API_BASE_URL}start_session/`,
    convertToFormData({
      auth_token,
      public_key: publicKeyPem
    })
  );
  return {
    privateKey,
    publicKey,
    sessionId: response.data.session_id
  };
}

export async function endSession(): Promise<EndSessionResponse> {
  const response: AxiosResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.END_SESSION}`);
  return response.data;
}

export async function getSubmissionUrls(): Promise<GetSubmissionUrlsResponse> {
  const response: AxiosResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_SUBMISSION_URLS}`);
  return response.data;
}

export async function getEncryptedShares(): Promise<GetEncryptedSharesResponse> {
  const response: AxiosResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_ENCRYPTED_SHARES}`);
  return response.data;
}

export async function submitData(data: any): Promise<SubmitDataResponse> {
  const response: AxiosResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SUBMIT_DATA}`, data);
  return response.data;
}

const convertToFormData = (data: any): FormData => {
  return Object.keys(data).reduce((formData, key) => {
    formData.append(key, data[key]);
    return formData;
  }, new FormData());
};