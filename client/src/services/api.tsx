import axios, { AxiosResponse } from 'axios';
import { generateKeyPair } from '@utils/keypair';
import React, { createContext, FC, useContext, useEffect } from 'react';
import { useAuth } from '@context/auth.context';
import { useSession } from '@context/session.context';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/bwwc/';

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

export interface GetSubmissionUrlsResponse {
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

export interface ApiContextProps {
  startSession: () => Promise<CreateSessionResponse>;
  endSession: () => Promise<EndSessionResponse>;
  createNewSubmissionUrls: (count: number) => Promise<GetSubmissionUrlsResponse>;
  getSubmissionUrls: (participant_count: number) => Promise<GetSubmissionUrlsResponse>;
  getEncryptedShares: () => Promise<GetEncryptedSharesResponse>;
  submitData: (data: NestedObject) => Promise<SubmitDataResponse>;
}

async function startSession(): Promise<CreateSessionResponse> {
  const { publicKey, privateKey } = await generateKeyPair();
  const publicKeyPem = publicKey.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');
  const response: AxiosResponse<StartSessionResponse> = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.START_SESSION}`,
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

async function endSession(sessionId?: string): Promise<EndSessionResponse> {
  const response: AxiosResponse = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.END_SESSION}`,
    convertToFormData({
      session_id: sessionId,
      auth_token: 'remove this later'
    })
  );
  return response.data;
}

export async function createNewSubmissionUrls(count: number, sessionId?: string): Promise<GetSubmissionUrlsResponse> {
  const response: AxiosResponse = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.GET_SUBMISSION_URLS}`,
    convertToFormData({
      session_id: sessionId,
      participant_count: count,
      auth_token: 'remove this later'
    })
  );
  return response.data;
}

async function getSubmissionUrls(participant_count: number, session_id?: string): Promise<GetSubmissionUrlsResponse> {
  const response: AxiosResponse = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.GET_SUBMISSION_URLS}`,
    convertToFormData({
      auth_token: 'remove this later',
      session_id: session_id,
      participant_count: participant_count
    })
  );
  return response.data;
}

async function getEncryptedShares(): Promise<GetEncryptedSharesResponse> {
  const response: AxiosResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_ENCRYPTED_SHARES}`);
  return response.data;
}

async function submitData(data: any): Promise<SubmitDataResponse> {
  const response: AxiosResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SUBMIT_DATA}`, data);
  return response.data;
}

const convertToFormData = (data: any): FormData => {
  return Object.keys(data).reduce((formData, key) => {
    formData.append(key, data[key]);
    return formData;
  }, new FormData());
};

const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const { token } = useAuth();
  const { sessionId } = useSession();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <ApiContext.Provider
      value={{
        startSession: () => startSession(),
        endSession: () => endSession(sessionId),
        createNewSubmissionUrls: (count: number) => createNewSubmissionUrls(count, sessionId),
        getSubmissionUrls: (participant_count: number) => getSubmissionUrls(participant_count, sessionId),
        getEncryptedShares: () => getEncryptedShares(),
        submitData: (data: any) => submitData(data)
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);