import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Box, Checkbox, Grid, FormGroup, FormControlLabel } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AgGridReact } from 'ag-grid-react';
import useInvoice from "shared/hooks/useInvoice";
import { formatUIDate, precisionRound } from 'shared/utils';
import { LoadingButton } from '@mui/lab';
import Payments from 'shared/components/Payments';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { reissueType } from 'data/constants';

const InvoiceList = ({ companyId, eInvoice }) => {
  const gridRef = useRef();
  const gridBillRef = useRef();
  // const [invoices, setInvoices] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [splitted, setSplitted] = useState(false);
  const [email, setEmail] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedBillRow, setSelectedBillRow] = useState([]);
  const { isLoading, invoices, fetchInvoices, reIssueInvoice } = useInvoice();
    
  const columnDefs = [
    { field: 'invoiceNo', headerName: 'Invoice No', width: 200, },
    { field: 'primaryName', headerName: 'Company', minWidth: 300 },
    { field: 'dueDate', headerName: 'Due Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'outstandingCost', headerName: 'Outstanding Cost', width: 200, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingTax', headerName: 'Outstanding Tax', width: 180, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'outstandingTotal', headerName: 'Total', width: 150, resizable: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
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
    fetchInvoices(companyId);
    setSelectedRow([]);
    setSelectedBillRow([]);
  }, [companyId, fetchInvoices]);

  useEffect(() => {
    if (selectedRow.length === 0) {
      setSplitted(false);
      setEmail(false);
    }
  }, [selectedRow]);

  const onSelectionChanged = useCallback(() => {
    const selectedRow = gridRef.current.api.getSelectedRows();

    setSelectedRow(selectedRow);
    setSelectedBillRow([]);
  }, [])

  const onSelectionBill = () => {
    const selectedBill = gridBillRef.current.api.getSelectedRows();

    setSelectedBillRow(selectedBill);
  }

  const reIssueInvoiceHandler = async () => {
    await reIssueInvoice(selectedRow[0]?.invoiceNo, splitted ? reissueType.split : reissueType.reissue, email ? 1 : 0);
    setIsOpen(false);
  };

  return (
    <>
      <ConfirmDialog open={isOpen}
        title="Save Bills"
        message="Do you want to save bills?" 
        isLoading={isLoading} onOK={reIssueInvoiceHandler} 
        onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)} 
      />

      <Grid container direction="column" rowGap={3}>
        <Grid container item justifyContent="space-between" alignItems="center" wrap="nowrap">
          <Grid container item alignItems="center" columnGap={5}>
            <Grid item>
              <LoadingButton loading={isLoading}
                variant="contained"
                onClick={() => setIsOpen(true)} 
                startIcon={<ReceiptIcon />}
                disabled={selectedRow.length === 0}
              >
                Re-Issue
              </LoadingButton>
            </Grid>
            <Grid item >
              <FormGroup sx={{ "& .MuiCheckbox-root": { ml: "-9px" } }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={email} onChange={(e) => setEmail(e.target.checked)} />}
                  label="Email" labelPlacement="top" sx={{ "& .MuiFormControlLabel-label": { fontSize: 11 }}}
                  disabled={selectedRow.length === 0 || !eInvoice}
                />
              </FormGroup>
            </Grid>
            <Grid item>
              <FormGroup sx={{ "& .MuiCheckbox-root": { ml: "-9px" } }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={splitted} onChange={(e) => setSplitted(e.target.checked)} />}
                  label="Split" labelPlacement="top" sx={{ "& .MuiFormControlLabel-label": { fontSize: 11 }, mx: 0}}
                  disabled={selectedRow.length === 0}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Grid item>
            <LoadingButton loading={isLoading}
              variant="contained"
              onClick={() => {
                setSelectedRow([]);
                setSelectedBillRow([]);
                fetchInvoices(companyId);
              }} 
              startIcon={<ReplayIcon />}
            >
              Reload
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid item>
          <Box sx={{ width: '100  %', height: 400 }} className="ag-theme-alpine">
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
  );
};

export default InvoiceList;
