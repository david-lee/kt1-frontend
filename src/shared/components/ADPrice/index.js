import React, { forwardRef } from 'react';
// import NumberFormat from 'react-number-format';
import { Box, TextField } from '@mui/material';
import { numberWithCommas } from 'shared/utils';

// const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
//   const { onChange, ...other } = props;

//   return (
//     <NumberFormat
//       {...other}
//       getInputRef={ref}
//       onValueChange={(values) => {
//         onChange({
//           target: {
//             name: props.name,
//             value: +values.value,
//             fmtValue: values.formattedValue,
//           },
//         });
//       }}
//       thousandSeparator
//       isNumericString
//       prefix="$"
//     />
//   );
// });

const ADPrice = ({
  id, label = 'Price', name = "adPrice", value, onChange, onBlur, fullWidth = false,
  InputProps, variant = 'standard', sx, type 
}) => {
  const handleChange = (e) => {
    // make sure only number, commas and dot entered
    if (!/^[0-9,.]*$/.test(e.target.value)) return false;

    onChange && onChange(e);
  };

  return (
    <Box sx={{
      "& input": { textAlign: "right" }
    }}>
      <TextField
        {...{ id, label, name, onBlur, onChange: handleChange, value, variant, type, fullWidth, sx }}
        // onChange={handleChange}
        value={value ? numberWithCommas(value.toString().replace(/,/g, '')) : value}
        InputProps={InputProps}
      />
    </Box>
  );
}

export default ADPrice;
