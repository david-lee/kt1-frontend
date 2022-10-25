import React from 'react';
import { useIntl } from 'react-intl';
import { Paper, Typography } from '@mui/material';

const StatsCard = ({label, stat, isMoney}) => {
  const intl = useIntl();
  const options = isMoney ? { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 } : {};

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h5">
        {intl.formatNumber(stat, options)}
      </Typography>
      <Typography variant="body2">{label}</Typography>
  </Paper>
  )
}

export default StatsCard;
