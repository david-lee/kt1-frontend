import { useCallback, useState } from 'react';
import axios from 'axios';
import api from 'appConfig/restAPIs';

const usePayments = (onFetch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [billPayments, setBillPayments] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchPayments = useCallback((adId) => {
    setIsLoading(true);

    axios.get(`${api.paymentHistory}/${adId}`)
      .then((resp) => {
        // it has bill info and paid list
        const payment = resp.data[0];

        const mappedPayments = payment?.paidList.map(payment => {
          return {
            ...payment,
            total: payment.paidAmount + payment.paidTax
          };
        });

        if (payment) payment.paidList = mappedPayments;

        setBillPayments(payment);
        // setPayments(mappedPayments || []);

        onFetch();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const deletePayment = (payIds, userId, adId) => {
    setIsLoading(true);

    axios.delete(`${api.payment}`, { data: { payId: payIds, userId } })
      .then((resp) => {
        if(resp.data === "rejected")
        {
          setDeleteSuccess(true);
        }
        fetchPayments(adId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    billPayments,
    fetchPayments,
    deletePayment,
    deleteSuccess,
    setDeleteSuccess
  };
};

export default usePayments;
