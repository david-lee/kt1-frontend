import React from 'react';
import { TextField, useTheme } from '@mui/material';
// import Dropdown from '../Dropdown';
// import { adTypePage } from 'data/adOptions';

const ADPage = ({value, onChange, sx, isWAD = false}) => {
  const { spaces: { adOptMinWidthS }} = useTheme();
  const id = "ad-page";
  const label = "Page";

  // if (isWAD) {
  //   return <Dropdown options={adTypePage.WAD} {...{id, label, value, onChange, sx}} />
  // }

  return (
    <TextField {...{id, label, value, onChange}}
      variant="standard"
      size="small" 
      sx={{ my: 2, mr: 3, width: adOptMinWidthS, ...sx }}
    />
  );
}

export default ADPage;
