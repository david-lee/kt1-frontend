import React, { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import useReceipt from 'shared/hooks/useReceipt';
import { subMonths } from 'date-fns';
import { format } from 'date-fns';
import { DATA_DATE_FORMAT } from 'data/constants';

const BulkEReceipts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyIssued, setAlreadyIssued] = useState(false);
  const { isLoading, checkBulkIssue, issueAllReceipts } = useReceipt();

  const onIssued = () => {
    setIsOpen(false);
    setAlreadyIssued(true);
  };

  const issueReceipts = () => {
    const preDate = format(subMonths(new Date(), 1), DATA_DATE_FORMAT).substring(0,7) + "01";
    const curDate = format(new Date(), DATA_DATE_FORMAT).substring(0,7) + "01";
    
    const period = {
      fromDate:preDate,
      toDate:curDate
      // fromDate:"20240101",
      // toDate:"20240106"
    }
    issueAllReceipts(onIssued, period);
  };

  useEffect(() => {
    checkBulkIssue((resp) => setAlreadyIssued(resp));
  }, []);

  return (
    <>
      <Box>
        <ConfirmDialog open={isOpen}
          title="Bulk Receipts"
          message="Do you want to issue all receipts?"
          isLoading={isLoading}
          onOK={issueReceipts}
          onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)}
        />
        {false && (
          <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh', margin: "0 auto" }}>
            <Box sx={{ minHeight: 4, width: 500 }}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
        
        <Typography variant="body1">
          All receipt will be issued and sent via email if companies set "eReceipt" option to active while other companies with inactive option are excluded.
        </Typography>

        {alreadyIssued && <Typography color="error" variant="h6" sx={{ mt: 5 }}>It has been already issued for the month.</Typography>}

        <LoadingButton startIcon={<ReceiptIcon />} variant="contained"
          disabled={isLoading || alreadyIssued} onClick={() => setIsOpen(true)} sx={{ mt: 5 }}
        >
          Issue All Receipts
        </LoadingButton>
      </Box>

      {isLoading && (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: '10vh', margin: "0 auto" }}>
          <Box sx={{ minHeight: 4, width: 600 }}>
            <LinearProgress />
          </Box>
        </Grid>
      )}
    </>
  )

}

export default BulkEReceipts;