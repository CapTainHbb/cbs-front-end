import React, {useEffect, useMemo, useState} from 'react';
import {CurrencyAccount} from "../../Accounting/types";
import CloseAllPositionItem from "./CloseAllPositionItem";
import {Col, Label, Row} from "reactstrap";
import {t} from "i18next";
import BalanceAmount from "../BalanceAmount";

interface Props {
    currencyAccounts: CurrencyAccount[];
}

const CloseAllPositions: React.FC<Props> = ({ currencyAccounts }) => {
    const [exchangedAmounts, setExchangedAmounts] = useState<number[]>([]);

    // Initialize exchangedAmounts based on currencyAccounts
    useEffect(() => {
        setExchangedAmounts(new Array(currencyAccounts.length).fill(0));
    }, [currencyAccounts]);

    const totalExchangedAmount = useMemo(() => {
        return exchangedAmounts.reduce((sum, amount) => sum + amount, 0);
    }, [exchangedAmounts]);

    const handleAmountChange = (index: number, amount: number) => {
        setExchangedAmounts((prev) => {
            const newAmounts = [...prev];
            newAmounts[index] = amount; // Use assignment instead of += for clarity
            return newAmounts;
        });
    };

    return (
        <React.Fragment>
            <Row className="gap-1">
                {currencyAccounts
                    ?.filter((ca: CurrencyAccount) => ca.balance !== 0)
                    ?.map((ca: CurrencyAccount, index) => (
                        <CloseAllPositionItem
                            key={index} // Add key prop for list rendering
                            currencyAccount={ca}
                            onExchangedAmountChange={(amount: number) =>
                                handleAmountChange(index, amount)
                            }
                        />
                    ))}
            </Row>
            <Row>
                <Col>
                    <Label>{t("Total Exchanged Amount")}</Label>
                </Col>
                <Col>
                    <BalanceAmount amount={totalExchangedAmount} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CloseAllPositions;