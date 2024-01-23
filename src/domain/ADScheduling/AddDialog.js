import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormGroup, FormControlLabel, Grid, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import CompanySearch from 'shared/components/CompanySearch';
import ADTypeSize from './ADTypeSize';
import ADPrice from 'shared/components/ADPrice';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { calculateTax, calculateTaxWithTaxIncluded, removeCommas } from 'shared/utils';
import { format } from 'date-fns';
import { DATA_DATE_FORMAT } from 'data/constants';
import api from 'appConfig/restAPIs';

const AddDialog = ({isOpen, onClose, onSaved, onError, adDate, page, adType}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const [total, setTotal] = useState('');
  const [size, setSize] = useState('');
  const [colorChecked, setColor] = useState(true);
  const [cardPayChecked, setCardPay] = useState(false);
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { user } = useUserAuth();

  const handlePrice = (e) => {
    setPrice(e.target.value);
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

  const handleClose = () => {
    onClose();
  };

  const handleSize = (e) => {
    setSize(e.target.value);
  }

  const handleSchedule = () => {
    const data = {
      startDate: format(adDate, DATA_DATE_FORMAT),
      endDate: format(adDate, DATA_DATE_FORMAT),
      userId: user.userId,
      companyId: selectedCompany.userId,
      adType: Number(adType),
      page,
      size,
      cardPayment: cardPayChecked,
      color: colorChecked,
      cost: price,
      taxAmount: tax,
      adTitle,
    };

    axios.post(api.createAdOnetime, {...data})
      .then(() => {
        onSaved();
      })
      .catch((e) => {
        onError(e);
      })
      .finally(() => {
        setIsLoading(false);
        handleClose();      
      });
  }

  useEffect(() => {
    if (price) setTotal(Number(removeCommas(price)) + +tax)
  }, [tax]);

  return (
    <Dialog open={isOpen} onClose={handleClose}
      sx={{ "& .MuiPaper-root": { minWidth: 800, minHeight: 280 }}}
    >
      <DialogTitle>Page: {page}</DialogTitle>
      
      <DialogContent>
        <CompanySearch onSelectCompany={setSelectedCompany} variant="dialog" />
    
        {selectedCompany && (
          <Grid container alignItems="center" columnGap={3} flexWrap="nowrap" sx={{ mt: 3 }}>
            <Grid item xs={3}>
              <TextField
                id="add-memo"
                label="AD description"
                fullWidth
                value={adTitle}
                onChange={e => setAdTitle(e.target.value)}
                variant='standard'
              />
            </Grid>
            <Grid item xs={1}>
              <ADTypeSize type={adType} width="100%" value={size} onChange={handleSize} noNone pageView />
            </Grid>
            <Grid item xs={1}>
              <ADPrice id="price" label="Price" onChange={handlePrice} onBlur={handleBlurOnCost} value={price} />
            </Grid>
            <Grid item xs={1}>
              <ADPrice label="Tax" value={tax} readOnly />
            </Grid>
            <Grid item xs={1}>
              <ADPrice label="Total" value={total} readOnly />
            </Grid>
            <Grid item sx={2}>
              <FormGroup>
                <FormControlLabel control={<Checkbox size="small" checked={taxIncluded} onChange={handleTaxIncluded} />}
                  label="Tax Included" labelPlacement="top" sx={{ position: "relative", top: "10px", mx: 0 }} />
              </FormGroup>
            </Grid>
            <Grid item xs={1}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" checked={cardPayChecked} onChange={e => setCardPay(e.target.checked)} />} 
                  label="Card" labelPlacement='top' sx={{ position: "relative", top: "10px", ml: 0 }}
                />
              </FormGroup>
            </Grid>       
            <Grid item xs={1}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" checked={colorChecked} onChange={e => setColor(e.target.checked)} />} 
                  label="Color" labelPlacement='top' sx={{ position: "relative", top: "10px", ml: 0 }}
                />
              </FormGroup>
            </Grid>             
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleSchedule}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isLoading || !selectedCompany || !price || price < 0 || !size}
        >
          Save
        </Button>
        <Button startIcon={<ClearIcon />} onClick={handleClose} disabled={isLoading} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDialog;
