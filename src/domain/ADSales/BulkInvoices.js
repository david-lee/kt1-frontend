import React, { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import useInvoice from 'shared/hooks/useInvoice';

const BulkInvoices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyIssued, setAlreadyIssed] = useState(false);
  const { isLoading, checkBulkIssue, issueAllInvoices } = useInvoice();

  const onIssued = () => {
    setIsOpen(false);
    setAlreadyIssed(true);
  };

  const issueInvoices = () => {
    issueAllInvoices(onIssued);
  };

  useEffect(() => {
    checkBulkIssue((resp) => setAlreadyIssed(resp));
  }, []);

  return (
    <>
      <Box>
        <ConfirmDialog open={isOpen}
          title="Bulk Invoices"
          message="Do you want to issue all invoices?"
          isLoading={isLoading}
          onOK={issueInvoices} 
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
          It will create invoices into a PDF file and download it. If companies set "eInvoice" option to active, those invoices will be emailed and not included in the file.
        </Typography>

        {alreadyIssued && <Typography color="error" variant="h6" sx={{ mt: 5 }}>It has been already issued for the month.</Typography>}

        <LoadingButton startIcon={<ReceiptIcon />} variant="contained"
          disabled={isLoading || alreadyIssued} onClick={() => setIsOpen(true)} sx={{ mt: 5 }}
        >
          Issue All Invoices
        </LoadingButton>
      </Box>

      {isLoading && (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: '50vh', margin: "0 auto" }}>
          <Box sx={{ minHeight: 4, width: 500 }}>
            <LinearProgress />
          </Box>
        </Grid>
      )}
    </>
  );
}

export default BulkInvoices;
