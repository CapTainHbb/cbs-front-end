import React, {useEffect, useState} from 'react';
import {CurrencyAccount, FinancialAccount} from "../Accounting/types";
import {Card, CardBody, Table} from "reactstrap";
import {t} from "i18next";
import CurrencyNameAndFlag from "../Reports/CurrencyNameAndFlag";
import {Currency} from "../Reports/utils";
import BalanceAmount from "../Reports/BalanceAmount";
import {determineCreditorOrDebtor, determineCurrencyTextColor} from "../Accounting/utils";
import {useSelector} from "react-redux";
import axiosInstance from "../../helpers/axios_instance";
import toast from "react-hot-toast";

interface Props {
    financialAccount: FinancialAccount | null;
}

const FinancialAccountViewDetail: React.FC<Props> = ({ financialAccount }) => {

    const [currencyAccounts, setCurrencyAccounts] = useState<CurrencyAccount[]>([]);
    const currencies = useSelector((info: any) => info.InitialData.currencies);

    useEffect(() => {
        if(!financialAccount?.id) {
            setCurrencyAccounts([]);
            return;
        }
        axiosInstance.get(`/accounts/financial-accounts/${financialAccount.id}/currency-accounts/`)
            .then(response => {
                setCurrencyAccounts(response.data);
            }).catch(error => {
            toast.error(t("LoadCurrencyAccountFailed"))
        })
    }, [financialAccount]);

    return (
        <Card id="financial-account-view-detail">
            <CardBody>
                <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-0">
                        <tbody>
                        <tr>
                            <td className="fw-medium">
                                {t("Financial Account Name")}
                            </td>
                            <td>{financialAccount?.name}</td>
                        </tr>
                        <tr>
                            <td className="fw-medium">
                                {t("Financial Account Code")}
                            </td>
                            <td>{financialAccount?.full_code}</td>
                        </tr>
                        {currencyAccounts?.map((currencyAccount: CurrencyAccount, index: number) => {
                            return (
                                <tr key={index}>
                                    <td className='fw-medium'>
                                        <CurrencyNameAndFlag currencyName={currencies.find((currency: Currency) => currency.id === currencyAccount.currency).name}/>
                                    </td>
                                    <td>
                                        <BalanceAmount amount={currencyAccount.balance} />
                                    </td>
                                    <td
                                        style={{
                                            color: determineCurrencyTextColor(currencyAccount.balance || 0)
                                        }}
                                    >
                                        {determineCreditorOrDebtor(currencyAccount.balance || 0)}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    );
};

export default FinancialAccountViewDetail;