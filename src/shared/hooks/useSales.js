import { useCallback, useState } from "react";
import { format } from 'date-fns';
import axios from 'axios';
import api from 'appConfig/restAPIs';
import { salesStatus } from "data/adOptions";
import { DATA_DATE_FORMAT } from 'data/constants';

const useSales = () => {
  const [isLoading, setIsLoading] = useState();

  const updateStatus = (data, onUpdated) => {
    setIsLoading(true);

    axios.put(api.salesStatus, { ...data })
      .then((resp) => {
        onUpdated(resp);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmAD = (adIds, onConfirm) => {
    const data = {
      status: salesStatus.confirmed,
      adIds
    }
    updateStatus(data, onConfirm);
  };

  const deleteAD = (adIds, onDeleted) => {
    const data = {
      status: salesStatus.deleted,
      adIds
    }
    return updateStatus(data, onDeleted);
  };

  const fetchADs = (endpoint, onFetch) => {
    setIsLoading(true);

    axios.get(endpoint)
      .then((resp) => {
        const mapped = resp.data.main.map(({
          adId, company, adType, adTitle, page, size, startDate, endDate, cardPayment, paymentStatus,
          status, cost, taxAmount, cadTitle, webFlag, color, scheduleType, regBy, regDate
        }) => {
          // TODO: try to pass object with code and use formatValue
          return {
            adId,
            company: company.label,
            companyId: company.value,
            adType: adType.label,
            adTypeCode: adType.value,
            adTitle,
            page,
            size: size?.value || "",
            sizeCode: size?.codeId,
            startDate,
            endDate,
            cost,
            taxAmount,
            total: cost + taxAmount,
            cadTitle: cadTitle?.value || "",
            cadTitleCode: cadTitle?.codeId,
            webFlag: webFlag ? "Y": "N",
            // color: color ? "Y" : "N",
            color,
            paymentStatus,
            cardPayment,
            scheduleTypeCode: scheduleType,
            scheduleType: scheduleType === 1 ? '회성' : ( scheduleType === 2 ? '고정' : '고정(R)' ),
            status: status.value,
            statusCode: status.codeId,
            regBy: regBy.label,
            regDate: regDate,
          }
        });
        const random =resp.data.randomDates.map(({
          adId, pAdId, company, adType, adTitle, page, size, startDate, endDate, cost, taxAmount, cadTitle,scheduleType
        }) => {
          return {
            adId,
            pAdId,
            company: company.label,
            companyId: company.value,
            adType: adType.label,
            adTypeCode: adType.value,
            adTitle,
            page,
            size: size?.value || "",
            sizeCode: size?.codeId,
            startDate,
            endDate,
            cost,
            taxAmount,
            total: cost + taxAmount,
            cadTitle: cadTitle?.value || "",
            cadTitleCode: cadTitle?.codeId,
            scheduleTypeCode: scheduleType,
            scheduleType: scheduleType === 1 ? '회성' : ( scheduleType === 2 ? '고정' : '고정(R)' )
          }
        });          
        onFetch({main: mapped, randomDates: random, payments: resp.data.paidHistory});
      })
      .finally(() => {
        setIsLoading(false);
      });     
  }

  const fetchPendingADs = useCallback((onFetch) => {
    const endpoint = `${api.getAdList}?status=${salesStatus.pending}`;
    fetchADs(endpoint, onFetch);
  }, []);

  const fetchADList = useCallback(({ companyId, startDate, endDate }, onFetch) => {
    const stDate = startDate ? format(startDate, DATA_DATE_FORMAT) : "";
    const edDate = endDate ? format(endDate, DATA_DATE_FORMAT) : "";
    const endpoint = `${api.getAdList}?companyId=${companyId}&startDate=${stDate}&endDate=${edDate}`;
    
    fetchADs(endpoint, onFetch);   
  }, []);

  const fetchOneTimeADs = useCallback((date, onFetch) => {
    const reqDate = format(date, DATA_DATE_FORMAT);
    const endpoint = `${api.getAdList}?startDate=${reqDate}&endDate=${reqDate}&scheduleType=13`;

    fetchADs(endpoint, onFetch);
  }, []);

  const updateAD = (data) => {
    setIsLoading(true);

    return axios.put('/sales', data)
      .then(() => {
        console.log("done with update");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fetchCardPayList = (onFetch) => {
    setIsLoading(true);

    axios.get(`${api.cardPayList}`, { responseType: 'blob' })
      .then(resp => {
        const file = new Blob([resp.data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        onFetch && onFetch();
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  return {
    isLoading,
    fetchPendingADs,
    fetchOneTimeADs,
    fetchADList,
    fetchCardPayList,
    confirmAD,
    deleteAD, 
    updateAD
  };
}

export default useSales;
