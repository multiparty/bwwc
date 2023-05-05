import React, { FC } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { Header, HeaderProps } from '@components/header';
import { Footer } from '@components/footer';
import { TrainingBanner } from '@components/training-banner';
import { NavBar } from '@components/navbar/navbar';

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Layout: FC<LayoutProps> = ({ children, maxWidth, ...headerProps }) => {
  const showNavBar = location.pathname !== '/';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header {...headerProps} />
      <Box sx={{ flexGrow: 1, minHeight: '95vh', display: 'flex' }}>
        <Grid container>
        {showNavBar && (
            <Grid item xs={2}>
              <NavBar />
            </Grid>
          )}
          <Grid item xs={10}>
            <TrainingBanner />
            <Container maxWidth={maxWidth || 'xl'} sx={{ mt: 5 }}>
              {children}
            </Container>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};
