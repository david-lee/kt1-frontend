import { AD_TAX } from 'data/constants';
import { format, parse } from 'date-fns';
import { DATA_DATE_FORMAT, UI_DATE_FORMAT } from 'data/constants';

export const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const removeCommas = (numStr) => {
  return +(numStr.toString().replace(/,/g, ''));
}

export const precisionRound = (number, precision = 2) => {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

export const getTax = (price, taxIncluded) => {
  return precisionRound((AD_TAX*price) / (taxIncluded ? AD_TAX + 1 : 1))
};

export const formatUIDate = (dateStr, timezone) => {
  if (!dateStr) return "";

  const parsed = timezone ? new Date(dateStr) : parse(dateStr, DATA_DATE_FORMAT, new Date()); 
  return format(parsed, UI_DATE_FORMAT);
}

export const calculateTax = (cost, taxIncluded) => {
  let newCost;
  let tax;
  let total;

  const numPrice = removeCommas(cost);

  if (taxIncluded) {
    tax = getTax(numPrice, taxIncluded);

    newCost = numPrice - tax;
    total = tax + newCost;
  }
  else {
    tax = getTax(numPrice);
    total = numPrice + tax;
  }
  
  return { cost: precisionRound(newCost), tax: precisionRound(tax), total: precisionRound(total) };
};

export const calculateTaxWithTaxIncluded = (cost, tax, taxIncluded) => {
  let newCost;
  let newTax;
  let total;

  const numPrice = removeCommas(cost);

  if (taxIncluded) {
    newTax = getTax(numPrice, taxIncluded);
    newCost = numPrice - newTax;
  }

  if (!taxIncluded) {
    const adjustedPrice = numPrice + +tax;

    newTax = getTax(adjustedPrice);
    newCost = adjustedPrice;
  }

  total = newCost + newTax;
  return { cost: precisionRound(newCost), tax: precisionRound(newTax), total: precisionRound(total) };
};


// Credit Card Validation

export const validCardHolderName = new RegExp(/^[a-zA-Z, \s]+$/);
export const validCardNumber = new RegExp(/^[3-8][0-9, -]{16,18}$/);
export const validCardMonth = new RegExp(/^[1-9]$|^0[1-9]$|^1[0-2]$/);
export const validCardYear = new RegExp(/^20[2-9][0-9]$/);
export const validSecNumber = new RegExp(/^[0-9]{3}$/);

export const validCardMonthYear = (cardMonth, cardYear) => {
  const validYear = cardYear - new Date().getFullYear();
  const curMonth = new Date().getMonth()+1;
  if(validYear < 0 || (validYear === 0  && (curMonth > cardMonth))){
    return false;
  }else{
    return true;
  }
}

export const cardNumberWithDash = (num) => {
  return num.toString().replace(/(?<=[0-9]{4})(?=[0-9]{4})/, '-');
}