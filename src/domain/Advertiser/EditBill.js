import React, { useState, useEffect } from 'react';
// import { format, isAfter, isBefore, isSameDay, parse, parseISO } from 'date-fns';
import { Button, Grid, Checkbox, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel } from "@mui/material";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { styled } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
// import EditIcon from '@mui/icons-material/Edit';
// import ADDate from 'shared/components/ADDate';
import ADPrice from 'shared/components/ADPrice';
import { cadTitles } from 'data/adOptions';
import { calculateTax, precisionRound, removeCommas, calculateTaxWithTaxIncluded } from 'shared/utils';
// import { numberWithCommas, precisionRound } from 'shared/utils';
import Dropdown from 'shared/components/Dropdown';
import ADTypeSize from '../ADScheduling/ADTypeSize';
import useSales from 'shared/hooks/useSales';
import { useUserAuth } from 'shared/contexts/UserAuthContext';

const OptionCheck = ({ checked, label, onChange, sx }) => {
  return (
    <FormGroup>
      <FormControlLabel label={label}
        control={<Checkbox size="small" checked={checked} onChange={onChange} />}
        labelPlacement="top" sx={{ "& .MuiFormControlLabel-label": { fontSize: 11 }, mx: 0, ...sx }}
      />
    </FormGroup>    
  );
};

const EditBill = ({gridApi, selectedNode: bill, onSaved, onClose}) => {
  // const [bill, setBill] = useState({});
  const [adTitle, setAdTitle] = useState(bill.adTitle);
  const [cadTitle, setCadTitle] = useState(bill.cadTitleCode);
  const [page, setPage] = useState(bill.page);
  const [size, setSize] = useState(bill.sizeCode);
  // const [startDate, setStartDate] = useState(() => parse(bill.startDate, 'yyyyMMdd', new Date()));
  // const [endDate, setEndDate] = useState(() => parse(bill.endDate, 'yyyyMMdd', new Date()));
  const [cost, setCost] = useState(bill.cost);
  const [tax, setTax] = useState(bill.taxAmount);
  const [total, setTotal] = useState('');
  const [color, setColor] = useState(bill.color);
  const [cardPayment, setCardPayment] = useState(bill.cardPayment);
  const [taxIncluded, setTaxIncluded] = useState(false);
  const { user } = useUserAuth();

  const { isLoading, updateAD } = useSales();

  const handleBlurOnCost = () => {
    if (!cost) return;

    const calculated = calculateTax(cost, taxIncluded);

    setTax(calculated.tax);
    taxIncluded && setCost(calculated.cost);
  };

  const handleTaxIncluded = (e) => {
    const taxIncluded = e.target.checked;
    
    setTaxIncluded(taxIncluded);
    const { cost: newCost, tax: newTax } = calculateTaxWithTaxIncluded(cost, tax, taxIncluded);

    setCost(newCost);
    setTax(newTax);
  };

  const saveChanges = async () => {
    const data = { 
      adId: bill.adId, 
      companyId: bill.companyId, 
      adTitle, 
      cadTitle: cadTitle === -1 ? "" : cadTitle, 
      page, 
      size, 
      cost: Number(removeCommas(cost)), 
      taxAmount: tax, 
      color, 
      cardPayment,
      updatedBy: user.userId };

    await updateAD(data);
    onSaved();
  };

  useEffect(() => {
    if (cost) setTotal(precisionRound(Number(removeCommas(cost)) + +tax))
  }, [tax]);

  return (
    <Dialog
      open={true}
      onClose={() => onClose()}
      sx={{ "& .MuiPaper-root": { minWidth: 500, minHeight: 200 }}}
    >
      <DialogTitle>Edit Bill - {bill.adId}</DialogTitle>

      <DialogContent>
        <Grid container columnGap={1} wrap="nowrap" sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField label="AD Title" variant="standard" fullWidth
              value={adTitle} onChange={(e) => setAdTitle(e.target.value)}
            />
          </Grid>
          {/* 
          <Grid item>
            <ADDate label="Start Date"
              onChange={(value) => {
                if (isAfter(value, endDate)) {
                  // setErrorMessage("paidDate can't be future date!");
                  alert("cannot be after the end date");
                } else {
                  setStartDate(value);
                }
              }}
              width="120px" sx={{ my: 0 }}
              value={startDate}
            />                  
          </Grid>
          <Grid item>
            <ADDate label="End Date"
              onChange={(value) => {
                if (isBefore(value, startDate)) {
                  // setErrorMessage("paidDate can't be future date!");
                  alert("cannot be before the start date");
                } else {
                  setEndDate(value);
                }
              }}
              width="120px" sx={{ my: 0 }}
              value={endDate}
            />                  
          </Grid>  
          */}
        </Grid>

        <Grid container columnGap={3} wrap="nowrap">
          <Grid item xs={1}>
            <TextField label="Page" value={page} variant="standard" onChange={e => setPage(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            {/* <TextField label="Size" value={size} 
              variant="standard"
            /> */}
            <ADTypeSize type={bill.adTypeCode} width="100%" value={size} onChange={(e) => setSize(e.target.value)} noNone />            
          </Grid>
          {bill.adType === "CAD" && (
            <Grid item xs={2}>
              <Dropdown label="CAD Title" options={cadTitles} noNone fullWidth
                value={cadTitle} onChange={e => setCadTitle(e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <ADPrice label="Cost" value={cost} onChange={e => setCost(e.target.value)} onBlur={handleBlurOnCost} />
          </Grid>
          <Grid item xs={2}>
            <ADPrice label="Tax" value={tax} readOnly />
          </Grid>
          <Grid item xs={2}>
            <ADPrice label="Total" value={total} readOnly />
          </Grid>  
        </Grid>

        <Grid container wrap="nowrap" sx={{ mt: 4 }}>
          <Grid item xs={2}>
            <OptionCheck label="Tax Included" checked={taxIncluded} onChange={handleTaxIncluded} />
          </Grid>
          <Grid item xs={2}>
            <OptionCheck label="Card Pay" checked={cardPayment} onChange={e => setCardPayment(e.target.checked)} />
          </Grid>
          <Grid item xs={2}>
            <OptionCheck label="Color" checked={color} onChange={e => setColor(e.target.checked)} />
          </Grid>          
        </Grid>
      </DialogContent>

      <DialogActions>
        <LoadingButton loading={isLoading} startIcon={<SaveIcon />} variant="contained"
          onClick={saveChanges}
        >
          Save
        </LoadingButton>
        <Button startIcon={<ClearIcon />} onClick={() => onClose()} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBill;
