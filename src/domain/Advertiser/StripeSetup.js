import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import{loadStripe} from '@stripe/stripe-js';
import { STRIPE_PUB_KEY } from 'data/constants';
import StripSetupForm from './StripeSetupForm';

const stripePromise = loadStripe(STRIPE_PUB_KEY);

const client_secret = 'seti_1OkYETFTcVYEN1aoQEsL4YZx_secret_PZhdxTvEQHoxMFfZRBIEyo7qtlFBSKw';
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

const StripeSetup = () => {
  const options = {
    clientSecret: client_secret,
    layout,
    appearance,
  };

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <StripSetupForm />
      </Elements>
      
    </>
  );
}

export default StripeSetup;