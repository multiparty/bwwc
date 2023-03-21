import React, { FC, useEffect } from 'react';
import { useSession } from '@context/session.context';
import { Outlet, useNavigate } from 'react-router-dom';

export const SessionGuard: FC = () => {
  const { sessionId, sessionPassword } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId || !sessionPassword) {
      navigate('/login');
    }
  }, []);

  return <Outlet />;
};
