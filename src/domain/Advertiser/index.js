import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Tab, Tabs, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import api from 'appConfig/restAPIs';
import CompanySearch from 'shared/components/CompanySearch';
import TabPanel from 'shared/components/TabPanel';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { roleType, deptType } from 'data/constants';
import CompanyOverview from './CompanyOverview';
import AddressContainer from './AddressContainer';
import ADList from './ADList';
import Notes from './Notes';
import InvoiceList from './InvoiceList';
import MonthlySales from './MonthlySales';
import AddNewCompany from './AddNewCompany';
import CardInfo from './CardInfo';

const Advertiser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [company, setCompany] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  
  // const [ads, setADs] = useState(null);
  // const [invoices, setInvoices] = useState(null);
  const { user: { role, dept }} = useUserAuth();

  const fetchCompany = useCallback((userId) => {
    setIsLoading(true);

    axios.post(api.companySearch, { userId })
      .then(({ data }) => {
        setCompany(data[0]);

        if (data.length === 0) alert(`There is no company of the customer ID ${userId}.`);
      })
      .catch((error) => {
        console.log("Error on refresh: ", error.message);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }, []);

  const handleSaveCompany = useCallback((userId, deleted) => {
    if (deleted) {
      setIsDeleted(true);
      // navigate(`/s/${path.advertiser}`);
    }
    else {
      fetchCompany(userId);
    }
  }, [fetchCompany]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const resetHandler = () => {
    setCompany(null);
    // setADs(null);
    // setInvoices(null);
    setTabIndex(0);
    setIsDeleted(false);
  };

  useEffect(() => {
    if (params?.userId) {
      // default is INFO tab
      setTabIndex(+params.tabIndex || 0);
      // if it reloads after saving or comes from a link in the renewal alarm, it doesn't have state
      loc.state ? setCompany(loc.state) : fetchCompany(params.userId);
    } 
    else {
      setCompany(null);
    }
  }, [params, loc.state, fetchCompany]);

  if (dept.toLowerCase() === deptType.account || dept.toLowerCase() === deptType.sub) {
    navigate('/s/dashboard', { replace: true });
    return null;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={9}>
          <CompanySearch onReset={resetHandler} isDeleted={isDeleted} />
        </Grid>
        {
          role !== roleType.director && (
            <Grid item xs={2} sx={{ pt: 5 }}>
              <AddNewCompany />
            </Grid>
          )
        }
      </Grid>

      {company && (
        <Box sx={{ width: '100%', typography: 'body1', margin: "0 auto", mt: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Grid item>
              <Tabs value={tabIndex} onChange={handleChange} aria-label="Advertise Tabs">
                <Tab label="Info" value={0} />
                <Tab label="Notes" value={1} />
                <Tab label="AD List" value={2} />
                <Tab label="Issued Invoice List" value={3} />
                <Tab label="Monthly Sales" value={4} />
                <Tab label="Card Info" value={5} />
              </Tabs>
            </Grid>
            <Grid item><Typography color="green" variant="body1b">{company.primaryName} ({company.userId})</Typography></Grid>
          </Grid>

          <TabPanel value={tabIndex} index={0}>
            {isLoading && (
              <Grid container justifyContent="center" alignItems="center" sx={{ height: '40vh', margin: "0 auto" }}>
                <Box sx={{ minHeight: 4, width: 500 }}>
                  <LinearProgress />
                </Box>
              </Grid>
            )}
            {!isLoading && (
              <>
                <CompanyOverview company={company} onSave={handleSaveCompany} />
                <AddressContainer company={company} />
              </>
            )}
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Notes companyId={company.userId} role={role} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <ADList companyId={company.userId} eInvoice={company.eInvoice} role={role} />
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            <InvoiceList companyId={company.userId} role={role} eInvoice={company.eInvoice} />
          </TabPanel>
          <TabPanel value={tabIndex} index={4}>
            <MonthlySales companyId={company.userId} tabIndex={tabIndex} />
          </TabPanel>
          <TabPanel value={tabIndex} index={5}>
            <CardInfo companyId={company.userId} role={role} />
          </TabPanel>
        </Box>
      )}
    </>
  )
};

export default Advertiser;
