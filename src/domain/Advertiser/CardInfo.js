import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import ConfirmDialog from "shared/components/ConfirmDialog";
import StripeSetup from './StripeSetup';
import useCard from 'shared/hooks/useCard';

const IconLoadingButton = styled(LoadingButton)({
    "& .MuiButton-startIcon": {
        marginLeft: 0, marginRight: 0,
    }
});

const CardInfo = ({ companyId, companyName, companyEmail, regBy }) => {
        
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
    console.log("customerInfo", customerInfo);
    const [setupOpen, setSetupOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [isIntentOpen, setIsIntentOpen] = useState(false);
    const [completeAddCardOpen, setCompleteAddCardOpen] = useState(false);
    const { customerIntent, customerCard } = useCard();

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
                    
                </Grid>
                
            </Grid>   
        </>
    );
}

export default CardInfo;