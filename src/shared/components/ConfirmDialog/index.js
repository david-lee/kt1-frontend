import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent,DialogContentText, DialogActions} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

const ConfirmDialog = ({ open, onOK, onCancel, onClose, title, message, isLoading, deleteOp = false }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color={deleteOp ? "red" : "inherit"}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <LoadingButton loading={isLoading} startIcon={<SaveIcon />} variant="contained"
          onClick={onOK} sx={{ bgcolor: deleteOp ? "red" : "" }}
        >
          Yes
        </LoadingButton>
        {onCancel && <Button startIcon={<ClearIcon />} onClick={onCancel} variant="outlined">No</Button>}
      </DialogActions>
    </Dialog>    
  )
};

export default ConfirmDialog;
