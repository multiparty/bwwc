import React, { FC } from 'react';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from '@components/header';
import { Footer } from '@components/footer';

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children, ...headerProps }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header {...headerProps} />
      <Box sx={{ flexGrow: 1, minHeight: '95vh' }}>
        <Container maxWidth="xl" sx={{ mt: 5 }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
