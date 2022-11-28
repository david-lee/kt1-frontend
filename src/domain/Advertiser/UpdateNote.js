import React, { useState } from 'react';
import api from 'appConfig/restAPIs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import axios from 'axios';

const UpdateNote = ({noteData, isUpdateOpen, onClose, onUpdated}) => {
  const {noteId, title, content} = noteData;

  const [isLoading, setIsLoading] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [isError, setIsError] = useState(false);
  const { user } = useUserAuth();

  const handleUpdateNote = () => {
    if(noteContent){
        setIsLoading(true);

        axios.put(api.notes, {noteId: noteId, content: noteContent, updatedBy: user.userId})
        .then((resp) => {
            onUpdated();
        })
        .finally(() => {
            setIsLoading(false);
        })
    }else{
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
  
  return(
    <Dialog open={isUpdateOpen} onClose={handleOnClose} disableEscapeKeyDown
      sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 }}}>
      <DialogTitle>Update a note</DialogTitle>

      <DialogContent>
        <Grid container direction="column" sx={{ mb: 4 }} rowGap={3}>
          <Grid item>
            <TextField
              label="Title"
              value={title}
              variant='standard'
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
      </DialogContent>
      {isError && <Grid container><Typography color="error">Please enter note.</Typography></Grid>}
      <DialogActions>
        <LoadingButton variant="contained" onClick={handleUpdateNote} disabled={isLoading} loading={isLoading}>
          Save
        </LoadingButton>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
      </DialogActions>

    </Dialog>
  );
}

export default UpdateNote;