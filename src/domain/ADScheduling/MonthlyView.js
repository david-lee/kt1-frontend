import React, { useEffect, useState } from 'react';
import { addYears, compareAsc, eachMonthOfInterval, endOfMonth, format, isAfter, isBefore, isSameDay, endOfYear, startOfYear } from 'date-fns';
import { Box, Button, Checkbox, Chip, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import { calculateTax, calculateTaxWithTaxIncluded, removeCommas } from 'shared/utils';
import Dropdown from 'shared/components/Dropdown';
import CompanySearch from 'shared/components/CompanySearch';
import ADDate from 'shared/components/ADDate';
import ADPage from 'shared/components/ADPage';
import ADPrice from 'shared/components/ADPrice';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import api from 'appConfig/restAPIs';
import { adTypeCode, UI_DATE_FORMAT, DATA_DATE_FORMAT, roleType } from 'data/constants';
import { cadTitles } from 'data/adOptions';
import ADType from './ADType';
import ADTypeSize from './ADTypeSize';
import BillList from './MonthlyBillList';

const MonthlyView = () => {
  const curDate = new Date(); 

  const [isSave, setIsSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adType, setAdType] = useState('');
  const [size, setSize] = useState();
  const [stDate, setStDate] = useState(curDate);
  const [edDate, setEdDate] = useState(endOfMonth(curDate));
  const [bills, setBills] = useState([]);
  const [randomSelectedDates, setRandomSelectedDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRandom, setIsRandom] = useState(false);
  const [price, setPrice] = useState(null);
  const [tax, setTax] = useState(null);
  const [total, setTotal] = useState('');
  const [colorChecked, setColor] = useState(true);
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [cardPayment, setCardPayment] = useState(false);
  const [cadTitle, setCadTitle] = useState('');
  const { user: { role, userId } } = useUserAuth();
  const isDirector = role === roleType.director;

  const handleDateChange = (type, value) => {
    if (type === 'start') setStDate(value);
    if (type === 'end') setEdDate(value);
  };

  const handlePrice = (e) => setPrice(e.target.value);

  const handleSize = (e) => setSize(e.target.value);

  const handleDeleteDate = (date) => {
    const newDates = randomSelectedDates.filter(saved => saved !== date);
    setRandomSelectedDates(newDates);
  }

  const resetSchedule = (() => {
    resetOptions();
    setAdType('');
  });

  const resetOptions = (changedAdType) => {
    setIsRandom(false);
    setPage('');
    setBills([]);
    setPrice('');
    setSize('');
    setTax('');
    setAdTitle('');
    setCadTitle('');
    setErrorMessage('');
    setTaxIncluded(false);
    setColor(true);
    setRandomSelectedDates([]);
   
    if (changedAdType === adTypeCode.bd) {
      const nextYear = addYears(curDate, 1);

      setStDate(startOfYear(nextYear));
      setEdDate(endOfYear(nextYear));
    } else {
      setStDate(curDate);
      setEdDate(endOfMonth(curDate));
    }
  };

  const handleRandomDateChange = (selectedDate) => {
    if (isAfter(selectedDate, edDate) || isBefore(selectedDate, stDate)) {
      setErrorMessage(`Please select a date between ${format(stDate, UI_DATE_FORMAT)} and ${format(edDate, UI_DATE_FORMAT)}`);
      return;
    }

    const fmtDate = format(selectedDate, DATA_DATE_FORMAT);
    const dupDate = randomSelectedDates.find(saved => saved === fmtDate);

    if (!dupDate) setRandomSelectedDates([...randomSelectedDates, fmtDate]);
  };

  const handleBlurOnCost = () => {
    if (!price) return;

    const calculated = calculateTax(price, taxIncluded);

    setTax(calculated.tax);
    taxIncluded && setPrice(calculated.cost);
  };

  const handleTaxIncluded = (e) => {
    const taxIncluded = e.target.checked;
    
    if (!price) return;

    setTaxIncluded(taxIncluded);
    const { cost: newCost, tax: newTax } = calculateTaxWithTaxIncluded(price, tax, taxIncluded);

    setPrice(newCost);
    setTax(newTax);
  };

  const scheduleHandler = () => {
    let data;

    if (adType !== adTypeCode.bd) {
      const common = {
        userId: userId,
        companyId: selectedCompany.userId,
        adType: Number(adType),
        page: page.toUpperCase(),
        size,
        color: colorChecked ? 1 : 0,
        adTitle,
        cadTitle,
        cardPayment: cardPayment ? 1 : 0,
        // it is true all the time for CAD
        webFlag: 1 // webChecked ? 1 : 0,
      };

      const formattedBills = bills.map(bill => {
        return { 
          ...bill,
          startDate: format(bill.startDate, DATA_DATE_FORMAT),
          endDate: format(bill.endDate, DATA_DATE_FORMAT)
        };
      });

      data = { common, bills: formattedBills, days: randomSelectedDates }
      // send common, bills and selectedDates for random
    } else {
      data = {
        startDate: format(stDate, DATA_DATE_FORMAT),
        endDate: format(edDate, DATA_DATE_FORMAT),
        userId: userId,
        companyId: selectedCompany.userId,
        adTitle,
        adType: Number(adType),
        size,
        color: colorChecked ? 1 : 0,
        cost: Number(price),
        taxAmount: tax,
      }
    }

    setIsLoading(true);

    axios.post(
      api[adType === adTypeCode.bd ? "createAdOnetime" : (isRandom ? "createAdRandom" : "createAdFixed")],
      {...data}
    )
      .then((resp) => {
        resetSchedule();
      })
      .catch((e) => { console.log('Error on saving monthly view', e); })
      .finally(() => {
        setIsSave(false); 
        setIsLoading(false);
      });
  };

  const createBills = () => {
    const beforeDate = isBefore(stDate, edDate);
    const sameDay = isSameDay(stDate, edDate);
    const invalid = !beforeDate || sameDay;

    invalid && setErrorMessage("Please check the start and end date.");

    const eachMonth = eachMonthOfInterval({ start: stDate, end: edDate });

    const bills = eachMonth.map((month, index) => {
      const cost = Number(removeCommas(price));
      const taxAmount = Number(removeCommas(tax));
      const total = cost + taxAmount;     
      const bill = {
        startDate: index === 0 ? stDate : month,
        endDate: index === eachMonth.length - 1 ? edDate : endOfMonth(month),
        cost,
        taxAmount,
        total
      }

      return bill;
    });

    !invalid && setBills(bills);
  };

  const handleAdTypeChange = (e) => {
    setAdType(e.target.value);
    resetOptions(e.target.value);
  }

  useEffect(() => {
    if (price) setTotal(Number(removeCommas(price)) + +tax)
  }, [tax]);

  return (
    <>
      <SnackbarMessage errorMessage={errorMessage} onClose={() => setErrorMessage('')} />

      <ConfirmDialog open={isSave}
        title="Save Bills"
        message="Do you want to save bills?" 
        isLoading={isLoading} onOK={scheduleHandler} 
        onCancel={() => setIsSave(false)} onClose={() => setIsSave(false)} 
      />
      
      <CompanySearch onSelectCompany={setSelectedCompany} onReset={resetSchedule} />

      {selectedCompany && (
        <Box sx={{ pt: 6, px: 40, width: "100%" }}>
          <Grid container alignItems="center">
            <ADType value={adType} onChange={handleAdTypeChange} />

            <ADDate label="Start Date"
              value={stDate}
              disabled={!adType}
              onChange={newValue => { handleDateChange('start', newValue) }}
            />
            <ADDate label="End Date"
              value={edDate}
              disabled={!adType}
              onChange={newValue => { handleDateChange('end', newValue) }}
            />
          
            {adType === adTypeCode.dad && (
              <>
                <FormGroup sx={{ mr: 4 }}>
                  <FormControlLabel control={
                    <Checkbox size="small" checked={isRandom} disabled={!bills?.length}
                      onChange={(e) => {
                        setIsRandom(e.target.checked); 
                        if (!e.target.checked) setRandomSelectedDates([]);
                      }} 
                    />}
                    label="Random" sx={{ position: "relative", top: "10px", mx: 0 }} />
                </FormGroup>
                
                {isRandom && (
                  <ADDate label="AD Dates" closeOnSelect={false} onChange={(newValue) => handleRandomDateChange(newValue)} disabled={!bills.length} />
                )}
              </>
            )}
          </Grid>

          {adType && (
            <Grid container alignItems="center" columnGap={2} flexWrap="nowrap">
              <Grid item xs={4}>
                <TextField
                  id="add-memo"
                  label="AD description"
                  fullWidth
                  variant='standard'
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                />
              </Grid>
              {adType !== adTypeCode.bd && (
                <Grid item xs={1}>
                  <ADPage value={page} onChange={(e) => setPage(e.target.value)} sx={{ width: "100%" }} />
                </Grid>
              )}
              <Grid item xs={1}>
                <ADTypeSize type={adType} width="100%" value={size} onChange={handleSize} noNone />
              </Grid>
              {adType === adTypeCode.cad && (
                <Grid item xs={1}>
                  <Dropdown label="Title" noNone options={cadTitles} value={cadTitle} onChange={e => setCadTitle(e.target.value)} />
                </Grid>
              )}
              <Grid item xs={1}>
                <ADPrice id="price" label="Price" onChange={handlePrice} onBlur={handleBlurOnCost} value={price} />
              </Grid>
              <Grid item xs={1}>
                <ADPrice id="tax" label="Tax" value={tax} />
              </Grid>
              <Grid item xs={1}>
                <ADPrice label="Total" value={total} readOnly />
              </Grid>              
              <Grid item sx={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox size="small" checked={taxIncluded} onChange={handleTaxIncluded} />}
                    label="Tax Included" labelPlacement="top" sx={{ mx: 0 }} />
                </FormGroup>
              </Grid>
              <Grid item sx={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox size="small" checked={cardPayment} onChange={(e) => setCardPayment(e.target.checked)} />}
                    label="Card Pay" labelPlacement="top" sx={{ mx: 0 }} />
                </FormGroup>
              </Grid>              
              <Grid item sx={1}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={colorChecked} onChange={(e) => setColor(e.target.checked)} />}
                    label="Color" labelPlacement="top" sx={{ mx: 0 }}
                  />
                </FormGroup>
              </Grid>
            </Grid>
          )}

          {adType !== adTypeCode.bd && (
            <>
              <Grid container justifyContent="flex-end" alignItems="center" columnGap={2} sx={{ mt: 3 }}>
                <Button disabled={!(adType && price && tax && size)} onClick={createBills}
                  startIcon={<ReceiptLongIcon />} variant="contained"
                >
                  Review Bills
                </Button>

                <Button startIcon={<RestartAltIcon />} variant="outlined" onClick={resetSchedule}>Reset</Button>
              </Grid>

              <Grid container alignItems="center" rowGap={1} sx={{ mt: 5 }}>
                <BillList {...{ bills, taxIncluded }} onPriceChange={setBills} />

                {randomSelectedDates?.length > 0 && (
                  <Grid container alignItems="center" columnGap={1} rowGap={2} sx={{ mt: 4, mb: 4 }}>
                    {randomSelectedDates.sort((a, b) => 
                      compareAsc(new Date(a), new Date(b))).map(date => 
                        <Chip key={date} onDelete={() => handleDeleteDate(date)} label={date} />
                    )}
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {(!isDirector && (adType === adTypeCode.bd || bills.length > 0)) && (
            <Grid container justifyContent="center" alignItems="center" columnGap={2} sx={{ mt: 3 }}>
              <Button disabled={!(adType && price) || (isRandom && !randomSelectedDates?.length)}
                startIcon={<SaveIcon />} variant="contained" 
                onClick={() => setIsSave(true)} 
              >
                Save
              </Button>
            </Grid>
          )}            
        </Box>
      )}
    </>
  );
}

export default MonthlyView;
