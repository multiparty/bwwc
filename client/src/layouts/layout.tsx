import React, { FC } from 'react';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from '@components/header';

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children, ...headerProps }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header {...headerProps} />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ mt: 5 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
