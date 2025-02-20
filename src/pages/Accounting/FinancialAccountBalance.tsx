import React, {useEffect, useState} from 'react'

import {useSelector} from "react-redux";
import {determineCreditorOrDebtor, determineCurrencyTextColor} from "./utils";
import {Table} from "reactstrap";
import {getToday, handleValidDate, handleValidTime} from "../../helpers/date";
import {t} from "i18next";
import {CurrencyAccount, FinancialAccount} from "./types";
import CurrencyNameAndFlag from "../Reports/CurrencyNameAndFlag";
import BalanceAmount from "../Reports/BalanceAmount";


interface Props {
    financialAccountId?: number | null;
    forceUpdate?: boolean;
    setModal?: any;
    currencyAccounts: CurrencyAccount[];
}

const FinancialAccountBalance: React.FC<Props> = ({ financialAccountId,
                                                  forceUpdate = undefined, setModal, currencyAccounts }) => {
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts);
    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
    const [financialAccount, setFinancialAccount] = useState<FinancialAccount | null>(null)


    useEffect(() => {
        setFinancialAccount(financialAccounts.find((acc: FinancialAccount) => acc.id === financialAccountId));
    }, [financialAccountId])

    return (<Table className="table table-hover mb-0">
        <tbody>
        <tr>
            <td className={'fw-medium'}>
                {handleValidDate(getToday())}{" "}
                <small className="text-muted">{handleValidTime(getToday())}</small>
            </td>
            <td></td>
            {setModal && <td>
                <i className="bx bx-expand align-middle btn btn-soft-primary btn-sm dropdown"
                   onClick={(e: any) => setModal(true)}></i>
            </td>}
        </tr>
        {!setModal && <tr>
            <td className="fw-medium">
                {t("Financial Account Name")}
            </td>
            <td>{financialAccount?.name}</td>
            <td></td>
        </tr>}
        {currencyAccounts?.filter((currencyAccount: CurrencyAccount) => currencyAccount?.balance !== 0)?.map((currencyAccount: CurrencyAccount, index: number) => {
            return (
                <tr className={'p-0'} key={index}>
                    <td className='fw-medium p-1'>
                        <CurrencyNameAndFlag currencyId={currencyAccount.currency}/>
                    </td>
                    <td className={'p-1'}>
                        <BalanceAmount amount={currencyAccount.balance} />
                    </td>
                    <td
                        className={'p-1'}
                        style={{
                            color: determineCurrencyTextColor(currencyAccount.balance || 0)
                        }}
                    >
                        {determineCreditorOrDebtor(currencyAccount.balance || 0)}
                    </td>
                </tr>
            )
        })}
        {currencyAccounts?.every((currencyAccount: CurrencyAccount) => Number(currencyAccount.balance === 0))
            && <tr className={'p-0'} key={0}>
                <td className='fw-medium p-1'>
                    <CurrencyNameAndFlag
                        currencyId={referenceCurrency.id}/>
                </td>
                <td className={'p-1'}>
                    <BalanceAmount amount={0}/>
                </td>
                <td
                    className={'p-1'}
                    style={{
                        color: determineCurrencyTextColor(0)
                    }}
                >
                    {determineCreditorOrDebtor(0)}
                </td>
            </tr>}
        </tbody>
    </Table>)
}

export default FinancialAccountBalance;