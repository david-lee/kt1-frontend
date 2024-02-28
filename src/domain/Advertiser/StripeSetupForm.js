import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';

const StripeSetupForm = ({onClose, setCompleteAddCardOpen}) => {
  const stripe  = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!stripe || !elements) {
      return null;
    }

    const {error} = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // redirect to setup intent client secret for card payment, but redirect display updated card register
      },
      redirect: 'if_required',
    });

    if(error){
      setErrorMessage(error.message);
    }else{
      onClose();
      setCompleteAddCardOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button disabled={!stripe}>Submit</button>
        <button onClick={() => onClose()}>Cancel</button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </>
  );
  
};

export default StripeSetupForm;