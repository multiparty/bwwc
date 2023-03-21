import { FC, useEffect } from 'react';
import { Box, Button, CircularProgress, Container, Grow, Stack, Typography } from '@mui/material';
import { Paths } from '@constants/paths';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkTwoTone } from '@mui/icons-material';

export const LogoutPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate(Paths.HOME, { replace: true });
  }, []);

  return (
    <Stack
      spacing={4}
      sx={{
        mt: 10,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={64} />
    </Stack>
  );
};
