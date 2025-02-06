import React, {useCallback, useEffect, useState} from 'react'
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../helpers/axios_instance';
import {v4 as uuidv4} from "uuid";
import {useSelector} from "react-redux";
import RectLoader from "../Reports/RectLoader";
import {determineCreditorOrDebtor} from "./utils";
import BalanceCurrencyAmount from "./BalanceCurrencyAmount";
import CurrencyAmount from "./CurrencyAmount";
import {Col, Label, Row} from "reactstrap";


interface Props {
    financialAccountId: string | number | undefined;
    forceUpdate?: boolean;
}

const FinancialAccountBalance: React.FC<Props> = ({ financialAccountId, forceUpdate = undefined }) => {
    const { t } = useTranslation();
    const [currencyAccounts, setCurrencyAccounts] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);

    const fetchFinancialAccountCurrencyAccount = useCallback(async () => {
        if(!financialAccountId) {
            setCurrencyAccounts([]);
            return;
        }
        axiosInstance.get(`accounts/financial-accounts/${financialAccountId}/currency-accounts/`)
            .then(response => {
                setCurrencyAccounts(response.data);
            }).catch(error => {
            toast.error(t("LoadCurrencyAccountFailed"))
        }).finally(() => {
            setIsDataLoading(false);
        })
    }, [financialAccountId, t])

    useEffect(() => {
        setIsDataLoading(!!financialAccountId);
        fetchFinancialAccountCurrencyAccount();
    }, [fetchFinancialAccountCurrencyAccount, financialAccountId, forceUpdate]);

    return (
        <Col lg={12}>
            {isDataLoading ? (
                <RectLoader />
            ) : (
                <>
                    {currencyAccounts?.some((currencyAccount: any) => Number(currencyAccount?.balance) !== 0) ? (
                        currencyAccounts?.map((currencyAccount: any, index) => {
                            const newId = uuidv4();
                            if (Number(currencyAccount?.balance) !== 0) {
                                return (
                                    <BalanceCurrencyAmount
                                        key={newId}
                                        amount={currencyAccount.balance}
                                        currencyId={currencyAccount.currency}
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        <Row>
                            <CurrencyAmount
                                key={uuidv4()}
                                amount={0}
                                currencyId={referenceCurrency?.id}
                                disabled={true}
                            />
                            <Label>{determineCreditorOrDebtor(0)}</Label>
                        </Row>
                    )}
                </>
            )}
        </Col>
    )
}

export default FinancialAccountBalance;