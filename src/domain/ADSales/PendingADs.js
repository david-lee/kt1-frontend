import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Grid, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ReplayIcon from '@mui/icons-material/Replay';
import ContrastIcon from '@mui/icons-material/Contrast';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AgGridReact } from 'ag-grid-react';
import { formatUIDate, precisionRound } from 'shared/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import { LoadingButton } from '@mui/lab';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { roleType } from 'data/constants';
import useSales from 'shared/hooks/useSales';
import { addMonths, subMonths, format } from 'date-fns';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import LastMonthBills from './LastMonthBills';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { useNavigate } from "react-router-dom";
import path from 'data/routes';

const ADSales = () => {
  const gridRef = useRef();
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [ads, setADs] = useState(null);
  const [randomDates, setRandomDates] = useState([]);
  const { user: { role } } = useUserAuth();
  const { isLoading, confirmAD, fetchPendingADs } = useSales();
  const [lastMonth, setLastMonth] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const columnDefs = [
    { field: 'status', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value.toLowerCase() === "confirmed" ? <CheckCircleIcon sx={{ position: 'relative', top: 5, color: "green" }} /> : <PendingIcon sx={{ color: "red", position: 'relative', top: 5 }} />
      },
      valueGetter: (params) => params.data.status.toLowerCase(),
    },
    { field: 'color', headerName: '', width: 40, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <></> : <ContrastIcon sx={{ position: 'relative', top: 5, color: "gray" }} />
      },
      valueGetter: (params) => params.data.color ? 1 : 0,
    },    
    { field: 'adId', headerName: 'Bill No', width: 90 },
    { field: 'companyId', headerName: 'Company Id', width: 120 },
    { field: 'company', headerName: 'Company Name', width: 200 },
    { field: 'companyId', hide: true },
    { field: 'adType', headerName: 'Type', width: 80 },
    { field: 'adTitle', headerName: 'Title', minWidth: 100 },
    { field: 'page', headerName: 'Page', width: 80 },
    { field: 'size', headerName: 'Size', width: 80 },
    { field: 'startDate', headerName: 'Start Date', width: 110, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'endDate', headerName: 'End Date', width: 110, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'cost', headerName: 'Cost', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'taxAmount', headerName: 'Tax', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'total', headerName: 'Total', width: 80, filter: false, valueFormatter: (params) => precisionRound(params.value).toLocaleString() },
    { field: 'cardPayment', headerName: 'Card', width: 80, resizable: false,
      cellRenderer: (props) => {
        return props.value ? <CreditCardIcon sx={{ position: 'relative', top: 5, color: "gray" }} /> : <></>
      },
      valueGetter: (params) => params.data.cardPayment ? 1 : 0,
    },    
    { field: 'scheduleType', headerName: 'Schedule', width: 90 },
    { field: 'cadTitle', headerName: 'CAD Title', width: 120 },
    // { field: 'color', headerName: 'Color', width: 80 },
    // { field: 'webFlag', headerName: 'Web', width: 80 },
    { field: 'regBy', headerName: 'Reg By', width: 100 },
    { field: 'regDate', headerName: 'Reg Date', width: 110, valueFormatter: (params) => formatUIDate(params.value)}
  ];

  // TODO: need randomDates? no place to show it in this view
  const onFetch = ({main, randomDates}) => {
    setADs(main);
    setRandomDates(randomDates);
  };

  useEffect(() => { 
    fetchPendingADs(onFetch);
  }, [fetchPendingADs]);

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    setSelectedNodes(selectedNodes);
    setSelectedData(selectedNodes);
  }, [])

  const onConfirm = () => {
    selectedNodes.forEach((rowNode) => {
      rowNode.setDataValue('status', 'confirmed');
      gridRef.current.api.deselectAll();
    });
    setIsConfirm(false);
  };

  const [isConfirm, setIsConfirm] = useState(false);

  const fetchLastMonthData = (selectedData) =>{
     
    const data = selectedData[0].data;
    const adStartDate = new Date(formatUIDate(data.startDate));
    const lastAdYM = format(subMonths(adStartDate, 1), 'yyyyMM');
   
    setLastMonth(lastAdYM);
    setSelectedCompany(data.companyId);

    if(data.scheduleTypeCode === 1){
      setErrorMessage("One Time Ad does not provide the previouse list");
      return false;
    }

    setIsOpen(true);
  }

  const onCloseLastMonthBills = () => setIsOpen(false);

  const navigate = useNavigate();
  const moveToCompany = (companyId) => {
    navigate(`/s/${path.advertiser}/${companyId}/0`);
  }

  return (
    <>
      <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
      {!ads && (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh', margin: "0 auto" }}>
          <Box sx={{ minHeight: 4, width: 500 }}>
            <LinearProgress />
          </Box>
        </Grid>
      )}
      {ads && (
        <>
          <ConfirmDialog open={isConfirm}
            title="Confirm AD"
            message="Do you want to confirm selected ADs?" 
            isLoading={isLoading} onOK={() => confirmAD(selectedNodes.map((rowNode) => +rowNode.id), onConfirm)} 
            onCancel={() => setIsConfirm(false)} onClose={() => setIsConfirm(false)} 
          />

          <Grid container direction="column" rowGap={3}>
            <Grid container item justifyContent="center" columnGap={4}>
              {role >= roleType.manager && (
                <>
                  <LoadingButton startIcon={<CheckCircleIcon />} variant="contained"
                    disabled={isLoading || (!isLoading && !selectedNodes?.length)}
                    onClick={() => setIsConfirm(true)}
                  >
                    Confirm
                  </LoadingButton>
                  <LoadingButton startIcon={<ContentPasteSearchIcon />} variant="contained"
                    disabled={selectedData?.length !== 1}
                    onClick = {() => fetchLastMonthData(selectedData)}
                  >
                    Last Month
                  </LoadingButton>
                  <LoadingButton startIcon={<ReplayIcon />} variant="outlined" disabled={isLoading}
                    onClick={() => fetchPendingADs(onFetch)} 
                  >
                    Reload
                  </LoadingButton>
                  <LoadingButton startIcon={<OpenInNewIcon />} variant="outlined" disabled={isLoading || selectedNodes === null || selectedNodes.length !== 1 }
                    onClick={() => moveToCompany(selectedNodes[0].data.companyId)} 
                  >
                    To Company
                  </LoadingButton>
                </>
              )}
            </Grid>

            <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 700, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={ads}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  filter: true,
                  maxWidth: 700,
                }}
                getRowId={params => params.data.adId}
                rowSelection={`${role >= roleType.manager ? "multiple" : "none"}`}
                rowMultiSelectWithClick={true}
                onSelectionChanged={onSelectionChanged}
                pagination={true}
                paginationPageSize={20}
              >
              </AgGridReact>
            </Grid>
          </Grid>
        </>
      )}
      {isOpen && <LastMonthBills selectedCompany={selectedCompany} lastMonth={lastMonth} isOpen={isOpen} onClose={onCloseLastMonthBills} />}
    </>
  )
}

export default ADSales;
