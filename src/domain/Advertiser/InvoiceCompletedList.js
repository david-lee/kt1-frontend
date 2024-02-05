import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Box, Checkbox, Grid, FormGroup, FormControlLabel } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AgGridReact } from 'ag-grid-react';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { formatUIDate, precisionRound } from 'shared/utils';
import { LoadingButton } from '@mui/lab';
import { reissueType } from 'data/constants';
import Payments from 'shared/components/Payments';
import useInvoice from "shared/hooks/useInvoice";

const InvoiceCompletedList = ({companyId, eInvoice}) => {
  const gridRef = useRef();
  const gridBillRef = useRef();
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedBillRow, setSelectedBillRow] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, invoices, fetchCompletedInvoices, reDownloadInvoice } = useInvoice();

  const columnDefs = [
    { field: 'invoiceNo', headerName: 'Invoice No', width: 200, },
    { field: 'primaryName', headerName: 'Company', minWidth: 360 },
    { field: 'dueDate', headerName: 'Due Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'outstandingCost', headerName: 'Cost', width: 160, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingTax', headerName: 'Tax', width: 160, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingTotal', headerName: 'Total', width: 160, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'issuedDate', headerName: 'Issued Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'issuedBy', headerName: 'Issued By', width: 170 },
  ];

  const billColumnDefs = [
    { field: 'billId', headerName: 'Bill No', width: 120, },
    { field: 'adType', headerName: 'Type', width: 100 },
    { field: 'startDate', headerName: 'Start Date', minWidth: 100, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'endDate', headerName: 'End Date', minWidth: 100, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'cost', headerName: 'Cost', width: 150, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'taxAmount', headerName: 'Tax', width: 100, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingCost', headerName: 'Outstanding Cost', width: 200, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingTax', headerName: 'Outstanding Tax', width: 200, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    // { field: 'total', headerName: 'Total', width: 100, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
  ];

  useEffect(() => {
    fetchCompletedInvoices(companyId);
    setSelectedRow([]);
    setSelectedBillRow([]);
  }, [companyId, fetchCompletedInvoices]);

  const onSelectionChanged = useCallback(() => {
    const selectedRow = gridRef.current.api.getSelectedRows();

    setSelectedRow(selectedRow);
    setSelectedBillRow([]);
  }, [])

  const onSelectionBill = () => {
    const selectedBill = gridBillRef.current.api.getSelectedRows();

    setSelectedBillRow(selectedBill);
  }

  const reDownloadInvoiceHandler = async () => {
    await reDownloadInvoice(selectedRow[0]?.invoiceNo);
    
    setIsOpen(false);
  };
  
  return(
    <>
      <ConfirmDialog open={isOpen}
        title="Redownload an invoice"
        message="Do you want to download the invoice again?"
        isLoading={isLoading} onOK={reDownloadInvoiceHandler}
        onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)}
      />
    
      <Grid container direction="column" rowGap={3}>
        <Grid item>
          <LoadingButton loading={isLoading}
            variant="contained"
            onClick={() => setIsOpen(true)}
            startIcon={<ReceiptIcon />}
            disabled={selectedRow.length === 0}
          >
            Re-Download
          </LoadingButton>
        </Grid>
        <Grid item>
          <Box sx={{ width: '100  %', height: 200 }} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={invoices}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
              }}
              rowSelection="single"
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationPageSize={10}
            >
            </AgGridReact>
          </Box>
        </Grid>
        {selectedRow[0]?.paymentBills && (
          <Grid item>
            <Box sx={{ width: '100  %', height: 180 }} className="ag-theme-alpine">
              <AgGridReact
                ref={gridBillRef}
                rowData={selectedRow[0].paymentBills}
                columnDefs={billColumnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  filter: true,
                }}
                rowSelection="single"
                onSelectionChanged={onSelectionBill}
              >
              </AgGridReact>
            </Box>
          </Grid>
        )}

        <Payments adId={selectedBillRow[0]?.billId} />
      </Grid>
    </>
  )
}

export default InvoiceCompletedList;