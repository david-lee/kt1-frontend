import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { cardNumberWithDash, validCardHolderName, validCardNumber, validCardMonth, validCardYear, validSecNumber, validCardMonthYear } from 'shared/utils';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const AddCard = ({ customerInfo, onClose, onSaved }) => {
    const [holderName, setHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState(null);
    const [expYear, setExpYear] = useState(null);
    const [secNum, setSecNum] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [validCard, setValidCard] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);

    const handleAddCard = async (data) => {
        await axios.post(`${api.stripeCustomer}`, data)
            .then((res) => {
                console.log(res.status);
            });
    };

    const isValidCard = () => {

        if (!validCardHolderName.test(holderName)) {
            setErrorMessage(`Please correct holder name`);
            setValidCard(false);
        } else if (!validCardNumber.test(cardNumber)) {
            setErrorMessage(`Please correct card number`);
            setValidCard(false);
        } else if (!validCardMonth.test(expMonth)) {
            setErrorMessage(`Please correct expiration Month`);
            setValidCard(false);
        } else if (!validCardYear.test(expYear)) {
            setErrorMessage(`Please correct expiration Year`);
            setValidCard(false);
        } else if (!validSecNumber.test(secNum)) {
            setErrorMessage(`Please correct cvc number`);
            setValidCard(false);
        } else if (!validCardMonthYear(expMonth, expYear)) {
            setErrorMessage(`Please correct expiration Month and Year`);
            setValidCard(false);
        } else {
            setValidCard(true);
        }
    };

    const saveAdd = async () => {
        setIsAddLoading(true);
        const data = {
            ...customerInfo,
            creditCard: {
                holderName: holderName,
                cardNumber: cardNumber.replaceAll('-', ''),
                expirationMonth: expMonth,
                expirationYear: expYear,
                cvc: secNum
            }
        }
        
        await handleAddCard(data);
        await onSaved();
        setIsAddLoading(false);
    };

    return (
        <>
            <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
            <Dialog
                open={true}
                onClose={() => onClose()}
                sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 } }}
            >
                <DialogTitle>Add a card</DialogTitle>
                <DialogContent>
                    {isAddLoading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Grid container direction="column" sx={{ mb: 4 }} rowGap={3}>
                        <Grid item>
                            <TextField
                                label="Holder Name"
                                value={holderName}
                                variant='standard'
                                onChange={(e) => setHolderName(e.target.value)}
                                onBlur={() => isValidCard()}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Card Number"
                                value={cardNumberWithDash(cardNumber)}
                                variant='standard'
                                onChange={(e) => setCardNumber(e.target.value)}
                                onBlur={() => isValidCard()}
                            />
                        </Grid>
                        <Grid item container columnGap={2}>
                            <Grid item>
                                <TextField
                                    label="Exp. Month"
                                    value={expMonth}
                                    variant='standard'
                                    onChange={(e) => setExpMonth(e.target.value)}
                                    onBlur={() => isValidCard()}
                                />
                                <TextField
                                    label="Exp. Year"
                                    value={expYear}
                                    variant='standard'
                                    onChange={(e) => setExpYear(e.target.value)}
                                    onBlur={() => isValidCard()}
                                />
                                <TextField
                                    label="Cvc"
                                    value={secNum}
                                    variant='standard'
                                    onChange={(e) => setSecNum(e.target.value)}
                                    onBlur={() => isValidCard()}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <LoadingButton startIcon={<SaveIcon />} variant="contained"
                        onClick={saveAdd}
                        disabled={!validCard}
                    >
                        Save
                    </LoadingButton>
                    <Button startIcon={<ClearIcon />} onClick={() => onClose()} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddCard;