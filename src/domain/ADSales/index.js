import React, { useState } from 'react';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import TabPanel from 'shared/components/TabPanel';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import PendingADs from './PendingADs';
import ConfirmedADs from './ConfirmedADs';
import CardPayments from './CardPayments';
import { useNavigate } from 'react-router-dom';
import { deptType } from 'data/constants';
import BulkInvoices from './BulkInvoices';
import BulkEReceipts from './BulkEReceipts';

const ADSales = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { user: { dept } } = useUserAuth();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (dept.toLowerCase() === deptType.account || dept.toLowerCase() === deptType.sub) {
    alert("You have no access to this menu.");
    navigate('/s/dashboard', { replace: true });
    return null;
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1', margin: "0 auto", mt: 2 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Grid item>
          <Tabs value={tabIndex} onChange={handleChange} aria-label="Sales Tabs">
            <Tab label="Pending ADs" value={0} />
            <Tab label="Confirmed ADs" value={1} />
            <Tab label="Card Payments" value={2} />
            <Tab label="Issue All Invoices" value={3} />
            <Tab label="Issue All E-Receipts" value={4} />
          </Tabs>
        </Grid>
      </Grid>

      <TabPanel value={tabIndex} index={0}>
        <PendingADs />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ConfirmedADs />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <CardPayments />
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <BulkInvoices />
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <BulkEReceipts />
      </TabPanel>
    </Box>
  )
}

export default ADSales;
