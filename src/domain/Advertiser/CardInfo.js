import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles'
import api from 'appConfig/restAPIs';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { formatUIDate } from 'shared/utils';
import { roleType } from 'data/constants';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from '@mui/lab';
import ConfirmDialog from "shared/components/ConfirmDialog";
import AddCard from './AddCard';
import UpdateCard from './UpdateCard';

const IconLoadingButton = styled(LoadingButton)({
    "& .MuiButton-startIcon": {
        marginLeft: 0, marginRight: 0,
    }
});

const CardInfo = ({ companyId, companyName, companyEmail, userId }) => {
    const gridRef = useRef();
    const [cards, setCards] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isChangeCardOpen, setIsChangeCardOpen] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        companyId: companyId,
        companyName: companyName,
        companyEmail: companyEmail,
        regBy: userId
    });

    const columnDefs = [
        { field: 'holderName', headerName: 'Card Holder', width: 260, minWidth: 200 },
        { field: 'lastDigit', headerName: 'Last Digit', resizable: false, width: 120 },
        { field: 'expirationMonth', headerName: 'Exp. Month', resizable: false, width: 120 },
        { field: 'expirationYear', headerName: 'Exp. Year', resizable: false, width: 100 },
        {
            field: 'regDate', headerName: 'Register Date', resizable: false, width: 140,
            valueFormatter: (params) => formatUIDate(params.value)
        },
        { 
            field: 'isPrimary', headerName: 'Primary Card', resizable: false, width: 120,
            cellRenderer: (props) => {
                return props.value === true ? <CheckCircleIcon sx={{ position: 'relative', top: 5, color: "green" }} /> : ''
            },
            valueGetter: (params) => params.data.isPrimary
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

    const deleteCard = async () => {
      const { customerId } = await selectedRow;
      await axios.delete(`${api.stripeCustomer}/${customerId}`)
        .then(() => fetchCards(companyId))
        .then(() => setIsDeleteOpen(false));
    }

    const changeCard = async () => {
        const data = {
            companyId: selectedRow.companyId,
            customerId: selectedRow.customerId
        }
        await axios.put(`${api.stripeCustomerCard}`, data)
          .then(() => fetchCards(companyId))
          .then(() => setIsChangeCardOpen(false));
    }

    const addCard = () => {
        setIsAddOpen(true);
    }

    const updateCard = () => {
        setIsUpdateOpen(true);
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

            <ConfirmDialog open={isChangeCardOpen}
                message={`Do you want to change the primary card?`}
                isLoading={isLoading} onOK={changeCard} 
                onCancel={() => setIsChangeCardOpen(false)} onClose={() => setIsChangeCardOpen(false)} 
            />
            
            {isAddOpen && <
                AddCard
                  customerInfo={customerInfo}
                  onClose={() => setIsAddOpen(false)}
                  onSaved={() => {
                    fetchCards(companyId);
                    setIsAddOpen(false);
                  }}
                />}

            {isUpdateOpen && <
                UpdateCard
                  selectedRow = {selectedRow}
                  onClose={() => setIsUpdateOpen(false)}
                  onSaved={() => {
                    fetchCards(companyId);
                    setIsUpdateOpen(false);
                    setSelectedRow(null);
                  }}
                />}

            <Grid container direction="column">
                <Grid container item wrap="nowrap" alignItems="center" sx={{ mb: 2 }} columnGap={1}>
                    <Button startIcon={<AddIcon />} variant="contained"
                        onClick={addCard}
                    >
                        Add a Card
                    </Button>
                    <IconLoadingButton variant="outlined" startIcon={<EditIcon />}
                        loadingPosition='start'
                        onClick={updateCard}
                        loading={isLoading}
                        disabled={!selectedRow}
                    >
                    </IconLoadingButton>
                    <IconLoadingButton startIcon={<DeleteForeverIcon />} color="error" variant="outlined"
                        loadingPosition='start'
                        onClick={() => setIsDeleteOpen(true)}
                        loading={isLoading}
                        disabled={!selectedRow}
                    >
                    </IconLoadingButton>
                    <IconLoadingButton startIcon={<CheckIcon />} color="success" variant="outlined"
                        loadingPosition='start'
                        onClick={() => setIsChangeCardOpen(true)}
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
        </>
    );
}

export default CardInfo;