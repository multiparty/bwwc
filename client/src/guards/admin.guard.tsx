import React, { FC, useEffect } from 'react';
import { useAuth } from '@context/auth.context';
import { Outlet, useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';

export const AdminGuard: FC = () => {
  const { token, decodedToken, initialized } = useAuth();
  const navigate = useNavigate();
  const projectId = import.meta.env.VITE_SAIL_PROJECT_ID;
  const loginUrl = `${import.meta.env.VITE_SAIL_AUTH_CLIENT}?projectId=${projectId}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`;

  useEffect(() => {
    if (initialized && !token) {
      window.location.replace(loginUrl);
    }

    if (initialized && decodedToken && decodedToken.role !== 1) {
      navigate(Paths.PERMISSION_REQUIRED, { replace: true });
    }
  }, [token, decodedToken, initialized]);

  return <Outlet />;
};
