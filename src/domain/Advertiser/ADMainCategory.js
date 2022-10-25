import React from 'react';
import Dropdown from 'shared/components/Dropdown';
import { mainCategory } from 'data/adOptions';

const ADMainCategory = ({ id, readOnly, disabled, fullWidth, onChange, value }) => {
  return (
    <Dropdown id={id} label="Main Category" 
      {...{ disabled, onChange, value, readOnly, fullWidth }}
      options={mainCategory}
    />
  );
}

export default ADMainCategory;
