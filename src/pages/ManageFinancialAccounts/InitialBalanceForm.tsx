import React, {useCallback} from 'react';
import {t} from "i18next";
import {CurrencyAccount} from "../Accounting/types";
import {Col, Input, Label, Table} from "reactstrap";
import CurrencyNameAndFlag from "../Reports/CurrencyNameAndFlag";
import {useSelector} from "react-redux";

interface Props {
    currencyAccounts: CurrencyAccount[];
    setCurrencyAccounts: any;
}

const InitialBalanceForm: React.FC<Props> = ({ currencyAccounts, setCurrencyAccounts }) => {

    const onInitialBalanceChange = useCallback((currencyAccount: CurrencyAccount, e: any) => {
        setCurrencyAccounts((prevAccounts: CurrencyAccount[]) => {
            return prevAccounts.map((account) =>
                account.currency === currencyAccount.currency
                    ? { ...account, initial_balance: e?.target?.value }
                    : account
            );
        });
    }, [setCurrencyAccounts]);


    return (
        <Col lg={12}>
            <Label
                htmlFor="initialbalance-field"
                className="form-label"
            >
                {t("Initial Balance")}
            </Label>
            <Table className={'table table-striped'}>
                <tbody>
                    {currencyAccounts?.map?.((currencyAccount: CurrencyAccount, index) => (
                        <tr key={index} className='m-0 p-0'>
                            <td className='fw-medium m-0 p-0'>
                                <CurrencyNameAndFlag
                                    currencyId={currencyAccount.currency}/>
                            </td>
                            <td className={'m-0 p-0'}>
                                <Input dir={'ltr'} type={'number'} bsSize={'sm'} value={currencyAccount.initial_balance} onChange={(e: any) => onInitialBalanceChange(currencyAccount, e)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Col>
    );
};

export default InitialBalanceForm;