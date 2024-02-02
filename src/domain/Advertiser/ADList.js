import React, { useCallback, useEffect, useRef, useState } from 'react';
import { subYears } from 'date-fns';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContrastIcon from '@mui/icons-material/Contrast';
import PendingIcon from '@mui/icons-material/Pending';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { LoadingButton } from '@mui/lab';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import useInvoice from 'shared/hooks/useInvoice';
import ADDate from 'shared/components/ADDate';
import Payments from 'shared/components/Payments';
import ConfirmDialog from "shared/components/ConfirmDialog";
import { formatUIDate, precisionRound } from 'shared/utils';
import { roleType } from 'data/constants';
import EditBill from './EditBill';
import useSales from 'shared/hooks/useSales';
import UndoIcon from '@mui/icons-material/Undo';

const IconLoadingButton = styled(LoadingButton)({
  "& .MuiButton-startIcon": {
    marginLeft: 0, marginRight: 0,
  }
});

const ADList = ({ companyId, eInvoice, role }) => {
  const gridRef = useRef();
  const [ads, setADs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [stDate, setStDate] = useState(() => subYears(new Date(), 1));
  const [edDate, setEdDate] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [canIssue, setCanIssue] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [clickedAction, setClickedAction] = useState("view");
  const [selectedRandomDates, setSelectedRandomDates] = useState([]);
  const { isLoading, deleteAD, toPendingAD, fetchADList } = useSales();
  const { isLoading: isInvoiceLoading, checkInvoiceByBill, ...invoiceActions } = useInvoice();
  const [isBackToPendingOpen, setIsBackToPendingOpen] = useState(false);

  const columnDefs = [
    { field: 'status', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value.toLowerCase() === "confirmed" ? <CheckCircleIcon sx={{ position: 'relative', top: 5, color: "green" }} /> : <PendingIcon sx={{ color: "red", position: 'relative', top: 5 }} />
      },
      valueGetter: (params) => params.data.status.toLowerCase(),
    },
    { field: 'paymentStatus', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <PaidIcon sx={{ position: 'relative', top: 5, color: "blue" }} /> : <></>
      },
      valueGetter: (params) => params.data.paymentStatus ? 1 : 0,
    },  
    { field: 'color', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <></> : <ContrastIcon sx={{ position: 'relative', top: 5, color: "gray" }} />
      },
      valueGetter: (params) => params.data.color ? 1 : 0,
    },
    { field: 'adId', headerName: 'Bill No', width: 110 },
    { field: 'adType', headerName: 'Type', width: 100 },
    { field: 'adTitle', headerName: 'Title', minWidth: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'endDate', headerName: 'End Date', width: 140, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'cost', headerName: 'Cost', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'taxAmount', headerName: 'Tax', width: 75, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'total', headerName: 'Total', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'page', headerName: 'Page', width: 90 },
    { field: 'size', headerName: 'Size', width: 90 },
    { field: 'cardPayment', headerName: 'Card', width: 80, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <CreditCardIcon sx={{ position: 'relative', top: 5, color: "gray" }} /> : <></>
      },
      valueGetter: (params) => params.data.cardPayment ? 1 : 0,
    },
    { field: 'scheduleType', headerName: 'Schedule', width: 100 },
    { field: 'scheduleTypeCode', headerName: '', width: 100, hide: true },
    { field: 'cadTitle', headerName: 'CAD Title', width: 120 },
    // { field: 'color', headerName: 'Color', width: 80 },
    // { field: 'webFlag', headerName: 'Web', width: 80 },
    { field: 'regBy', headerName: 'Reg By', width: 100 },
    { field: 'regDate', headerName: 'Reg Date', width: 120, valueFormatter: (params) => formatUIDate(params.value)},
  ];

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    setSelectedNodes(selectedNodes);
  }, [])

  const handleInvoice = async () => {
    const resp = await checkInvoiceByBill(companyId, selectedNodes.map(rowNode => +rowNode.id));

    if (resp.data === "success") {
      invoiceActions[`${clickedAction}InvoiceByBill`](selectedNodes.map(rowNode => +rowNode.id));
      setIsOpen(true);
    } else {
      setIsOpen(false);
      alert(`It is already issued in invoices ${resp.data.list.map(inv => inv.invoiceNo).join(",")}`);
    }
  }

  const backToPending = async () => {
    const resp = await checkInvoiceByBill(companyId, selectedNodes.map(rowNode => +rowNode.id));
    if (resp.data === "success") {
      toPendingAD(selectedNodes.map(rowNode => +rowNode.id), () => fetchADs(companyId, stDate, edDate));
    } else {
      alert(`It is already issued in invoices ${resp.data.list.map(inv => inv.invoiceNo).join(",")}`);
    }
    setIsBackToPendingOpen(false);
  }

  const setInvoiceAction = (action) => {
    setClickedAction(action);
    setIsOpen(true)
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') setStDate(value);
    if (type === 'end') setEdDate(value);
  };

  const editBill = () => {
    setIsEditOpen(true);
  }

  const fetchADs = useCallback((companyId, startDate, endDate) => {
    fetchADList({ companyId, startDate, endDate }, setADs);
  }, []);

  const deleteBill = () => {
    // TODO: reload is not working properly
    deleteAD(selectedNodes.map(rowNode => +rowNode.id), () => fetchADs(companyId, stDate, edDate));
    setIsDeleteOpen(false);
  }

  useEffect(() => {
    const startDate = subYears(new Date(), 1);

    fetchADs(companyId, startDate, null);
    setStDate(startDate);
    setEdDate(null);
  }, [companyId, fetchADs]);

  useEffect(() => {
    if (!isInvoiceLoading) setIsOpen(false);
  }, [isInvoiceLoading]);

  useEffect(() => {
    // check to show random dates
    if (selectedNodes?.length === 1 && selectedNodes[0].data.scheduleTypeCode === 3) {
      const adDates = ads.randomDates.filter(date => date.pAdId === selectedNodes[0].data.adId);
      setSelectedRandomDates(adDates);
    } 
    else {
      setSelectedRandomDates([]);
    }

    // check if the bills can be issued: disable if bill is pending or paid all
    if (selectedNodes?.length) {
      const pendingBill = selectedNodes.find(({ data: { status,  paymentStatus }}) => {
        return (status.toLowerCase() === 'pending' || paymentStatus)
      });
      setCanIssue(!pendingBill);

      if (selectedNodes?.length > 1) {
        setCanEdit(false);
      } else {
        const { data: { status, paymentStatus}} = selectedNodes[0];
        setCanEdit(status.toLowerCase() === 'pending' && (!paymentStatus || selectedNodes[0].data.cost === 0));
      }
    } else {
      setCanIssue(false);
      setCanEdit(false);
    }
  }, [selectedNodes, setCanIssue, ads?.randomDates]);

  if (isLoading) <div>Loading...</div>
  
  return (
    <>
      <ConfirmDialog open={isOpen}
        message={`Do you want to ${clickedAction} the invoice?`}
        isLoading={isInvoiceLoading} onOK={handleInvoice} 
        onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)} 
      />

      <ConfirmDialog open={isDeleteOpen}
        message={`Do you want to delete it?`}
        isLoading={isLoading} onOK={deleteBill} 
        onCancel={() => setIsDeleteOpen(false)} onClose={() => setIsDeleteOpen(false)} 
      />

      <ConfirmDialog open={isBackToPendingOpen}
        message={`Do you want to change the AD to Pending status?`}
        onOK={backToPending} 
        onCancel={() => setIsBackToPendingOpen(false)} onClose={() => setIsBackToPendingOpen(false)} 
      />

      {isEditOpen && <EditBill 
        selectedNode={selectedNodes[0]?.data} 
        randomDates = {selectedRandomDates}
        gridApi={gridRef.current} 
        onClose={() => setIsEditOpen(false)}
        onSaved={() => {
          fetchADs(companyId, stDate, edDate);
          setIsEditOpen(false);
        }}
      />}

      <Grid container direction="column">
        <Grid container item justifyContent="space-between" wrap="nowrap" alignItems="center">
          <Grid container item alignItems="center" xs={4}>
            <ADDate label="Start Date" width="120px" value={stDate}
              onChange={(newValue) => { handleDateChange('start', newValue); }}
            />
            <ADDate label="End Date" width="120px" value={edDate}
              onChange={(newValue) => { handleDateChange('end', newValue); }}
            />

            <IconLoadingButton variant="contained" startIcon={<SearchIcon />} loading={isLoading}
              onClick={() => fetchADs(companyId, stDate, edDate)}
              sx={{ position: "relative", top: 5, ml: 1 }}>
            </IconLoadingButton>
          </Grid>

          <Grid container item justifyContent="space-between" wrap="nowrap" xs={7} sx={{ position:"relative", top: "5px" }}>
            <Grid container item justifyContent="center" columnGap={1}>
              <IconLoadingButton variant="outlined" startIcon={<EditIcon />}
                loadingPosition='start' 
                onClick={editBill}
                loading={isInvoiceLoading}
                disabled={!canEdit}>
              </IconLoadingButton>

              <IconLoadingButton startIcon={<DeleteForeverIcon />} color="error" variant="outlined"
                loadingPosition='start' 
                onClick={() => setIsDeleteOpen(true)}
                loading={isLoading}
                disabled={!canEdit}>
              </IconLoadingButton>

              {role >= roleType.manager && (
                <IconLoadingButton variant="outlined" startIcon={<UndoIcon />}
                  loadingPosition='start'
                  onClick={() => setIsBackToPendingOpen(true)}
                  disabled={!canIssue}>
                </IconLoadingButton>
              )}  
            </Grid>

            <Grid container item justifyContent="flex-end"  alignItems="center" columnGap={2}>
              <Typography variation="caption">Invoices:</Typography>

              <IconLoadingButton variant="outlined" startIcon={<PreviewIcon />}
                onClick={() => setInvoiceAction("view")}
                loadingPosition="start"
                loading={isInvoiceLoading}
                disabled={!canIssue}
              ></IconLoadingButton>

              {role !== roleType.director && (
                <>
                  <IconLoadingButton variant="contained" startIcon={<DownloadIcon />}
                    onClick={() => setInvoiceAction("issue")}
                    loadingPosition="start"
                    loading={isInvoiceLoading}
                    disabled={!canIssue}
                  ></IconLoadingButton>

                  <IconLoadingButton variant="contained" startIcon={<EmailIcon />}
                    onClick={() => setInvoiceAction("email")}
                    loadingPosition="start"
                    loading={isInvoiceLoading}
                    disabled={!canIssue || !eInvoice}
                  ></IconLoadingButton>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 500, width: '100%', mb: 3 }}>
          <AgGridReact
            ref={gridRef}
            rowData={ads?.main}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
            }}
            getRowId={params => params.data.adId}
            rowSelection="multiple"
            // rowMultiSelectWithClick={true}
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationPageSize={10}
          >
          </AgGridReact>
        </Grid>
        
        <Grid container columnGap={2}>
          {selectedRandomDates.map(date => <Typography key={date} variant="body1b">{formatUIDate(date.startDate)},</Typography>)}
        </Grid>

        {selectedNodes?.length === 1 && (selectedNodes[0].data.paymentStatus || canIssue) && <Payments adId={selectedNodes[0]?.data.adId} paidList={ads.payments} />}
      </Grid>
    </>
  );
}

export default ADList;
