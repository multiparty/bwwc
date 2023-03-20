import React, { createContext, FC, useEffect, useState } from 'react';

export interface SessionContextProps {
  publicKey?: string;
  setPublicKey: (publicKey: string) => void;
  sessionId?: string;
  setSessionId: (sessionId: string) => void;
  sessionPassword?: string;
  setSessionPassword: (sessionPassword: string) => void;
  participantCode?: string;
  setParticipantCode: (participantCode: string) => void;
}

export const SessionContext = createContext<SessionContextProps>({} as SessionContextProps);

export interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [sessionPassword, setSessionPassword] = useState<string>();
  const [participantCode, setParticipantCode] = useState<string>();

  return (
    <SessionContext.Provider
      value={{
        publicKey,
        setPublicKey,
        sessionId,
        setSessionId,
        sessionPassword,
        setSessionPassword,
        participantCode,
        setParticipantCode
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => React.useContext(SessionContext);
