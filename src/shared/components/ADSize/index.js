import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import { adTypeSize } from 'data/adOptions';

const ADSize = ({id, value, onChange, sx}) => {
  const { spaces: { adOptMinWidthM }} = useTheme();
  // TODO:get different size based on ad type
  const options = adTypeSize.DAD;

  return (
    <FormControl
      size="small"
      sx={{ my: 2, mr: 4, minWidth: adOptMinWidthM, ...sx }}
    >
      <InputLabel id={`${id}-label`}>Size</InputLabel>
      <Select
        id={id}
        label="Size"
        labelId={id}
        value={value}
        onChange={onChange}
      >
        {options.map(({label, value}) => {
          return <MenuItem value={value}>{label}</MenuItem>
        })}
      </Select>
    </FormControl>      
  )
}

export default ADSize;
