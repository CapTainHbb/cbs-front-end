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
import DraggableTableFooter from "./DraggableTableFooter";
import {DebouncedInput} from "../../../Components/Common/TableContainerReactTable";
import {ToastContainer} from "react-toastify";
import { getTransactionTypeCell, groupPartiesByDate } from './utils';

interface Props {
    loadItemsApi?: string;
    hasFinancialAccount?: boolean;
    hasFinancialAccountViewDetail?: boolean;
    pageName?: string;
}

const Billing: React.FC<Props> = ({ loadItemsApi = '/transactions/billing/',
                                      hasFinancialAccountViewDetail = true,
                                      hasFinancialAccount = true, pageName = t("Billing") }) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const [table, setTable] = useState<any>(undefined);
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [isFooterComponentOpen, setIsFooterComponentOpen] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const {filters, updateFilter} = useBillingFilters();
    useEffect(() => {
        if(Number(searchParams.get("financial_account")) === 0) return
        updateFilter("financial_account", Number(searchParams.get("financial_account")))
    }, [searchParams]);

    const getTransactionBriefCell = useCallback((info: any) => {
        const { document_type, transaction_type } = info.row.original;
        if (document_type !== "main") {
            if (document_type === 'interest' || document_type === 'standalone-interest') {
                return <span style={{overflowX: "scroll"}} className={'badge bg-success-subtle text-success fs-11'}>{t(String(info.getValue()))}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span style={{overflowX: "scroll"}} className={"badge bg-danger-subtle text-danger fs-11"}>{t(String(info.getValue()))}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p style={{overflowX: "scroll"}} className="badge bg-primary-subtle text-primary fs-11">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p style={{overflowX: "scroll"}} className="badge bg-secondary-subtle text-secondary fs-11">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p style={{overflowX: "scroll"}} className="badge bg-warning-subtle text-warning fs-11">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p style={{overflowX: "scroll"}} className="badge bg-info-subtle text-info fs-11">{t(String(info.getValue()))}</p>;
                default:
                    return null;
            }
        }

        return null;
    }, [])

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
                    size: 15
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
                            <span className={'fs-12'} >{t("Created By")}</span>,
                    cell: info => <span  className={'fs-11'}>{info.row.original?.created_by}</span>,
                    minSize: 50,
                    maxSize: 50,
                    size: 50
                },
                {
                    accessorKey: 'transaction_type',
                    cell: info =>
                        <div>
                            {getTransactionTypeCell(info)}
                        </div>,
                    header: () =>
                        <div className={'fs-12'}>
                            <span className={'header-item-title'}>{t("Transaction Type")}</span>
                        </div>,
                    minSize: 65,
                    maxSize: 65,
                    size: 65
                },
                {
                    accessorKey: 'transaction',
                    cell: info => info.getValue(),
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Document Number")}</span>
                            <DebouncedInput value={filters.transaction_id_from}
                                            placeholder={t("From")}
                                            onChange={(value: any) => updateFilter('transaction_id_from', value === ""? undefined : value)}
                                            style={{padding: '0px'}}
                            />
                            <DebouncedInput value={filters.transaction_id_to}
                                            placeholder={t("To")}
                                            onChange={(value: any) => updateFilter('transaction_id_to', value === ""? undefined : value)}
                                            style={{padding: '0px', marginTop: '1px'}}
                            />
                        </div>,
                    minSize: 40,
                    maxSize: 40,
                    size: 40
                },
                {
                    accessorKey: 'user_specified_id',
                    cell: info =>
                        <span 
                            style={{WebkitLineClamp: 1, 
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
                            <span className={'fs-12'}>{t("Transaction Id")}</span>
                            <DebouncedInput value={filters.user_specified_id}
                                            onChange={(value: any) => updateFilter('user_specified_id', value === ""? undefined : value)}
                                            style={{padding: '0px'}}
                            />
                        </div>,
                    minSize: 50,
                    maxSize: 50,
                    size: 50
                },
                {
                    accessorKey: 'date',
                    cell: info => <span className={'fw-medium'}>{getLocalizedFormattedDateTime(createLocalizedDate(info.row.original.date, info.row.original.time)).date }</span>,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Date")}</span>
                        </div>,
                    minSize: 50,
                    maxSize: 50,
                    size: 50
                },
                {
                    accessorKey: 'time',
                    cell: info => <span className={'fw-medium'}>{getLocalizedFormattedDateTime(createLocalizedDate(info.row.original.date, info.row.original.time)).time}</span>,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Time")}</span>
                        </div>,
                    minSize: 55,
                    maxSize: 55,
                    size: 55
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
                        (<div>
                            <span className={'fs-12'}>{t("Description")}</span>
                            <DebouncedInput
                                type="text"
                                value={filters.description}
                                onChange={value => updateFilter('description', value === ""? undefined : value)}
                                className="border shadow rounded"
                                style={{padding: '0px'}}
                            />
                        </div>),
                    minSize: 70,
                    maxSize: 70,
                    size: 70
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
                            <span className={'fs-12'}>{t("Transaction Brief")}</span>
                        </div>,
                    minSize: 300,
                    maxSize: 300,
                    size: 300
                },
                {
                    accessorKey: 'currency',
                    cell: info => <CurrencyNameAndFlag currencyId={info.row.original.currency} />,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Currency Type")}</span>
                        </div>,
                    minSize: 45,
                    maxSize: 45,
                    size: 45
                },
                {
                    id: 'debtor_amount',
                    cell: info => <CreditorDebtorAmount
                        type={"debtor"}
                        party_type={info.row.original.type}
                        amount={info.row.original.amount}
                    />,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Debtor")}</span>
                            <DebouncedInput value={filters.debtor_from_value}
                                            placeholder={t("From")}
                                            onChange={(value: any) => updateFilter('debtor_from_value', value === ""? undefined : value)}
                                            style={{padding: '0px'}}
                            />
                            <DebouncedInput value={filters.debtor_to_value}
                                            placeholder={t("To")}
                                            onChange={(value: any) => updateFilter('debtor_to_value', value === ""? undefined : value)}
                                            style={{marginTop: '1px', padding: '0px'}}
                            />
                        </div>,
                    minSize: 95,
                    maxSize: 95,
                    size: 95
                },
                {
                    id: 'creditor_amount',
                    cell: info => <CreditorDebtorAmount type={'creditor'}
                                                        party_type={info.row.original.type}
                                                        amount={info.row.original.amount}
                    />,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Creditor")}</span>
                            <DebouncedInput value={filters.creditor_from_value}
                                            placeholder={t("From")}
                                            onChange={(value: any) => updateFilter('creditor_from_value', value === ""? undefined : value)}
                                            style={{padding: '0px'}}
                            />
                            <DebouncedInput value={filters.creditor_to_value}
                                            placeholder={t("To")}
                                            onChange={(value: any) => updateFilter('creditor_to_value', value === ""? undefined : value)}
                                            style={{marginTop: '1px', padding: '0px'}}
                            />
                        </div>,
                    minSize: 95,
                    maxSize: 95,
                    size: 95
                },
                {
                    accessorKey: 'balance',
                    cell: info => <BalanceAmount amount={Number(info.getValue())} />,
                    header: () =>
                        <div>
                            <span className={'fs-12'}>{t("Balance")}</span>
                            <DebouncedInput value={filters.balance_from_value}
                                            placeholder={t("From")}
                                            onChange={(value: any) => updateFilter('balance_from_value', value === ""? undefined : value)}
                                            style={{padding: '0px'}}
                            />
                            <DebouncedInput value={filters.balance_to_value}
                                            placeholder={t("To")}
                                            onChange={(value: any) => updateFilter('balance_to_value', value === ""? undefined : value)}
                                            style={{marginTop: '1px', padding: '0px'}}
                            />
                        </div>,
                    minSize: 95,
                    maxSize: 95,
                    size: 95
                },
            ]
        )
    }, [currencies, filters.balance_from_value, filters.balance_to_value, filters.creditor_from_value,
        filters.creditor_to_value, filters.currency, filters.date_from, filters.date_to, filters.debtor_from_value,
        filters.debtor_to_value, filters.description, filters.time_from, filters.time_to, filters.transaction_id_from,
        filters.transaction_id_to, filters?.transaction_type, filters.user_specified_id,
        getTransactionTypeCell, t])

    useEffect(() => {
        setIsFooterComponentOpen(selectedRows?.length !== 0)
    }, [selectedRows])

    document.title = `${pageName} | ZALEX - Financial Software`;

    return (
        <React.Fragment>
            <div className='page-content'>
                <ToastContainer closeButton={false} />
                <Container fluid>
                    <BreadCrumb title={pageName} pageTitle={pageName} />
                    <Col lg={12}>
                        <Card key="direct-currency-transfer-card">
                            <CardHeader>
                                <BillingExtraHeader
                                    table={table}
                                    itemsChanged={itemsChanged}
                                    setItemsChanged={setItemsChanged}
                                    hasFinancialAccount={hasFinancialAccount}
                                    hasFinancialAccountViewDetail={hasFinancialAccountViewDetail}
                                />
                            </CardHeader>
                            <CardBody>
                                <React.Fragment>
                                    <CustomTableContainer
                                        loadItemsApi={loadItemsApi}
                                        columns={(columns || [])}
                                        filters={filters}
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                        onDoubleClickRow={handleEditTransaction}
                                        setTable={setTable}
                                        preProcessData={groupPartiesByDate}
                                        onSelectedRowsChange={(rows: any) => setSelectedRows(rows)}
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
            {isFooterComponentOpen && <DraggableTableFooter
                                        updateRowColorApi={'/transactions/party/update-highlight-color/'}
                                        onCloseClicked={() => setIsFooterComponentOpen(false)}
                                        selectedRows={selectedRows?.map((row: any) => row.original)}
            />}
        </React.Fragment>
    );
};

export default Billing;