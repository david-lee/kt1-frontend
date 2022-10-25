import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
// import ADStats from './ADStats';
import RenewalList from './RenewalList';
import StatsAD from './StatsAD';
import StatsPayment from './StatsPayment';
// import SubStats from './SubStats';

const Dashbaord = () => {
  return (
    <Box sx={{ py: 3, px: 8 }}>
      <RenewalList />

      <Grid container justifyContent="space-between" sx={{ mt: 10 }}>
        <Grid item xs={6}>
          <StatsAD />
        </Grid>
        <Grid item xs={6}>
          <StatsPayment />
        </Grid>
      </Grid>
    </Box>
  )
};

export default Dashbaord;
