import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';

export interface DecodedToken {
  id: string;
  projectId: string;
  role: number;
}

export interface AuthContextProps {
  initialized: boolean;
  token?: string;
  decodedToken?: DecodedToken;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string>();
  const [decodedToken, setDecodedToken] = useState<DecodedToken>();

  useEffect(() => {
    const token = restoreToken();
    if (token) {
      setToken(token);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (token) {
      saveToken(token);
      //setDecodedToken(decode(token, { json: true }) as DecodedToken);
    }
  }, [token]);

  return <AuthContext.Provider value={{ token, decodedToken, setToken, initialized }} {...props} />;
};

const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

const restoreToken = (): string | null => {
  return localStorage.getItem('token');
};

export const useAuth = () => useContext(AuthContext);
