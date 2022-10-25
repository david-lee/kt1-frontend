import React, { useState } from 'react';
import api from 'appConfig/restAPIs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import axios from 'axios';

const AddNote = ({ companyId, isOpen, onClose, onSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isError, setIsError] = useState(false);
  const { user } = useUserAuth();

  const handleSaveNote = () => {
    if (noteTitle && noteContent) {
      setIsLoading(true);

      axios.post(api.notes, { title: noteTitle, content: noteContent, customerId: companyId, regBy: user.userId })
        .then((resp) => {
          onSaved();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError(true);
    }
  }

  const handleCancel = () => {
    onClose();
  }

  const handleOnClose = (e, reason) => {
    if (reason === "backdropClick") {
      return false;
    }
    onClose && onClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleOnClose} disableEscapeKeyDown
      sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 }}}>
      <DialogTitle>Add a note</DialogTitle>

      <DialogContent>
        <Grid container direction="column" sx={{ mb: 4 }} rowGap={3}>
          <Grid item>
            <TextField
              label="Title"
              value={noteTitle}
              variant='standard'
              onChange={e => setNoteTitle(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Note"
              value={noteContent}
              fullWidth
              multiline
              rows={3}
              variant='standard'
              onChange={e => setNoteContent(e.target.value)}
            />            
          </Grid>
        </Grid>
        
        {isError && <Grid container><Typography color="error">Please enter title and note.</Typography></Grid>}
      </DialogContent>

      <DialogActions>
        <LoadingButton variant="contained" onClick={handleSaveNote} disabled={isLoading} loading={isLoading}>
          Save
        </LoadingButton>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
      </DialogActions>

    </Dialog>
  );
}

export default AddNote;
