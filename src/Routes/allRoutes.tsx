import { Navigate } from "react-router-dom";
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';


import CreditorsAndDebtors from "../pages/Reports/CreditorsAndDebtors/CreditorsAndDebtors";
import IncomeCostProfit from "pages/Reports/IcomeCostProfit/IncomeCostProfit";
import Billing from "../pages/Accounting/Billing/Billing";
import GeneralLedger from "pages/Accounting/GeneralLedger/GeneralLedger";
import UsersActivityHistory from "../pages/ManageUsers/UsersActivityHistory";
import UsersList from "pages/ManageUsers/UsersList";
import ManageCurrencies from "../pages/ManageCurrencies/ManageCurrencies";
import ManageFinancialAccounts from "../pages/ManageFinancialAccounts/ManageFinancialAccounts";
import ManageCompanyProfile from "../pages/ManageCompanyProfile/ManageCompanyProfile";
import GrossFee from "../pages/Reports/GrossFee/GrossFee";
import TotalPerformance from "../pages/Reports/TotalPerformance/TotalPerformance";
import ManageBackup from "pages/ManageBackup/ManageBackup";
import CustomersBalance from "pages/Reports/CustomersBalance/CustomersBalance";
import AllTransactions from "../pages/Accounting/AllTransactions/AllTransactions";
import CustomerBilling from "pages/Accounting/CustomerBilling/CustomerBilling";


const authProtectedRoutes = [

  // reports
  { path: "/reports-creditors-and-debtors", component: <CreditorsAndDebtors />, action: "view", subject: "creditorsanddebtors" },
  { path: "/reports-income-cost-profit", component: <IncomeCostProfit />, action: "view", subject: "incomecostprofit"},
  { path: "/reports-gross-fee", component: <GrossFee />, action: "view", subject: "grossfee" },
  { path: "/reports-total-performance", component: <TotalPerformance />, action: "view", subject: "totalperformance" },
  { path: "/reports-customers-balance", component: <CustomersBalance />, action: "view", subject: "systemstate" },

  // accounting
  { path: '/accounting-billing', component: <Billing />, action: "view",  subject: "billing"},
  { path: '/accounting-customer-billing', component: <CustomerBilling />, action: "view", subject: "customerbilling"},
  { path: '/accounting-all-transactions', component: <AllTransactions />, action: "view", subject: "alltransactions"},
  { path: '/accounting-general-ledger', component: <GeneralLedger />, action: "view", subject: "generalledger"},

  // manage users
  { path: "/manage-users-user-activity-history", component: <UsersActivityHistory />, action: "view", subject: "useractivityhistory"},
  { path: "/manage-users-users-list", component: <UsersList />, action: "view", subject: "userslist"},

  // manage currencies
  { path: "/manage-currencies", component: <ManageCurrencies />,action: "view", subject: "managecurrencies"},

  // manage financial accounts
  { path: "/manage-financial-accounts", component: <ManageFinancialAccounts />, action: "view", subject: "managefinancialaccounts"},

  { path: "/manage-company-profile", component: <ManageCompanyProfile />, action: "view", subject: "companyprofile"},

  { path: "/manage-backup", component: <ManageBackup />, action: "view", subject: "managebackup"},
  {
    path: "/",
    exact: true,
    component: <div></div>,
    action: "view",
    subject: "home"
  },
  { path: "*", component: <Navigate to="/" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <CoverLogout /> },
  { path: "/login", component: <CoverSignIn /> },

];

export { authProtectedRoutes, publicRoutes };