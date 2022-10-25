import { useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import clsx from 'clsx';
import { useAppContext } from 'shared/contexts/AppContext';
import ADPageView from '../AdPageView';

const MainContent = ({ children }) => {
  const { spaces: { headerHeight, sidebarWidth, contentPT}, spacing } = useTheme();
  const [{ isLeftSideBarOpen }] = useAppContext();

  return (
    <>
      <Box
        className={clsx({ expandContent: !isLeftSideBarOpen })}
        sx={{
          pt: headerHeight + contentPT,
          px: 3,
          ml: sidebarWidth,
          minHeight: "100vh",
          transition: "margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
          "&.expandContent": {
            transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            marginLeft: 0
          }
        }}
      >
        {children}
      </Box>

      <ADPageView />
    </>
  )
}

export default MainContent;
