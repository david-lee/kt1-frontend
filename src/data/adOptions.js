import { searchBy, adTypeCode } from './constants';

export const DADPagesLayout = [
  'A1','A11','B1','B11',
  'A2','A12','B2','B12',
  'A3','A13','B3','B13',
  'A4','A14','B4','B14',
  'A5','A15','B5','B15',
  'A6','A16','B6','B16',
  'A7','A17','B7','B17',
  'A8','A18','B8','B18',
  'A9','A19','B9','B19',
  'A10','A20','B10','B20',
];

export const taxRates = [
  { label: '13%', value: 13 },
  { label: '10%', value: 10 },
  { label: '5%', value: 5 },
];

// it is a type of one-time or fixed registration
//TODO: should be changed to adType. It is used in one or monthly view.
// it is passed via a router param
export const scheduleType = {
  oneTimeDAD: adTypeCode.dad,  // onetime
  oneTimeWKY: adTypeCode.wky,  // onetime
  MONTHLY: 'Monthly'  // fixed / random
};

export const adTypeOptions = [
  { value: 'DAD', codeId: adTypeCode.dad },
  { value: 'WKY', codeId: adTypeCode.wky },
  { value: 'WAD', codeId: adTypeCode.wad },
  { value: 'CAD', codeId: adTypeCode.cad },
  // TODO: for now, it is not decided how to deal with size and page
  // { value: 'BD', codeId: adTypeCode.bd },
];

export const recurringOptions = [
  {label: 'Fixed', value: '1'},
  {label: 'Random', value: '2'},
  // {label: 'Random', value: '3'},
];

export const adSizeShort = {
  'Full': 'FL',
  'Half': 'HF',
  '1/4': '1/4',
  '1/8': '1/8',
  '1/16': '1/16',
  'Belt': 'BT',
  'Pop': 'PP',
  'Cell1': 'C1',
  'Cell2': 'C2',
  'Cell4': 'C4',
  'Cell6': 'C6',
  'Cell8': 'C8',
  'Half Portrait': 'HP',
  'Half Landscape': 'HL',
  '1/4 Portrait': 'QP',
  '1/4 Landscape': 'QL',
  'Special': 'SP',
};

// TODO: refactor to have it with number prop
// add a helper function to find type label with id?
export const adTypeSize = {
  [adTypeCode.dad]: [
    {
      "codeId": 2113,
      "value": "FL",
      "longValue": "Full"
    },
    {
        "codeId": 2114,
        "value": "HF",
        "longValue": "Half"
    },
    {
        "codeId": 2115,
        "value": "1/4",
        "longValue": "1/4"
    },
    {
        "codeId": 2116,
        "value": "1/8",
        "longValue": "1/8"
    },
    {
        "codeId": 2117,
        "value": "1/16",
        "longValue": "1/16"
    },
    {
        "codeId": 2122,
        "value": "POP",
        "longValue": "POP"
    },
    {
        "codeId": 2123,
        "value": "BT",
        "longValue": "Belt"
    },
    {
        "codeId": 2124,
        "value": "SP",
        "longValue": "Special"
    }
  ],
  [adTypeCode.cad]: [
    {
      "codeId": 2125,
      "value": "C1",
      "longValue": "Cell1"
    },
    {
        "codeId": 2126,
        "value": "C2",
        "longValue": "Cell2"
    },
    {
        "codeId": 2127,
        "value": "C4",
        "longValue": "Cell4"
    },
    {
        "codeId": 2128,
        "value": "C6",
        "longValue": "Cell6"
    },
    {
        "codeId": 2129,
        "value": "C8",
        "longValue": "Cell8"
    }    
  ],
  [adTypeCode.wky]: [
    {
      "codeId": 2113,
      "value": "FL",
      "longValue": "Full"
  },
  {
      "codeId": 2115,
      "value": "1/4",
      "longValue": "1/4"
  },
  {
      "codeId": 2118,
      "value": "HP",
      "longValue": "Half Portrait"
  },
  {
      "codeId": 2119,
      "value": "HL",
      "longValue": "Half Landscape"
  },
  {
      "codeId": 2122,
      "value": "POP",
      "longValue": "POP"
  },
  {
      "codeId": 2124,
      "value": "SP",
      "longValue": "Special"
  }
  ],
  [adTypeCode.wad]: [
    {
      "codeId": 2124,
      "value": "SP",
      "longValue": "Special"
    },
    {
        "codeId": 2125,
        "value": "C1",
        "longValue": "Cell1"
    },
    {
        "codeId": 2126,
        "value": "C2",
        "longValue": "Cell2"
    },
    {
        "codeId": 2127,
        "value": "C4",
        "longValue": "Cell4"
    },
    {
        "codeId": 2130,
        "value": "Long",
        "longValue": null
    },
    {
        "codeId": 2131,
        "value": "Square",
        "longValue": null
    },
    {
        "codeId": 2132,
        "value": "HalfCell2",
        "longValue": null
    },
    {
        "codeId": 2133,
        "value": "LongCell2",
        "longValue": null
    },
    {
        "codeId": 2134,
        "value": "Youtube",
        "longValue": null
    },
    {
        "codeId": 2135,
        "value": "Restaurant",
        "longValue": null
    },
    {
        "codeId": 2136,
        "value": "Top",
        "longValue": null
    },
    {
        "codeId": 2137,
        "value": "SideLong",
        "longValue": null
    }
  ],
  [adTypeCode.bd]: [
    {
      "codeId": 2118,
      "value": "HP",
      "longValue": "Half Portrait"
    },
    {
        "codeId": 2119,
        "value": "HL",
        "longValue": "Half Landscape"
    },
    {
        "codeId": 2120,
        "value": "QP",
        "longValue": "1/4 Portrait"
    },
    {
        "codeId": 2121,
        "value": "QL",
        "longValue": "1/4 Landscape"
    },
    {
        "codeId": 2133,
        "value": "LongCell2",
        "longValue": null
    },
    {
        "codeId": 2138,
        "value": "Cover",
        "longValue": null
    }
  ] 
}

export const adTypePage = {
  WAD: [
    {value: 'Main', codeId: 2068 },
    {value: 'Category', codeId: 2069 },
    {value: 'Article', codeId: 2070 },
    {value: 'Community', codeId: 2071 },
    {value: 'Restaurant', codeId: 2072 },
  ]
}

export const adDefaults = {
  adType: adTypeOptions[0].value,
}

export const searchOptions = [
  { label: "Company Name", value: searchBy.name },
  { label: "Company Name2", value: searchBy.subName },
  { label: "Company ID", value: searchBy.id },
  { label: "Owner Name", value: searchBy.ownerName },
  { label: "Phone Number", value: searchBy.phoneNumber },
  { label: "Email", value: searchBy.email },
  { label: "Old ID", value: searchBy.oldId },
];

export const payBy = [
  { label: "Cash", value: 2182 },
  { label: "Cheque", value: 2183 },
  { label: "e-Transfer", value: 2184 },
  { label: "Master", value: 2185 },
  { label: "Visa", value: 2186 },
  { label: "BC", value: 2187 },
  { label: "American Express", value: 2188 },
  { label: "Direct Deposit", value: 2189 }
];

export const cadTitles = [
  { value: "Job Hunting", codeId: 2176 },
  { value: "Job Opening", codeId: 2177 },
  { value: "Trading", codeId: 2178 },
  { value: "Rent", codeId: 2179 },
];

export const salesStatus = {
  confirmed: 1908,
  pending: 1907,
  editing: 1909,
  deleted: 1910,
}

export const invoiceStatus = {
  outstanding: 2191,
  completed: 2192,
  overdue: 2193,
}

export const mainCategories = [
  {
    "codeId": 26,
    "value": "Restaurant | Food | Bakery",
  },
  {
      "codeId": 27,
      "value": "Medical | Oriental Herb | Pharmacy",
  },
  {
      "codeId": 28,
      "value": "Shopping | Wedding | Photo | Clothing",
  },
  {
      "codeId": 29,
      "value": "Immigration | Studying Abroad | Institute | Office",
  },
  {
      "codeId": 30,
      "value": "Electronics | Internet | Computer",
  },
  {
      "codeId": 31,
      "value": "Real Estate | Mortgage | Insurance | Financial | Trading",
  },
  {
      "codeId": 32,
      "value": "Specialized service | Advertisement",
  },
  {
      "codeId": 33,
      "value": "Construction | Renovation | Handyman",
  },
  {
      "codeId": 34,
      "value": "Vehicle | Transpotation | Repair | Rent",
  },
  {
      "codeId": 35,
      "value": "Sports | Entertainment",
  },
  {
      "codeId": 36,
      "value": "Law | Accounting",
  },
  {
      "codeId": 37,
      "value": "Health | Beauty | Sauna | Welfare",
  },
  {
      "codeId": 38,
      "value": "Travel | Accommodation | Transpotation",
  },
  {
      "codeId": 39,
      "value": "Media | Religion | Community | Korean Company",
  },
  {
      "codeId": 40,
      "value": "Others",
  }
];

export const provinces = [
  {
      "codeId": 243,
      "value": "Alberta",
  },
  {
      "codeId": 244,
      "value": "British Columbia",
  },
  {
      "codeId": 245,
      "value": "Manitoba",
  },
  {
      "codeId": 246,
      "value": "New Brunswick",
  },
  {
      "codeId": 247,
      "value": "Newfoundland and Labrador",
  },
  {
      "codeId": 248,
      "value": "Nova Scotia",
  },
  {
      "codeId": 249,
      "value": "Ontario",
  },
  {
      "codeId": 250,
      "value": "Prince Edward Island",
  },
  {
      "codeId": 251,
      "value": "Quebec",
  },
  {
      "codeId": 252,
      "value": "Saskatchewan",
  },
  {
      "codeId": 253,
      "value": "Other",
  }
]
