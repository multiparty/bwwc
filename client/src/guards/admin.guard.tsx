import React, { FC, useEffect } from 'react';
import { useAuth } from '@context/auth.context';
import { Outlet, useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { useSettings } from '@context/settings.context';

export const AdminGuard: FC = () => {
  const { token, decodedToken, initialized } = useAuth();
  const { VITE_SAIL_PROJECT_ID, VITE_SAIL_AUTH_CLIENT } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !token && !!VITE_SAIL_AUTH_CLIENT && !!VITE_SAIL_PROJECT_ID) {
      window.location.replace(`${VITE_SAIL_AUTH_CLIENT}?projectId=${VITE_SAIL_PROJECT_ID}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`);
    }

    if (initialized && decodedToken && decodedToken.role !== 1) {
    navigate(Paths.PERMISSION_REQUIRED, { replace: true });
    }
  }, [token, decodedToken, initialized, VITE_SAIL_PROJECT_ID, VITE_SAIL_AUTH_CLIENT]);

  return <Outlet />;
};
