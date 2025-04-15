import { useReactTable } from '@tanstack/react-table';
import { t } from 'i18next'
import RectLoader from 'pages/Reports/RectLoader';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Container, Label, Row, Table } from 'reactstrap'
import { UserProfile } from './types';
import { FinancialAccount } from 'pages/Accounting/types';
import axiosInstance from 'helpers/axios_instance';

interface Props {
    activeUserProfile: UserProfile | null;
    isEdit: boolean;
}

const ViewFinancialAccountsPermissions: React.FC<Props> = ({ activeUserProfile, isEdit }) => {
    const [financialAccountsAreLoading, setFinancialAccountsAreLoading] = useState<boolean>(true);
    const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>([])

    useEffect(() => {
        if(!activeUserProfile) setFinancialAccountsAreLoading(false);
        
        axiosInstance.get(`/users/permissions/view-financial-account/?user=${activeUserProfile?.user?.id}&`)
        .then(response => {
            setFinancialAccounts(response.data)
        })
        .catch(error => console.error(error))
        .finally(() => setFinancialAccountsAreLoading(false));
    }, [activeUserProfile]);

    const onClickDelete = useCallback((id: number | undefined) => {
        if (id === undefined) return;
        
        setFinancialAccounts((prev: FinancialAccount[]) => {
            return prev.filter((fa: FinancialAccount) => fa.id !== id);
        });
    }, []);

  return (
    <Container fluid>
        <Card>
            <CardHeader className={'table-light p-2'}>
                <Label>
                    {t("View Financial Accounts Permissions")}
                </Label>
            </CardHeader>
            <CardBody>
                <Row>
                    <Table className='table table-hover table-bordered'>
                        <thead
                            className='table-light'
                        >
                            <tr>
                                <th>
                                    {t("Financial Account Name")}
                                </th>
                                <th>
                                    {t("Delete")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialAccountsAreLoading && <tr>
                                <td><RectLoader/></td>
                                <td><RectLoader/></td>
                            </tr>}
                            {!financialAccountsAreLoading && 
                                financialAccounts?.map((fa: FinancialAccount) => 
                                    <tr>
                                        <td>{fa.full_name}</td>
                                        <td>
                                            <button className={'btn btn-soft-danger rounded-pill p-1'}
                                                    type={'button'}
                                                    onClick={() => { onClickDelete(fa?.id); }}>
                                                        <i className="ri-delete-bin-fill"></i>
                                            </button>
                                        </td>
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

export default ViewFinancialAccountsPermissions
