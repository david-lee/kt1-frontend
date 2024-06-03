export const RECURRING_FIXED = '1';
export const RECURRING_RANDOM = '2';
export const RECURRING_ONE_TIME = '3';
export const AD_TAX = 0.13;
export const UI_DATE_FORMAT = 'yyyy/MM/dd';
export const DATA_DATE_FORMAT = 'yyyyMMdd';
export const DEFAULT_ADDRESS = {
  addr: '-',
  city: '-',
  province: '-',
  postal: '-',
};
// export const API_BASE_URL = 'https://api.koreatimes.net/api/v1';
export const API_BASE_URL = 'https://api.dev.koreatimes.net/api/v1';
// export const API_BASE_URL = 'https://localhost:5000/api/v1';

export const STRIPE_PUB_KEY =
  'pk_live_51J0pcLFTcVYEN1aoFspMOmRHY0X5FO5EhJro9x1xVkarTL3wvfIz2dDdrJ4U2sL362IhltlTySVYGQBrExCysSrT00JcdmqTHm';
// export const STRIPE_PUB_KEY = "pk_test_51J0pcLFTcVYEN1aoOOqeqOnEaJIW0lKq0K3D2m0X6NSemN8D9oIeKgJ740KYoGdQMOFzbhWsxSoaNbZIBEh9qmfx00fbhXsT3Q";

export const codeType = {
  userType: 1,
  dept: 2,
  permission: 3,
  mainCat: 4,
  subCat: 5,
  prov: 6,
  city: 7,
  status: 8,
  adType: 9,
  page: 10,
  size: 11,
  title: 12,
  taxRate: 13,
  payMethod: 14,
  invoiceStatus: 2190,
};

export const companyStatus = {
  confirmed: 1908,
  deleted: 1910,
};

export const adTypeCode = {
  dad: '1911',
  wky: '1912',
  wad: '1913',
  cad: '1914',
  bd: '1915',
};

export const searchBy = {
  name: '1',
  subName: '2',
  id: '3',
  oldId: '4',
  phoneNumber: '5',
  ownerName: '6',
  email: '7',
};

export const displaySize = {
  pp: 2122,
  bt: 2123,
  sp: 2124,
};

export const addressType = {
  main: 1,
  bill: 2,
};

// TODO: change to number
export const roleType = {
  staff: '0', // 2197
  director: '1', // 2198
  manager: '2', // 2199
  admin: '3', // 2200
};

// TODO: change to number
export const permissionType = {
  read: '0', // 23
  write: '1', // 24
  delete: '2', // 25
};

export const deptType = {
  director: 'director', //18,
  sales: 'sales', //19,
  sub: 'sub', // 20,
  account: 'account', //21,
  it: 'it', //22,
};

export const reissueType = {
  reissue: 1,
  split: 2,
};

export const cardCompanyBrand = {
  master: 2185,
  visa: 2186,
  bc: 2187,
  mastercard: 2185,
  amex: 2188,
};
