import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import {t} from "i18next";
import DirectCurrencyTransfer from "../pages/Accounting/CreateTransaction/DirectCurrencyTransfer/DirectCurrencyTransfer";
import BuyAndSellCash from "../pages/Accounting/CreateTransaction/BuyAndSellCash/BuyAndSellCash";
import LocalPayments from "../pages/Accounting/CreateTransaction/LocalPayments/LocalPayments";
import {useSelector} from "react-redux";

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


    // Apps
    const [isEmail, setEmail] = useState<boolean>(false);
    const [isSubEmail, setSubEmail] = useState<boolean>(false);
    const [isTasks, setIsTasks] = useState<boolean>(false);
    const [isInvoices, setIsInvoices] = useState<boolean>(false);

    // Reports
    const [isReports, setIsReports] = useState<boolean>(false);

    // Accounting
    const [isBilling, setIsBilling] = useState<boolean>(false);
    const [isAllTransactions, setIsAllTransactions] = useState<boolean>(false);
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
    const [isProfile, setIsProfile] = useState<boolean>(false);
    const [isLanding, setIsLanding] = useState<boolean>(false);
    const [isBlog, setIsBlog] = useState<boolean>(false);


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

    const role = useSelector((state: any) => state.InitialData.userProfileData.role)
    const isAuthorized = useMemo(() => {
        return role === 'admin' || role === 'manager';
    }, [role])

    const authorizedMenuItems =
         [
            {
                label: t("Menu"),
                isHeader: true,
            },
            {
                id: "dashboard",
                label: "Dashboards",
                icon: "ri-dashboard-2-line",
                link: "/#",
                stateVariables: isDashboard,
                click: function (e: any) {
                    e.preventDefault();
                    setIsDashboard(!isDashboard);
                    setIscurrentState('Dashboard');
                    updateIconSidebar(e);
                },
                subItems: [
                    {
                        id: "analytics",
                        label: "Analytics",
                        link: "/dashboard-analytics",
                        parentId: "dashboard",
                    },
                    {
                        id: "crm",
                        label: "CRM",
                        link: "/dashboard-crm",
                        parentId: "dashboard",
                    },
                    {
                        id: "ecommerce",
                        label: "Ecommerce",
                        link: "/dashboard",
                        parentId: "dashboard",
                    },
                ],
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
                subItems: [
                    {
                        id: "creditors-and-debtors",
                        label: "Creditors And Debtors",
                        link: "/reports-creditors-and-debtors",
                        parentId: "dashboard",
                    },
                    {
                        id: "income-cost-profit",
                        label: "Income Cost And Profit",
                        link: "/reports-income-cost-profit",
                        parentId: "dashboard",
                    },
                    {
                        id: "gross-fee",
                        label: "Gross Fee",
                        link: "/reports-gross-fee",
                        parentId: "dashboard",
                    },
                    {
                        id: "total-performance",
                        label: "Total Performance",
                        link: "/reports-total-performance",
                        parentId: "dashboard",
                    },
                    {
                        id: "customers-balance",
                        label: "Customers Balance",
                        link: "/reports-customers-balance",
                        parentId: "dashboard",
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
                subItems: [
                    {
                        id: "user-activity-history",
                        label: "Users Activity History",
                        link: "/manage-users-user-activity-history",
                        parentId: "manage-users",
                    },
                    {
                        id: "users-list",
                        label: "Users List",
                        link: "/manage-users-users-list",
                        parentId: "manage-users",
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
            }
        ]

    const unAuthorizedMenuItems =
         [
            // {
            //     label: t("Apps"),
            //     isHeader: true,
            // },
            // {
            //     id: "apps",
            //     label: "Apps",
            //     icon: "ri-apps-2-line",
            //     link: "/#",
            //     needsAuthorization: true,
            //     click: function (e: any) {
            //         e.preventDefault();
            //         setIsApps(!isApps);
            //         setIscurrentState('Apps');
            //         updateIconSidebar(e);
            //     },
            //     stateVariables: isApps,
            //     subItems: [
            //         {
            //             id: "chat",
            //             label: "Chat",
            //             link: "/apps-chat",
            //             parentId: "apps",
            //         },
            //         {
            //             id: "mailbox",
            //             label: "Email",
            //             link: "/#",
            //             parentId: "apps",
            //             isChildItem: true,
            //             click: function (e: any) {
            //                 e.preventDefault();
            //                 setEmail(!isEmail);
            //             },
            //             stateVariables: isEmail,
            //             childItems: [
            //                 {
            //                     id: 1,
            //                     label: "Mailbox",
            //                     link: "/apps-mailbox",
            //                     parentId: "apps"
            //                 },
            //                 {
            //                     id: 2,
            //                     label: "Email Templates",
            //                     link: "/#",
            //                     parentId: "apps",
            //                     isChildItem: true,
            //                     stateVariables: isSubEmail,
            //                     click: function (e: any) {
            //                         e.preventDefault();
            //                         setSubEmail(!isSubEmail);
            //                     },
            //                     childItems: [
            //                         { id: 2, label: "Basic Action", link: "/apps-email-basic", parentId: "apps" },
            //                         { id: 3, label: "Ecommerce Action", link: "/apps-email-ecommerce", parentId: "apps" },
            //                     ],
            //                 },
            //             ]
            //         },
            //         {
            //             id: "tasks",
            //             label: "Tasks",
            //             link: "/#",
            //             isChildItem: true,
            //             click: function (e: any) {
            //                 e.preventDefault();
            //                 setIsTasks(!isTasks);
            //             },
            //             parentId: "apps",
            //             stateVariables: isTasks,
            //             childItems: [
            //                 { id: 1, label: "Kanban Board", link: "/apps-tasks-kanban", parentId: "apps", },
            //                 { id: 2, label: "List View", link: "/apps-tasks-list-view", parentId: "apps", },
            //                 { id: 3, label: "Task Details", link: "/apps-tasks-details", parentId: "apps", },
            //             ]
            //         },
            //         {
            //             id: "invoices",
            //             label: "Invoices",
            //             link: "/#",
            //             isChildItem: true,
            //             click: function (e: any) {
            //                 e.preventDefault();
            //                 setIsInvoices(!isInvoices);
            //             },
            //             parentId: "apps",
            //             stateVariables: isInvoices,
            //             childItems: [
            //                 { id: 1, label: "List View", link: "/apps-invoices-list" },
            //                 { id: 2, label: "Details", link: "/apps-invoices-details" },
            //                 { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
            //             ]
            //         },
            //         {
            //             id: "filemanager",
            //             label: "File Manager",
            //             link: "/apps-file-manager",
            //             parentId: "apps",
            //         },
            //         {
            //             id: "todo",
            //             label: "To Do",
            //             link: "/apps-todo",
            //             parentId: "apps",
            //         },
            //     ],
            // },
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
                 subItems: [
                     {
                         id: "direct-currency-transfer",
                         label: "Direct Currency Transfer",
                         parentId: "create-new-document",
                         onClick: () => setDirectCurrencyTransferModal(true),
                         renderModal: () => <DirectCurrencyTransfer isOpen={directCurrencyTransferModal}
                                                                    toggle={() => setDirectCurrencyTransferModal(false)}
                         />,
                     },
                     {
                         id: "buy-and-sell-cash",
                         label: "Buy and Sell Cash",
                         parentId: "create-new-document",
                         onClick: () => setBuyAndSellCashModal(true),
                         renderModal: () => <BuyAndSellCash isOpen={buyAndSellCashModal}
                                                            toggle={() => setBuyAndSellCashModal(false)}
                         />,
                     },
                     {
                         id: "local-payments",
                         label: "Local Payments",
                         parentId: "create-new-document",
                         onClick: () => setLocalPaymentsModal(true),
                         renderModal: () => <LocalPayments isOpen={localPaymentsModal}
                                                           toggle={() => setLocalPaymentsModal(false)} />
                     },
                     {
                         id: "local-payments",
                         label: "Local Payments",
                         parentId: "create-new-document",
                     }
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
            },
        ]
    let menuItems: any = []
    if (isAuthorized) {
        menuItems = [
            ...authorizedMenuItems,
            ...unAuthorizedMenuItems,
        ]
    } else {
        menuItems = [...unAuthorizedMenuItems];
    }
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;