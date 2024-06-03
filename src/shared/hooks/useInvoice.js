import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from 'appConfig/restAPIs';
import { DATA_DATE_FORMAT } from 'data/constants';
import { invoiceStatus } from 'data/adOptions';
import { format } from 'date-fns';
import { useUserAuth } from 'shared/contexts/UserAuthContext';

const useInvoice = (fetchOnLoad) => {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const { user } = useUserAuth();

  const fetchInvoices = useCallback((companyId, onFetch) => {
    setIsLoading(true);
    const url = companyId
      ? `${api.companyInvoice}?userId=${companyId}`
      : api.invoiceList;

    axios
      .get(url)
      .then((resp) => {
        const mapped = resp.data.map(
          ({
            customerId,
            invoiceNo,
            primaryName,
            dueDate,
            issuedBy,
            issuedDate,
            paymentBills,
          }) => {
            let cost = 0;
            let tax = 0;
            let outstandingCost = 0;
            let outstandingTax = 0;

            paymentBills.forEach((bill) => {
              outstandingCost += bill.outstandingCost;
              outstandingTax += bill.outstandingTax;
              cost += bill.cost;
              tax += bill.taxAmount;
              bill.paidTotal = '';
              bill.paidCost = '';
              bill.paidTax = '';
              bill.paidDate = '';
              bill.method = '';
            });

            return {
              customerId,
              invoiceNo,
              primaryName,
              dueDate,
              issuedBy,
              issuedDate,
              cost,
              tax,
              orgTotal: cost + tax,
              outstandingCost,
              outstandingTax,
              outstandingTotal: outstandingCost + outstandingTax,
              paymentBills,
            };
          }
        );

        // console.log("mapped invoice: ", mapped);

        if (onFetch) onFetch(mapped);
        else setInvoices(mapped);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchCompletedInvoices = useCallback((companyId, onFetch) => {
    setIsLoading(true);
    const url = `${api.companyCompletedInvoice}?userId=${companyId}`;

    axios
      .get(url)
      .then((resp) => {
        const mapped = resp.data.map(
          ({
            customerId,
            invoiceNo,
            primaryName,
            dueDate,
            issuedBy,
            issuedDate,
            paymentBills,
          }) => {
            let cost = 0;
            let tax = 0;
            let outstandingCost = 0;
            let outstandingTax = 0;

            paymentBills.forEach((bill) => {
              outstandingCost += bill.outstandingCost;
              outstandingTax += bill.outstandingTax;
              cost += bill.cost;
              tax += bill.taxAmount;
              bill.paidTotal = '';
              bill.paidCost = '';
              bill.paidTax = '';
              bill.paidDate = new Date();
              bill.method = '';
            });

            return {
              customerId,
              invoiceNo,
              primaryName,
              dueDate,
              issuedBy,
              issuedDate,
              cost,
              tax,
              orgTotal: cost + tax,
              outstandingCost,
              outstandingTax,
              outstandingTotal: outstandingCost + outstandingTax,
              paymentBills,
            };
          }
        );

        if (onFetch) onFetch(mapped);
        else setInvoices(mapped);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getInvoice = (endPoint, data, viewPdf = true) => {
    setIsLoading(true);

    return axios
      .post(
        endPoint,
        { ...data, userId: user.userId },
        { responseType: 'blob' }
      )
      .then((data) => {
        if (viewPdf) {
          const file = new Blob([data.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (fetchOnLoad) fetchInvoices();
  }, [fetchInvoices, fetchOnLoad]);

  // TODO: don't we show AD date in an invoice
  const viewInvoiceByBill = (adId) => {
    const endPoint = `${api.invoicePreview}/byBill`;
    const data = { adId };

    getInvoice(endPoint, data);
  };

  const viewInvoiceByCompany = (companyId) => {
    const endPoint = `${api.invoicePreview}/byCompany`;
    const data = { companyId };

    getInvoice(endPoint, data);
  };

  const issueInvoiceByBill = (adId) => {
    const endPoint = `${api.invoiceIssue}/byBill`;
    const data = { adId };

    getInvoice(endPoint, data);
  };

  const issueInvoiceByCompany = (companyId) => {
    const endPoint = `${api.invoiceIssue}/byCompany`;
    const data = { companyId };

    getInvoice(endPoint, data);
  };

  const emailInvoiceByBill = (adId) => {
    const endPoint = `${api.invoiceEmail}/byBill`;
    const data = { adId };

    getInvoice(endPoint, data, false);
  };

  const emailInvoiceByCompany = (companyId) => {
    const endPoint = `${api.invoiceEmail}/byCompany`;
    const data = { companyId };

    getInvoice(endPoint, data, false);
  };

  const reIssueInvoice = (invoiceNo, type, email) => {
    const endPoint = `${api.invoiceReissue}`;
    const data = {
      invoice: invoiceNo,
      email,
      type,
    };

    return getInvoice(endPoint, data, !email);
  };

  const reDownloadInvoice = (invoiceNo) => {
    const endPoint = `${api.reDownloadInvoice}`;
    const data = {
      invoice: invoiceNo,
    };

    return getInvoice(endPoint, data);
  };

  const checkInvoiceByBill = (companyId, adIds) => {
    return axios.post(api.invoiceCheck, { companyId, adId: adIds });
  };

  const saveBills = ({ bills }, invoiceNo, onSave) => {
    const billData = Object.values(bills);

    let outstandingTotal = 0;
    let allPaidTotal = 0;
    let reqBillData = [];

    billData.forEach(
      ({
        outstandingCost,
        outstandingTax,
        paidTotal,
        paidDate,
        billId,
        paidCost,
        paidTax,
        method,
      }) => {
        outstandingTotal += outstandingCost + outstandingTax;
        allPaidTotal += +paidTotal;

        // send only paid bill
        if (+paidTotal > 0) {
          reqBillData.push({
            adId: billId,
            paidDate: format(paidDate, DATA_DATE_FORMAT),
            paidAmount: paidCost,
            paidTax,
            method,
          });
        }
      }
    );

    const reqData = {
      invoiceNo,
      status:
        outstandingTotal === allPaidTotal
          ? invoiceStatus.completed
          : invoiceStatus.outstanding,
      regBy: user.userId,
      paidBills: reqBillData,
    };

    setIsLoading(true);

    axios
      .post(`${api.payment}/submit`, { ...reqData })
      .then(() => {
        onSave(bills);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const checkBulkIssue = useCallback((onCheck) => {
    setIsLoading(true);

    axios
      .get(`${api.invoiceBulkCheck}`)
      .then((resp) => {
        onCheck(resp.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const issueAllInvoices = useCallback((onIssued, setNumberOfIssues) => {
    setIsLoading(true);

    axios
      .post(
        `${api.invoicebulkIssue}`,
        { userId: user.userId, issueType: 2 },
        { responseType: 'blob' }
      )
      .then((data) => {
        const file = new Blob([data.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        handleNumberOfIssues(setNumberOfIssues);
        onIssued();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleNumberOfIssues = useCallback((setNumberOfIssues) => {
    axios.get(`${api.invoiceNumberOfIssues}`).then((resp) => {
      setNumberOfIssues({
        email: resp.data[0].emails,
        download: resp.data[0].downloads,
      });
    });
  }, []);

  const issuePreviewAllInvoices = useCallback(() => {
    setIsLoading(true);

    axios
      .post(
        `${api.invoicebulkIssue}`,
        { userId: user.userId, issueType: 1 },
        { responseType: 'blob' }
      )
      .then((data) => {
        const file = new Blob([data.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const issueAllCardPaymentInvoices = useCallback(() => {
    setIsLoading(true);
    axios
      .post(`${api.invoicebulkCardPaymentIssue}`, { userId: user.userId })
      .then((data) => {
        console.log(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    invoices,
    fetchInvoices,
    fetchCompletedInvoices,
    viewInvoiceByBill,
    viewInvoiceByCompany,
    issueInvoiceByBill,
    issueInvoiceByCompany,
    issueAllInvoices,
    issuePreviewAllInvoices,
    issueAllCardPaymentInvoices,
    reIssueInvoice,
    reDownloadInvoice,
    emailInvoiceByBill,
    emailInvoiceByCompany,
    checkInvoiceByBill,
    checkBulkIssue,
    saveBills,
  };
};

export default useInvoice;
