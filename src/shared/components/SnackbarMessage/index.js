import React from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';

const SnackbarMessage = ({ errorMessage, onClose }) => {
  const handleCloseSnackbar = (e, reason) => {
    if (reason !== 'clickaway') {
      onClose && onClose();
    }
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={3000}
      open={!!errorMessage}
      onClose={handleCloseSnackbar}
    >
      <Alert severity='error'><Typography variant="body2b">{errorMessage}</Typography></Alert>
    </Snackbar>
  );
}

export default SnackbarMessage;
