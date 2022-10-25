import React, { useCallback, useEffect, useState, useRef } from "react";
import { Box, Grid } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import axios from "axios";
import api from "appConfig/restAPIs";
import { LoadingButton } from "@mui/lab";
import ConfirmDialog from "shared/components/ConfirmDialog";
import { useNavigate } from 'react-router-dom';
import { deptType } from 'data/constants';
import { useUserAuth } from 'shared/contexts/UserAuthContext';

const Subscriber = () => {
  const gridRef = useRef();
  const [isUnsubscribe, setIsUnsubscribe] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [canTerminated, setCanTerminated] = useState(false);
  const { user: { dept } } = useUserAuth();
  const navigate = useNavigate();

  const columnDefs = [
    { field: 'customerId', headerName: 'ID', width: 120 },
    { field: 'nameKo', headerName: 'Name (KOR)', width: 150 },
    { field: 'nameEn', headerName: 'Name (ENG)', width: 250 },
    { field: 'companyKo', headerName: 'Company Name (KOR)', width: 250 },
    { field: 'companyEn', headerName: 'Company Name (ENG)', width: 300 },
    { field: 'hTel', headerName: 'Home Phone', width: 150 },
    { field: 'bTel', headerName: 'Business Phone', width: 180 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();

    setSelectedNode(selectedNodes[0]);
    setCanTerminated(selectedNodes[0].data.status.toString().toLowerCase() !== 'terminated');
  }, []);

  const unsubscribe = () => {
    setIsLoading(true);

    axios.put(`${api.subscriber}/status`, { customerId: selectedNode.id, status: "Terminated" })
      .then(() => {
        selectedNode.setDataValue('status', 'Terminated');
      })
      .finally(() => {
        setIsLoading(false);
        setIsUnsubscribe(false);
        setCanTerminated(false);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    
    axios.get(api.subscribers)
      .then((resp) => {
        setSubscribers(resp.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (dept.toLowerCase() === deptType.account || dept.toLowerCase() === deptType.sales) {
    navigate('/s/dashboard', { replace: true });
    return null;
  }

  return (
    <>
      <ConfirmDialog open={isUnsubscribe} 
        message="Do you want to terminate the subscription?" 
        isLoading={isLoading} onOK={unsubscribe} 
        onCancel={() => setIsUnsubscribe(false)} onClose={() => setIsUnsubscribe(false)} 
      />
      
      <Grid container direction="column" rowGap={4}>
        <Grid container justifyContent="center" item>
          <LoadingButton variant="contained" disabled={isLoading || !canTerminated} onClick={() => setIsUnsubscribe(true)}>
            Unsubscribe
          </LoadingButton>
        </Grid>

        <Box sx={{ width: '100%', height: 700 }} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={subscribers}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
            }}
            getRowId={params => params.data.customerId}
            rowSelection="single"
            onSelectionChanged={onSelectionChanged}
          >
          </AgGridReact>
        </Box>
      </Grid>
    </>
  )
};

export default Subscriber;
