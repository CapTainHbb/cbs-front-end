import React from 'react';
import {FinancialAccount} from "../types";
import {Button, Col, Label, Row} from "reactstrap";
import SelectCurrency from "../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../Reports/utils";
import SelectTransactionType from "../SelectTransactionType";
import {t} from "i18next";
import FinancialAccountViewDetail from "../../ManageFinancialAccounts/FinancialAccountViewDetail";
import SelectFinancialAccount from "../SelectFinancialAccount";

interface Props {
    financialAccount?: FinancialAccount;
    onChangeFinancialAccount?: any;
    currency?: Currency;
    setCurrency: any;
    transactionType: any;
    setTransactionType: any;
    itemsChanged?: boolean;
    setItemsChanged: any;
}

const BillingExtraHeader: React.FC<Props> = ({ financialAccount, onChangeFinancialAccount,
                                                currency, setCurrency,
                                                 transactionType, setTransactionType,
                                                 setItemsChanged,
                                             itemsChanged}) => {


    return (
        <Row>
            <Col>
                <Label>{t("Financial Account")}</Label>
                <SelectFinancialAccount onSelectFinancialAccount={onChangeFinancialAccount}
                                        selectedFinancialAccountId={financialAccount?.id} />
            </Col>
            <Col>
                <Label>{t("Currency Type")}</Label>
                <SelectCurrency currencyId={currency?.id} onCurrencyChange={(item: any) => setCurrency(item)} />
            </Col>
            <Col>
                <Label>{t("Transaction Type")}</Label>
                <SelectTransactionType
                    onTransactionTypeChange={setTransactionType}
                    transactionType={transactionType}
                />
            </Col>
            <Col>
                <Button color='primary' onClick={() => setItemsChanged(!itemsChanged)}>
                    <i className=' ri-refresh-fill' /> {t("Refresh")}
                </Button>
            </Col>
            <Col style={{ maxHeight: "250px", overflowY: "auto" }}>
                <FinancialAccountViewDetail financialAccountId={financialAccount?.id} forceUpdate={itemsChanged} />
            </Col>
        </Row>

    );
};

export default BillingExtraHeader;