import { FC } from 'react';
import { Alert } from '@mui/material';
import { useSettings } from '@context/settings.context';

export const MaintenanceBanner: FC = () => {
  const { VITE_ENV } = useSettings();

  return (
    <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
      100talent.org is currently unavailable due to system maintenance. We apologize for the inconvenience. If you have any questions please contact team@thebwwc.org
    </Alert>
  );
};
