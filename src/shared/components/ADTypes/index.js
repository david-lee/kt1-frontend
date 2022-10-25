import React, { useState } from 'react';
import Dropdown from '../Dropdown';
import { adDefaults, adTypeOptions } from 'data/adOptions';

const ADTypes = () => {
  const [adType, setAdType] = useState(adDefaults.adType);
  const handleChange = (e) => {
    setAdType(e.target.value);
  }

  return (
    <Dropdown id="adType" label="AD Type" onChange={handleChange} options={adTypeOptions} value={adType} />  
  );
}

export default ADTypes;
