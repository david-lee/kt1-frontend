import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useEffect } from 'react';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { subMonths, addMonths } from 'date-fns';
import { precisionRound } from 'shared/utils';
import { cardCompanyBrand } from 'data/constants';

const CardPayTransaction = ({ onClose, onOpen, payData, fetchCardPayBills }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [validTotal, setValidTotal] = useState(true);
  const { payCard, cost, taxAmount, paidAmount, paidTax, adId, adType, companyName } = payData;
  const [price, setPrice] = useState(cost - paidAmount);
  const [tax, setTax] = useState(taxAmount - paidTax);
  const [total, setTotal] = useState(cost + taxAmount - paidAmount - paidTax);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [transErrMge, setTransErrMge] = useState("");
  const { user } = useUserAuth();

  useEffect(() => {
    handleTotal();
  }, [price, tax])

  const handleTotal = () => {
    if (price + tax > cost + taxAmount - paidAmount - paidTax) {
      setErrorMessage(`Sum of Cost and Tax should be same or less than Original Total`);
      setValidTotal(false);
    } else {
      setValidTotal(true);
      setTotal(price + tax);
    }
  };

  const onReset = () => {
    setPrice(cost - paidAmount);
    setTax(taxAmount - paidTax);
    setTotal(cost + taxAmount - paidAmount - paidTax);
  };

  const handleCardPay = async (data) => {
    await axios.post(`${api.stripePaymentCheckout}`, data)
        .then((res) => {
          if(res.data.status !== 'succeeded'){
            setTransErrMge(res.data.last_payment_error.message);
          }else{
            onClose();
          }
            // fetchCardPayBills();
        })
        .finally(() => {})
  };

  const submitCardPay = async () => {
    setIsPayLoading(true);
    const data = {
        customerId: payCard.customerId,
        paymentMethodId: payCard.paymentMethodId,
        amount: Math.round(total * 100),
        currency: 'cad',
        returnUrl: 'https://kt1.koreatimes.net/s/adsales',
        description: `${payData.invoiceNo}:${adId}:${price}:${tax}:${user.userId}:${cardCompanyBrand[payCard.cardBrand]}:${adType}:${companyName}`,        
    };
    
    await handleCardPay(data);

    const currentDate = new Date();
    const startDate = subMonths(currentDate, 2);
    const endDate = addMonths(currentDate, 1);
    
    fetchCardPayBills(startDate, endDate);
    
    setIsPayLoading(false);
  };

  return (
    <>
      <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
      <Dialog
        open={onOpen}
        // onClose={() => onClose()}
        sx={{ "& .MuiPaper-root": { maxWidth: 700, minWidth: 400, minHeight: 200 } }}
      >
        <DialogTitle>
          <Grid container direction="row" sx={{ justifyContent: 'space-between' }}>
            <Grid item>
              Pay the bill
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{color: "red", fontWeight: "bold"}}>{transErrMge}</Typography>
            </Grid>
            <Grid item>
              <Button startIcon={<ClearIcon />} onClick={() => onClose()} variant="outlined" fontSize="small"></Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {isPayLoading && (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          )}
          <Grid container direction="row" sx={{ mb: 4 }} rowGap={3}>
            <Grid item>
              <TextField
                label="Total"
                value={precisionRound(total)}
                variant='standard'

              />
            </Grid>
            <Grid item>
              <TextField
                type="number"
                label="Cost"
                value={precisionRound(price)}
                variant='standard'
                inputProps={{ maxLength: 8, step: "2" }}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item>
              <TextField
                type="number"
                label="Tax"
                value={precisionRound(tax)}
                variant='standard'
                inputProps={{ maxLength: 8, step: "2" }}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              />
            </Grid>
            
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton startIcon={<SaveIcon />} variant="contained"
            disabled={!validTotal}
            onClick={submitCardPay}
          >
            Submit
          </LoadingButton>
          <Button startIcon={<RestartAltIcon />} onClick={() => onReset()} variant="outlined">Reset</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CardPayTransaction;