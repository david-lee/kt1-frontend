import { useCallback, useState } from 'react';
import axios from 'axios';
import api from "appConfig/restAPIs";

const useReceipt = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkBulkIssue = useCallback((onCheck) => {
    setIsLoading(true);

    axios.get(`${api.receiptBulkCheck}`)
      .then((resp) => {
        onCheck(resp.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const issueAllReceipts = useCallback((onIssued, period) => {
    setIsLoading(true);
  
    axios.post(`${api.receiptBulkIssue}?fromDate=${period.fromDate}&toDate=${period.toDate}`)
      .then(resp => {
        console.log(resp.data);
        onIssued();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    checkBulkIssue,
    issueAllReceipts
  }
}

export default useReceipt;

