import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DownloadIcon from '@mui/icons-material/Download';
import Dropdown from 'shared/components/Dropdown';
import { adTypeOptions } from 'data/adOptions';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import useSales from 'shared/hooks/useSales';
import CardPayForBill from './CardPayForBill';

const CardPayment = () => {
  const { isLoading, fetchCardPayList } = useSales();
  const [adType, setAdType] = useState('');
  const [cardPayList, setCardPayList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
console.log("cardPayList", cardPayList);
  const downloadPDF = () => {
    fetchCardPayList(adType);
  };

  const fetchCardPayBills = useCallback(() => {
    setIsListLoading(true);

    axios.get(`${api.cardPayBillList}`)
    .then((res) => {
      setCardPayList(res.data);
    })
    .finally(() => {
      setIsListLoading(false);
    });
  }, [])

  useEffect(() => {
    fetchCardPayBills();
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" columnGap={4}>
        <Grid item>
          <Typography variant="body1">You can download a PDF file which has a list of bills with card payment option.</Typography>
        </Grid>

        <Grid container item columnGap={5} sx={{ mt: 8 }}>
          <Dropdown id="adType" name="adType" label="Ad Type" value={adType}
            onChange={e => setAdType(e.target.value)}
            options={adTypeOptions} width={160}
          />

          <LoadingButton startIcon={<DownloadIcon />} variant="contained" disabled={isLoading}
            onClick={() => downloadPDF()} loading={isLoading}
          >
            Download List
          </LoadingButton>
        </Grid>
      </Grid>
      <CardPayForBill cardPayList={cardPayList}></CardPayForBill>
    </>
  );
}

export default CardPayment;
