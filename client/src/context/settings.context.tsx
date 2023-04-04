import React, { createContext, FC, useEffect, useState } from 'react';

export interface SettingsContextProps {
  VITE_ENV: string;
  VITE_API_BASE_URL: string;
  VITE_SAIL_PROJECT_ID: string;
  VITE_SAIL_AUTH_CLIENT: string;
}

const SettingsContext = createContext<SettingsContextProps>({} as SettingsContextProps);

export interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [VITE_ENV, setVITE_ENV] = useState<string>(import.meta.env.VITE_ENV || '');
  const [VITE_API_BASE_URL, setVITE_API_BASE_URL] = useState<string>(import.meta.env.VITE_API_BASE_URL || '');
  const [VITE_SAIL_PROJECT_ID, setVITE_SAIL_PROJECT_ID] = useState<string>(import.meta.env.VITE_SAIL_PROJECT_ID || '');
  const [VITE_SAIL_AUTH_CLIENT, setVITE_SAIL_AUTH_CLIENT] = useState<string>(import.meta.env.VITE_SAIL_AUTH_CLIENT || '');

  useEffect(() => {
    fetch('/data.json').then((response) => {
      response
        .json()
        .then((data) => {
          if (data.VITE_ENV) setVITE_ENV(data.VITE_ENV);
          if (data.VITE_API_BASE_URL) setVITE_API_BASE_URL(data.VITE_API_BASE_URL);
          if (data.VITE_SAIL_PROJECT_ID) setVITE_SAIL_PROJECT_ID(data.VITE_SAIL_PROJECT_ID);
          if (data.VITE_SAIL_AUTH_CLIENT) setVITE_SAIL_AUTH_CLIENT(data.VITE_SAIL_AUTH_CLIENT);
        })
        .catch((error) => {
          console.error('Unable to parse data.json');
        });
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        VITE_ENV,
        VITE_API_BASE_URL,
        VITE_SAIL_PROJECT_ID,
        VITE_SAIL_AUTH_CLIENT
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => React.useContext(SettingsContext);
