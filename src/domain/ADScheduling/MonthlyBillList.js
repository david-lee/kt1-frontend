import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { format } from 'date-fns';
import { getTax, removeCommas } from 'shared/utils';
import { UI_DATE_FORMAT } from 'data/constants';
import ADPrice from 'shared/components/ADPrice';

const BillList = ({ bills, onPriceChange, taxIncluded }) => {
  const handleBillPrice = (index, value) => {
    bills[index].cost = removeCommas(value);
    onPriceChange([...bills]);
  }

  const handleBillTax = (index) => {
    const bill = bills[index];
    bill.taxAmount = getTax(bill.cost, taxIncluded);
    onPriceChange([...bills]);
  }

  const handleTotal = (index) => {
    const bill = bills[index];
    bill.total = bill.cost + bill.taxAmount;
    onPriceChange([...bills]);
  }


  const [sums, setSums] = useState({
    sumCost: 0,
    sumTaxAmount: 0,
    sumTotal: 0
  });

  const { sumCost, sumTaxAmount, sumTotal } = sums;

  useEffect(() => {
    const sumC = bills?.reduce((pre, cur) => { return pre + cur.cost }, 0);
    const sumT = bills?.reduce((pre, cur) => { return pre + cur.taxAmount }, 0);
    const sumTt = bills?.reduce((pre, cur) => { return pre + cur.total }, 0);

    setSums({
      ...sums,
      sumCost: sumC,
      sumTaxAmount: sumT,
      sumTotal: sumTt
    });
  }, [bills]);

  return (
    <>
      <Grid container columnGap={2} sx={{ mb: 10 }}>
        <Grid item xs={1.5}>
          <ADPrice label="Sum of Price" value={(sumCost === 0) ? "" : sumCost} readOnly />
        </Grid>
        <Grid item xs={1.5}>
          <ADPrice label="Sum of Tax" value={(sumTaxAmount === 0) ? "" : sumTaxAmount} readOnly />
        </Grid>
        <Grid item xs={1.5}>
          <ADPrice label="Sum of Total" value={(sumTotal === 0) ? "" : sumTotal} readOnly />
        </Grid>
      </Grid>

      {bills?.map(({ startDate, endDate, cost, taxAmount, total }, index) => {
        return (
          <Grid key={index} container columnGap={2} sx={{ mb: 2 }}>
            <Grid item xs={1.5}>
              <TextField
                label="Start Date"
                variant='standard'
                InputProps={{ readOnly: true }}
                defaultValue={format(startDate, UI_DATE_FORMAT)}
                fullWidth
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="End Date"
                variant='standard'
                InputProps={{ readOnly: true }}
                defaultValue={format(endDate, UI_DATE_FORMAT)}
                fullWidth
              />
            </Grid>
            {/* if stDate is not started from 1, calculate price and tax */}
            <Grid item xs={1}>
              <ADPrice label="Price" value={cost}
                onChange={(e) => handleBillPrice(index, e.target.value)}
                onBlur={() => {
                  handleBillTax(index);
                  handleTotal(index)
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <ADPrice label="Tax" value={taxAmount} readOnly />
            </Grid>
            <Grid item xs={1}>
              <ADPrice label="Total" value={total} readOnly />
            </Grid>
          </Grid>

        )
      })
      }
    </>
  )
};

export default BillList;
