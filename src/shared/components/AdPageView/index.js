import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppContext } from 'shared/contexts/AppContext';
import { TOGGLE_PAGE_VIEW } from 'data/actions';
import { IconButton } from '@mui/material';

const ADPageView = () => {
  const [{ isADPageViewOpen }, dispatch] = useAppContext();
  const anchorPosition = "right";

  const closeView = (e) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;

    dispatch({ type: TOGGLE_PAGE_VIEW });
  };

  return (
    <>
      <Drawer
        anchor={anchorPosition}
        open={isADPageViewOpen}
        onClose={closeView}
        sx={{ height: '100% '}}
      >
        <Box sx={{ px: 3, py: 1, position: 'relative', width: 'calc(100vw - 400px)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: 40 }}>
            <IconButton onClick={closeView}><CancelIcon /></IconButton>
          </Box>
          <Box sx={{ height: '100%' }}>Content</Box>
        </Box>
      </Drawer>
    </>
  );
}

export default ADPageView;
