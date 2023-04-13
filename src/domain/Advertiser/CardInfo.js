import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles'
import api from 'appConfig/restAPIs';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { formatUIDate } from 'shared/utils';
import { roleType } from 'data/constants';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { LoadingButton } from '@mui/lab';
import ConfirmDialog from "shared/components/ConfirmDialog";

const IconLoadingButton = styled(LoadingButton)({
    "& .MuiButton-startIcon": {
        marginLeft: 0, marginRight: 0,
    }
});

const CardInfo = ({ companyId, role }) => {
    const gridRef = useRef();

    const [cards, setCards] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const columnDefs = [
        { field: 'holderName', headerName: 'Card Holder', width: 260, minWidth: 200 },
        { field: 'lastDigit', headerName: 'Last Digit', resizable: false, width: 120 },
        { field: 'expirationMonth', headerName: 'Exp. Month', resizable: false, width: 120 },
        { field: 'expirationYear', headerName: 'Exp. Year', resizable: false, width: 100 },
        {
            field: 'regDate', headerName: 'Register Date', resizable: false, width: 140,
            valueFormatter: (params) => formatUIDate(params.value)
        }
    ];

    const fetchCards = useCallback((companyId) => {
        setIsLoading(true);

        axios.get(`${api.stripeCustomer}/${companyId}`)
            .then(({ data }) => {
                setCards(data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [])

    useEffect(() => {
        fetchCards(companyId);
    }, [companyId, fetchCards]);

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setSelectedRow(selectedRows[0]);
      }, [])

    const deleteCard = () => {
      const customerId = selectedRow.customerId;
      axios.delete(`${api.stripeCustomer}/${customerId}`)
        .then(() => setIsDeleteOpen(false), () => fetchCards(companyId));
    }

    if (isLoading) return <div>loading...</div>
    if (!cards) return null;

    return (
        <>
            <ConfirmDialog open={isDeleteOpen}
                message={`Do you want to delete it?`}
                isLoading={isLoading} onOK={deleteCard} 
                onCancel={() => setIsDeleteOpen(false)} onClose={() => setIsDeleteOpen(false)} 
            />
            <Grid container direction="column">
                <Grid container item wrap="nowrap" alignItems="center" sx={{ mb: 2 }} columnGap={1}>
                    <Button startIcon={<NoteAddIcon />} variant="contained" >
                        Add a Card
                    </Button>
                    <IconLoadingButton variant="outlined" startIcon={<EditIcon />}
                        loadingPosition='start'
                    // onClick={editBill}
                    // loading={isInvoiceLoading}
                    // disabled={!canEdit}
                    >
                    </IconLoadingButton>
                    <IconLoadingButton startIcon={<DeleteForeverIcon />} color="error" variant="outlined"
                        loadingPosition='start'
                        onClick={() => setIsDeleteOpen(true)}
                        loading={isLoading}
                        disabled={!selectedRow}
                    >
                    </IconLoadingButton>
                </Grid>
                <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 400, width: '100%', mb: 3 }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={cards}
                        columnDefs={columnDefs}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                        }}
                        // getRowId = {param => param.data.customerId}
                        rowSelection = "single"
                        onSelectionChanged={onSelectionChanged}
                    >
                    </AgGridReact>
                </Grid>
            </Grid>
            
            {/* {isOpen && <AddNote companyId={companyId} onClose={onCloseAddNote} onSaved={handleOnSaved} isOpen={isOpen} />}
        {isUpdateOpen && <UpdateNote {...{noteData}} onClose={onCloseUpdateNote} onUpdated={handleOnUpdated} isOpen={isUpdateOpen} />} */}
        </>
    );
}

export default CardInfo;