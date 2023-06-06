import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
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
import { subMonths } from 'date-fns';
import { precisionRound } from 'shared/utils';

const CardTransaction = ({onClose, onOpen, payData, fetchCardPayBills}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isPayLoading, setIsPayLoading] = useState(false);
    const [validTotal, setValidTotal] = useState(true);
    const {creditCard, receiptEmail, cost, taxAmount, paidAmount, paidTax, invoiceNo, adId, adType, companyName, method} = payData;
        
    const [price, setPrice] = useState(cost-paidAmount);
    const [tax, setTax] = useState(taxAmount-paidTax);
    const [total, setTotal] = useState(cost + taxAmount - paidAmount - paidTax);

    const { user } = useUserAuth();

    const handleTotal = () => {
        if(price + tax > cost + taxAmount - paidAmount - paidTax){
            setErrorMessage(`Sum of Cost and Tax should be same or less than Original Total`);
            setValidTotal(false);
        }else{
            setValidTotal(true);
            setTotal(price + tax);
        }
    };

    useEffect(() => {
        //setTotal(price + tax);
        handleTotal();
    },[price, tax]);

    const onReset = () => {
        setPrice(cost - paidAmount);
        setTax(taxAmount - paidTax);
        setTotal(cost + taxAmount - paidAmount - paidTax);
    };
    
    const handleCardPay = async (data) => {
        await axios.post(`${api.stripePayment}`, data)
            .then((res) => {
                console.log(res.status);
                // fetchCardPayBills();
            });
    };

    const submitCardPay = async () => {
        setIsPayLoading(true);
        const data = {
            customerId: creditCard.customerId,
            receiptEmail: receiptEmail,
            description: `${adId}:${adType}:${invoiceNo}:${companyName}:${price}:${tax}:${user.userId}:${method}`,
            currency: 'cad',
            amount: Math.round(total * 100)
        };

        await handleCardPay(data);
        const endDate = new Date()
        const startDate = subMonths(endDate, 2);
        fetchCardPayBills(startDate, endDate);
        setIsPayLoading(false);
        onClose();
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
                            <Button startIcon={<ClearIcon />} onClick={() => onClose()} variant="outlined" fontSize="small"></Button>
                        </Grid>
                    </Grid>               
                </DialogTitle>
                <DialogContent>
                    {isPayLoading && (
                        <Box sx={{ display:'flex' }}>
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
                                type ="number"
                                label="Cost"
                                value={precisionRound(price)}
                                variant='standard'
                                inputProps={{maxLength:8, step:"2"}}
                                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                label="Tax"
                                value={precisionRound(tax)}
                                variant='standard'
                                inputProps={{maxLength:8, step:"2"}}
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
    );
}

export default CardTransaction;

// paid와 ad 계산해서 original amount와 balance 나눠서 보여주기
// 이미 다 지불한건 balance 0, disabled
// original amount - paid history - pay == 0 이면 invoice status update
