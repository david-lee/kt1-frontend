import React, { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import useInvoice from 'shared/hooks/useInvoice';
import axios from 'axios';
import api from "appConfig/restAPIs";

const BulkInvoices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyIssued, setAlreadyIssed] = useState(false);
  const { isLoading, checkBulkIssue, issueAllInvoices, issuePreviewAllInvoices, issueAllCardPaymentInvoices } = useInvoice();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [numberOfIssues, setNumberOfIssues] = useState({download:0,email:0});
  const [isResult, setIsResult] = useState(false);
  const [issueCardPayOpen, setIssueCardPayOpen] = useState(false);

  const onIssued = () => {
    setIsOpen(false);
    setAlreadyIssed(true);
  };

  const issueInvoices = () => {
    issueAllInvoices(onIssued);
    handleNumberOfIssues();
  };

  const issuePreviewInvoices = () => {
    issuePreviewAllInvoices();
    setIsPreviewOpen(false);
  }

  const issueCardPayInvoices = () => {
    issueAllCardPaymentInvoices();
    setIssueCardPayOpen(false);
  }

  useEffect(() => {
    checkBulkIssue((resp) => setAlreadyIssed(resp));
  }, []);

  const handleNumberOfIssues = async () => {
    await axios.get(`${api.invoiceNumberOfIssues}`)
      .then((resp) => {
        setNumberOfIssues({email:resp.data[0].emails, download:resp.data[0].downloads});
      })
      .finally(() => {
        setIsResult(true);
      });
    
  }

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

        <ConfirmDialog open={isPreviewOpen}
          title="Preview Bulk Invoices"
          message="Do you want to issue all invoices to preview?"
          isLoading={isLoading}
          onOK={issuePreviewInvoices} 
          onCancel={() => setIsPreviewOpen(false)} onClose={() => setIsPreviewOpen(false)} 
        />

        <ConfirmDialog open={issueCardPayOpen}
          title="Card Payment Bulk Invoices"
          message="Do you want to issue all card payment invoices?"
          isLoading={isLoading}
          onOK={issueCardPayInvoices} 
          onCancel={() => setIssueCardPayOpen(false)} onClose={() => setIssueCardPayOpen(false)} 
        />

        <ConfirmDialog open={isResult}
          title="The result of All issues"
          message={numberOfIssues.download + ` download invoices and ` + numberOfIssues.email + ` email invoices are issued.`}
          isLoading={isLoading}
          onOK={() => setIsResult(false)}
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

        {alreadyIssued && <Typography color="error" variant="h6" sx={{ mt: 5 }}>
          It has been already issued for the month.</Typography>}

        <LoadingButton startIcon={<ReceiptIcon />} variant="outlined"
          onClick={() => setIssueCardPayOpen(true)} sx={{ mt: 5, mr: 3 }}
        >
          Issue All invoice for Card Payment
        </LoadingButton>
        
        <LoadingButton startIcon={<ReceiptIcon />} variant="outlined"
          onClick={() => setIsPreviewOpen(true)} sx={{ mt: 5, mr: 3 }}
        >
          Issue Preview All Invoices
        </LoadingButton>

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
