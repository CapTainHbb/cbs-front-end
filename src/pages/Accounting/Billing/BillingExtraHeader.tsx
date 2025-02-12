import React, {useMemo} from 'react';
import {FinancialAccount} from "../types";
import {useSelector} from "react-redux";
import Select from "react-select";
import {Col, Label, Row} from "reactstrap";
import FinancialAccountBalance from "../FinancialAccountBalance";
import SelectCurrency from "../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../Reports/utils";
import SelectTransactionType from "../SelectTransactionType";
import {t} from "i18next";
import FinancialAccountViewDetail from "../../ManageFinancialAccounts/FinancialAccountViewDetail";

interface Props {
    financialAccount?: FinancialAccount;
    onChangeFinancialAccount?: any;
    currency?: Currency;
    setCurrency: any;
    transactionType: any;
    setTransactionType: any;
    itemsChanged?: boolean;
}

const BillingExtraHeader: React.FC<Props> = ({ financialAccount, onChangeFinancialAccount,
                                                currency, setCurrency,
                                                 transactionType, setTransactionType,
                                             itemsChanged}) => {
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts);
    const options = useMemo(() => {
        return financialAccounts.map((item: FinancialAccount) => ({
            label: item?.full_name,
            value: item,
        }));
    }, [financialAccounts])

    return (
        <Row>
            <Col>
                <Label>{t("Financial Account")}</Label>
                <Select
                    options={options}
                    onChange={(item: any) => onChangeFinancialAccount(item?.value)}
                    value={options?.find((option: any) => option?.value?.id === financialAccount?.id)}
                    isClearable
                />
            </Col>
            <Col>
                <Label>{t("Currency Type")}</Label>
                <SelectCurrency currency={currency} onCurrencyChange={(item: any) => setCurrency(item)}/>
            </Col>
            <Col>
                <Label>{t("Transaction Type")}</Label>
                <SelectTransactionType
                    onTransactionTypeChange={setTransactionType}
                    transactionType={transactionType}
                />
            </Col>
            <Col>
                <FinancialAccountViewDetail financialAccount={financialAccount} forceUpdate={itemsChanged} />
            </Col>
        </Row>
    );
};

export default BillingExtraHeader;