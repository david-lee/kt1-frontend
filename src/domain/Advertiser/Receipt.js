import React, { useCallback, useState, useEffect } from 'react';
import { subYears } from 'date-fns';
import axios from 'axios';
import api from 'appConfig/restAPIs';
import { format } from 'date-fns';
import { DATA_DATE_FORMAT } from 'data/constants';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, IconButton, Collapse } from '@mui/material';
import ADDate from 'shared/components/ADDate';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import { roleType } from 'data/constants';
import ConfirmDialog from "shared/components/ConfirmDialog";


import ReceiptDetail from './ReceiptDetail';

const IconLoadingButton = styled(LoadingButton)({
  "& .MuiButton-startIcon": {
    marginLeft: 0, marginRight: 0,
  }
});

const Receipt = ({ companyId, eInvoice, role }) => {
  const [receiptList, setReceiptList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [stDate, setStDate] = useState(() => subYears(new Date(), 1));
  const [edDate, setEdDate] = useState(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);
  const [canIssue, setCanIssue] = useState(false);
  const [clickedAction, setClickedAction] = useState("view");
  


  const getList = useCallback((companyId, stDate, edDate) => {

    setIsLoading(true);
    const fromDate = stDate ? format(stDate, DATA_DATE_FORMAT) : "";
    const toDate = edDate ? format(edDate, DATA_DATE_FORMAT) : "";

    axios.get(`${api.getReceiptList}?companyId=${companyId}&startDate=${fromDate}&endDate=${toDate}`)
      .then((resp) => {
        setReceiptList(resp);
      })
      // .catch(err => {
      //   console.log(err.response.data.error);
      // })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  useEffect(() => {
    getList(companyId, stDate, edDate);
  }, [companyId, getList]);

  console.log("receiptList2", receiptList);
  
  const handleDateChange = (type, value) => {
    if (type === 'start') setStDate(value);
    if (type === 'end') setEdDate(value);
  };

  const setReceiptAction = (action) => {
    setClickedAction(action);
    setIsOpen(true);
  }

  const handleReceipt = () => {

  }

  const headCells = ["BillNo", "Type", "Title", "StartDate", "EndDate", "Cost", "Tax", "Total", "Page", "Size", "CadTitle"];

  return (
    <>
      <ConfirmDialog open={isOpen}
        message={`Do you want to ${clickedAction} the receipt?`}
        isLoading={isReceiptLoading}
        onOk={handleReceipt}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
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
              onClick={() => getList(companyId, stDate, edDate)}
              sx={{ position: "relative", top: 5, ml: 1 }}>
            </IconLoadingButton>
          </Grid>
          <Grid container item alignItems="center" xs={4} columnGap={1}>
            <Typography variation="captiion">Receipt:</Typography>

            <IconLoadingButton variant="outlined" startIcon={<PreviewIcon />}
              onClick={() => setReceiptAction("view")}
              loadingPosition="start"
              loading={isReceiptLoading}
              disabled={!canIssue}
            ></IconLoadingButton>

            {role !== roleType.director && (
              <>
                <IconLoadingButton variant="contained" startIcon={<DownloadIcon />}
                  onClick={() => setReceiptAction("issue")}
                  loadingPosition="start"
                  loading={isReceiptLoading}
                  disabled={!canIssue}
                ></IconLoadingButton>

                <IconLoadingButton variant="contained" startIcon={<EmailIcon />}
                  onClick={() => setReceiptAction("email")}
                  loadingPosition="start"
                  loading={isReceiptLoading}
                  disabled={!canIssue || !eInvoice}
                ></IconLoadingButton>
              </>
            )}
          </Grid>
        </Grid>

        {!isLoading && !receiptList && <Grid item><Typography>No List</Typography></Grid>}

        {receiptList && (
          <>
            <Grid container item direction="column" sx={{ mt: 2 }}>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography>Select</Typography>
                      </TableCell>
                      {headCells.map((headCell) => (
                        <TableCell key={headCell}>
                          <Typography>{headCell}</Typography>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Typography>Paid</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receiptList.data.map((row) => (
                      <ReceiptDetail key={row.adId.toString()} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}

      </Grid>

    </>
  )
}

export default Receipt;