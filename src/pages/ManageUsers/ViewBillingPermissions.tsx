import React, { useCallback } from 'react'
import { Card, CardBody, Container, Row, Table } from 'reactstrap'
import { FinancialAccount } from 'pages/Accounting/types';
import IndeterminateCheckbox from "../Reports/IndetermineCheckbox";
import {useSelector} from "react-redux";

interface Props {
    selectedFinancialAccounts: FinancialAccount[];
    setSelectedFinancialAccounts: any;
}

const ViewBillingPermissions: React.FC<Props> = ({ selectedFinancialAccounts, setSelectedFinancialAccounts }) => {
    const allFinancialAccount = useSelector((state: any) => state.InitialData.financialAccounts)

    const handleToggleCheckBox = useCallback((e: any, fa: FinancialAccount) => {
        if(e?.target?.checked) {
            setSelectedFinancialAccounts((prev: any) => {
                return [...prev, fa]
            })
        } else {
            setSelectedFinancialAccounts((prev: any) => {
                const newState = prev.filter((f: FinancialAccount) => f.id !== fa.id);
                return [...newState]
            })
        }
    }, [selectedFinancialAccounts, allFinancialAccount]);

    const handleClickCheckAll = useCallback((e: any) => {
        if(e?.target?.checked) {
            setSelectedFinancialAccounts([...allFinancialAccount])
        } else {
            setSelectedFinancialAccounts([])
        }
    }, [allFinancialAccount])

  return (
    <Container fluid>
        <Card>
            <CardBody>
                <Row>
                    <Table className='table table-hover table-bordered'>
                        <thead
                            className='table-light'
                        >
                            <tr>
                                <th>
                                    <IndeterminateCheckbox
                                        {...{
                                            checked: allFinancialAccount.length === selectedFinancialAccounts.length,
                                            indeterminate: selectedFinancialAccounts.length === 0? false: allFinancialAccount.length !== selectedFinancialAccounts.length,
                                            onChange: (e: any) => handleClickCheckAll(e)
                                        }}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-auto" style={{ display: 'block', maxHeight: '300px' }}>
                            {
                                allFinancialAccount?.map((fa: FinancialAccount, index: number) =>
                                    <tr key={index} style={{ display: 'table', width: '100%', tableLayout: 'fixed'}}>
                                        <td style={{width:'5%'}}>
                                            <IndeterminateCheckbox
                                                {...{
                                                    checked: selectedFinancialAccounts.find((f: FinancialAccount) => f.id === fa.id) !== undefined,
                                                    onChange: (e: any) => handleToggleCheckBox(e, fa),
                                                }}
                                            />
                                        </td>
                                        <td>{fa.full_name}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Row>
            </CardBody>
        </Card>
    </Container>
  )
}

export default ViewBillingPermissions
