import { FC } from 'react';
import { AppBar, Box, Hidden, Stack, Toolbar, Typography } from '@mui/material';
import bwwcLogo from '../assets/bwwc-logo.png';
import buLogo from '../assets/bu-logo.png';

export const Header: FC = () => {
  return (
    <AppBar position="fixed" sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}>
      <Toolbar>
        <Stack sx={{ flexGrow: 1, ml: 5, m: 3 }}>
          <Typography variant="h5" color="black">
            Boston Women's Workforce Council
          </Typography>
          <Typography variant="subtitle1" color="gray">
            100% Talent Data Submission
          </Typography>
        </Stack>
        <Hidden mdDown>
          <Stack direction="row" sx={{ m: 3 }} spacing={5}>
            <Box component="img" src={bwwcLogo} sx={{ maxHeight: '80px' }} />
            <Box component="img" src={buLogo} sx={{ maxHeight: '80px' }} />
          </Stack>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
