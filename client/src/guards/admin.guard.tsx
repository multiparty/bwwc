import React, { FC, useEffect } from 'react';
import { useAuth } from '@context/auth.context';
import { Outlet, useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { useSettings } from '@context/settings.context';

export const AdminGuard: FC = () => {
  const { token, decodedToken, initialized } = useAuth();
  const { VITE_SAIL_PROJECT_ID, VITE_SAIL_AUTH_CLIENT } = useSettings();
  const navigate = useNavigate();
  const loginUrl = `${VITE_SAIL_AUTH_CLIENT}?projectId=${VITE_SAIL_PROJECT_ID}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`;

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
