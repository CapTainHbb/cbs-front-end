import React, {useCallback, useMemo, useState} from 'react';
import {Badge, Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomTableContainer from "../../Reports/CustomTableContainer";
import {ColumnDef} from "@tanstack/table-core";
import IndeterminateCheckbox from "../../Reports/IndetermineCheckbox";
import {t} from "i18next";
import BalanceAmount from "../../Reports/BalanceAmount";
import CreditorDebtorAmount from "../../Reports/CreditorsAndDebtors/CreditorDebtorAmount";
import {FinancialAccount, Party} from "../types";
import {useSelector} from "react-redux";
import {Currency} from "../../Reports/utils";
import SelectTransactionType from "../SelectTransactionType";
import CurrencyNameAndFlag from "../../Reports/CurrencyNameAndFlag";
import SelectCurrency from "../../Reports/SelectCurrency/SelectCurrency";
import BillingExtraHeader from "./BillingExtraHeader";
import { useSearchParams } from 'react-router-dom';

export interface Filters {
    financial_account?: number,
    date_from?: string,
    date_to?: string,
    time_from?: string,
    time_to?: string,
    transaction_type?: string,
    description?: string,
    currency?: number,
    creditor_from_value?: number,
    creditor_to_value?: number,
    debtor_from_value?: number,
    debtor_to_value?: number,
    balance_from_value?: number,
    balance_to_value?: number,
    user_specified_id?: string,
    transaction_id_from?: string,
    transaction_id_to?: string,
}

const Billing = () => {

    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts)
    const [searchParams] = useSearchParams();
    const financial_account_id = useMemo(() => {
        return Number(searchParams.get("financial_account"))
    }, [searchParams])

    const [itemsChanged, setItemsChanged] = useState<boolean>(false)

    const [financialAccount, setFinancialAccount] = useState<FinancialAccount | undefined>(
        financialAccounts?.find((item: any) => item?.id === financial_account_id)
    );
    const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
    const [dateTo, setDateTo] = useState<string | undefined>(undefined);
    const [timeFrom, setTimeFrom] = useState<string | undefined>(undefined);
    const [timeTo, setTimeTo] = useState<string | undefined>(undefined);
    const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [currency, setCurrency] = useState<Currency | undefined>(undefined);
    const [creditorFromValue, setCreditorFromValue] = useState<number | undefined>(undefined);
    const [creditorToValue, setCreditorToValue] = useState<number | undefined>(undefined);
    const [debtorFromValue, setDebtorFromValue] = useState<number | undefined>(undefined);
    const [debtorToValue, setDebtorToValue] = useState<number | undefined>(undefined);
    const [balanceFromValue, setBalanceFromValue] = useState<number | undefined>(undefined);
    const [balanceToValue, setBalanceToValue] = useState<number | undefined>(undefined);
    const [userSpecifiedId, setUserSpecifiedId] = useState<string | undefined>(undefined);
    const [transactionIdFrom, setTransactionIdFrom] = useState<string | undefined>(undefined);
    const [transactionIdTo, setTransactionIdTo] = useState<string | undefined>(undefined);

    const filters: Filters = useMemo(() => {
        return {
            financial_account: financialAccount?.id,
            date_from: dateFrom,
            date_to: dateTo,
            time_from: timeFrom,
            time_to: timeTo,
            transaction_type: transactionType,
            description: description,
            currency: currency?.id,
            creditor_from_value: creditorFromValue,
            creditor_to_value: creditorToValue,
            debtor_from_value: debtorFromValue,
            debtor_to_value: debtorToValue,
            balance_from_value: balanceFromValue,
            balance_to_value: balanceToValue,
            userSpecified_id: userSpecifiedId,
            transaction_id_from: transactionIdFrom,
            transaction_id_to: transactionIdTo,
        }
    }, [currency, transactionType, financialAccount])

    const getTransactionBriefCell = useCallback((info: any) => {
        const { document_type, transaction_type } = info.row.original;

        if (document_type !== "main") {
            if (document_type === 'interest' || document_type === 'standalone-interest') {
                return <span className={'badge rounded-pill bg-success-subtle text-success'}>{t(String(info.getValue()))}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span className={"badge rounded-pill bg-danger-subtle text-danger"}>{t(String(info.getValue()))}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p className="badge bg-primary-subtle text-primary">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p className="badge bg-secandary-subtle text-secandary">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p className="badge bg-warning-subtle text-warning">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p className="badge bg-info-subtle text-info">{t(String(info.getValue()))}</p>;
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
                return <span className={'badge rounded-pill bg-success-subtle text-success'}>{t("Received Fees")}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span className={'badge rounded-pill bg-danger-subtle text-danger'}>{t("Paid Fees")}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p className="badge bg-primary-subtle text-primary">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p className="badge bg-secondary-subtle text-secondary">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p className="badge bg-warning-subtle text-warning">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p className="badge bg-info-subtle text-info">{t(String(info.getValue()))}</p>;
                default:
                    return null;
            }
        }

        return null;
    }, [t]);

    const columns = useMemo<ColumnDef<Party>[]>(() => {
        return (
            [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <div className="header-item-container">
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
                    size: 10,
                },
                {
                    id: 'account_name',
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Account Name")}</span>
                        </div>,
                    cell: info => info.row.original.financial_account?.name,
                    size: 60,
                },
                {
                    id: 'created_by',
                    header: () =>
                        <div className={'header-item-container'}>
                            <span className={'header-item-title'}>{t("Created By")}</span>
                        </div>,
                    cell: info => info.row.original?.created_by,
                    size: 60
                },
                {
                    id: 'sub_transaction',
                    header: () =>
                        <div className={'header-item-container'}>
                            <span className={'header-item-title'}>{t('')}</span>
                        </div>,
                    cell: ({ row }) => {
                        return row.getCanExpand() ?
                            <div
                                data-bs-toggle="tooltip"
                                title={row.getIsExpanded() ? t("Close SubTransaction") : t("Open SubTransaction")}
                                style={{
                                    transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(180deg)',
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                                onClick={row.getToggleExpandedHandler()}
                            >
                                <i className="ri-arrow-right-s-line"></i>
                            </div>
                            : '';
                    },
                    minSize: 10,  // Ensure the column doesn't shrink below this size
                    maxSize: 10,  // Prevent resizing beyond this size
                    width: 10     // Explicitly set the width
                },
                {
                    accessorKey: 'transaction_type',
                    cell: info =>
                        <div>
                            {getTransactionTypeCell(info)}
                        </div>,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Transaction Type")}</span>
                            <SelectTransactionType
                                onTransactionTypeChange={setTransactionType}
                                transactionType={filters?.transaction_type}
                            />
                        </div>,
                    size: 50
                },
                {
                    accessorKey: 'transaction',
                    cell: info => info.getValue(),
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Document Number")}</span>
                            {/*<DebouncedInput type="number"*/}
                            {/*             fromName={'transaction_id_from'}*/}
                            {/*             toName={'transaction_id_to'}*/}
                            {/*             onFromChange={handleFilterValueChange}*/}
                            {/*             onToChange={handleFilterValueChange}*/}
                            {/*             fromValue={filters.transaction_id_from}*/}
                            {/*             toValue={filters.transaction_id_to}*/}
                            {/*/>*/}
                        </div>,
                    size: 20
                },
                {
                    accessorKey: 'user_specified_id',
                    cell: info =>
                        <span className={'line-clamp-1'}
                              data-tooltip-content={info.row.original.user_specified_id}
                              data-tooltip-id="global-tooltip"
                        >
                            {info.row.original.user_specified_id}
                        </span>,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Transaction Id")}</span>
                            {/*<DebouncedInput  type={'text'} className='filter-component'*/}
                            {/*                 value={filters.user_specified_id}*/}
                            {/*                 onChange={handleFilterValueChange}*/}
                            {/*                 name={'user_specified_id'}*/}
                            {/*/>*/}
                        </div>,
                    size: 50
                },
                {
                    accessorKey: 'date',
                    cell: info => info.row.original.date,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Date")}</span>
                            {/*<DateRangeFilter*/}
                            {/*    fromName={'date_from'}*/}
                            {/*    toName={'date_to'}*/}
                            {/*    onFromChange={handleFilterValueChange}*/}
                            {/*    onToChange={handleFilterValueChange}*/}
                            {/*    fromValue={filters.date_from}*/}
                            {/*    toValue={filters.date_to}*/}
                            {/*/>*/}
                        </div>,
                    size: 65
                },
                {
                    accessorKey: 'time',
                    cell: info => info.getValue(),
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Time")}</span>
                            {/*<RangeFilter type="time"*/}
                            {/*             fromName={'time_from'}*/}
                            {/*             toName={'time_to'}*/}
                            {/*             onFromChange={handleFilterValueChange}*/}
                            {/*             onToChange={handleFilterValueChange}*/}
                            {/*             fromValue={filters.time_from}*/}
                            {/*             toValue={filters.time_to}*/}
                            {/*/>*/}
                        </div>,
                    size: 60
                },
                {
                    accessorKey: 'description',
                    cell: info =>
                        <span className={'line-clamp-1'}
                              data-tooltip-content={info.row.original.description}
                              data-tooltip-id="global-tooltip">
                            {info.row.original.description}
                        </span>,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Description")}</span>
                            {/*<DebouncedInput type={'text'} className='filter-component'*/}
                            {/*                name={'description'}*/}
                            {/*                value={filters.description}*/}
                            {/*                onChange={handleFilterValueChange} />*/}
                        </div>,
                    size: 80
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
                        <div className={'header-item-container'}>
                            <span className={'header-item-title'} >{t("Transaction Brief")}</span>
                        </div>,
                    size: 250
                },
                {
                    accessorKey: 'currency',
                    cell: info => <CurrencyNameAndFlag currencyName={info.row.original.currency?.name} />,
                    header: () =>
                        <div className='header-item-container'>
                            <span className={'header-item-title'}>{t("Currency Type")}</span>
                            <SelectCurrency currency={currency} onCurrencyChange={(item: any) => setCurrency(item)}/>
                        </div>,
                    size: 50
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
                            {/*<RangeFilter type="number"*/}
                            {/*             fromName={'debtor_from_value'}*/}
                            {/*             toName={'debtor_to_value'}*/}
                            {/*             onFromChange={handleFilterValueChange}*/}
                            {/*             onToChange={handleFilterValueChange}*/}
                            {/*             fromValue={filters.debtor_from_value}*/}
                            {/*             toValue={filters.debtor_to_value}*/}
                            {/*/>*/}
                        </div>,
                    size: 90,
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
                            {/*<RangeFilter type="number"*/}
                            {/*             fromName={'creditor_from_value'}*/}
                            {/*             toName={'creditor_to_value'}*/}
                            {/*             onFromChange={handleFilterValueChange}*/}
                            {/*             onToChange={handleFilterValueChange}*/}
                            {/*             fromValue={filters.creditor_from_value}*/}
                            {/*             toValue={filters.creditor_to_value}*/}
                            {/*/>*/}
                        </div>,
                    size: 90,
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
                    size: 90,
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
                        <Card>
                            <CardHeader>
                                <BillingExtraHeader
                                    financialAccount={financialAccount}
                                    onChangeFinancialAccount={setFinancialAccount}
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