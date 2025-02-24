import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomTableContainer from "../../Reports/CustomTableContainer";
import {ColumnDef} from "@tanstack/table-core";
import IndeterminateCheckbox from "../../Reports/IndetermineCheckbox";
import {t} from "i18next";
import BalanceAmount from "../../Reports/BalanceAmount";
import CreditorDebtorAmount from "../../Reports/CreditorsAndDebtors/CreditorDebtorAmount";
import {Party} from "../types";
import {useSelector} from "react-redux";
import CurrencyNameAndFlag from "../../Reports/CurrencyNameAndFlag";
import BillingExtraHeader from "./BillingExtraHeader";
import { useSearchParams } from 'react-router-dom';
import DirectCurrencyTransfer from "../CreateTransaction/DirectCurrencyTransfer/DirectCurrencyTransfer";
import axiosInstance from "../../../helpers/axios_instance";
import BuyAndSellCash from '../CreateTransaction/BuyAndSellCash/BuyAndSellCash';
import LocalPayments from '../CreateTransaction/LocalPayments/LocalPayments';
import {useBillingFilters} from "./hooks/useBillingFilters";
import {createLocalizedDate, getLocalizedFormattedDateTime} from "../../../helpers/date";


const Billing = () => {
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const [table, setTable] = useState<any>(undefined);
    const [searchParams] = useSearchParams();
    const {updateFilter, resetFilters} = useBillingFilters();
    useEffect(() => {
        if(Number(searchParams.get("financial_account")) === 0) return
        resetFilters();
        updateFilter("financial_account", Number(searchParams.get("financial_account")))
    }, [searchParams]);

    const { filters } = useBillingFilters();

    const [itemsChanged, setItemsChanged] = useState<boolean>(false)

    const getTransactionBriefCell = useCallback((info: any) => {
        const { document_type, transaction_type } = info.row.original;
        if (document_type !== "main") {
            if (document_type === 'interest' || document_type === 'standalone-interest') {
                return <span className={'badge bg-success-subtle text-success fs-6'}>{t(String(info.getValue()))}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span className={"badge bg-danger-subtle text-danger fs-6"}>{t(String(info.getValue()))}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p className="badge bg-primary-subtle text-primary fs-6">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p className="badge bg-secondary-subtle text-secondary fs-6">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p className="badge bg-warning-subtle text-warning fs-6">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p className="badge bg-info-subtle text-info fs-6">{t(String(info.getValue()))}</p>;
                default:
                    return null;
            }
        }

        return null;
    }, [])

    const getTransactionTypeCell = useCallback((info: any) => {
        const { document_type, transaction_type } = info.row.original;

        if (document_type !== "main") {
            if (document_type === 'interest' || document_type === 'standalone-interest') {
                return <span className={'badge bg-success-subtle text-success fs-6'}>{t("Received Fee")}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span className={'badge bg-danger-subtle text-danger fs-6'}>{t("Paid Fee")}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p className="badge bg-primary-subtle text-primary fs-6">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p className="badge bg-secondary-subtle text-secondary fs-6">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p className="badge bg-warning-subtle text-warning fs-6">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p className="badge bg-info-subtle text-info fs-6">{t(String(info.getValue()))}</p>;
                default:
                    return null;
            }
        }

        return null;
    }, [t]);

    const [activeTransactionData, setActiveTransactionData] = useState<any>(undefined)
    const [isDirectCurrencyTransferModalOpen, setIsDirectCurrencyTransferModalOpen] = useState<boolean>(false);
    const [isBuyAndSellCashModalOpen, setIsBuyAndSellCashModalOpen] = useState<boolean>(false);
    const [isLocalPaymentsModalOpen, setIsLocalPaymentsModalOpen] = useState<boolean>(false);
    const handleEditTransaction = useCallback(async (party: any) => {
        let url = "";
        if(party?.transaction_type === "direct-currency-transfer") {
            url = `/transactions/direct-currency-transfer/${party?.transaction}/`;
        } else if(party?.transaction_type === 'buy-cash' || party?.transaction_type === 'sell-cash') {
            url = `/transactions/buy-and-sell-cash/${party?.transaction}/`;
        } else if(party?.transaction_type === 'local-payments') {
            url = `/transactions/local-payments/${party?.transaction}/`
        }

        axiosInstance.get(url)
            .then(response => {
                setActiveTransactionData(response.data);
                if(response.data?.transaction_type === 'direct-currency-transfer') {
                    setIsDirectCurrencyTransferModalOpen(true);
                } else if(response.data?.transaction_type === 'buy-cash' || response.data?.transaction_type === 'sell-cash') {
                    setIsBuyAndSellCashModalOpen(true);
                } else if(response.data?.transaction_type === 'local-payments') {
                    setIsLocalPaymentsModalOpen(true);
                }
            })
            .catch(error => {
                // toast.error(normalizeDjangoError(error));
            })
    }, [setActiveTransactionData, setIsDirectCurrencyTransferModalOpen, setIsBuyAndSellCashModalOpen, setIsLocalPaymentsModalOpen]);

    const columns = useMemo<ColumnDef<Party>[]>(() => {
        return (
            [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </div>
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    ),
                    minSize: 15,  
                    maxSize: 15,  
                    width: 15
                },
                // {
                //     id: 'account_name',

                //     header: () =>
                //         <div>
                //             <span>{t("Account Name")}</span>
                //         </div>,
                //     cell: info => <FinancialAccountName financialAccountId={info.row.original.financial_account} />,
                //     minSize: 150,  
                //     maxSize: 150,  
                //     width: 150     
                // },
                {
                    id: 'created_by',
                    header: () =>
                            <span>{t("Created By")}</span>,
                    cell: info => info.row.original?.created_by,
                    minSize: 60,  
                    maxSize: 60,  
                    width: 60  
                },
                {
                    accessorKey: 'transaction_type',
                    cell: info =>
                        <div>
                            {getTransactionTypeCell(info)}
                        </div>,
                    header: () =>
                        <div>
                            <span className={'header-item-title'}>{t("Transaction Type")}</span>
                        </div>,
                    minSize: 50,  
                    maxSize: 50,  
                    width: 50  
                },
                {
                    accessorKey: 'transaction',
                    cell: info => info.getValue(),
                    header: () =>
                        <div>
                            <span className={'header-item-title'}>{t("Document Number")}</span>
                        </div>,
                    minSize: 60,  
                    maxSize: 60,  
                    width: 60  
                },
                {
                    accessorKey: 'user_specified_id',
                    cell: info =>
                        <span 
                            style={{WebkitLineClamp: 1, 
                                width: 80,   
                                overflow: "hidden", 
                                textOverflow: 'ellipsis',
                                display: "-webkit-inline-flex"
                            }}
                            className={'line-clamp-1'}
                              data-tooltip-content={info.row.original.user_specified_id}
                              data-tooltip-id="global-tooltip"
                        >
                            {info.row.original.user_specified_id}
                        </span>,
                    header: () =>
                        <div>
                            <span className={'header-item-title'}>{t("Transaction Id")}</span>
                        </div>,
                    minSize: 80,  
                    maxSize: 80,  
                    width: 80  
                },
                {
                    accessorKey: 'date',
                    cell: info => <span className={'fw-medium'}>{getLocalizedFormattedDateTime(createLocalizedDate(info.row.original.date, info.row.original.time)).date }</span>,
                    header: () =>
                        <div>
                            <span className={'header-item-title'}>{t("Date")}</span>
                        </div>,
                    minSize: 70,
                    maxSize: 70,
                    width: 70
                },
                {
                    accessorKey: 'time',
                    cell: info => <span className={'fw-medium'}>{getLocalizedFormattedDateTime(createLocalizedDate(info.row.original.date, info.row.original.time)).time}</span>,
                    header: () =>
                        <div>
                            <span className={'header-item-title'}>{t("Time")}</span>
                        </div>,
                    minSize: 70,
                    maxSize: 70,
                    width: 70
                },
                {
                    accessorKey: 'description',
                    cell: info =>
                        <p
                            style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "70px"
                        }}
                              data-tooltip-content={info.row.original.description}
                              data-tooltip-id="tooltip">
                            {info.row.original.description}
                        </p>,
                    header: () =>
                            <span>{t("Description")}</span>,
                    minSize: 70,  
                    maxSize: 70,  
                    width: 70     
                },
                {
                    accessorKey: 'transaction_brief',
                    cell: info =>
                        <span
                              data-tooltip-content={info.row.original.transaction_brief}
                              data-tooltip-id="global-tooltip">
                            {getTransactionBriefCell(info)}
                        </span>,
                    header: () =>
                        <div>
                            <span className={'header-item-title'} >{t("Transaction Brief")}</span>
                        </div>,
                    minSize: 100,
                    maxSize: 100,
                    width: 100
                },
                {
                    accessorKey: 'currency',
                    cell: info => <CurrencyNameAndFlag currencyId={info.row.original.currency} />,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Currency Type")}</span>
                        </div>,
                    minSize: 50,  
                    maxSize: 50,  
                    width: 50  
                },
                {
                    id: 'debtor_amount',
                    cell: info => <CreditorDebtorAmount
                        type={"debtor"}
                        party_type={info.row.original.type}
                        amount={info.row.original.amount}
                    />,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Debtor")}</span>
                        </div>,
                    minSize: 90,  
                    maxSize: 90,  
                    width: 90  
                },
                {
                    id: 'creditor_amount',
                    cell: info => <CreditorDebtorAmount type={'creditor'}
                                                        party_type={info.row.original.type}
                                                        amount={info.row.original.amount}
                    />,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Creditor")}</span>
                        </div>,
                    minSize: 90,  
                    maxSize: 90,  
                    width: 90  
                },
                {
                    accessorKey: 'balance',
                    cell: info => <BalanceAmount amount={Number(info.getValue())} />,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Balance")}</span>
                            {/*<RangeFilter type="number"*/}
                            {/*             fromName={'balance_from_value'}*/}
                            {/*             toName={'balance_to_value'}*/}
                            {/*             onFromChange={handleFilterValueChange}*/}
                            {/*             onToChange={handleFilterValueChange}*/}
                            {/*             fromValue={filters.balance_from_value}*/}
                            {/*             toValue={filters.balance_to_value}*/}
                            {/*/>*/}
                        </div>,
                    minSize: 90,  
                    maxSize: 90,  
                    width: 90  
                },
            ]
        )
    }, [currencies, filters.balance_from_value, filters.balance_to_value, filters.creditor_from_value,
        filters.creditor_to_value, filters.currency, filters.date_from, filters.date_to, filters.debtor_from_value,
        filters.debtor_to_value, filters.description, filters.time_from, filters.time_to, filters.transaction_id_from,
        filters.transaction_id_to, filters?.transaction_type, filters.user_specified_id,
        getTransactionTypeCell, t])

    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Billing")} pageTitle={t("Billing")} />
                    <Col lg={12}>
                        <Card key="direct-currency-transfer-card">
                            <CardHeader>
                                <BillingExtraHeader
                                    table={table}
                                    itemsChanged={itemsChanged}
                                    setItemsChanged={setItemsChanged}
                                />
                            </CardHeader>
                            <CardBody>
                                <React.Fragment >
                                    <CustomTableContainer
                                        loadItemsApi='/transactions/'
                                        columns={(columns || [])}
                                        filters={filters}
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                        onDoubleClickRow={handleEditTransaction}
                                        setTable={setTable}
                                    />
                                    <DirectCurrencyTransfer isOpen={isDirectCurrencyTransferModalOpen}
                                                            activeTransactionData={activeTransactionData || undefined}
                                                            toggle={() => {
                                                                      setIsDirectCurrencyTransferModalOpen(false);
                                                                      setItemsChanged(!itemsChanged);
                                                                      setActiveTransactionData(undefined);
                                                                  }}
                                    />
                                    <LocalPayments isOpen={isLocalPaymentsModalOpen}
                                                   activeTransactionData={activeTransactionData || undefined}
                                                   toggle={() => {
                                                       setIsLocalPaymentsModalOpen(false);
                                                       setItemsChanged(!itemsChanged);
                                                       setActiveTransactionData(undefined);
                                                   }}
                                    />
                                    <BuyAndSellCash isOpen={isBuyAndSellCashModalOpen}
                                                            activeTransactionData={activeTransactionData || undefined}
                                                            toggle={() => {
                                                                      setIsBuyAndSellCashModalOpen(false);
                                                                      setItemsChanged(!itemsChanged);
                                                                      setActiveTransactionData(undefined);
                                                                  }}
                                    />

                                </React.Fragment >
                            </CardBody>
                        </Card>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Billing;