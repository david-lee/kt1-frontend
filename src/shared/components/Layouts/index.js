import { Box } from '@mui/material';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import MainContent from './MainContent';
import Header from './Header';
import SideMenuBar from './SideMenuBar';

const Layout = () => {
  const { user } = useUserAuth();
  const location = useLocation();

  // if not logged in, redirect to login page passing location path 
  // so that it can be redirected to the target after login
  if (!user?.authToken) {
    return <Navigate to="/" state={{ path: location.pathname }} replace />
  }

  return (
    <Box>
      <Header />
      <SideMenuBar />
      <MainContent >
        <Outlet />
      </MainContent>
    </Box>
  );
}

export default Layout;
