import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { styled } from '@mui/material/styles'
import { formatUIDate } from 'shared/utils';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import { LoadingButton } from '@mui/lab';
import ConfirmDialog from "shared/components/ConfirmDialog";
import StripeSetup from './StripeSetup';
import useCard from 'shared/hooks/useCard';
import api from 'appConfig/restAPIs';
import axios from 'axios';

const IconLoadingButton = styled(LoadingButton)({
    "& .MuiButton-startIcon": {
        marginLeft: 0, marginRight: 0,
    }
});

const CardInfo = ({ companyId, companyName, companyEmail, regBy }) => {
    const gridRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    
    const [customerInfo, setCustomerInfo] = useState({
        companyId: companyId,
        name: companyName,
        email: companyEmail,
        regBy: regBy
    });
    const [cardInfo, setCardInfo] = useState({
        pmId: "",
        lastDigit: "",
        expMonth: null,
        expYear: null,
        cardBrand: ""
    });
    
    const [setupOpen, setSetupOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [isIntentOpen, setIsIntentOpen] = useState(false);
    const [completeAddCardOpen, setCompleteAddCardOpen] = useState(false);
    const [cards, setCards] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isChangeDefaultCardOpen, setIsChangeDefaultCardOpen] = useState(false);
    const { customerIntent, customerCard } = useCard();

    const columnDefs = [
        { field: 'lastDigit', headerName: 'Last Digit', resizable: false, width: 100 },
        { field: 'expMonth', headerName: 'Exp. Month', resizable: false, width: 100 },
        { field: 'expYear', headerName: 'Exp. Year', resizable: false, width: 100 },
        {
            field: 'regDate', headerName: 'Register Date', resizable: false, width: 140,
            valueFormatter: (params) => formatUIDate(params.value)
        },
        { 
            field: 'isPrimary', headerName: 'Primary', resizable: false, width: 100,
            cellRenderer: (props) => {
                return props.value === true ? <CheckCircleIcon sx={{ position: 'relative', top: 5, color: "green" }} /> : ''
            },
            valueGetter: (params) => params.data.isPrimary
        }
    ];

    const fetchCards = useCallback((companyId) => {
        setIsLoading(true);
    
        axios.get(`${api.stripeCustomerCardList}/${companyId}`)
            .then(({ data }) => {
                setCards(data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [])

    useEffect(() => {
        fetchCards(companyId);
    }, [companyId, cardInfo]);

    useEffect(() => {
        setCustomerInfo({
            companyId: companyId,
            name: companyName,
            email: companyEmail,
            regBy: regBy
        })
    }, [companyId, companyName, companyEmail, regBy]);

    const createCustomerIntent = () => {
        customerIntent(customerInfo, setClientSecret, setCustomerId);
        setIsIntentOpen(true);
    }

    const addCard = () => {
        setSetupOpen(true);
        setIsIntentOpen(false);
    }

    const completeAddCard = () => {
        customerCard(customerId, setCardInfo, setCompleteAddCardOpen);
    }

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setSelectedRow(selectedRows[0]);
    }, [])

    const changeDefaultCard = async () => {
        const data = {
            companyId: companyId,
            customerId: selectedRow.customerId
        }
        
        await axios.put(`${api.stripeChangeDefaultCard}`, data)
            .then(() => {
                fetchCards(companyId);
                setIsChangeDefaultCardOpen(false);
        });
    }

    return (
        <>
            <ConfirmDialog open={isIntentOpen}
                message={`Please click the button to register a card`}
                isLoading={isLoading} onOK={addCard} 
                onCancel={() => setIsIntentOpen(false)} onClose={() => setIsIntentOpen(false)} 
            />

            <ConfirmDialog open={completeAddCardOpen}
                message={`Card register is succeeded`}
                isLoading={isLoading} onOK={completeAddCard} 
            />

            <ConfirmDialog open={isChangeDefaultCardOpen}
                message={`Do you want to change the primary card?`}
                isLoading={isLoading} onOK={changeDefaultCard} 
                onCancel={() => setIsChangeDefaultCardOpen(false)} onClose={() => setIsChangeDefaultCardOpen(false)} 
            />
            
            {setupOpen && <
                StripeSetup
                  onClose={() => setSetupOpen(false)}
                  client_secret ={clientSecret}
                  setCompleteAddCardOpen={setCompleteAddCardOpen}
                
                />}

            <Grid container direction="column">
                <Grid container item wrap="nowrap" alignItems="center" sx={{ mb: 2 }} columnGap={1}>
                    <Button startIcon={<AddIcon />} variant="contained" disabled={companyEmail==='-' || companyEmail === ''}
                        onClick={createCustomerIntent}
                    >
                        Add a Card
                    </Button>
                    <IconLoadingButton startIcon={<CheckIcon />} color="success" variant="outlined"
                        loadingPosition='start'
                        onClick={() => setIsChangeDefaultCardOpen(true)}
                        loading={isLoading}
                        disabled={!selectedRow}
                    >
                    </IconLoadingButton>
                </Grid>
                <Grid item component={Box} className="ag-theme-alpine" sx={{ height: 400, width: 600, mb: 3 }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={cards}
                        columnDefs={columnDefs}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                        }}
                        getRowId = {param => param.data.customerId}
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