import React, { Suspense } from 'react';
import AppRoutes from 'routes';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IntlWrapper from 'shared/components/IntlWrapper';
import AppProvider from 'shared/contexts/AppContext';
import UserAuthProvider from 'shared/contexts/UserAuthContext';
import theme from './theme';

const App = () => {
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
