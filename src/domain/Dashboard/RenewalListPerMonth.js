import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { formatUIDate } from 'shared/utils';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const RenewalListPerMonth = ({ isOpenRenewal, setIsOpenRenewal, setRenewalYear, setRenewalMonth, renewalYear, renewalMonth }) => {

  const [renewalMonthlyList, setRenewalMonthlyList] = useState(null);
  const gridRef = useRef();
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

  const onClose = () => {
    setIsOpenRenewal(false);
    setRenewalMonth(null);
    setRenewalYear(null);
  }

  useEffect(() => {
    axios.get(`${api.renewalMonthlyList}?renewalMonth=${renewalYear+renewalMonth}`)
      .then(({ data }) => {
        setRenewalMonthlyList(data);
      })
      .finally(() => { });
  }, []);
  
  return (
    <>
      <Dialog open={isOpenRenewal} sx={{ "& .MuiPaper-root": { maxWidth: 1400, minWidth: 1200, minHeight: 400 } }}>
        <DialogTitle>
          {renewalYear} - {renewalMonth} Renewal List
        </DialogTitle>
        <DialogContent>
          {renewalMonthlyList?.length >= 0 && (
            <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 350, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowStyle={{ cursor: "pointer" }}
                rowData={renewalMonthlyList}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  filter: true,
                }}
                getRowId={params => params.data.adId}
                rowSelection="single"
                rowMultiSelectWithClick={true}
              >
              </AgGridReact>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RenewalListPerMonth;