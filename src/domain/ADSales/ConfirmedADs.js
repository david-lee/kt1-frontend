import React, { useState, useEffect } from 'react';
import { subYears } from 'date-fns';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatUIDate, precisionRound } from 'shared/utils';
import useSales from 'shared/hooks/useSales';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ADDate from 'shared/components/ADDate';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { AgGridReact } from 'ag-grid-react';

const IconLoadingButton = styled(LoadingButton)({
  "& .MuiButton-startIcon": {
    marginLeft: 0, marginRight: 0,
  }
});

const ConfirmedADs = () => {
  const [ads, setADs] = useState(null);
  const [stDate, setStDate] = useState(() => subYears(new Date(), 1));
  const [edDate, setEdDate] = useState(null);
  const { isLoading, fetchConfirmedADList } = useSales();

  const columnDefs = [
    { field: 'isInvoiced', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <DescriptionRoundedIcon sx={{ position: 'relative', top: 5, color: "black" }} /> : <></>
      },
      valueGetter: (params) => params.data.isInvoiced ? 1 : 0,
    },
    { field: 'paymentStatus', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <PaidIcon sx={{ position: 'relative', top: 5, color: "blue" }} /> : <></>
      },
      valueGetter: (params) => params.data.paymentStatus ? 1 : 0,
    },
    { field: 'adId', headerName: 'Bill No', width: 110 },
    { field: 'adType', headerName: 'Type', width: 80 },
    { field: 'page', headerName: 'Page', width: 80 },
    { field: 'size', headerName: 'Size', width: 80 },
    { field: 'adTitle', headerName: 'Title', minWidth: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 120, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'endDate', headerName: 'End Date', width: 120, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'cost', headerName: 'Cost', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'taxAmount', headerName: 'Tax', width: 75, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'total', headerName: 'Total', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'scheduleType', headerName: 'Schedule', width: 100 },
    { field: 'companyId', headerName: 'Company Id', width: 120 },
    { field: 'company', headerName: 'Company Name', width: 200 },
    { field: 'regBy', headerName: 'Reg By', width: 100 },
    { field: 'regDate', headerName: 'Reg Date', width: 120, valueFormatter: (params) => formatUIDate(params.value)},
  ];


  const handleDateChange = (type, value) => {
    if (type === 'start') setStDate(value);
    if (type === 'end') setEdDate(value);
  };

  const fetchADs = (startDate, endDate) => {
    fetchConfirmedADList({startDate, endDate}, setADs);
  }

  useEffect((stDate, edDate) => {
    fetchADs(stDate, edDate);
  },[]);

  return (
    <>
      <Grid container direction="column">
        <Grid container item wrap="nowrap" alignItems="center">
          <ADDate label="Start Date" width="120px" value={stDate}
            onChange={(newValue) => { handleDateChange('start', newValue); }}
          />
          <ADDate label="End Date" width="120px" value={edDate}
            onChange={(newValue) => { handleDateChange('end', newValue); }}
          />
          <IconLoadingButton variant="contained" startIcon={<SearchIcon />} loading={isLoading}
            onClick={() => fetchADs(stDate, edDate)}
            sx={{ position: "relative", top: 5, ml: 1 }}>
          </IconLoadingButton>
        </Grid>
        <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 700, width: '100%', mb: 3}}>
          <AgGridReact
            rowData={ads?.main}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              maxWidth: 700
            }}
            pagination={true}
            paginationPageSize={20}
          >
          </AgGridReact>
        </Grid>
      </Grid>
    </>
  );
}

export default ConfirmedADs; 