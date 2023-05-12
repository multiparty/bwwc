import axios, { AxiosResponse } from 'axios';
import { generateKeyPair, keyPairToDictionary } from '@utils/keypair';
import React, { createContext, FC, useContext, useEffect } from 'react';
import { useAuth } from '@context/auth.context';
import { useSession } from '@context/session.context';
import { useSettings } from '@context/settings.context';
import { AppState } from '@utils/data-format';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/bwwc/';

// trailing slash is required by backend
const API_ENDPOINTS = {
  START_SESSION: 'start_session/',
  STOP_SESSION: 'stop_session/',
  END_SESSION: 'end_session/',
  GET_PRIME: 'get_prime/',
  GET_PUBLIC_KEY: 'get_public_key/',
  GET_SUBMISSION_URLS: 'get_submission_urls/',
  GET_SUBMISSIONS: 'get_submitted_data/',
  GET_SUBMISSION_HISTORY: 'get_submission_history/',
  SUBMIT_DATA: 'submit_data/'
};

type NestedObject = {
  [key: string]: string | number | boolean | NestedObject | Array<string | number | boolean | NestedObject>;
};

interface StartSessionResponse {
  session_id: string;
  prime: string;
}

interface StopSessionResponse {
  status: {
    [code: number]: any;
  };
}

interface EndSessionResponse {
  status: {
    [code: number]: any;
  };
}

interface Submission {
  participantCode: string;
  industry: string;
  companySize: string;
}

export interface GetSubmissionUrlsResponse {
  [participant: string]: string;
}

interface GetEncryptedSharesResponse extends NestedObject {}

interface Metadata {
  companySize: number;
  industry: number;
}

interface GetSubmissionData {
  data: GetEncryptedSharesResponse;
  total_cells: number;
  metadata: Metadata;
}

interface SubmitDataResponse {
  status: {
    [code: number]: any;
  };
}

export interface CreateSessionResponse {
  privateKey: string;
  publicKey: string;
  sessionId: string;
  prime: string;
}

export interface ApiContextProps {
  startSession: () => Promise<CreateSessionResponse>;
  endSession: (sessionId: string, authToken: string) => Promise<EndSessionResponse>;
  createNewSubmissionUrls: (count: number, sessionId: string, authToken: string) => Promise<GetSubmissionUrlsResponse>;
  getPublicKey: (sessionId: string) => Promise<string>;
  getSubmissions: (sessionId: string, authToken: string) => Promise<GetSubmissionData>;
  getSubmissionHistory: (sessionId: string, authToken: string) => Promise<Submission[]>;
  stopSession: (sessionId: string, authToken: string) => Promise<StopSessionResponse>;
  submitData: (data: NestedObject, sessionId: string, participantCode: string) => Promise<AxiosResponse>;
}

export async function startSession(): Promise<CreateSessionResponse> {
  const keypair = await generateKeyPair();
  const { publicKey, privateKey } = await keyPairToDictionary(keypair);
  const publicKeyPem = publicKey.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');

  const response: AxiosResponse<StartSessionResponse> = await axios.post(
    API_ENDPOINTS.START_SESSION,
    convertToFormData({
      public_key: publicKeyPem
    })
  );

  return {
    privateKey,
    publicKey,
    sessionId: response.data.session_id,
    prime: response.data.prime
  };
}

export async function stopSession(sessionId: string, authToken: string): Promise<StopSessionResponse> {
  const response: AxiosResponse = await axios.post(
    API_ENDPOINTS.STOP_SESSION,
    convertToFormData({
      session_id: sessionId,
      auth_token: authToken
    })
  );
  return response.data;
}

export async function endSession(sessionId: string, authToken: string): Promise<EndSessionResponse> {
  const response: AxiosResponse = await axios.post(
    API_ENDPOINTS.END_SESSION,
    convertToFormData({
      session_id: sessionId,
      auth_token: authToken
    })
  );
  return response.data;
}

export async function createNewSubmissionUrls(count: number, sessionId: string, authToken: string): Promise<GetSubmissionUrlsResponse> {
  const response: AxiosResponse = await axios.post(
    API_ENDPOINTS.GET_SUBMISSION_URLS,
    convertToFormData({
      session_id: sessionId,
      participant_count: count
    })
  );
  return response.data;
}

export async function getSubmissions(sessionId: string, authToken: string): Promise<GetSubmissionData> {
  const response: AxiosResponse = await axios.get(API_ENDPOINTS.GET_SUBMISSIONS, { params: { session_id: sessionId, auth_token: authToken } });
  return {
    data: response.data,
    total_cells: response.data.total_cells,
    metadata: response.data.metadata
  };
}

export async function submitData(data: NestedObject, sessionId: string, participantCode: string): Promise<AxiosResponse> {
  console.log('WTF IS THE DATA?')
  const response: AxiosResponse = await axios.post(
    API_ENDPOINTS.SUBMIT_DATA,
    convertToFormData({
      data: JSON.stringify(data),
      sessionId: sessionId,
      participantCode: participantCode
    })
  );
  return response;
}

export async function getPrime(sessionId: string): Promise<string> {
  const response = await axios.get(API_ENDPOINTS.GET_PRIME, { params: { session_id: sessionId } });
  return response.data.prime;
}

export async function getPublicKey(session_id: string): Promise<string> {
  const response = await axios.get(API_ENDPOINTS.GET_PUBLIC_KEY, { params: { session_id: session_id } });
  return response.data.public_key;
}

export async function getSubmissionHistory(sessionId: string, authToken: string): Promise<Submission[]> {
  const response = await axios.get(API_ENDPOINTS.GET_SUBMISSION_HISTORY, { params: { session_id: sessionId, auth_token: authToken } });
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
  const { VITE_API_BASE_URL } = useSettings();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    axios.defaults.baseURL = VITE_API_BASE_URL;
  }, [token, VITE_API_BASE_URL]);

  useEffect(() => {
    // Set Default
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.common['Access-Control-Request-Headers'] = 'content-type';
    axios.defaults.headers.common['Access-Control-Request-Method'] = 'POST';
  }, []);

  return (
    <ApiContext.Provider
      value={{
        startSession: () => startSession(),
        endSession: (sessionId: string, authToken: string) => endSession(sessionId, authToken),
        createNewSubmissionUrls: (count: number, sessionId: string, authToken: string) => createNewSubmissionUrls(count, sessionId, authToken),
        getPublicKey: (session_id: string) => getPublicKey(session_id),
        getSubmissions: (sessionId: string, authToken: string) => getSubmissions(sessionId, authToken),
        getSubmissionHistory: (sessionId: string, authToken: string) => getSubmissionHistory(sessionId, authToken),
        stopSession: (sessionId: string, authToken: string) => stopSession(sessionId, authToken),
        submitData: (data: NestedObject, sessionId: string, participantCode: string) => submitData(data, sessionId, participantCode)
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
