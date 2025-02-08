import { ColumnDef } from '@tanstack/react-table'
import BreadCrumb from 'Components/Common/BreadCrumb'
import { t } from 'i18next'
import CustomTableContainer from 'pages/Reports/CustomTableContainer'
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox'
import { ReportItemType } from 'pages/Reports/types'
import { currencyColumns } from 'pages/Reports/utils'
import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'

const GeneralLedger = () => {

    const referenceCurrencies = useSelector((state: any)=> state.InitialData.referenceCurrencies);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const group_id = useMemo(() => {
        return Number(searchParams.get("group_id"))
    }, [searchParams])

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
                header: () => <span>{t("AccountName")}</span>,
                size: 100
            },
            {
                accessorKey: 'code',
                cell: (info) => info.getValue(),
                header: () => <span>{t("AccountCode")}</span>,
                size: 20
            },
            ...currencyColumns(referenceCurrencies),
        ]
    }, [determineGroupLinkText, referenceCurrencies])
    
    const handleDoubleClickRow = useCallback((inp: any) => {
        navigate(determineGroupLinkText(inp));
    }, [determineGroupLinkText, navigate])

  return (
    <React.Fragment>
        <div className='page-content'>
            <Container fluid>
                <BreadCrumb title={"General Ledger"} pageTitle={"General Ledger"} />
                <Col lg={12}>
                    <Card>
                        <CardHeader>
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
