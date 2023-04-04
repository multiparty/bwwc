import { FC } from 'react';
import { Alert } from '@mui/material';
import { useSettings } from '@context/settings.context';

export const TrainingBanner: FC = () => {
  const { VITE_ENV } = useSettings();
  if (VITE_ENV === 'training') {
    return (
      <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
        This is a training environment only. Do not submit real data.
      </Alert>
    );
  }
  return null;
};
