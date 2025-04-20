import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import {t} from "i18next";
import DirectCurrencyTransfer from "../pages/Accounting/CreateTransaction/DirectCurrencyTransfer/DirectCurrencyTransfer";
import BuyAndSellCash from "../pages/Accounting/CreateTransaction/BuyAndSellCash/BuyAndSellCash";
import LocalPayments from "../pages/Accounting/CreateTransaction/LocalPayments/LocalPayments";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
    const [isForms, setIsForms] = useState<boolean>(false);
    const [isTables, setIsTables] = useState<boolean>(false);
    const [isCharts, setIsCharts] = useState<boolean>(false);
    const [isIcons, setIsIcons] = useState<boolean>(false);
    const [isMaps, setIsMaps] = useState<boolean>(false);
    const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);

    // Reports
    const [isReports, setIsReports] = useState<boolean>(false);

    // Accounting
    const [isBilling, setIsBilling] = useState<boolean>(false);
    const [isAllTransactions, setIsAllTransactions] = useState<boolean>(false);
    const [isCustomerBilling, setIsCustomerBilling] = useState<boolean>(false);
    const [isGeneralLedger, setIsGeneralLedger] = useState<boolean>(false);
    const [isCreateNewDocument, setIsCreateNewDocument] = useState<boolean>(false);
    const [directCurrencyTransferModal, setDirectCurrencyTransferModal] = useState<boolean>(false);
    const [buyAndSellCashModal, setBuyAndSellCashModal] = useState<boolean>(false);
    const [localPaymentsModal, setLocalPaymentsModal] = useState<boolean>(false);

    // Manage
    const [isManageUsers, setIsManageUsers] = useState<boolean>(false);
    const [isManageCurrencies, setIsManageCurrencies] = useState<boolean>(false);
    const [isManageFinancialAccounts, setIsManageFinancialAccounts] = useState<boolean>(false);
    const [isManageCompanyProfile, setIsManageCompanyProfile] = useState<boolean>(false);
    const [isManageBackup, setIsManageBackup] = useState<boolean>(false);

    // Pages
    const [isLanding, setIsLanding] = useState<boolean>(false);


    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Reports') {
            setIsReports(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isReports,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel,
        isLanding,
    ]);

    const menuItems: any =
         [
            {
                label: t("Reports"),
                isHeader: true,
            },
            {
                id: "reports",
                label: "Reports",
                icon: "ri-numbers-line",
                stateVariables: isReports,
                click: function (e: any) {
                    e.preventDefault();
                    setIsReports(!isReports);
                    setIscurrentState('Reports');
                    updateIconSidebar(e);
                },
                action: "view",
                subject: "reports",
                subItems: [
                    {
                        id: "creditors-and-debtors",
                        label: "Creditors And Debtors",
                        link: "/reports-creditors-and-debtors",
                        parentId: "dashboard",
                        action: "view",
                        subject: "creditorsanddebtors",
                    },
                    {
                        id: "income-cost-profit",
                        label: "Income Cost And Profit",
                        link: "/reports-income-cost-profit",
                        parentId: "dashboard",
                        action: "view",
                        subject: "incomecostprofit"
                    },
                    {
                        id: "gross-fee",
                        label: "Gross Fee",
                        link: "/reports-gross-fee",
                        parentId: "dashboard",
                        action: "view",
                        subject: "grossfee"
                    },
                    {
                        id: "total-performance",
                        label: "Total Performance",
                        link: "/reports-total-performance",
                        parentId: "dashboard",
                        action: "view",
                        subject: "totalperformance"
                    },
                    {
                        id: "customers-balance",
                        label: "Customers Balance",
                        link: "/reports-customers-balance",
                        parentId: "dashboard",
                        action: "view",
                        subject: "systemstate"
                    }
                ],
            },
            {
                label: t("Manage"),
                isHeader: true,
            },
            {
                id: "manage-users",
                label: "Manage Users",
                icon: "ri-team-fill",
                click: function (e: any) {
                    e.preventDefault();
                    setIsManageUsers(!isManageUsers);
                    setIscurrentState('Manage Users');
                    updateIconSidebar(e);
                },
                stateVariables: isManageUsers,
                action: "view",
                subject: "manageusers",
                subItems: [
                    {
                        id: "user-activity-history",
                        label: "Users Activity History",
                        link: "/manage-users-user-activity-history",
                        parentId: "manage-users",
                        action: "view",
                        subject: "useractivityhistory"
                    },
                    {
                        id: "users-list",
                        label: "Users List",
                        link: "/manage-users-users-list",
                        parentId: "manage-users",
                        action: "view",
                        subject: "userslist"
                    },
                ]
            },
            {
                id: "manage-currencies",
                label: "Manage Currencies",
                link: "/manage-currencies",
                icon: "ri-currency-fill",
                click: function (e: any) {
                    e.preventDefault();
                    setIsManageCurrencies(!isManageCurrencies);
                    setIscurrentState('Manage Currencies');
                    updateIconSidebar(e);
                },
                stateVariables: isManageCurrencies,
                action: "view",
                subject: "managecurrencies",
            },
            {
                id: "manage-financial-accounts",
                label: "Manage Financial Accounts",
                link: "/manage-financial-accounts",
                icon: "ri-bank-fill",
                click: function (e: any) {
                    e.preventDefault();
                    setIsManageFinancialAccounts(!isManageFinancialAccounts);
                    setIscurrentState('Manage Financial Accounts');
                    updateIconSidebar(e);
                },
                stateVariables: isManageFinancialAccounts,
                action: "view",
                subject: "managefinancialaccounts"
            },
            {
                id: "manage-company-profile",
                label: "Manage Company Profile",
                link: "/manage-company-profile",
                icon: "ri-building-fill",
                click: function (e: any) {
                    e.preventDefault();
                    setIsManageCompanyProfile(!isManageCompanyProfile);
                    setIscurrentState('Manage Company Profile');
                    updateIconSidebar(e);
                },
                stateVariables: isManageCompanyProfile,
                action: "view",
                subject: "managecompanyprofile",
            },
            {
                id: "manage-backup",
                label: "Manage Backup",
                link: "/manage-backup",
                icon: "ri-archive-2-fill",
                click: function (e: any) {
                    e.preventDefault();
                    setIsManageBackup(!isManageBackup);
                    setIscurrentState('Manage Backup');
                    updateIconSidebar(e);
                },
                stateVariables: isManageBackup,
                action: "view",
                subject: "managebackup",
            },
             {
                 label: t("Accounting"),
                 isHeader: true,
             },
             {
                 id: "billing",
                 label: "Billing",
                 icon: "ri-file-paper-2-fill",
                 link: '/accounting-billing',
                 click: function (e: any) {
                     e.preventDefault();
                     setIsBilling(!isBilling);
                     setIscurrentState('Billing');
                     updateIconSidebar(e);
                 },
                 stateVariables: isBilling,
                 action: "view",
                 subject: "billing"
             },
             {
                 id: "all-transactions",
                 label: "All Transactions",
                 icon: "ri-file-paper-2-fill",
                 link: '/accounting-all-transactions',
                 click: function (e: any) {
                     e.preventDefault();
                     setIsAllTransactions(!isAllTransactions);
                     setIscurrentState('All Transactions');
                     updateIconSidebar(e);
                 },
                 stateVariables: isAllTransactions,
                 action: "view",
                 subject: "alltransactions",
             },
             {
                 id: 'customer-billing',
                 label: "Customer Billing",
                 icon: "ri-file-paper-2-fill",
                 link: '/accounting-customer-billing',
                 click: function (e: any) {
                     e.preventDefault();
                     setIsCustomerBilling(!isCustomerBilling);
                     setIscurrentState('Customer Billing');
                     updateIconSidebar(e);
                 },
                 stateVariables: isCustomerBilling,
                 action: "view",
                 subject: "customerbilling"
             },
             {
                 id: "create-new-document",
                 label: "Create New Document",
                 icon: "ri-file-add-fill",
                 click: function (e: any) {
                     e.preventDefault();
                     setIsCreateNewDocument(!isCreateNewDocument);
                     setIscurrentState('Create New Document');
                     updateIconSidebar(e);
                 },
                 stateVariables: isCreateNewDocument,
                 action: "view",
                 subject: "createnewdocument",

                 subItems: [
                     {
                         id: "direct-currency-transfer",
                         label: "Direct Currency Transfer",
                         parentId: "create-new-document",
                         onClick: () => setDirectCurrencyTransferModal(true),
                         renderModal: () => <DirectCurrencyTransfer isOpen={directCurrencyTransferModal}
                                                                    toggle={() => setDirectCurrencyTransferModal(false)}
                         />,
                         action: "add",
                         subject: "directcurrencytransfertransaction"
                     },
                     {
                         id: "buy-and-sell-cash",
                         label: "Buy and Sell Cash",
                         parentId: "create-new-document",
                         onClick: () => setBuyAndSellCashModal(true),
                         renderModal: () => <BuyAndSellCash isOpen={buyAndSellCashModal}
                                                            toggle={() => setBuyAndSellCashModal(false)}
                         />,
                         action: "add",
                         subject: "buyandsellcashtransaction"
                     },
                     {
                         id: "local-payments",
                         label: "Local Payments",
                         parentId: "create-new-document",
                         onClick: () => setLocalPaymentsModal(true),
                         renderModal: () => <LocalPayments isOpen={localPaymentsModal}
                                                           toggle={() => setLocalPaymentsModal(false)} />,
                         action: "add",
                         subject: "localpaymentstransaction"
                     },
                 ],
             },
             {
                 id: "general-ledger",
                 label: "General Ledger",
                 icon: "ri-book-2-fill",
                 link: '/accounting-general-ledger',
                 click: function (e: any) {
                     e.preventDefault();
                     setIsGeneralLedger(!isGeneralLedger);
                     setIscurrentState('General Ledger');
                     updateIconSidebar(e);
                 },
                 stateVariables: isBilling,
                 action: "view",
                 subject: "generalledger"

             },
        ]

    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;