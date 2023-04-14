import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import api from 'appConfig/restAPIs';
import axios from 'axios';

const UpdateCard = ({ selectedRow, onClose, onSaved }) => {
    const { holderName, lastDigit } = selectedRow;
    const [expMonth, setExpMonth] = useState(selectedRow.expirationMonth);
    const [expYear, setExpYear] = useState(selectedRow.expirationYear);
    const [secNum, setSecNum] = useState("***");
    const [errorMessage, setErrorMessage] = useState('');

    console.log("updateCard", selectedRow)

    const doUpdateCard = async (data) => {
        // const {customerId, cardId} = await selectedRow;
        // setCardUpdate({customerId, cardId, ...cardUpdate});
        axios.put(`${api.stripeCustomer}/customer`, data)
          .then(console.log("need to make a useCard component"));
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
                                />
                                <TextField
                                    label="Exp. Year"
                                    value={expYear}
                                    variant='standard'
                                    onChange={(e) => setExpYear(e.target.value)}
                                />
                                <TextField
                                    label="Cvc"
                                    value={secNum}
                                    variant='standard'
                                    onChange={(e) => setSecNum(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <LoadingButton startIcon={<SaveIcon />} variant="contained"
                        onClick={saveChanges}
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