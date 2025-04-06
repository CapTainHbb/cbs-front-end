import { ColumnDef } from '@tanstack/react-table'
import BreadCrumb from 'Components/Common/BreadCrumb'
import { t } from 'i18next'
import CustomTableContainer from 'pages/Reports/CustomTableContainer'
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox'
import {generalLedgerCurrencyColumns} from 'pages/Reports/utils'
import React, {useCallback, useMemo, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'
import GeneralLedgerExtraHeader from "./GeneralLedgerExtraHeader"
import {CurrencyAccount} from "../types"
import BalanceAmount from "../../Reports/BalanceAmount"
import CurrencyNameAndFlag from "../../Reports/CurrencyNameAndFlag"
import {getFormattedToday} from "../../../helpers/date"

export interface GeneralLedgerReportItemType {
    id: number;
    name: string;
    code: string;
    full_code: string;
    parent_group: number;
    currency_accounts: CurrencyAccount[];
    balance_exchanged_amount: number;
}

const GeneralLedger = () => {

    const referenceCurrencies = useSelector((state: any)=> state.InitialData.referenceCurrencies);
    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [hideSmallAmounts, setHideSmallAmounts] = useState(true);
    const [date, setDate] = useState<string | null>(getFormattedToday());

    const [itemsChanged, setItemsChanged] = useState<boolean>(false);

    const group_id = useMemo(() => {
        return searchParams.get("group_id") || ""
    }, [searchParams])

    const isSmallAmountAccount = useCallback((currencyAccounts: CurrencyAccount[]) => {
        const totalAmount = currencyAccounts.reduce((sum, account) => sum + (account?.balance || 0), 0);
        return hideSmallAmounts && !totalAmount;
    }, [hideSmallAmounts]);

    const determineGroupLinkText = useCallback((row_data: any) => {
        let linkText = ""
        if(row_data?.type === "Financial Account") {
            linkText = `/accounting-billing?financial_account=${row_data?.id}`
        } else {
            linkText = `/accounting-general-ledger?group_id=${row_data?.id}`
        }
        return linkText;
    }, [])

    const columns = useMemo<ColumnDef<GeneralLedgerReportItemType>[]>(() => {
        return [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    </div>
                ),
                size: 10
            },
            {
                accessorKey: 'name',
                cell: (info) => info.getValue(),
                header: () => <span>{t("Account Name")}</span>,
                minSize: 150,
                maxSize: 150,
                width: 150
            },
            {
                accessorKey: 'code',
                cell: (info) => info.getValue(),
                header: () => <span>{t("Account Code")}</span>,
                size: 20
            },
            {
                accessorKey: 'balance_exchanged_amount',
                cell: (info) =>  <BalanceAmount
                    amount={info.row.original.balance_exchanged_amount}
                />,
                header: () => <div className="flex flex-col">
                    <p>{t("Exchanged Total Amount")}</p>
                    <CurrencyNameAndFlag currencyId={referenceCurrency?.id} />
                </div>,
                meta: {
                    hideCondition: (row: any) => isSmallAmountAccount(row.original.balance_currency_accounts), // Hide rows where age is less than 25
                },
                minSize: 120,
                maxSize: 120,
                width: 120
            },
            ...generalLedgerCurrencyColumns(referenceCurrencies),
        ]
    }, [determineGroupLinkText, referenceCurrencies, hideSmallAmounts])

    const handleDoubleClickRow = useCallback((inp: any) => {
        navigate(determineGroupLinkText(inp));
    }, [determineGroupLinkText, navigate])

  return (
    <React.Fragment>
        <div className='page-content'>
            <Container fluid>
                <BreadCrumb title={t("General Ledger")} pageTitle={t("General Ledger")} />
                <Col lg={12}>
                    <Card>
                        <CardHeader>
                            <GeneralLedgerExtraHeader checked={hideSmallAmounts}
                                                      setChecked={setHideSmallAmounts}
                                                      date={date} setDate={setDate}
                                                      itemsChanged={itemsChanged}
                                                      setItemsChanged={setItemsChanged} />
                        </CardHeader>
                        <CardBody>
                            <React.Fragment >
                                <CustomTableContainer
                                    loadItemsApi={`/accounts/general-ledger/?account_group_id=${group_id}&date=${date}`}
                                    loadMethod='GET'
                                    columns={(columns || [])}
                                    onDoubleClickRow={handleDoubleClickRow}
                                    itemsChanged={itemsChanged}
                                    setItemsChanged={setItemsChanged}
                                    hasPagination={false}
                                />
                            </React.Fragment >
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </div>
    </React.Fragment>
  )
}

export default GeneralLedger
