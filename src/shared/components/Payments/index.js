import React, { useCallback, useEffect, useState } from 'react';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { Box, Grid, LinearProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { formatUIDate, precisionRound } from 'shared/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';

const Payments = ({ adId, paidList, rowSelection, rowMultiSelectWithClick = false, onSelectionChanged }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState(() => {
    return paidList ? paidList.filter(payment => payment.adId === adId) : null;
  });

  const columnDefs = [
    { field: 'payId', headerName: 'Payment No', width: 140 },
    { field: 'paidDate', headerName: 'Paid Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'paidAmount', headerName: 'Paid Cost', width: 120, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'paidTax', headerName: 'Paid Tax', width: 100, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'total', headerName: 'Paid Total', width: 140, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'method', headerName: 'Method', width: 140 },
    { field: 'regBy', headerName: 'Reg By', width: 160 },
    { field: 'regDate', headerName: 'Reg Date', width: 140, valueFormatter: (params) => formatUIDate(params.value)}
  ];
  
  // TODO: make a hook
  const fetchPayments = useCallback((adId) => {
    setPayments([]);
    setIsLoading(true);

    axios.get(`${api.paymentHistory}/${adId}`)
      .then((resp) => {
        const mapped = resp.data[0]?.paidList.map(payment => {
          return {
            ...payment,
            total: payment.paidAmount + payment.paidTax
          };
        });

        setPayments(mapped || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // paidList is returned in ADList view (ADS tab)
    if (paidList) {
      const list = paidList.filter(payment => payment.adId === adId)
        ?.map(payment => ({ ...payment, total: payment.paidAmount + payment.paidTax }));

      setPayments(list);
    } else {
      if (adId) fetchPayments(adId);
      else setPayments(null)
    }
  }, [adId, paidList, fetchPayments]);

  if (!payments) return null;

  return (
    <>
      {!paidList && (
        <Box sx={{ minHeight: 4 }}>
          {isLoading && <LinearProgress />}
        </Box>
      )}

      <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 160, width: '100%' }}>
        <AgGridReact
          rowData={payments}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
          getRowId={params => params.data.payId}
          rowSelection={rowSelection}
          rowMultiSelectWithClick={rowMultiSelectWithClick}
          onSelectionChanged={onSelectionChanged}
        >
        </AgGridReact>
      </Grid>
    </>
  );
}

export default Payments;
