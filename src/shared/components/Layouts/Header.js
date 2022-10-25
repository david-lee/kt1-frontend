import { Badge, Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'shared/contexts/AppContext';
import { SET_VALUES, TOGGLE_LEFT_SIDEBAR, TOGGLE_PAGE_VIEW } from 'data/actions';
import AccountMenu from './AccountMenu';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import logo from 'assets/tktd-logo-bottom.png';
import path from 'data/routes';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [renewals, setRenewals] = useState(null);
  const [{ isLeftSideBarOpen }, dispatch] = useAppContext();
  const { spaces: { headerHeight }, spacing } = useTheme();
  const navigate = useNavigate();
 
  const togglePageView = (e) => {
    e.preventDefault();
    dispatch({ type: TOGGLE_PAGE_VIEW });
  }

  const toggleSidebar = (e) => {
    e.preventDefault();
    dispatch({ type: TOGGLE_LEFT_SIDEBAR })
  }

  const gotoAdvertiser = (userId) => {
    setIsOpen(false);
    navigate(`/s/${path.advertiser}/${userId}/0`);
  }

  useEffect(() => {
    axios.get(api.salesPeople)
      .then(({ data }) => {
        if (data) dispatch({ type: SET_VALUES, data: { salesPeople: data }});
      });

    axios.get(api.renewal)
      .then(({ data }) => {
        if (data.length) {
          setRenewals(data);
        }
      })
      .finally(() => {});
  }, []);

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Renewal Notice</DialogTitle>

        <DialogContent>
          <Grid container direction="column" rowGap={1}>
            {renewals?.map((renewal) => {
              return (
                <Typography key={renewal.companyName} sx={{ cursor: "pointer" }} onClick={() => gotoAdvertiser(renewal.companyId)}>{renewal.companyName} ({renewal.companyId})</Typography>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          px: 3,
          py: 1,
          width: "100%",
          height: spacing(headerHeight),
          backgroundColor: "primary.kt1Green",
          boxShadow: 4,
          color: "white",
          transition: "width 0.2s",
          zIndex: 998,
        }}
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            height: "100%",
            ml: -2,
          }}
        >
          <img src={logo} width="220px" alt="The Korea Times Daily Logo" />
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            flexGrow: "1",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <Box sx={{ ml: 9 }}>
            <IconButton sx={{ color: 'white', background: 'rgba(0,0,0,0.15)' }} onClick={toggleSidebar}>
              { isLeftSideBarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* <IconButton sx={{ mx: 5, color: "white" }} onClick={() => setIsOpen(true)}>
              <Badge variant="dot" sx={{ "& .MuiBadge-badge": { backgroundColor: "red", width: 10, height: 10, top: 6, left: 4 }}}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}>
                <NotificationsIcon />
              </Badge>
            </IconButton> */}

            <AccountMenu />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Header;
