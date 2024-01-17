import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Grid } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import axios from "axios";
import api from "appConfig/restAPIs";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from 'react-router-dom';
import Dropdown from 'shared/components/Dropdown';
import { salesPersons } from 'data/adOptions';
import path from 'data/routes';
import { formatUIDate } from 'shared/utils';

const CompanyList = () => {
  const [allCompanyList, setAllCompanyList] = useState([]);
  const gridRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [salesPerson, setSalesPerson] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const columnDefs = [
    { field: 'userId', headerName: 'ID', width: 90 },
    { field: 'primaryName', headerName: 'ParimaryName', width: 280 },
    { field: 'secondaryName', headerName: 'Secondary Name', width: 240 },
    { field: 'ownerName', headerName: 'Owner Name', width: 180 },
    { field: 'mainCategory', headerName: 'Main Category', width: 320 },
    { field: 'subCategory', headerName: 'Sub Category', width: 240 },
    { field: 'regDate', headerName: 'Reg Date', width: 100, filter: false, valueFormatter: (params) => formatUIDate(params.value) },
    { field: 'salesId', headerName: 'Sales Person', width: 120 },
  ];

  const getCompanyList = useCallback((salesPerson) => {
    setIsLoading(true);
    
    axios.get(`${api.allCompanyList}?salesId=${salesPerson}`)
      .then((resp) => {
        setAllCompanyList(resp.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  },[])

  useEffect(() => {
    getCompanyList(salesPerson);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectedRow(selectedRows[0]);
  }, [])

  useEffect(() => {
    if (selectedRow) {
      navigate(`/s/${path.advertiser}/${selectedRow.userId}/0`);
    }

  }, [selectedRow, navigate]);

  return (
    <>
    <Grid container direction="column" justifyContent="center" columnGap={4}>
      <Grid container item columnGap={5} sx={{mb:8}}>
        <Dropdown id="salesPerson" name="salesPerson" label="Sales Person" value={salesPerson}
          onChange={e => setSalesPerson(e.target.value)}
          options={salesPersons}          
          width={160}
        />
        <LoadingButton size="large" variant="contained" disabled={isLoading}
          onClick={() => getCompanyList(salesPerson)} loading={isLoading}
        >
          Select
        </LoadingButton>
      </Grid>
      <Grid item>
      <Box sx={{ width: '100%', height: 600 }} className="ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        rowData={allCompanyList}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
          maxWidth: 700,
        }}
        // paginationAutoPageSize={true}
        pagination={true}
        paginationPageSize={15}
        // getRowId={params => params.data.userId}
        rowSelection="single"
        onRowClicked={true}
        onSelectionChanged={onSelectionChanged}
      >
      </AgGridReact>
    </Box>
      </Grid>
    </Grid>
    
    </>
  )
}

export default CompanyList;