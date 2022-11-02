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
import path from 'data/routes';

const RenewalList = () => {
  const gridRef = useRef();
  const [renewals, setRenewals] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const navigate = useNavigate();

  const columnDefs = [
    { field: 'adId', headerName: 'Bill No', width: 120 },
    { field: 'companyName', headerName: 'Company', width: 350 },
    { field: 'adTitle', headerName: 'Title', width: 350 },
    { field: 'companyId', header: '', hide: true },
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
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (selectedNodes) {
      navigate(`/s/${path.advertiser}/${selectedNodes[0].data.companyId}/0`);
    }

  }, [selectedNodes, navigate]);

  return (
    <Box sx={{ position: "relative "}}>
      <Typography variant="h5">Renewals</Typography>
      
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
