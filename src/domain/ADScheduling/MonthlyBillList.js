import React from 'react';
import { Grid, TextField } from '@mui/material';
import { format } from 'date-fns';
import { getTax, removeCommas } from 'shared/utils';
import { UI_DATE_FORMAT } from 'data/constants';
import ADPrice from 'shared/components/ADPrice';

const BillList = ({ bills, onPriceChange, taxIncluded }) => {
  const handleBillPrice = (index, value) => {
    bills[index].cost = removeCommas(value);
    onPriceChange([ ...bills ]);
  }
  
  const handleBillTax = (index) => {
    const bill = bills[index];
    bill.taxAmount = getTax(bill.cost, taxIncluded);
    onPriceChange([...bills]);
  }
  
  return (
    bills?.map(({ startDate, endDate, cost, taxAmount, total }, index) => {
      return (
        <Grid key={index} container columnGap={2} sx={{ mb: 2 }}>
          <Grid item xs={2}>
            <TextField
              label="Start Date"
              variant='standard'
              InputProps={{ readOnly: true }}
              defaultValue={format(startDate, UI_DATE_FORMAT)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
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
              onBlur={() => handleBillTax(index)}
            />
          </Grid>
          <Grid item xs={1}>
            <ADPrice label="Tax" value={taxAmount} readOnly />
          </Grid>        
        </Grid>
      )
    })
  );
};

export default BillList;
