import React, { Suspense } from 'react';
import AppRoutes from 'routes';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IntlWrapper from 'shared/components/IntlWrapper';
import AppProvider from 'shared/contexts/AppContext';
import UserAuthProvider from 'shared/contexts/UserAuthContext';
import { API_BASE_URL } from 'data/constants';
import theme from './theme';

const App = () => {
  axios.defaults.baseURL = API_BASE_URL;
  axios.interceptors.request.use((config) => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    let newConfig = user ? {...config, headers: { ...config.headers, Authorization: `Bearer ${user.authToken}`}} : config;
  
    return newConfig;
  }, (err) => {
    console.log("axios error: ", err);
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AppProvider>
              <UserAuthProvider>
                <CssBaseline />
                <IntlWrapper>
                  <AppRoutes />
                </IntlWrapper>
              </UserAuthProvider>
            </AppProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
