import { Button, Link, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import React, { useState } from 'react';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';

const CardTransaction = ({onClose, onOpen, payData}) => {
console.log("payData", payData);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPayLoading, setIsPayLoading] = useState(false);

    return (
        <>
            <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
            <Dialog
                open={onOpen}
                onClose={() => onClose()}
                sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 } }}
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
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress />
                        </Box>
                    )}
                    <Grid container direction="column" sx={{ mb: 4 }} rowGap={3}>
                        
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <LoadingButton startIcon={<SaveIcon />} variant="contained"
                        
                    >
                        Submit
                    </LoadingButton>
                    {/* 초기화 */}
                    <Button startIcon={<RestartAltIcon />} onClick={() => onClose()} variant="outlined">Reset</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CardTransaction;