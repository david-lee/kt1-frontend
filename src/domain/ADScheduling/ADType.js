import React from 'react';
import Dropdown from 'shared/components/Dropdown';
import { adTypeOptions } from 'data/adOptions';

const ADType = ({ id, disabled, onChange, value, sx }) => {
  return (
    <Dropdown id={id} label="AD Type" {...{ disabled, onChange, value, sx }} options={adTypeOptions} />
  );
}

export default ADType;
