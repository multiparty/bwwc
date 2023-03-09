import React, { FC } from 'react';
import { Box, Container } from '@mui/material';
import { Header } from '@components/header';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Container sx={{ mt: 20 }}>{children}</Container>
      </Box>
    </Box>
  );
};
