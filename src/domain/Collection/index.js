import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, LinearProgress } from '@mui/material';
import { useFormik } from 'formik';
import { AgGridReact } from 'ag-grid-react';
import { formatUIDate, numberWithCommas, precisionRound } from 'shared/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import * as Yup from 'yup';
import useInvoice from 'shared/hooks/useInvoice';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { deptType } from 'data/constants';
import BillList from './BillList';

const Collection = () => {
  const gridRef = useRef();
  const [paymentBills, setPaymentBills] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const { isLoading, invoices, fetchInvoices, saveBills } = useInvoice(true);
  const {
    user: { dept },
  } = useUserAuth();
  const navigate = useNavigate();

  const columnDefs = [
    { field: 'invoiceNo', headerName: 'Invoice No', width: 220 },
    { field: 'primaryName', headerName: 'Company', minWidth: 300 },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 130,
      valueFormatter: (params) => formatUIDate(params.value),
    },
    {
      field: 'issuedDate',
      headerName: 'Issued Date',
      width: 150,
      valueFormatter: (params) => formatUIDate(params.value),
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 120,
      editable: true,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 100,
      editable: true,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
    {
      field: 'orgTotal',
      headerName: 'Total',
      width: 100,
      editable: true,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
    {
      field: 'outstandingCost',
      headerName: 'Outstanding Cost',
      width: 180,
      editable: true,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
    {
      field: 'outstandingTax',
      headerName: 'Outstanding Tax',
      width: 170,
      editable: true,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
    {
      field: 'outstandingTotal',
      headerName: 'Outstanding Total',
      width: 170,
      resizable: false,
      valueFormatter: (params) =>
        numberWithCommas(precisionRound(params.value)),
    },
  ];

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();

    if (selectedNodes.length) {
      setSelectedNode(selectedNodes[0]);
      setPaymentBills(selectedNodes[0].data.paymentBills);
    }
  }, []);

  const onSave = (paidBills) => {
    // const selectedNode = gridRef.current.api.getSelectedNodes()[0];
    setPaymentBills(null);
    fetchInvoices();
  };

  useEffect(() => {
    if (paymentBills) fmk.setValues({ bills: paymentBills });
  }, [paymentBills]);

  //custom validation funciton
  const validate = (values) => {
    const errors = {};

    if (
      !(values.paidCost || values.paidTax || values.paidDate || values.method)
    ) {
      errors.msg = 'Please fill in all the required fields!';
    }

    return errors;
  };

  let fmk = useFormik({
    validationSchema: Yup.object().shape({
      bills: Yup.array()
        .of(
          Yup.object({
            paidTotal: Yup.string().required('Paid Total required'),
            paidCost: Yup.string().required('paidCost required'),
            paidTax: Yup.string().required('paidTax required'),
            paidDate: Yup.string().required('paidDate required'),
            method: Yup.string().required('payment method required'),
          })
        )
        .compact(function (v) {
          return (
            (v.method ||
              v.paidCost ||
              v.paidDate ||
              v.paidTax ||
              v.paidTotal) === undefined
          );
        })
        .min(1, 'Need to fill in at least one row'),
    }),
    initialValues: { bills: paymentBills },
    initialErrors: {
      bills: [
        {
          paidCost: 'paidCost required',
          paidTax: 'paidTax required',
          paidDate: 'paidDate required',
          method: 'method reqired',
        },
      ],
    },
    onSubmit: (values) => saveBills(values, selectedNode.id, onSave),
    enableReinitialize: true, //rerenders when initialvalues change
    validateOnBlur: true,
  });

  if (
    dept.toLowerCase() === deptType.sales ||
    dept.toLowerCase() === deptType.sub
  ) {
    navigate('/s/dashboard');
    return null;
  }

  return (
    <>
      {isLoading && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: '80vh', margin: '0 auto' }}
        >
          <Box sx={{ minHeight: 4, width: 500 }}>
            <LinearProgress />
          </Box>
        </Grid>
      )}

      {!isLoading && (
        <Grid container direction="column" rowGap={5}>
          <Grid item sx={{ mb: 5 }}>
            <Box
              sx={{ width: '100%', height: 600 }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                ref={gridRef}
                rowData={invoices}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  filter: true,
                }}
                getRowId={(params) => params.data.invoiceNo}
                rowSelection="single"
                onSelectionChanged={onSelectionChanged}
                pagination={true}
                paginationPageSize={20}
              ></AgGridReact>
            </Box>
          </Grid>

          {fmk.values.bills && paymentBills && (
            <BillList {...{ fmk, isLoading }} />
          )}
        </Grid>
      )}
    </>
  );
};

export default Collection;
