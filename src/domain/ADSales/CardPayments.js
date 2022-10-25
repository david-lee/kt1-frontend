import React from 'react';
import { Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DownloadIcon from '@mui/icons-material/Download';
import useSales from 'shared/hooks/useSales';

const CardPayment = () => {
  const { isLoading, fetchCardPayList } = useSales();

  const downloadPDF = () => {
    fetchCardPayList();
  };

  return (
    <Grid container direction="column" justifyContent="center" columnGap={4}>
      <Grid item>
        <Typography variant="body1">You can download a PDF file which has a list of bills with card payment option.</Typography>
      </Grid>

      <Grid item sx={{ mt: 5 }}>
        <LoadingButton startIcon={<DownloadIcon />} variant="contained" disabled={isLoading}
          onClick={() => downloadPDF()} loading={isLoading}
        >
          Download List
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

export default CardPayment;
