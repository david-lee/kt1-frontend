import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import { formatUIDate } from 'shared/utils';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import path from 'data/routes';
import Dropdown from 'shared/components/Dropdown';
import { years, months } from 'data/adOptions';
import RenewalListPerMonth from './RenewalListPerMonth';
import { format } from 'date-fns';
import { DATA_DATE_FORMAT } from 'data/constants';

const RenewalList = () => {
  const gridRef = useRef();
  const [renewals, setRenewals] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [isSaveRenewal, setIsSaveRenewal] = useState(false);
  const [numOfRenewal, setNumOfRenewal] = useState(null);
  const [renewalMonth, setRenewalMonth] = useState(null);
  const [renewalYear, setRenewalYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), DATA_DATE_FORMAT).slice(0, 6));
  const [isOpenRenewal, setIsOpenRenewal] = useState(false);
  const navigate = useNavigate();

  const columnDefs = [
    { field: 'companyId', headerName: 'Company Id', width: 120 },
    { field: 'companyName', headerName: 'Company', width: 350 },
    { field: 'adId', headerName: 'Bill No', width: 120 },
    { field: 'adTitle', headerName: 'Title', width: 350 },
    { field: 'endDate', headerName: 'End Date', width: 130, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'adType', headerName: 'Type', width: 100 },
    { field: 'page', headerName: 'Page', width: 100 },
    { field: 'size', headerName: 'Size', width: 100 },
  ];
  
  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    setSelectedNodes(selectedNodes);
  }, [])

  useEffect(() => {
    axios.get(api.renewal)
      .then(({ data }) => {
        setRenewals(data);
      })
      .finally(() => { });
  }, []);

  useEffect(() => {
    if (selectedNodes) {
      navigate(`/s/${path.advertiser}/${selectedNodes[0].data.companyId}/0`);
    }

  }, [selectedNodes, navigate]);


  const checkRenewalSave = useCallback(() => {
    axios.get(`${api.renewalConfirmCheck}`)
      .then((resp) => {
        setIsSaveRenewal(resp.data);
      })
      .finally(() => { });
  }, []);

  useEffect(() => {
    checkRenewalSave();
  }, []);

  const handleSaveRenewal = () => {
    axios.post(api.renewal, renewals)
      .then(({ data }) => {
        setNumOfRenewal(data);
        axios.post(api.renewalConfirm, { numOfRenewal: data })
          .then(({ status }) => {
            if (status === 200) {
              setIsSaveRenewal(true);
            }
          })
      })
      .finally(() => { })
  }

  const searchRenewal = () => {
    setIsOpenRenewal(true);
  }

  return (
    <Box sx={{ position: "relative " }}>
      {isOpenRenewal &&
        <RenewalListPerMonth
          isOpenRenewal={isOpenRenewal}
          setIsOpenRenewal={setIsOpenRenewal}
          setRenewalYear={setRenewalYear}
          setRenewalMonth={setRenewalMonth}
          renewalYear={renewalYear}
          renewalMonth={renewalMonth}
        />}

      <Grid container justifyContent="space-between" wrap="nowrap" sx={{ mb: 2 }}>
        <Grid container item alignItems="flex-end" columnGap={2}>
          <Grid item>
            <Typography variant="h5">Renewals</Typography>
          </Grid>
          <Grid item>
            <LoadingButton size="small" variant="contained" disabled={isSaveRenewal} onClick={handleSaveRenewal}>{isSaveRenewal ? 'Saved' : 'Save'}</LoadingButton>
          </Grid>
        </Grid>
        <Grid item container alignItems="flex-end" justifyContent="right" columnGap={1}>
          <Grid item>
            <Dropdown id="renewalYear" name="renewalYear" label="Year" value={renewalYear}
              onChange={e => setRenewalYear(e.target.value)}
              options={years}
              width={60}
            />
          </Grid>
          <Grid item>
            <Dropdown id="renewalMonth" name="renewalMonth" label="Month" value={renewalMonth}
              onChange={e => setRenewalMonth(e.target.value)}
              options={months}
              width={60}
            />
          </Grid>
          <Grid item>
            <LoadingButton size="small" variant="contained"
              disabled={renewalMonth === null || renewalYear === null || currentMonth < renewalYear + renewalMonth}
              onClick={() => searchRenewal()}>Search</LoadingButton>
          </Grid>
        </Grid>
      </Grid>

      {renewals?.length < 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <CircularProgress />
        </Box>
      )}

      {renewals?.length >= 0 && (
        <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 350, width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowStyle={{ cursor: "pointer" }}
            rowData={renewals}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
            }}
            getRowId={params => params.data.adId}
            rowSelection="single"
            rowMultiSelectWithClick={true}
            onSelectionChanged={onSelectionChanged}
          >
          </AgGridReact>
        </Grid>
      )}
    </Box>
  );

};

export default RenewalList;