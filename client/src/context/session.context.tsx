import React, { createContext, FC, useEffect, useState } from 'react';

export interface SessionContextProps {
  publicKey?: string;
  setPublicKey: (publicKey?: string) => void;
  sessionId?: string;
  setSessionId: (sessionId?: string) => void;
  participantCode?: string;
  setParticipantCode: (participantCode?: string) => void;
  industry?: string;
  setIndustry: (industry?: string) => void;
  companySize?: string;
  setCompanySize: (companySize?: string) => void;
}

export const SessionContext = createContext<SessionContextProps>({} as SessionContextProps);

export interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string>();
  const [sessionId, setSessionId] = useState<string>(); // save in local storage
  const [participantCode, setParticipantCode] = useState<string>();
  const [industry, setIndustry] = useState<string>();
  const [companySize, setCompanySize] = useState<string>();

  return (
    <SessionContext.Provider
      value={{
        publicKey,
        setPublicKey,
        sessionId,
        setSessionId,
        participantCode,
        setParticipantCode,
        industry,
        setIndustry,
        companySize,
        setCompanySize
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => React.useContext(SessionContext);
