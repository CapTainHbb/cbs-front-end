import React, {useCallback} from 'react';
import {t} from "i18next";
import {CurrencyAccount} from "../Accounting/types";
import CurrencyAmount from "../Accounting/CurrencyAmount";

interface Props {
    currencyAccounts: CurrencyAccount[];
    setCurrencyAccounts: any;
}

const InitialBalanceForm: React.FC<Props> = ({ currencyAccounts, setCurrencyAccounts }) => {

    const onInitialBalanceChange = useCallback((currencyAccount: CurrencyAccount, e: any) => {
        setCurrencyAccounts((prevAccounts: CurrencyAccount[]) => {
            return prevAccounts.map((account) =>
                account.currency === currencyAccount.currency
                    ? { ...account, initial_balance: Number(e?.target?.value) }
                    : account
            );
        });
    }, [setCurrencyAccounts]);


    return (
        <div className={'form-section p-2 w-full items-center'}>
            <h1 className={'form-section-title'}>{t("InitialBalance")}</h1>
            {currencyAccounts?.map?.((currencyAccount: CurrencyAccount, index) => (
                <>

                </>
            ))}
        </div>
    );
};

export default InitialBalanceForm;