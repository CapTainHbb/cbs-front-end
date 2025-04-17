import BreadCrumb from 'Components/Common/BreadCrumb'
import axiosInstance from 'helpers/axios_instance'
import { t } from 'i18next'
import React, { useEffect, useMemo, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'
import BillingExtraHeader from '../Billing/BillingExtraHeader'
import CustomTableContainer from 'pages/Reports/CustomTableContainer'
import { useBillingFilters } from '../Billing/hooks/useBillingFilters'
import { getTransactionTypeCell, groupPartiesByDate } from '../Billing/utils'
import { createLocalizedDate, getLocalizedFormattedDateTime } from 'helpers/date'
import { ColumnDef } from '@tanstack/react-table'
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox'
import CurrencyNameAndFlag from 'pages/Reports/CurrencyNameAndFlag'
import CreditorDebtorAmount from 'pages/Reports/CreditorsAndDebtors/CreditorDebtorAmount'
import { DebouncedInput } from 'Components/Common/TableContainerReactTable'
import BalanceAmount from 'pages/Reports/BalanceAmount'
import { CustomerParty } from '../types'
import { useSelector } from 'react-redux'
import DraggableTableFooter from '../Billing/DraggableTableFooter'

const CustomerBilling = () => {
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [table, setTable] = useState<any>(undefined);
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const {filters, updateFilter} = useBillingFilters();
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const [isFooterComponentOpen, setIsFooterComponentOpen] = useState<boolean>(false);
    
    useEffect(() => {
            setIsFooterComponentOpen(selectedRows?.length !== 0)
    }, [selectedRows]);
    
    const columns = useMemo<ColumnDef<CustomerParty>[]>(() => {
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

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <div className='page-content'>
        <Container fluid>
            <BreadCrumb title={t("Customer Billing")} pageTitle={t("Customer Billing")} />
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <BillingExtraHeader
                            table={table}
                            itemsChanged={itemsChanged}
                            setItemsChanged={setItemsChanged}
                        />
                    </CardHeader>
                    <CardBody>
                        <React.Fragment>
                            <CustomTableContainer 
                                loadItemsApi={"/transactions/customer-billing/"}
                                columns={(columns || [])}
                                filters={filters}
                                itemsChanged={itemsChanged}
                                setItemsChanged={setItemsChanged}
                                setTable={setTable}
                                preProcessData={groupPartiesByDate}
                                onSelectedRowsChange={(rows: any) => setSelectedRows(rows)}
                            />
                        </React.Fragment>
                    </CardBody>
                </Card>
            </Col>
        </Container>
      </div>
        {isFooterComponentOpen && <DraggableTableFooter
                                    onCloseClicked={() => setIsFooterComponentOpen(false)}
                                    selectedRows={selectedRows?.map((row: any) => row.original)}
            />}
    </React.Fragment>
  )
}

export default CustomerBilling
