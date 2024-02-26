import { useCallback, useState } from 'react';
import axios from 'axios';
import api from "appConfig/restAPIs";

const useCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const customerIntent = useCallback((data, setClientSecret, setCustomerId, setIsIntentOpen) => {
    setIsLoading(true);
    axios.post(`${api.stripeCreateCustomer}`, data)
      .then(resp => {
        setCustomerId(resp.data);
        axios.post(`${api.stripeClientSecret}`, {customerId: resp.data})
          .then(resp => {
            setClientSecret(resp.data);
          })
      })
      .finally(() => {
        setIsLoading(false);
        setIsIntentOpen(true);
      });
  }, []);

  const customerCard = useCallback((customerId, setCardInfo, setCompleteAddCardOpen) => {
    setIsLoading(true);
    axios.post(`${api.stripeCustomerCard}`, {customerId: customerId})
      .then(resp => {
        setCardInfo({pmId: resp.data.id,
                    lastDigit: resp.data.card.last4, 
                    expMonth: resp.data.card.exp_month, 
                    expYear: resp.data.card.exp_year, 
                    cardBrand: resp.data.card.brand
                  })
      })
      .finally(() => {
        setIsLoading(false);
        setCompleteAddCardOpen(false);
      })
  }, []);

  return {
    customerIntent,
    customerCard
  }
}

export default useCard;