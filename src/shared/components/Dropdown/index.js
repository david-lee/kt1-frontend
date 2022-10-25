import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';

const Dropdown = ({
  id = "dd", name, label, value, disabled, readOnly,
  onChange, options, width, size, fullWidth,
  noNone = false, variant="standard", sx
}) => {
  const { spaces: { adOptMinWidthS }} = useTheme();

  return (
    <FormControl
      disabled={disabled}
      variant={variant}
      size={size || 'small'}
      sx={{ marginTop: "3px", mb: 0, mr: 4, minWidth: width || adOptMinWidthS, ...sx }}
      fullWidth={fullWidth}
    >
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select {...{id, label, name, value, onChange}} labelId={id} readOnly={readOnly}>
        {!noNone && <MenuItem value="">None</MenuItem>}
        {options?.map(({label, value, codeId}) => {
          // NOTE: in the case of adTypeSize, "value" is used for label and "codeId" is used for value
          // so it should be "codeId || value" not "value || codeId"
          return <MenuItem key={codeId || value} value={codeId || value}>{label || value}</MenuItem>
        })}
      </Select>
    </FormControl>   
  );
}

export default Dropdown;
