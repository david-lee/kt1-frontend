import React from 'react';
import { Box } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index, sx,...other } = props;

  // if (value !== index) return null;
  
  return (
    <Box
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{
        px: 2,
        py: 4,
        display: value !== index ? "none" : "block",
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default TabPanel;

