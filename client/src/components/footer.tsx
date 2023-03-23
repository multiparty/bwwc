import { AppBar, Box, Divider, Grid, Link, Stack, Toolbar, Typography } from '@mui/material';

import buLogo from '../assets/bu-logo.png';
import bwwcLogo from '../assets/bwwc-logo.png';
import sailLogo from '../assets/sail-logo.png';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 4 }}>
      <AppBar position="relative" sx={(theme) => ({ backgroundColor: theme.palette.background.paper, bottom: 0, p: 3, pt: 6 })}>
        <Toolbar>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" color="black">
                  Need Help?
                </Typography>
                <Typography variant="subtitle1" color="gray">
                  Contact us at team@thebwwc.org
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Box>
                    <Box component="img" src={bwwcLogo} sx={{ maxHeight: '40px' }} />
                  </Box>
                  <Typography variant="h6" color="black">
                    Boston Women’s Workforce Council
                  </Typography>
                  <Typography variant="subtitle1" color="gray">
                    The Boston Women’s Workforce Council (BWWC) leads a unique public-private partnership between the Boston Mayor and Greater Boston employers dedicated to
                    eliminating gender and racial wage gaps.
                  </Typography>
                  <Link href="https://thebwwc.org" target="_blank">
                    https://thebwwc.org
                  </Link>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Stack spacing={3} direction="row">
                    <Box component="img" src={sailLogo} sx={{ maxHeight: '40px' }} />
                    <Box component="img" src={buLogo} sx={{ maxHeight: '40px' }} />
                  </Stack>
                  <Typography variant="h6" color="black">
                    Software Applications & Innovation Lab
                  </Typography>
                  <Typography variant="subtitle1" color="gray">
                    The Software & Applications Innovation Lab (SAIL) is the premier professional research, software engineering, and consulting lab within the Hariri Institute for
                    Computing at Boston University.
                  </Typography>
                  <Link href="https://sail.bu.edu" target="_blank">
                    https://sail.bu.edu
                  </Link>
                </Stack>
              </Grid>
            </Grid>
            <Divider />
            <Typography variant="subtitle1" color="gray" sx={{ mt: 2 }}>
              © {new Date().getFullYear()} All rights reserved. Boston Women’s Workforce Council
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
