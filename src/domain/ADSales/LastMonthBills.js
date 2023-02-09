import React, { useState, useEffect } from 'react';
import useSales from 'shared/hooks/useSales';
import { Button, Dialog, DialogContent, Box, Grid, LinearProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { formatUIDate, precisionRound } from 'shared/utils';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ContrastIcon from '@mui/icons-material/Contrast';
import { AgGridReact } from 'ag-grid-react';

const LastMonthBills = ({selectedCompany, lastMonth, isOpen, onClose}) =>{
    const { fetchLastMonthBills } = useSales();
    const [isLoading, setIsLoading] = useState(false);
    const [billList, setBillList] = useState(null);

    const columnDefs = [
        { field: 'color', headerName: 'Color', width: 120, resizable: false,
          cellRenderer: (props) => {
            return props.value ? <></> : <ContrastIcon sx={{ position: 'relative', top: 5, color: "gray" }} />
          },
          valueGetter: (params) => params.data.color ? 1 : 0
        },    
        { field: 'adId', headerName: 'Bill No', width: 110 },
        { field: 'adType', headerName: 'Type', width: 80 },
        { field: 'adTitle', headerName: 'Title', minWidth: 120 },
        { field: 'page', headerName: 'Page', width: 80 },
        { field: 'size', headerName: 'Size', width: 80 },        
        { field: 'startDate', headerName: 'Start Date', width: 125, valueFormatter: (params) => formatUIDate(params.value) },
        { field: 'endDate', headerName: 'End Date', width: 125, valueFormatter: (params) => formatUIDate(params.value) },
        { field: 'cost', headerName: 'Cost', width: 90, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
        { field: 'taxAmount', headerName: 'Tax', width: 90, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
        { field: 'total', headerName: 'Total', width: 95, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
        { field: 'cardPayment', headerName: 'Card', width: 80, resizable: false,
          cellRenderer: (props) => {
            return props.value ? <CreditCardIcon sx={{ position: 'relative', top: 5, color: "gray" }} /> : <></>
          },
          valueGetter: (params) => params.data.cardPayment ? 1 : 0
        },
        { field: 'scheduleType', headerName: 'Schedule', width: 100 },
        { field: 'cadTitle', headerName: 'CAD Title', width: 120 },
        { field: 'regBy', headerName: 'Reg By', width: 100 },
        { field: 'regDate', headerName: 'Reg Date', width: 140, valueFormatter: (params) => formatUIDate(params.value)}
      ];

    useEffect(() => {
        const startDate = lastMonth + "01";
        const endDate = lastMonth + "31"
        fetchLastMonthBills(selectedCompany, startDate, endDate, setBillList);
      }, []);
    
    const handleClose = () => {
        onClose();
    }
    
    return (
      <>
        <Dialog open={isOpen} fullWidth={true} maxWidth={true} PaperProps={{sx:{position:"fixed", bottom:40, m:0}}} >
          <DialogContent>
            {!billList && (
              <Grid container justifyContent="center" alignItems="center" sx={{ height: '20vh', margin: "0 auto" }}>
                <Box sx={{ minHeight: 4, width: 500 }}>
                  <LinearProgress />
                </Box>
              </Grid>
            )}
            {billList && (
              <Grid className="ag-theme-alpine" sx={{width:'100%', height:200}}>
                <AgGridReact
                  rowData={billList.main}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    sortable: true,
                    resizable: true,
                    filter: true,
                  }}
                >
                </AgGridReact>
              </Grid>
            )}
          </DialogContent>
          <Button startIcon={<ClearIcon />} variant="outlined" onClick={handleClose} disabled={isLoading}>Close</Button>
        </Dialog>
      </>
    )
    
}

export default LastMonthBills;