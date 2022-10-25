import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import { addressType as addrType } from 'data/constants';

const AddressInfo = ({ values, handleChange, setFieldValue, editMode }) => {
  if (!values.addresses) return null;

  const copyMainAddress = () => {
    const addresses = values.addresses;

    setFieldValue('addresses.1.addr', addresses[0].addr);
    setFieldValue('addresses.1.city', addresses[0].city);
    setFieldValue('addresses.1.province', addresses[0].province);
    setFieldValue('addresses.1.postal', addresses[0].postal);
  };

  return (
    values.addresses.map(({ addr, postal, city, province, addressType }, index) => {
      return (
        <Grid key={index} container rowGap={3} columnGap={3}>
          <Grid item xs={1}>
            <TextField label="Type" value={addressType === addrType.main ? "Main" : "Billing"} 
              variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
            />
          </Grid>            
          <Grid item xs={4}>
            <TextField label="Address" name={`addresses.${index}.addr`} value={addr} 
              variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField label="City" name={`addresses.${index}.city`} value={city} 
              variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            {/* <Dropdown id="province" label="Province" name={`address.${index}.province`} value={province} 
              fullWidth onChange={handleChange} readOnly={!editMode}
              options={provinces}
            />*/}
            <TextField label="Province" name={`addresses.${index}.province`} value={province} 
              variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField label="Postal Code" name={`addresses.${index}.postal`} value={postal} 
              variant="standard" InputProps={{ readOnly: !editMode }} fullWidth
              onChange={handleChange}
            />
          </Grid>
          {addressType === addrType.bill &&
            <Grid item xs={2}>
              <FormGroup sx={{ mr: 4 }}>
                <FormControlLabel label="same as Main" sx={{ position: "relative", top: "10px", mx: 0 }} 
                  control={
                    <Checkbox size="small" name="sameAddress" checked={values.sameAddress}
                      onClick={copyMainAddress}  
                      onChange={editMode ? handleChange: undefined } 
                    />
                  }/>
              </FormGroup>
            </Grid>          
          }
        </Grid>          
      )
    })
  );
};

export default AddressInfo;
