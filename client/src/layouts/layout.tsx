import React, { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from '@components/header';
import { Footer } from '@components/footer';
import { TrainingBanner } from '@components/training-banner';
import { MaintenanceBanner } from '@components/maintenance-banner';
import { NavBar } from '@components/navbar/navbar';

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Layout: FC<LayoutProps> = ({ children, maxWidth, ...headerProps }) => {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = useState(false);

  useEffect(() => {
    if (location.pathname === '/create' || location.pathname === '/manage') {
      setShowNavBar(true);
    } else {
      setShowNavBar(false);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header {...headerProps} />
      {showNavBar && <NavBar />}
      <TrainingBanner />
      <MaintenanceBanner />
      <Box sx={{ flexGrow: 1, minHeight: '95vh' }}>
        <Container maxWidth={maxWidth || 'xl'} sx={{ mt: 5 }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
