import React from 'react';
import {abs} from "mathjs";
import {determineCreditorOrDebtor, determineCurrencyTextColor} from "./utils";
import CurrencyAmount from "./CurrencyAmount";
import {Col, Label, Row} from "reactstrap";

interface Props {
    amount?: number;
    currencyId?: number;
}

const BalanceCurrencyAmount: React.FC<Props> = ({ amount, currencyId }) => {
    return (
        <Row className="d-flex align-items-center justify-content-evenly gap-2">
            <Col xs="auto">
                <CurrencyAmount
                    amount={amount || 0}
                    currencyId={currencyId}
                    disabled={true}
                />
            </Col>
            <Col xs="auto">
                <Label
                    style={{
                        color: determineCurrencyTextColor(amount || 0)
                    }}
                >
                    {determineCreditorOrDebtor(amount || 0)}
                </Label>
            </Col>
        </Row>

    );
};

export default BalanceCurrencyAmount;