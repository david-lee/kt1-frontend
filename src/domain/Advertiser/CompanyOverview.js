import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Grid, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import * as Yup from 'yup';
import api from 'appConfig/restAPIs';
import CompanyInfo from './CompanyInfo';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { companyStatus } from 'data/constants';

const CompanyOverview = ({ company, onSave }) => {
  let fmk;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isError, setIsError] = useState(false);
  const { user: { userId }, canDo } = useUserAuth();
  const { canEdit, canDelete } = canDo(company);

  const handleCancel = () => {
    setIsEdit(false);
    fmk.resetForm();
  };

  const saveInfo = (values) => {
    const data = {
      ...values,
      userType: 16, // company
      updatedBy: userId,
      status: isDelete ? companyStatus.deleted : companyStatus.confirmed,
    };

    setIsLoading(true);

    axios.put(`${api.updateUser}?companyId=${company.userId}`, {...data})
      .then(() => {
        setMessage("Successfully saved!");
        onSave && onSave(company.userId, isDelete);
      })
      .catch((e) => {
        setIsError(true);
        setMessage(`Save error: ${e?.message}`);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEdit(false);
        setIsDelete(false);
      });
  }

  const handleCloseSnackbar = (e, reason) => {
    if (reason !== 'clickaway') {
      setMessage('');
      setIsError(false);
    }
  }

  fmk = useFormik({
    validationSchema: Yup.object().shape({
      mainCategory: Yup.number().required("Required"),
      primaryName: Yup.string().required("Required"),
      email: Yup.string().when('eInvoice', {
        is: true,
        then: (schema) => schema.required("Required if eInvoice is checked")
      }),
    }),    
    initialValues: {
      ...company, 
      salesId: company.salesPerson.value, 
      mainCategory: company.mainCategory.value, 
      subCategory: company.subCategory.value,
      status: company.status.value,
      sameAddress: false
    },
    onSubmit: saveInfo,
    enableReinitialize: true,
  });

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        open={!!message}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={`${isError ? 'error' : 'success'}`}>{message}</Alert>
      </Snackbar>

      <ConfirmDialog open={isDelete} 
        title="Delete Company"
        message="Do you really want to delete this company? It will change the status to inactive."
        isLoading={isLoading} deleteOp
        onOK={fmk.handleSubmit}
        onCancel={() => setIsDelete(false)}
        onClose={() => setIsDelete(false)}
      />

      <Grid sx={{ width: '95%', margin: "0 auto" }} container rowGap={5} direction='column'>
        <CompanyInfo {...{ 
          values: fmk.values, handleChange: fmk.handleChange, setFieldValue: fmk.setFieldValue, 
          editMode: isEdit, isNew: false 
        }} />

        <Grid container justifyContent="space-between" alignItems="center">
          {!isEdit && (
            <>
              <Button startIcon={<EditIcon />} onClick={() => setIsEdit(true)} variant="contained" disabled={!canEdit}>
                Edit Info
              </Button>
              <Button startIcon={<GroupRemoveIcon />} onClick={() => setIsDelete(true)} variant="outlined" disabled={!canDelete}>
                Delete Company
              </Button>
            </>
          )}
          {isEdit && (
            <Grid container item alignItems="center" columnGap={5}>
              <LoadingButton startIcon={<SaveIcon />} onClick={fmk.handleSubmit} variant="contained" loading={isLoading} disabled={isLoading || !fmk.isValid}>
                Save
              </LoadingButton>
              <Button startIcon={<ClearIcon />} onClick={handleCancel} disabled={isLoading} variant="outlined">Cancel</Button>
            </Grid>
          )}
        </Grid>      
      </Grid>
    </>
  );
};

export default CompanyOverview;
