import React, { FC } from 'react';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from '@components/header';
import { Footer } from '@components/footer';
import { TrainingBanner } from '@components/training-banner';

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Layout: FC<LayoutProps> = ({ children, maxWidth, ...headerProps }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header {...headerProps} />
      <TrainingBanner />
      <Box sx={{ flexGrow: 1, minHeight: '95vh' }}>
        <Container maxWidth={maxWidth || 'xl'} sx={{ mt: 5 }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
