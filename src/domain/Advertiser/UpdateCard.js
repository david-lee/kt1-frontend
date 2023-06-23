import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { validCardMonth, validCardYear, validSecNumber, validCardMonthYear } from 'shared/utils';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const UpdateCard = ({ selectedRow, onClose, onSaved }) => {
    const { holderName, lastDigit } = selectedRow;
    const [expMonth, setExpMonth] = useState(selectedRow.expirationMonth);
    const [expYear, setExpYear] = useState(selectedRow.expirationYear);
    const [secNum, setSecNum] = useState("");
    const [validCard, setValidCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    const doUpdateCard = async (data) => {
        await axios.put(`${api.stripeCustomer}`, data)
            .then((res) => {
                console.log(res.status);
            });
    }

    const isValidCard = () => {
        if (!validCardMonth.test(expMonth)) {
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
    }

    const saveChanges = async () => {
        setIsUpdateLoading(true);
        const data = {
            customerId: selectedRow.customerId,
            cardId: selectedRow.cardId,
            expirationMonth: expMonth,
            expirationYear: expYear,
            cvc: secNum
        };

        await doUpdateCard(data);
        await onSaved();
        setIsUpdateLoading(false);
    };

    return (
        <>
            <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
            <Dialog
                open={true}
                onClose={() => onClose()}
                sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 } }}
            >
                <DialogTitle>Update the card</DialogTitle>
                <DialogContent>
                    {isUpdateLoading && (
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
                                disabled={true}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Last 4 digit"
                                value={lastDigit}
                                variant='standard'
                                disabled={true}
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
                        onClick={saveChanges}
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

export default UpdateCard;