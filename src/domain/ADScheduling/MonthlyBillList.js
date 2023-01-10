import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { format } from 'date-fns';
import { removeCommas, precisionRound } from 'shared/utils';
import { UI_DATE_FORMAT } from 'data/constants';
import ADPrice from 'shared/components/ADPrice';

const BillList = ({ bills, onPriceChange }) => {
  const handleBillPrice = (index, value) => {
    bills[index].cost = value;
    onPriceChange([...bills]);
  }

  const handleBillTax = (index, value) => {
    bills[index].taxAmount = value;
    onPriceChange([...bills]);
  }

  const handleTotal = (index) => {
    const bill = bills[index];
    const total = Number(removeCommas(bill.cost)) + Number(removeCommas(bill.taxAmount));
    bill.total = precisionRound(total);
    onPriceChange([...bills]);
  }

  const [sums, setSums] = useState({
    sumCost: 0,
    sumTaxAmount: 0,
    sumTotal: 0
  });

  const { sumCost, sumTaxAmount, sumTotal } = sums;

  useEffect(() => {
    const sumC = bills?.reduce((pre, cur) => { return pre + Number(removeCommas(cur.cost)) }, 0);
    const sumT = bills?.reduce((pre, cur) => { return pre + Number(removeCommas(cur.taxAmount)) }, 0);
    const sumTt = bills?.reduce((pre, cur) => { return pre + cur.total }, 0);

    setSums({
      sumCost: precisionRound(sumC),
      sumTaxAmount: precisionRound(sumT),
      sumTotal: precisionRound(sumTt)
    });
  }, [bills]);

  return (
    <>
      {bills?.length > 0 &&
        <Grid container columnGap={2} sx={{ mb: 10 }}>
          <Grid item xs={1.5}>
            <ADPrice label="Sum of Price" value={sumCost} readOnly />
          </Grid>
          <Grid item xs={1.5}>
            <ADPrice label="Sum of Tax" value={sumTaxAmount} readOnly />
          </Grid>
          <Grid item xs={1.5}>
            <ADPrice label="Sum of Total" value={sumTotal} readOnly />
          </Grid>
        </Grid>
      }

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
                  handleTotal(index)
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <ADPrice label="Tax" value={taxAmount}
                onChange={(e) => handleBillTax(index, e.target.value)}
                onBlur={() => {
                  handleTotal(index)
                }} />
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