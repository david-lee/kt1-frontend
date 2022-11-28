import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import api from 'appConfig/restAPIs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'assets/styles/table.css';
import axios from 'axios';
import { formatUIDate } from 'shared/utils'
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';
import { roleType } from 'data/constants';

const Notes = ({ companyId, role }) => {
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [noteData, setNoteData] = useState(null);

  const columnDefs = [
    { field: 'noteId', headerName: 'ID', width: 80, resizable: false },
    { field: 'regDate', headerName: 'Date', resizable: false, width: 100,
      valueFormatter: (params) => formatUIDate(params.value) 
    },
    { field: 'title', headerName: 'Title', minWidth: 240 },
    { field: 'content', headerName: 'Note', minWidth: 900, autoHeight: true, wrapText: true, suppressSizeToFit: true  },
    { field: 'regBy', headerName: 'Created By', width: 120, resizable: false },
    { field: 'updatedBy', headerName: 'Updated By', width: 120, resizable: false },
  ];

  const fetchNotes = useCallback((companyId) => {
    setIsLoading(true);
      
    axios.get(`${api.notes}/${companyId}`)
      .then(({ data }) => {
        setNotes(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [])

  const handleCreateNote = () => setIsOpen(true);
  
  const onCloseAddNote = () => setIsOpen(false);
  
  const handleOnSaved = () => {
    setIsOpen(false);
    fetchNotes(companyId);
  };

  // Update a Note
  const current = new Date();
  const curDate = `${current.getFullYear()}${current.getMonth()+1}${current.getDate()}`;
  
  const updateNote = useCallback( event => {
    if(event.data.regDate === curDate){
      setNoteData(event.data);
      handleUpdateNote();
    }
  }, []);

  const handleUpdateNote = () => setIsUpdateOpen(true);
  const onCloseUpdateNote = () => setIsUpdateOpen(false);

  const handleOnUpdated = () => {
    setIsUpdateOpen(false);
    fetchNotes(companyId);
  };
  // End of Update the Note

  useEffect(() => {
    fetchNotes(companyId);
  }, [companyId, fetchNotes]);
  

  if (isLoading) return <div>loading...</div>

  if (!notes) return  null;

  return (
    <>
      <Box>
        <Box sx={{ width: '100%', height: 400 }} className="ag-theme-alpine">
          {role !== roleType.director && (
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} wrap="noWrap">
              <Grid item columnGap={3} alignItems="center">
                <Button startIcon={<NoteAddIcon />} variant="contained" onClick={handleCreateNote}>
                  Create a note
                </Button>
              </Grid>
            </Grid>
          )}

          <AgGridReact
            rowData={notes}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            onCellClicked={updateNote}
          >
          </AgGridReact>
        </Box>
      </Box>

      {isOpen && <AddNote companyId={companyId} onClose={onCloseAddNote} onSaved={handleOnSaved} isOpen={isOpen} />}
      {isUpdateOpen && <UpdateNote {...{noteData}} onClose={onCloseUpdateNote} onUpdated={handleOnUpdated} isUpdateOpen={isUpdateOpen} />}
    </>
  );
}

export default Notes;
