import React, { useEffect, useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Grid, TextField } from '@mui/material';
import { formatUIDate } from 'shared/utils';
import Dropdown from 'shared/components/Dropdown';
import { mainCategories } from 'data/adOptions';
import useCode from 'shared/hooks/useCode';
import { useAppContext } from 'shared/contexts/AppContext';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { roleType } from 'data/constants';

const CompanyInfo = ({ values, handleChange, setFieldValue, editMode, isNew }) => {
  const { mainCategory, subCategory, salesId, primaryName, secondaryName, userId, oldCustomerId = "", ownerName, 
    phoneNumber, email, contactName, contactNumber, contactEmail, regDate, updatedDate, updatedBy, eInvoice, bulkInvoice, randomList, eReceipt, bulkReceipt, status } = values;

  const { user: { userId: loginUserId, role } } = useUserAuth();
  const [subCategories, setSubCategories] = useState([]);
  const [{ salesPeople }] = useAppContext();
  const { getSubCategory } = useCode();

  useEffect(() => {
    // if staff adds a company then salesId will be set to loginUserId
    if (isNew && role === roleType.staff) setFieldValue('salesId', loginUserId);
  }, []);

  useEffect(() => {
    if (typeof mainCategory === 'number' && mainCategory) {
      getSubCategory(mainCategory)
        .then((data) => {
          setSubCategories(data.data);
          setFieldValue('subCategory', subCategory);
        }
      );
    } else {
      setFieldValue('subCategory', -1);
    }
  }, [mainCategory, subCategory, getSubCategory]);

  return (
    <Grid container rowGap={4} direction='column' sx={{ mb: isNew ? 5 : 0 }}>
      <Grid container columnGap={2} wrap="nowrap">
        <Grid item xs={3.5}>
          <Dropdown id="main-category" name="mainCategory" label="Main Category *" value={mainCategory}
            fullWidth onChange={handleChange} readOnly={!editMode}
            options={mainCategories}
          />          
        </Grid>
        <Grid item xs={2}>
          <Dropdown id="sub-category" name="subCategory" label="Sub Category" value={subCategory}
            fullWidth onChange={handleChange} readOnly={!editMode}
            options={subCategories}
          />        
        </Grid>
        <Grid item xs={1.2}>
          {role === roleType.staff && (
            <TextField label="Sales Person" name="salesId" value={salesId}
              variant="standard" InputProps={{ readOnly: !editMode }} disabled
              onChange={handleChange} sx={{ width: '100%' }}
            />
          )}
          {(role >= roleType.manager) && (
            <Dropdown id="sales-person" name="salesId" label="Sales Person *" value={salesId}
              fullWidth onChange={handleChange} readOnly={!editMode}
              options={salesPeople}
            />
          )}
        </Grid>
        <Grid item xs={1.2}>
          <FormGroup sx={{ mr: 4 }}>
            <FormControlLabel label="eInvoice" sx={{ position: "relative", top: "10px", mx: 0 }} 
              control={
                <Checkbox size="small" name="eInvoice" checked={eInvoice} onChange={editMode ? handleChange : undefined} />
              }/>
          </FormGroup>        
        </Grid>
        <Grid item xs={1.2}>
          <FormGroup sx={{ mr: 4 }}>
            <FormControlLabel label="BulkInvoice" sx={{ position: "relative", top: "10px", mx: 0 }} 
              control={
                <Checkbox size="small" name="bulkInvoice" checked={bulkInvoice} onChange={editMode ? handleChange : undefined} />
              }/>
          </FormGroup>        
        </Grid>
        <Grid item xs={1.2}>
          <FormGroup sx={{ mr: 4 }}>
            <FormControlLabel label="RandomList" sx={{ position: "relative", top: "10px", mx: 0 }} 
              control={
                <Checkbox size="small" name="randomList" checked={randomList} onChange={editMode ? handleChange : undefined} />
              }/>
          </FormGroup>        
        </Grid>
      </Grid>

      <Grid container columnGap={2} wrap="nowrap">
        <Grid item xs={3.5}>
          <TextField label="Company Name *" name="primaryName" value={primaryName}
            variant="standard" InputProps={{ readOnly: !editMode }} onChange={handleChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3.2}>
          <TextField label="Secondary Name" name="secondaryName" value={secondaryName}
            variant="standard" InputProps={{ readOnly: !editMode }} onChange={handleChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        {!isNew && (
          <>
            <Grid item xs={1.2}>
              <TextField label="Company ID" name="userId" value={userId} 
                variant="standard" disabled={editMode}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={1.2}>
              <TextField label="Old Company ID" name="oldCustomerId" value={oldCustomerId} 
                variant="standard" disabled={true}
              />
            </Grid>
          </>
        )}
        <Grid item xs={1.2}>
          <FormGroup sx={{ mr: 4 }}>
            <FormControlLabel label="eReceipt" sx={{ position: "relative", top: "10px", mx: 0 }} 
              control={
                <Checkbox size="small" name="eReceipt" checked={eReceipt} onChange={editMode ? handleChange : undefined} />
              }/>
          </FormGroup>        
        </Grid>
        <Grid item xs={1.2}>
          <FormGroup sx={{ mr: 4 }}>
            <FormControlLabel label="BulkReceipt" sx={{ position: "relative", top: "10px", mx: 0 }} 
              control={
                <Checkbox size="small" name="bulkReceipt" checked={bulkReceipt} onChange={editMode ? handleChange : undefined} />
              }/>
          </FormGroup>        
        </Grid>
      </Grid>

      <Grid container columnGap={2} wrap="nowrap">
        <Grid item xs={3}>
          <TextField label="Owner Name" name="ownerName" value={ownerName} 
            variant="standard" InputProps={{ readOnly: !editMode }}
            fullWidth onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField label="Owner Phone" name="phoneNumber" value={phoneNumber} 
            variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField label={`Invoice/Receipt Email ${eInvoice || eReceipt ? "*" : ""}`} name="email" value={email} 
            variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Grid container columnGap={2} wrap="nowrap">
        <Grid item xs={3}>
          <TextField label="Contact Name" name="contactName" value={contactName} 
            variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField label="Contact Number" name="contactNumber" value={contactNumber} 
            variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField label="Contact Email" name="contactEmail" value={contactEmail} 
            variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            onChange={handleChange}
          />
        </Grid>
      </Grid>   

      {!isNew && (
        <Grid container columnGap={2} wrap="nowrap" sx={{ mt: 1 }}>
          <Grid item xs={3}>
            <TextField label="Last Updated By" name="updatedBy" value={updatedBy} 
              variant="standard" disabled={editMode} InputProps={{ readOnly: !editMode }} fullWidth
              onChange={handleChange}
            />
          </Grid>        
          <Grid item xs={3}>
            <TextField label="Register Date" name="regDate" value={regDate ? formatUIDate(regDate) : ""} 
              variant="standard" disabled={editMode} InputProps={{ readOnly: !editMode }} fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Last Updated Date" name="updatedDate" value={updatedDate ? formatUIDate(updatedDate, true) : ""} 
              variant="standard" disabled={editMode}  InputProps={{ readOnly: !editMode }} fullWidth
            />
          </Grid>
          {/* <Grid item xs={2}>
            <TextField label="Status" name="status" value={status} 
              variant="standard" disabled fullWidth
            />
          </Grid>  */}
        </Grid>
      )}
    </Grid>
  );
};

export default CompanyInfo;
