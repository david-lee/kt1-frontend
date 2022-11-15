import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CompanyInfo from './CompanyInfo';
import { useFormik } from 'formik';
import AddressInfo from './AddressInfo';
import { LoadingButton } from '@mui/lab';
import { companyStatus, DEFAULT_ADDRESS } from 'data/constants';
import api from 'appConfig/restAPIs';
import * as Yup from 'yup';
import axios from 'axios';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import path from 'data/routes';

const AddNewCompany = () => {
  let fmk;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    fmk.resetForm();
    setIsOpen(false);
    setIsLoading(false);
  }

  const handleSave = (values) => {
    let addressData;
    let company = {};

    setIsLoading(true);
    
    // extract company related data
    Object.entries(values).forEach(data => {
      if (data[0] !== 'addresses' || data[0] !== 'sameAddress') {
        company[data[0]] = data[1];
      }
    });

    company = { ...company, userType: 16, regBy: user.userId }

    axios.post(api.createCompany, { ...company })
      .then(({ data }) => (data.customerId))
      .then((customerId) => {
        addressData =  Object.values({ ...values.addresses });

        if(values.sameAddress) {
          addressData = [{ ...addressData[0], customerId }, { ...addressData[0], addressType: 2, customerId }];
        } else {
          addressData = addressData.map(addr => ({ ...addr, customerId }));
        }
        
        return axios.post(api.address, addressData)
      })
      .then((company) => {
        console.log("Address saved...");
        navigate(`/s/${path.advertiser}/${company.data}/0`);
      })
      .catch((e) => {
        console.log("Error on saving company: ", e);
      })
      .finally(() => {
        setIsLoading(false);
        setIsOpen(false);
      });
  }

  fmk = useFormik({
    validationSchema: Yup.object().shape({
      mainCategory: Yup.number().required("Required"),
      primaryName: Yup.string().required("Required"),
      salesId: Yup.string().required("Required"),
      email: Yup.string().when('eInvoice', {
        is: true,
        then: (schema) => schema.required("Required if eInvoice is checked")
      }),
    }),
    initialValues: {
      addresses: [{ addressType: 1, ...DEFAULT_ADDRESS  }, { addressType: 2, ...DEFAULT_ADDRESS  }],
      mainCategory: '',subCategory: '', salesId: '', primaryName: '', secondaryName: '', status: companyStatus.confirmed,
      ownerName: '', phoneNumber: '', email: '', contactName: '', contactNumber: '', contactEmail: '', eInvoice: false,
      sameAddress: false,
    },
    onSubmit: handleSave,
    enableReinitialize: true,
  });

  return (
    <>
      {isOpen &&
        <Dialog open={isOpen} onClose={handleClose} 
          sx={{ "& .MuiPaper-root": { maxWidth: 1000, minWidth: 600, minHeight: 340 }}}>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogContent>
            <CompanyInfo {
              ...{ values: fmk.values, handleChange: fmk.handleChange, setFieldValue: fmk.setFieldValue, editMode: true, isNew: true }}
            />
            <Grid container direction="column" rowGap={5} columnGap={3} wrap="nowrap" sx={{ mt: 5 }}>
              <AddressInfo 
                {...{ values: fmk.values, handleChange: fmk.handleChange, setFieldValue: fmk.setFieldValue, editMode: true }} 
              />
            </Grid>
          </DialogContent>

          <DialogActions>
            <LoadingButton startIcon={<SaveIcon />} onClick={fmk.handleSubmit} variant="contained" disabled={isLoading || !fmk.isValid}>Save</LoadingButton>
            <Button startIcon={<ClearIcon />} onClick={handleCancel} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>
      }
      <Button startIcon={<AddBusinessIcon />} variant="contained" onClick={() => setIsOpen(true)}>New company</Button>
    </>
  );
};

export default AddNewCompany;
