import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DownloadIcon from '@mui/icons-material/Download';
import Dropdown from 'shared/components/Dropdown';
import { adTypeOptions } from 'data/adOptions';
import useSales from 'shared/hooks/useSales';

const CardPayment = () => {
  const { isLoading, fetchCardPayList } = useSales();
  const [ adType, setAdType ] = useState('');

  const downloadPDF = () => {
    fetchCardPayList(adType);
  };

  return (
    <Grid container direction="column" justifyContent="center" columnGap={4}>
      <Grid item>
        <Typography variant="body1">You can download a PDF file which has a list of bills with card payment option.</Typography>
      </Grid>

      <Grid container item columnGap={5} sx={{ mt: 8 }}>
        <Dropdown id="adType" name="adType" label="Ad Type" value={adType}
           onChange={e => setAdType(e.target.value)}
           options={adTypeOptions} width={160}
        />

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
