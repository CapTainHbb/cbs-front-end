import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

// // Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

// //Chat
import Chat from "../pages/Chat";

// //Calendar
import Calendar from "../pages/Calendar";

// //Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";

// //Invoices
import InvoiceList from "../pages/Invoices/InvoiceList";
import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails";


import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';

import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';



// // User Profile
import UserProfile from "../pages/Authentication/user-profile";


import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";
import Kanbanboard from "pages/Tasks/KanbanBoard";
import CreditorsAndDebtors from "../pages/Reports/CreditorsAndDebtors/CreditorsAndDebtors";
import IncomeCostProfit from "pages/Reports/IcomeCostProfit/IncomeCostProfit";
import Billing from "../pages/Accounting/Billing/Billing";
import GeneralLedger from "pages/Accounting/GeneralLedger/GeneralLedger";
import UsersActivityHistory from "../pages/ManageUsers/UsersActivityHistory";
import UsersList from "pages/ManageUsers/UsersList";
import ManageCurrencies from "../pages/ManageCurrencies/ManageCurrencies";
import ManageFinancialAccounts from "../pages/ManageFinancialAccounts/ManageFinancialAccounts";



const authProtectedRoutes = [

  // dashboard
  { path: "/dashboard-analytics", component: <DashboardAnalytics />, needsAuthorization: true },
  { path: "/dashboard-crm", component: <DashboardCrm />, needsAuthorization: true },
  { path: "/dashboard", component: <DashboardEcommerce />, needsAuthorization: true },
  { path: "/index", component: <DashboardEcommerce />, needsAuthorization: true },

  // reports
  { path: "/reports-creditors-and-debtors", component: <CreditorsAndDebtors />, needsAuthorization: true },
  { path: "/reports-income-cost-profit", component: <IncomeCostProfit />, needsAuthorization: true},

  // accounting
  { path: '/accounting-billing', component: <Billing />},
  { path: '/accounting-general-ledger', component: <GeneralLedger />},

  // manage users
  { path: "/manage-users-user-activity-history", component: <UsersActivityHistory />, needsAuthorization: true},
  { path: "/manage-users-users-list", component: <UsersList />, needsAuthorization: true},

  // manage currencies
  { path: "/manage-currencies", component: <ManageCurrencies />, needsAuthorization: true},

  // manage financial accounts
  { path: "/manage-financial-accounts", component: <ManageFinancialAccounts />, needsAuthorization: true},

  // apps
  { path: "/apps-calendar", component: <Calendar />, needsAuthorization: true },
  { path: "/apps-file-manager", component: <FileManager />, needsAuthorization: true },
  { path: "/apps-todo", component: <ToDoList />, needsAuthorization: true },

  // //Chat
  { path: "/apps-chat", component: <Chat /> },

  // //EMail
  { path: "/apps-mailbox", component: <MailInbox /> },
  { path: "/apps-email-basic", component: <BasicAction /> },
  { path: "/apps-email-ecommerce", component: <EcommerceAction /> },

  // //Task
  { path: "/apps-tasks-kanban", component: <Kanbanboard /> },
  { path: "/apps-tasks-list-view", component: <TaskList /> },
  { path: "/apps-tasks-details", component: <TaskDetails /> },

  // //Invoices
  { path: "/apps-invoices-list", component: <InvoiceList /> },
  { path: "/apps-invoices-details", component: <InvoiceDetails /> },
  { path: "/apps-invoices-create", component: <InvoiceCreate /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <div></div>,
  },
  { path: "*", component: <Navigate to="/" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <CoverLogout /> },
  { path: "/login", component: <CoverSignIn /> },

];

export { authProtectedRoutes, publicRoutes };