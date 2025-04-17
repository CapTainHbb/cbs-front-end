import { Navigate } from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';

import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';


// // User Profile
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

  // dashboard
  { path: "/dashboard-analytics", component: <DashboardAnalytics />, action: "view", codename: "" },
  { path: "/dashboard-crm", component: <DashboardCrm />, action: "view", codename: "" },
  { path: "/dashboard", component: <DashboardEcommerce />, action: "view", codename: "" },
  { path: "/index", component: <DashboardEcommerce />, action: "view", codename: "" },

  // reports
  { path: "/reports-creditors-and-debtors", component: <CreditorsAndDebtors />, action: "view", codename: "creditorsanddebtors" },
  { path: "/reports-income-cost-profit", component: <IncomeCostProfit />, action: "view", codename: "incomecostprofit"},
  { path: "/reports-gross-fee", component: <GrossFee />, action: "view", codename: "grossfee" },
  { path: "/reports-total-performance", component: <TotalPerformance />, action: "view", codename: "totalperformance" },
  { path: "/reports-customers-balance", component: <CustomersBalance />, action: "view", codename: "systemstate" },

  // accounting
  { path: '/accounting-billing', component: <Billing />, action: "view",  codename: "billing"},
  { path: '/accounting-customer-billing', component: <CustomerBilling />, action: "view", codename: "customerbilling"},
  { path: '/accounting-all-transactions', component: <AllTransactions />, action: "view", codename: "alltransactions"},
  { path: '/accounting-general-ledger', component: <GeneralLedger />, action: "view", codename: "generalledger"},

  // manage users
  { path: "/manage-users-user-activity-history", component: <UsersActivityHistory />, action: "view", codename: "action"},
  { path: "/manage-users-users-list", component: <UsersList />, action: "add", codename: "userprofile"},

  // manage currencies
  { path: "/manage-currencies", component: <ManageCurrencies />,action: "add", codename: "currency"},

  // manage financial accounts
  { path: "/manage-financial-accounts", component: <ManageFinancialAccounts />, action: "add", codename: "financialaccount"},

  { path: "/manage-company-profile", component: <ManageCompanyProfile />, action: "add", codename: "companyprofile"},

  { path: "/manage-backup", component: <ManageBackup />, action: "add", codename: "backup"},

  // apps
  // { path: "/apps-calendar", component: <Calendar />, codename: true },
  // { path: "/apps-file-manager", component: <FileManager />, codename: true },
  // { path: "/apps-todo", component: <ToDoList />, codename: true },

  // //Chat
  // { path: "/apps-chat", component: <Chat /> },

  // //EMail
  // { path: "/apps-mailbox", component: <MailInbox /> },
  // { path: "/apps-email-basic", component: <BasicAction /> },
  // { path: "/apps-email-ecommerce", component: <EcommerceAction /> },

  // //Task
  // { path: "/apps-tasks-kanban", component: <Kanbanboard /> },
  // { path: "/apps-tasks-list-view", component: <TaskList /> },
  // { path: "/apps-tasks-details", component: <TaskDetails /> },

  // // //Invoices
  // { path: "/apps-invoices-list", component: <InvoiceList /> },
  // { path: "/apps-invoices-details", component: <InvoiceDetails /> },
  // { path: "/apps-invoices-create", component: <InvoiceCreate /> },

  //User Profile
  // { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <div></div>,
    action: "view",
    codename: "home"
  },
  { path: "*", component: <Navigate to="/" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <CoverLogout /> },
  { path: "/login", component: <CoverSignIn /> },

];

export { authProtectedRoutes, publicRoutes };