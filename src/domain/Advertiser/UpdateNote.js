import React, { useState, useEffect } from 'react';
import api from 'appConfig/restAPIs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { format } from 'date-fns';
import { DATA_DATE_FORMAT } from 'data/constants';
import axios from 'axios';

const UpdateNote = ({noteData, onClose, onUpdated, isOpen}) => {
  const {noteId, title, content, regDate} = noteData;
  const [isLoading, setIsLoading] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [isError, setIsError] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUserAuth();

  useEffect(() => {
    return checkUpdate();
  }, []);
  
  const checkUpdate = () => {
    const current = new Date();
    const curDate = format(current, DATA_DATE_FORMAT);
    if(curDate == regDate){
        setIsUpdate(true);
    }else{
        setErrorMessage("Only the note created in the same day is editiable!");
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
 
  const handleUpdateNote = () => {
    if(noteContent){
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
  
  return(
    <>
    <Dialog open={isOpen} onClose={handleOnClose} disableEscapeKeyDown
      sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 300 }}}>
      <DialogTitle>Update a Note</DialogTitle>

      <DialogContent>
        <Grid container direction="column" sx={{ mb: 4 }} rowGap={3}>
          <Grid item>
            <TextField
              label="Title"
              value={title}
              variant='standard'
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Note"
              value={noteContent}
              fullWidth
              multiline
              rows={4}
              variant='standard'
              disabled={!isUpdate}
              onChange={e => setNoteContent(e.target.value)}
            />            
          </Grid>
        </Grid>
      </DialogContent>

      {!isUpdate && <Grid container justifyContent="center"><Typography color="error">{errorMessage}</Typography></Grid>}
      {isError && <Grid container><Typography color="error">Please enter note.</Typography></Grid>}
      
      <DialogActions>
        <LoadingButton variant="contained" onClick={handleUpdateNote} disabled={!isUpdate} loading={isLoading}>
          Save
        </LoadingButton>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
      </DialogActions>
      
    </Dialog>
    </>
  );
}

export default UpdateNote;