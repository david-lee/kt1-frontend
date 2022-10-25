import React, { useState } from 'react';
import { Alert, Grid, TextField, Snackbar } from "@mui/material";
import { formatUIDate, removeCommas } from 'shared/utils';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ADPrice from 'shared/components/ADPrice';
import Dropdown from 'shared/components/Dropdown';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { numberWithCommas, precisionRound } from 'shared/utils';
import { payBy } from 'data/adOptions';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { roleType } from 'data/constants';
import { isAfter } from 'date-fns';

const BillList = ({ fmk, isLoading }) => {
  const { user: { role }} = useUserAuth();
  const [isSave, setIsSave] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // validate paid cost and tax
  const calculatePaidAmount = (e, index) => {
    const { paidTotal, outstandingCost, outstandingTax } = fmk.values.bills[index];

    if (!paidTotal) return false;

    const numTotal = removeCommas(paidTotal);
    const numCost = removeCommas(outstandingCost);
    const numTax = removeCommas(outstandingTax);

    if (numTotal > numCost + numTax) {
      setErrorMessage("paidTotal shouldn't be greater than sum of outstanding cost and tax!");
      return false;
    }

    let amountPortion = precisionRound(numTotal / 1.13);
    let taxPortion = precisionRound(numTotal - amountPortion);  

    // if paid total is the same as the sum of outstanding cost and tax then use outstanding cost and tax
    if (numTotal === numCost + numTax) {
      amountPortion = outstandingCost;
      taxPortion = outstandingTax;
    }

    setTimeout(() => {
      fmk.setFieldValue(`bills.${index}.paidCost`, precisionRound(amountPortion));
      fmk.setFieldValue(`bills.${index}.paidTax`, taxPortion);
    }, 1);
  }

  const handleCloseSnackbar = (e, reason) => {
    if (reason !== 'clickaway') {
      setErrorMessage('');
    }
  }

  const handleSave = () => {
    const paidBill = fmk.values.bills.filter(bill => bill.paidCost > 0 && bill.paidTax > 0 && bill.paidDate && bill.method);

    if (!paidBill.length) {
      setIsSave(false);
      setErrorMessage("Please make sure paidCost, paidTax, paidDate and method entered!");
    } else {
      fmk.handleSubmit();
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        open={!!errorMessage}
        onClose={handleCloseSnackbar}
      >
        <Alert severity='error'>{errorMessage}</Alert>
      </Snackbar>

      <ConfirmDialog open={isSave} title="Save Payment" message="Do you want to save payment?" 
        isLoading={isLoading} onOK={handleSave} onCancel={() => setIsSave(false)} onClose={() => setIsSave(false)} 
      />

      {fmk.values.bills.map(( 
        { billId, startDate, endDate, adType, cost, taxAmount, outstandingCost, outstandingTax, paidTotal, paidCost, paidTax, paidDate, method },
        index
        ) => {
        return (
          <Grid container item columnGap={3} wrap="nowrap">
            <Grid item>
              <TextField label="Bill No" name={`bills.${index}.billId`} value={billId}
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="AD Type" name={`bills.${index}.adType`} value={adType} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="Start Date" name={`bills.${index}.startDate`} value={formatUIDate(startDate)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="End Date" name={`bills.${index}.endDate`} value={formatUIDate(endDate)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="Cost" name={`bills.${index}.cost`} 
                value={numberWithCommas(cost)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="Tax" name={`bills.${index}.taxAmount`}
                value={numberWithCommas(taxAmount)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="Outstanding Cost" name={`bills.${index}.outstandingCost`} 
                value={numberWithCommas(outstandingCost)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <TextField label="Outstanding Tax" name={`bills.${index}.outstandingTax`}
                value={numberWithCommas(outstandingTax)} 
                variant="standard" InputProps={{ readOnly: true }} disabled
              />
            </Grid>
            <Grid item>
              <ADPrice label="Paid Total" name={`bills.${index}.paidTotal`} value={paidTotal}
                variant="standard" onChange={fmk.handleChange} onBlur={(e) => calculatePaidAmount(e, index)}
              />
            </Grid>
            <Grid item>
              <ADPrice label="Paid Cost *" name={`bills.${index}.paidCost`} value={paidCost}
                variant="standard" onChange={fmk.handleChange} InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item>
              <ADPrice label="Paid Tax *" name={`bills.${index}.paidTax`} value={paidTax} 
                variant="standard" onChange={fmk.handleChange} InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item>
              <DatePicker label="Payment Date *"
                onChange={(value) => {
                  if (isAfter(value, new Date())) {
                    setErrorMessage("paidDate can't be future date!");
                  } else {
                    fmk.setFieldValue(`bills.${index}.paidDate`, value);
                  }
                }}
                value={paidDate}
                // inputFormat={UI_DATE_FORMAT}
                renderInput={(params) => <TextField name={`bills.${index}.paidDate`} {...params} variant="standard" 
                  sx={{ my: 0, mr: 3, width: 150, "& input": { p: 1 } }} />}
              />                  
            </Grid>
            <Grid item>
              <Dropdown label="Paid method *" name={`bills.${index}.method`} value={method} 
                onChange={fmk.handleChange} 
                options={payBy}  
              />
            </Grid>
          </Grid>
        );
      })}

      {/* {fmk.errors.bills?.length && (
        <Grid container direction="column" rowGap={2}>
        {
          fmk.errors.bills.map((errors) => {
            return errors && Object.keys(errors).map((key) => <Typography color="error">{errors[key]}</Typography>);
          })
        }
        </Grid>
      )} */}
      
      {role !== roleType.director && (
        <Grid container justifyContent="center" columnGap={4}>
          <LoadingButton variant="contained" onClick={() => setIsSave(true)} disabled={isLoading || !fmk.isValid}>
            Save
          </LoadingButton>

          {/* <Button variant="outlined" onClick={handleDone}>Done</Button> */}
        </Grid>
      )}
    </>
  );
};

export default BillList;
