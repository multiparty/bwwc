import React, { FC } from 'react';
import { Box, Button, Container, Grow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShieldTwoTone } from '@mui/icons-material';
import {Paths} from "@constants/paths";

export const PermissionRequiredPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Grow in>
      <Container
        sx={{
          display: 'flex',
          minHeight: '100%',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Access Denied
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>The page you are trying to access has restricted access. Please refer to your system administrator.</Typography>
          <Box sx={{ m: 10 }}>
            <ShieldTwoTone sx={{ fontSize: 300 }} />
          </Box>
          <Button size="large" variant="contained" onClick={() => navigate(Paths.HOME) }>
            Go back
          </Button>
        </Box>
      </Container>
    </Grow>
  );
};
