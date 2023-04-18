import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { validCardNumber } from 'shared/utils';

const UpdateCard = ({ selectedRow, onClose, onSaved }) => {
    const { holderName, lastDigit } = selectedRow;
    const [expMonth, setExpMonth] = useState(selectedRow.expirationMonth);
    const [expYear, setExpYear] = useState(selectedRow.expirationYear);
    const [secNum, setSecNum] = useState(null);
    const [validCard, setValidCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const doUpdateCard = async (data) => {    
        await axios.put(`${api.stripeCustomer}`, data)
            .then((res) => {
                console.log(res.status);
        });
    }

    const isValidCard = () => {
        const cur = new Date();
        const validYear = expYear - cur.getFullYear();
        const curMonth = cur.getMonth()+1;
        const inputMonth = expMonth;
        
        if(!validCardNumber.test(expMonth) || expMonth > 12 ){
            setErrorMessage(`Please correct expiration Month`);
            setValidCard(false);
        }else if(!validCardNumber.test(expYear) || validYear < 0 || validYear > 10 ){
            setErrorMessage(`Please correct expiration Year`);
            setValidCard(false);
        }else if(!validCardNumber.test(secNum) || secNum.toString().length !== 3){
            setErrorMessage(`Please correct cvc number`);
            setValidCard(false);
        }else if(validYear === 0 && (curMonth > inputMonth)){
            setErrorMessage(`Please correct expiration Month and Year`);
            setValidCard(false);
        }else{
            setValidCard(true);
        }   
    }

    const saveChanges = async () => {
        const data = {
          customerId: selectedRow.customerId,
          cardId: selectedRow.cardId,
          expirationMonth: expMonth,
          expirationYear: expYear,
          cvc: secNum
        };

        await doUpdateCard(data);
        onSaved();       
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