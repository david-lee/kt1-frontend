import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import{loadStripe} from '@stripe/stripe-js';
import { STRIPE_PUB_KEY } from 'data/constants';
import StripSetupForm from './StripeSetupForm';
import { Dialog, DialogTitle, DialogContent, } from '@mui/material';

const stripePromise = loadStripe(STRIPE_PUB_KEY);

const layout = {
  type: 'tabs',
  defaultConllapsed: false,
};

const appearance = {
  theme: 'flat',
  variables: {
    colorPrimaryText: '#262626',
    colorBackground: '#e0e0e0',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Ideal Sans, system-ui, sans-serif',
    spacingUnit: '2px',
    borderRadius: '6px',
  },
}

const StripeSetup = ({onClose, client_secret, setCompleteAddCardOpen}) => {
  const options = {
    clientSecret: client_secret,
    layout,
    appearance,
  };

  return (
    <>
      
    <Dialog
      open={true}
      onClose={onClose}
      sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 400, minHeight: 400 } }}
    >
      <DialogTitle>
        Register Card
        
      </DialogTitle>
      <DialogContent>
        <Elements stripe={stripePromise} options={options}>
          <StripSetupForm onClose={onClose} setCompleteAddCardOpen={setCompleteAddCardOpen} />
        </Elements>
      </DialogContent>
      
    </Dialog>  
    </>
  );
}

export default StripeSetup;