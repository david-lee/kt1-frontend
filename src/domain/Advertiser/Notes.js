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
import { roleType } from 'data/constants';

const Notes = ({ companyId, role }) => {
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const columnDefs = [
    { field: 'noteId', headerName: 'ID', width: 100, resizable: false },
    { field: 'regDate', headerName: 'Date', resizable: false, width: 120,
      valueFormatter: (params) => formatUIDate(params.value) 
    },
    { field: 'title', headerName: 'Title', minWidth: 250 },
    { field: 'content', headerName: 'Note', minWidth: 900, autoHeight: true, wrapText: true, suppressSizeToFit: true  },
    { field: 'regBy', headerName: 'Created By', width: 160, resizable: false },
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
          >
          </AgGridReact>
        </Box>
      </Box>

      {isOpen && <AddNote companyId={companyId} onClose={onCloseAddNote} onSaved={handleOnSaved} isOpen={isOpen} />}
    </>
  );
}

export default Notes;
