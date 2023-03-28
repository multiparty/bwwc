import { FC } from 'react';
import { Alert } from '@mui/material';

export const TrainingBanner: FC = () => {
  if (import.meta.env.VITE_ENV === 'training') {
    return (
      <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
        This is a training environment only. Do not submit real data.
      </Alert>
    );
  }
  return null;
};
