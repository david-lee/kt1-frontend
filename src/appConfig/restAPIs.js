const restApi = {
  address: '/address',
  code: '/code',
  companyInvoice: '/invoice/company',
  companySearch: '/company/search',
  createCompany: '/auth/register',
  cardPayList: '/sales/cardPayList',
  createAdOnetime: '/sales/oneTime',
  createAdFixed: '/sales/fixed',
  createAdRandom: '/sales/random',
  dashboard: '/dashboard',
  getAdList: '/sales/list',
  invoiceEmail: '/invoice/email',
  invoiceIssue: '/invoice/issue',
  invoicePreview: '/invoice/preview',
  invoiceList: '/invoice/list',
  invoiceCheck: '/invoice/issuedInvoiceCheck',
  invoiceReissue: '/invoice/reissue',
  invoiceBulkCheck: '/invoice/bulkIssuedCheck',
  invoicebulkIssue: '/invoice/issueAll',
  login: '/auth/login',
  logout: '/auth/logout',
  notes: '/note',
  paymentHistory: '/payment/history',
  payment: '/payment',
  renewal: '/sales/renewal',
  updateUser: '/User/updateUser',
  salesPeople: '/User/salesPerson',
  salesStatus: '/sales/status',
  subscribers: '/subscriber',
  resetPassword: '/auth/resetPassword',
  viewInvoice: '/invoice/issueByCompany',
  subscriber: '/subscriber',
  statsAD: '/stats/advertisement',
  statsPayment: '/stats/payment',
  monthlySales: '/sales/monthlySales'
}

export default restApi;
