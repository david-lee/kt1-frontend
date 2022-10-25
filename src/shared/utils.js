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

  const numPrice = removeCommas(cost);

  if (taxIncluded) {
    tax = getTax(numPrice, taxIncluded);

    newCost = numPrice - tax;
  }
  else {
    tax = getTax(numPrice);
  }

  return { cost: precisionRound(newCost), tax: precisionRound(tax) };
};

export const calculateTaxWithTaxIncluded = (cost, tax, taxIncluded) => {
  let newCost;
  let newTax;

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

  return { cost: precisionRound(newCost), tax: precisionRound(newTax) };
};
