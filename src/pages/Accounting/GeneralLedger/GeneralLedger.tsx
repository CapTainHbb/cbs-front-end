import { ColumnDef } from '@tanstack/react-table'
import BreadCrumb from 'Components/Common/BreadCrumb'
import { t } from 'i18next'
import CustomTableContainer from 'pages/Reports/CustomTableContainer'
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox'
import { ReportItemType } from 'pages/Reports/types'
import { currencyColumns } from 'pages/Reports/utils'
import React, {useCallback, useMemo, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'
import GeneralLedgerExtraHeader from "./GeneralLedgerExtraHeader";
import {CurrencyAccount} from "../types";
import BalanceAmount from "../../Reports/BalanceAmount";
import CurrencyNameAndFlag from "../../Reports/CurrencyNameAndFlag";

const GeneralLedger = () => {

    const referenceCurrencies = useSelector((state: any)=> state.InitialData.referenceCurrencies);
    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [hideSmallAmounts, setHideSmallAmounts] = useState(true);
    
    const group_id = useMemo(() => {
        return Number(searchParams.get("group_id"))
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

    const columns = useMemo<ColumnDef<ReportItemType>[]>(() => {
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
                size: 100
            },
            {
                accessorKey: 'code',
                cell: (info) => info.getValue(),
                header: () => <span>{t("Account Code")}</span>,
                size: 20
            },
            {
                id: 'exchanged_amounts',
                cell: (info) =>  <BalanceAmount
                    amount={info.row.original.exchanged_amounts}

                />,
                header: () => <div className="flex flex-col">
                    <p>{t("Exchanged Total Amount")}</p>
                    <CurrencyNameAndFlag currencyName={referenceCurrency?.name} />
                </div>,
                meta: {
                    hideCondition: (row: any) => isSmallAmountAccount(row.original.currency_accounts), // Hide rows where age is less than 25
                },
                size: 20,
            },
            ...currencyColumns(referenceCurrencies),
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
                            <GeneralLedgerExtraHeader checked={hideSmallAmounts} setChecked={setHideSmallAmounts} />
                        </CardHeader>
                        <CardBody>
                            <React.Fragment >
                                <CustomTableContainer
                                    loadItemsApi={`/accounts/general-ledger/${group_id}/`}
                                    loadMethod='GET'
                                    columns={(columns || [])}
                                    onDoubleClickRow={handleDoubleClickRow}
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
