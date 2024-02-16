import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const StripeSetupForm = () => {
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
        return_url: 'https://example.com/account/payments/setup-completes',
      },
    });

    if(error){
      setErrorMessage(error.message);
    }else{

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
    
  );
  
};

export default StripeSetupForm;