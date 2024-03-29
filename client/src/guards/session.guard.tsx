import React, { FC, useEffect } from 'react';
import { useSession } from '@context/session.context';
import { Outlet, useNavigate } from 'react-router-dom';

export const SessionGuard: FC = () => {
  const { sessionId } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      navigate('/login');
    }
  }, []);

  return <Outlet />;
};
