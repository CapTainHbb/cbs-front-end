import React, {useMemo} from 'react'
import {useSelector} from "react-redux";
import {Currency, formatNumber} from "../Reports/utils";
import {Col, Label, Row} from "reactstrap";
import {determineCurrencyTextColor} from "./utils";
import {abs} from "mathjs";


interface Props {
    amount: number | undefined;
    disabled?: boolean;
    currencyId?: number;
    placeHolder?: string;
}

const CurrencyAmount: React.FC<Props> = ({ amount,
                                             disabled = false,
                                             placeHolder = "",
                                             currencyId}) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies)

    const currencyName = useMemo(() => {
        return currencies.find((currency: Currency) => currency?.id === currencyId)?.name
    }, [currencies, currencyId]);

    return (
        <Row className="align-items-center">
            <Col xs="auto">
                <Label style={{color: determineCurrencyTextColor(amount || 0)}}>
                    {formatNumber(abs(amount || 0))}
                </Label>
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
                <img
                    alt={currencyName}
                    src={`/flags/${currencyName}.svg`}
                />
                <Label>{currencyName}</Label>
            </Col>
        </Row>
    );
}

export default CurrencyAmount;