import { FC } from 'react';
import { AppBar, Box, Hidden, Stack, Toolbar, Typography } from '@mui/material';
import bwwcLogo from '../assets/bwwc-logo.png';
import buLogo from '../assets/bu-logo.png';

export interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: FC<HeaderProps> = (props) => {
  return (
    <AppBar position="static" sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}>
      <Toolbar>
        <Stack sx={{ flexGrow: 1, ml: 5, m: 3 }}>
          <Typography variant="h5" color="black">
            {props.title}
          </Typography>
          <Typography variant="subtitle1" color="gray">
            {props.subtitle}
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
