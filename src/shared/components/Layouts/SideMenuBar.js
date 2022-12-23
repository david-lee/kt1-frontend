import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ApprovalIcon from '@mui/icons-material/Approval';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import StoreIcon from '@mui/icons-material/Store';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import routePath from 'data/routes';
import { useAppContext } from 'shared/contexts/AppContext';
import { adTypeCode, deptType, roleType  } from 'data/constants';
import { useUserAuth } from 'shared/contexts/UserAuthContext';

const SideMenuBar = () => {
  const [{ isLeftSideBarOpen }] = useAppContext();
  const { spaces: { headerHeight, sidebarWidth, contentPT }, spacing } = useTheme();
  const [salesOpen, setSalesOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user: { dept, role } } = useUserAuth();
  
  const canUseAnyMenus = dept.toLowerCase() === deptType.it || dept.toLowerCase() === deptType.director;
  const canUseSub = canUseAnyMenus || dept.toLowerCase() === deptType.sub;
  const canUseSales = canUseAnyMenus || dept.toLowerCase() === deptType.sales;
  const canUseCollection = canUseAnyMenus || dept.toLowerCase() === deptType.account;

  const handleItemClick = (e, route, id) => {
    setSelectedIdx(id || route);

    if (route === 'sales') {
      setSalesOpen(isOpen => !isOpen);
      setCollectionOpen(false);
      return;
    }
    if (route === 'collections') {
      setCollectionOpen(isOpen => !isOpen);
      setSalesOpen(false);
      return;
    } 
    if (route) {
      navigate(`${routePath.prefixAuthed}/${route}`, { replace: true });
    }
  };

  useEffect(() => {
    const { pathname } = location;
    // const route = pathname.substring(pathname.lastIndexOf('/') + 1);
    
    setSelectedIdx(pathname);
    // setSelectedIdx(route);
    // TODO: figure out how to identify parent list like sales or collections
    // include into pathname? or nested routes?
    // setSalesOpen(pathname.indexOf('/sales/'))
  }, [location]);

  return (
    <Box
      className={clsx({ hideMenu: !isLeftSideBarOpen })}
      sx={{
        position: "fixed",
        left: 0,
        top: spacing(headerHeight),
        pt: contentPT,
        height: `calc(100% - ${spacing(headerHeight)})`,
        width: spacing(sidebarWidth),
        zIndex: 997,
        boxShadow: 5,
        tranform: "none",
        transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
        "&.hideMenu": {
          transform: "translateX(-280px)",
        }
      }}
    >
      <List
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: 40,
          },
          "& .Mui-selected": {
            backgroundColor: "#D6D9EF",
          },
        }}
      >
      {/* TODO: make an item object to iterate */}
        <ListItemButton selected={selectedIdx.includes(routePath.dashboard)} onClick={e => handleItemClick(e, routePath.dashboard)}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {canUseSub && (
          <ListItemButton selected={selectedIdx.includes(routePath.subscriber)} onClick={e => handleItemClick(e, routePath.subscriber)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Subscriber" />
          </ListItemButton>
        )}

        {canUseSales && (
          <>
            {/* <ListItemButton selected={selectedIdx === 'sales'} onClick={e => handleItemClick(e, 'sales')}>
              <ListItemIcon>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Sales" />
              {salesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton> */}
            <List component="div" disablePadding>
              <ListItemButton selected={selectedIdx.includes(`${adTypeCode.dad}`)} onClick={e => handleItemClick(e, `scheduleAD/1/${adTypeCode.dad}`, `${adTypeCode.dad}`)}>
                <ListItemIcon>
                  <NewspaperOutlinedIcon />
                </ListItemIcon>            
                <ListItemText primary="One Time - DAD" />
              </ListItemButton>

              <ListItemButton selected={selectedIdx.includes(`${adTypeCode.wky}`)} onClick={e => handleItemClick(e, `scheduleAD/1/${adTypeCode.wky}`, `${adTypeCode.wky}`)}>
                <ListItemIcon>
                  <ImportContactsOutlinedIcon />
                </ListItemIcon>            
                <ListItemText primary="One Time - WKY" />
              </ListItemButton>
              
              <ListItemButton selected={selectedIdx.includes('fixed')} onClick={e => handleItemClick(e, `scheduleAD/2/fixed`, 'fixed')}>
                <ListItemIcon>
                  <EventRepeatOutlinedIcon />
                </ListItemIcon>            
                <ListItemText primary="Monthly / recurring" />
              </ListItemButton>

              <Divider variant='middle' />
              
              <ListItemButton selected={selectedIdx.includes(routePath.advertiser)} onClick={e => handleItemClick(e, routePath.advertiser)}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Company Management" />
              </ListItemButton>
              
              <ListItemButton selected={selectedIdx.includes(routePath.adsales)} onClick={e => handleItemClick(e, routePath.adsales)}>
                <ListItemIcon>
                  <ApprovalIcon />
                </ListItemIcon>
                <ListItemText primary="Advertise Management" />
              </ListItemButton>
            </List>
          </>
        )}

        {canUseCollection && (
          <>
            <ListItemButton selected={selectedIdx.includes(routePath.collection)} onClick={e => handleItemClick(e, routePath.collection)}>
              <ListItemIcon>
                <LocalAtmIcon />
              </ListItemIcon>
              <ListItemText primary="Collections - Invoices" />
            </ListItemButton>

            <ListItemButton selected={selectedIdx.includes(routePath.collectionBills)} onClick={e => handleItemClick(e, routePath.collectionBills)}>
              <ListItemIcon>
                <MoneyOffIcon />
              </ListItemIcon>
              <ListItemText primary="Collections - Bills" />
            </ListItemButton>
          </>
        )}
        {/* <Collapse in={collectionOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton selected={selectedIdx === routePath.collectionInvoices} onClick={e => handleItemClick(e, routePath.collectionInvoices)}
              sx={{ pl: 8 }}
            >
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>            
              <ListItemText primary="Invoices" />
            </ListItemButton>  
          </List>
        </Collapse>         */}
      </List>
    </Box>    
  );
}

export default SideMenuBar;
