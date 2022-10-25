import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, useTheme } from '@mui/material';

const ADDate = ({label, value, onChange, width, name, sx, ...rest}) => {
  const { spaces: { adOptMinWidthM }} = useTheme();

  return (
    <DatePicker
      {...{label, onChange, value}} 
      {...rest}
      renderInput={(params) => <TextField {...params} variant="standard" 
        sx={{ my: 2, mr: 3, width: width || adOptMinWidthM, "& input": { p: 1 }, ...sx }} />}
    />    
  );
}

export default ADDate;
