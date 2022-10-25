import React from 'react';
import { adTypeSize } from 'data/adOptions';
import Dropdown from 'shared/components/Dropdown';

const ADTypeSize = ({id, value, onChange, type, sx, width, noNone, pageView }) => {
  let options = adTypeSize[type];

  // const changeHandler = (e) => {
  //   const sizeId = e.target.value;
  //   console.log("********* ", sizeId)
  //   // const codeId = options.find(size => size.value === sizeId)?.codeId;

  //   // console.log("&&& codeId: ", codeId);
  //   onChange && onChange(sizeId);
  // }

  if (pageView) {
    options = options.filter(option => option.value !== 'BT' && option.value !== 'POP');
  }

  return (
    <Dropdown {...{ id, value, options, sx, width, noNone }} label="AD Size" onChange={onChange} />
  )
}

export default ADTypeSize;
