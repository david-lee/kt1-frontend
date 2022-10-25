import React, { useEffect, useState } from 'react';
import { Button, Grid, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AddressInfo from './AddressInfo';
import { DEFAULT_ADDRESS } from 'data/constants';
import { useUserAuth } from 'shared/contexts/UserAuthContext';

const AddressContainer = ({ company }) => {
  let fmk;
  const companyId = company.userId;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { canDo } = useUserAuth();
  const { canEdit } = canDo(company);

  const handleCancel = () => {
    setIsEdit(false);
    fmk.resetForm();
  };

  const saveAddress = (values) => {
    let addressData =  Object.values({ ...values.addresses });

    setIsLoading(true);
  
    axios[isNew ? "post" : "put"](api.address, addressData)
      .then(() => {
        setMessage("Successfully saved!");
      })
      .catch((e) => {
        setMessage("Error in saving: ", e?.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEdit(false);
      });
  };  
  
  const handleCloseSnackbar = (e, reason) => {
    if (reason !== 'clickaway') {
      setMessage('');
    }
  }

  useEffect(() => {
    axios.get(`${api.address}?userId=${companyId}`)
      .then((resp) => {
        // TODO: remove if it returns only active ones
        const result = resp.data.filter(addr => addr.status);

        if (result.length) {
          fmk.resetForm({values: { addresses: result }});
        } 
        else {
          setIsNew(true);
        }
      })
      .finally();
  }, [company]);

  fmk = useFormik({
    initialValues: { 
      addresses: [{ addressType: 1, ...DEFAULT_ADDRESS, customerId: companyId }, { addressType: 2, ...DEFAULT_ADDRESS, customerId: companyId }], 
      sameAddress: false 
    },
    onSubmit: saveAddress,
  });

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        open={!!message}
        onClose={handleCloseSnackbar}
      >
        <Alert severity='success'>{message}</Alert>
      </Snackbar>

      <Grid container direction="column" rowGap={5} columnGap={3} wrap="nowrap" sx={{ width: '95%', margin: "0 auto", mt: 10 }} >
        <AddressInfo {...{ 
          values: fmk.values, handleChange: fmk.handleChange, setFieldValue: fmk.setFieldValue, editMode: isEdit 
        }} />

        <Grid container columnGap={5} alignItems="center">
          {!isEdit && <Button startIcon={<EditIcon />} onClick={() => setIsEdit(true)} variant="contained" disabled={!canEdit}>
            Edit Address
          </Button>}
          {isEdit && (
            <>
              <LoadingButton startIcon={<SaveIcon />} onClick={fmk.handleSubmit} variant="contained" disabled={isLoading}>Save</LoadingButton>
              <Button startIcon={<ClearIcon />} onClick={handleCancel} variant="outlined">Cancel</Button>
            </>
          )}
        </Grid>  
      </Grid> 
    </>)
}

export default AddressContainer;
