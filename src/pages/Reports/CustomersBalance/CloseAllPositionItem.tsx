import React, {useEffect, useMemo, useState} from 'react';
import {t} from "i18next";
import {CurrencyAccount} from "../../Accounting/types";
import {Card, Col, Input, Row} from "reactstrap";
import CurrencyNameAndFlag from "../CurrencyNameAndFlag";
import BalanceAmount from "../BalanceAmount";
import {customFormatNumber, removeNonNumberChars} from "../../Accounting/utils";
import Select from "react-select";

const conversionTypeOptions= [
    {label: ('÷'), value: 'division'},
    {label: ('x') , value: 'multiplication'}
]

interface Props {
    currencyAccount: CurrencyAccount;
    onExchangedAmountChange: any;
}

const CloseAllPositionItem: React.FC<Props> = ({ currencyAccount, onExchangedAmountChange }) => {
    const [rate, setRate] = useState<string>("0");

    const [conversionType, setConversionType] = useState<any>(conversionTypeOptions[1])

    const exchangedAmount = useMemo(() => {
        const rateNumber = Number(removeNonNumberChars(rate))
        if(conversionType?.value === 'multiplication') {
            return (currencyAccount.balance * rateNumber)
        } else {
            return (currencyAccount.balance / rateNumber)
        }
    }, [rate, currencyAccount]);

    useEffect(() => {
        onExchangedAmountChange(exchangedAmount);
    }, [rate, currencyAccount]);

    return (
        <Card className={'align-items-center'}>
            <Row className={'p-1  w-100'}>
                <Col md={2}>
                    <CurrencyNameAndFlag currencyId={currencyAccount.currency} />
                </Col>
                <Col md={2}>
                    <BalanceAmount amount={currencyAccount.balance} />
                </Col>
                <Col md={2}>
                    <Select
                        options={conversionTypeOptions}
                        onChange={(e: any) => setConversionType(e)}
                        value={conversionType}
                    />
                </Col>
                <Col md={3}>
                    <Input
                        id="rate"
                        name="rate"
                        type="text"
                        value={rate}
                        onChange={(e: any) => setRate(customFormatNumber(e.target.value))}
                        placeholder={t("Enter Amount")}
                    />
                </Col>
                <Col md={2}>
                    <BalanceAmount amount={exchangedAmount} />
                </Col>
            </Row>
        </Card>
    );
};

export default CloseAllPositionItem;