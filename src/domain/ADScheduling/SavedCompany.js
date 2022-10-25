import React, { useState } from 'react';
import Dropdown from 'shared/components/Dropdown';

// TODO: save into local storage?
const options = [
  {label: 'Sebang Travel', value: '12345678'},
  {label: '맛나분식', value: '23456789'}
]
const SavedCompany = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const handleChange = (e) => {
    setSelectedCompany(e.target.value);
  }

  return (
    <Dropdown id="savedCompany" label="Saved Company" onChange={handleChange} options={options} value={selectedCompany} />  
  );
}

export default SavedCompany;
